from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils import timezone

from .models import Submission
from .serializers import SubmissionSerializer, SubmissionUploadSerializer, SubmissionReviewSerializer
from tasks.models import TaskAssignment
from portfolio.models import PortfolioItem
from core.models import Notification


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def submission_upload(request):
    """Upload a submission for an accepted task."""
    serializer = SubmissionUploadSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    task = serializer.validated_data['task']

    # Verify user has accepted the task
    assignment = TaskAssignment.objects.filter(user=request.user, task=task).first()
    if not assignment:
        return Response(
            {'detail': 'You must accept this task first.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Prevent duplicate pending/approved submissions
    existing = Submission.objects.filter(
        user=request.user, task=task
    ).exclude(status='rejected').first()
    if existing:
        return Response(
            {'detail': 'You have already submitted work for this task.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    submission = serializer.save(user=request.user)

    # Notify all admins about the new submission
    from accounts.models import User
    admins = User.objects.filter(role='admin')
    for admin in admins:
        Notification.objects.create(
            user=admin,
            type='task_accepted',
            title='New Submission',
            message=f'{request.user.name} submitted work for "{task.title}".',
        )

    return Response(
        SubmissionSerializer(submission, context={'request': request}).data,
        status=status.HTTP_201_CREATED,
    )


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def my_submissions(request):
    """List submissions by the current user."""
    submissions = Submission.objects.filter(
        user=request.user
    ).select_related('task')
    return Response(
        SubmissionSerializer(submissions, many=True, context={'request': request}).data
    )


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def all_submissions(request):
    """List all submissions (admin only)."""
    if request.user.role != 'admin':
        return Response(
            {'detail': 'Admin access required.'},
            status=status.HTTP_403_FORBIDDEN,
        )
    submissions = Submission.objects.select_related('task', 'user').order_by('-submitted_at')
    return Response(
        SubmissionSerializer(submissions, many=True, context={'request': request}).data
    )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def review_submission(request, pk):
    """Approve or reject a submission (admin only)."""
    if request.user.role != 'admin':
        return Response(
            {'detail': 'Admin access required.'},
            status=status.HTTP_403_FORBIDDEN,
        )

    submission = get_object_or_404(
        Submission.objects.select_related('task', 'user'), pk=pk
    )

    # Prevent re-reviewing
    if submission.status != 'pending':
        return Response(
            {'detail': f'This submission has already been {submission.status}.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    serializer = SubmissionReviewSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)

    new_status = serializer.validated_data['status']
    rating = serializer.validated_data.get('rating')
    feedback = serializer.validated_data.get('feedback', '')

    submission.status = new_status
    submission.feedback = feedback
    submission.reviewed_at = timezone.now()
    if rating is not None:
        submission.rating = rating
    submission.save()

    # If approved → create portfolio item, award XP, mark assignment completed
    if new_status == 'approved':
        work_link = submission.external_link or ''
        if not work_link and submission.file_url:
            try:
                work_link = request.build_absolute_uri(submission.file_url.url)
            except Exception:
                work_link = ''

        PortfolioItem.objects.get_or_create(
            user=submission.user,
            submission=submission,
            defaults={
                'task_title': submission.task.title,
                'work_link': work_link,
                'rating': submission.rating,
                'completed_at': timezone.now(),
            },
        )

        # Award XP
        submission.user.experience_points += submission.task.reward_points
        submission.user.save(update_fields=['experience_points'])

        # Mark assignment completed
        TaskAssignment.objects.filter(
            user=submission.user, task=submission.task
        ).update(status='completed')

        # Notify student: approved + XP
        Notification.objects.create(
            user=submission.user,
            type='task_approved',
            title='Task Approved! 🎉',
            message=f'Your work on "{submission.task.title}" was approved. You earned +{submission.task.reward_points} XP!',
        )
    else:
        # Notify student: rejected
        Notification.objects.create(
            user=submission.user,
            type='task_rejected',
            title='Submission Needs Revision',
            message=f'Your submission for "{submission.task.title}" was not approved.{" Feedback: " + feedback if feedback else ""}',
        )

    return Response(
        SubmissionSerializer(submission, context={'request': request}).data
    )

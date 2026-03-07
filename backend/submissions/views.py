from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db.models import Count, Q

from .models import Submission, SkillScore
from .serializers import SubmissionSerializer, SubmissionUploadSerializer, SubmissionReviewSerializer, SkillScoreSerializer
from .scoring import calculate_skill_score
from tasks.models import TaskAssignment
from portfolio.models import PortfolioItem
from core.models import Notification

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB
ALLOWED_EXTENSIONS = {
    'pdf', 'doc', 'docx', 'txt', 'md',
    'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp',
    'zip', 'rar', '7z',
    'py', 'js', 'ts', 'jsx', 'tsx', 'html', 'css', 'java', 'cpp', 'c',
    'pptx', 'xlsx', 'csv', 'json',
    'mp4', 'mov', 'avi',
    'fig', 'sketch', 'psd', 'ai',
}


def validate_uploaded_file(file_obj):
    """Validate file size and extension. Returns error string or None."""
    if file_obj.size > MAX_FILE_SIZE:
        return f'File too large. Maximum size is {MAX_FILE_SIZE // (1024 * 1024)}MB.'
    ext = file_obj.name.rsplit('.', 1)[-1].lower() if '.' in file_obj.name else ''
    if ext and ext not in ALLOWED_EXTENSIONS:
        return f'File type .{ext} is not allowed.'
    return None


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
    # Validate file if present
    if 'file_url' in request.FILES:
        err = validate_uploaded_file(request.FILES['file_url'])
        if err:
            return Response({'detail': err}, status=status.HTTP_400_BAD_REQUEST)

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


@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated])
def edit_submission(request, pk):
    """Edit a pending or rejected submission (student only)."""
    submission = get_object_or_404(Submission, pk=pk, user=request.user)

    if submission.status == 'approved':
        return Response(
            {'detail': 'Cannot edit an approved submission.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Update fields
    if 'external_link' in request.data:
        submission.external_link = request.data['external_link']
    if 'notes' in request.data:
        submission.notes = request.data['notes']
    if 'file_url' in request.FILES:
        err = validate_uploaded_file(request.FILES['file_url'])
        if err:
            return Response({'detail': err}, status=status.HTTP_400_BAD_REQUEST)
        submission.file_url = request.FILES['file_url']

    # If was rejected, reset to pending for re-review
    was_rejected = submission.status == 'rejected'
    if was_rejected:
        submission.status = 'pending'
        submission.feedback = ''
        submission.rating = None
        submission.reviewed_at = None
        submission.reviewed_by = None

    submission.save()

    # Notify admins about the edit / resubmission
    from accounts.models import User
    admins = User.objects.filter(role='admin')
    msg_type = 'Resubmission' if was_rejected else 'Submission Updated'
    for admin in admins:
        Notification.objects.create(
            user=admin,
            type='task_accepted',
            title=msg_type,
            message=f'{request.user.name} {"resubmitted" if was_rejected else "updated"} work for "{submission.task.title}".',
        )

    return Response(
        SubmissionSerializer(submission, context={'request': request}).data
    )


@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def delete_submission(request, pk):
    """Delete a pending or rejected submission (student only)."""
    submission = get_object_or_404(Submission, pk=pk, user=request.user)

    if submission.status == 'approved':
        return Response(
            {'detail': 'Cannot delete an approved submission.'},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Delete the uploaded file from disk
    if submission.file_url:
        try:
            submission.file_url.delete(save=False)
        except Exception:
            pass

    submission.delete()
    return Response({'detail': 'Submission deleted.'}, status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def all_submissions(request):
    """List all submissions (admin only)."""
    if request.user.role != 'admin':
        return Response(
            {'detail': 'Admin access required.'},
            status=status.HTTP_403_FORBIDDEN,
        )
    submissions = Submission.objects.select_related('task', 'user', 'reviewed_by').order_by('-submitted_at')
    print(f"DEBUG: Found {submissions.count()} submissions in DB.")
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
    submission.reviewed_by = request.user
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

    # Recalculate skill score after review
    calculate_skill_score(submission.user)

    return Response(
        SubmissionSerializer(submission, context={'request': request}).data
    )


# ─── New Admin & Skill Score Endpoints ────────────────────────────


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def admin_stats(request):
    """Dashboard statistics for admin panel."""
    if request.user.role != 'admin':
        return Response({'detail': 'Admin access required.'}, status=status.HTTP_403_FORBIDDEN)

    from accounts.models import User
    from tasks.models import Task

    total_students = User.objects.filter(role='student', is_active=True).count()
    total_tasks = Task.objects.count()

    sub_counts = Submission.objects.aggregate(
        total=Count('id'),
        pending=Count('id', filter=Q(status='pending')),
        approved=Count('id', filter=Q(status='approved')),
        rejected=Count('id', filter=Q(status='rejected')),
    )

    return Response({
        'total_students': total_students,
        'total_tasks': total_tasks,
        'total_submissions': sub_counts['total'],
        'pending_submissions': sub_counts['pending'],
        'approved_submissions': sub_counts['approved'],
        'rejected_submissions': sub_counts['rejected'],
    })


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def admin_student_list(request):
    """List all students with stats (admin only)."""
    if request.user.role != 'admin':
        return Response({'detail': 'Admin access required.'}, status=status.HTTP_403_FORBIDDEN)

    from accounts.models import User

    students = (
        User.objects
        .filter(role='student', is_active=True)
        .annotate(
            total_submissions=Count('submissions'),
            approved_submissions=Count('submissions', filter=Q(submissions__status='approved')),
        )
        .order_by('-experience_points')
    )

    data = []
    for s in students:
        skills = list(s.user_skills.select_related('skill').values_list('skill__name', flat=True))
        score = getattr(s, 'skill_score', None)
        data.append({
            'id': s.id,
            'name': s.name,
            'email': s.email,
            'experience_points': s.experience_points,
            'bio': s.bio,
            'skills': skills,
            'total_submissions': s.total_submissions,
            'approved_submissions': s.approved_submissions,
            'created_at': s.created_at.isoformat(),
            'skill_score': SkillScoreSerializer(score).data if score else None,
        })

    return Response(data)


@api_view(['GET', 'POST'])
@permission_classes([permissions.IsAuthenticated])
def skill_score_view(request):
    """
    GET  → return current user's skill score
    POST → recalculate and return updated score
    """
    if request.method == 'POST':
        score = calculate_skill_score(request.user)
        return Response(SkillScoreSerializer(score).data)

    score = SkillScore.objects.filter(user=request.user).first()
    if not score:
        score = calculate_skill_score(request.user)
    return Response(SkillScoreSerializer(score).data)

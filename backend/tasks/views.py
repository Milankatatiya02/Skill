from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Task, TaskAssignment
from .serializers import TaskSerializer, TaskCreateSerializer, TaskAssignmentSerializer


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def task_list(request):
    """List all tasks, optionally filtered by skill."""
    tasks = Task.objects.select_related('skill_required').all()
    skill = request.query_params.get('skill')
    if skill:
        tasks = tasks.filter(skill_required__id=skill)
    return Response(TaskSerializer(tasks, many=True).data)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def task_detail(request, pk):
    """Retrieve a single task."""
    task = get_object_or_404(Task.objects.select_related('skill_required'), pk=pk)
    data = TaskSerializer(task).data
    # Add assignment info for authenticated users
    if request.user.is_authenticated:
        data['is_accepted'] = TaskAssignment.objects.filter(
            user=request.user, task=task
        ).exists()
    return Response(data)


@api_view(['POST'])
def task_create(request):
    """Create a new task (admin only)."""
    if request.user.role != 'admin':
        return Response(
            {'detail': 'Admin access required.'},
            status=status.HTTP_403_FORBIDDEN,
        )
    serializer = TaskCreateSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def task_accept(request, pk):
    """Accept a task. User cannot accept the same task twice."""
    task = get_object_or_404(Task, pk=pk)
    if TaskAssignment.objects.filter(user=request.user, task=task).exists():
        return Response(
            {'detail': 'You have already accepted this task.'},
            status=status.HTTP_400_BAD_REQUEST,
        )
    assignment = TaskAssignment.objects.create(user=request.user, task=task)
    return Response(TaskAssignmentSerializer(assignment).data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def my_tasks(request):
    """List tasks accepted by the current user."""
    assignments = TaskAssignment.objects.filter(
        user=request.user
    ).select_related('task', 'task__skill_required')
    return Response(TaskAssignmentSerializer(assignments, many=True).data)

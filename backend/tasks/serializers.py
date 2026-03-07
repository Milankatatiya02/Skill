from rest_framework import serializers
from .models import Task, TaskAssignment
from accounts.serializers import SkillSerializer


class TaskSerializer(serializers.ModelSerializer):
    skill_required_name = serializers.CharField(source='skill_required.name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.name', read_only=True, default=None)

    class Meta:
        model = Task
        fields = (
            'id', 'title', 'description', 'skill_required', 'skill_required_name',
            'difficulty', 'deadline', 'reward_points', 'created_by', 'created_by_name', 'created_at',
        )


class TaskCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ('title', 'description', 'skill_required', 'difficulty', 'deadline', 'reward_points')
        read_only_fields = ('created_by',)


class TaskAssignmentSerializer(serializers.ModelSerializer):
    task = TaskSerializer(read_only=True)

    class Meta:
        model = TaskAssignment
        fields = ('id', 'task', 'status', 'assigned_at')

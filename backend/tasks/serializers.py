from rest_framework import serializers
from .models import Task, TaskAssignment
from accounts.serializers import SkillSerializer


class TaskSerializer(serializers.ModelSerializer):
    skill_required_name = serializers.CharField(source='skill_required.name', read_only=True)

    class Meta:
        model = Task
        fields = (
            'id', 'title', 'description', 'skill_required', 'skill_required_name',
            'difficulty', 'deadline', 'reward_points', 'created_at',
        )


class TaskCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ('title', 'description', 'skill_required', 'difficulty', 'deadline', 'reward_points')


class TaskAssignmentSerializer(serializers.ModelSerializer):
    task = TaskSerializer(read_only=True)

    class Meta:
        model = TaskAssignment
        fields = ('id', 'task', 'status', 'assigned_at')

from rest_framework import serializers
from .models import PortfolioItem


class PortfolioItemSerializer(serializers.ModelSerializer):
    feedback = serializers.CharField(source='submission.feedback', read_only=True, default='')
    difficulty = serializers.SerializerMethodField()
    skill_name = serializers.SerializerMethodField()
    reward_points = serializers.SerializerMethodField()

    class Meta:
        model = PortfolioItem
        fields = (
            'id', 'task_title', 'work_link', 'rating', 'completed_at',
            'feedback', 'difficulty', 'skill_name', 'reward_points',
        )

    def get_difficulty(self, obj):
        try:
            return obj.submission.task.difficulty
        except Exception:
            return None

    def get_skill_name(self, obj):
        try:
            return obj.submission.task.skill_required.name
        except Exception:
            return None

    def get_reward_points(self, obj):
        try:
            return obj.submission.task.reward_points
        except Exception:
            return 0

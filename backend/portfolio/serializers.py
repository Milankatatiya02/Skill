from rest_framework import serializers
from .models import PortfolioItem


class PortfolioItemSerializer(serializers.ModelSerializer):
    work_link = serializers.SerializerMethodField()
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

    def get_work_link(self, obj):
        # If there's an external link, use it
        if obj.submission.external_link:
            return obj.submission.external_link
        
        # Otherwise, if there's an uploaded file, get its current URL (signed if S3)
        if obj.submission.file_url:
            try:
                # obj.submission.file_url.url handles S3 signing automatically if configured
                return obj.submission.file_url.url
            except Exception:
                return None
        
        return obj.work_link  # Fallback to stored link if any

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

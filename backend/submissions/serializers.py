from rest_framework import serializers
from .models import Submission


class SubmissionSerializer(serializers.ModelSerializer):
    task_title = serializers.CharField(source='task.title', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.name', read_only=True)
    file_download = serializers.SerializerMethodField()

    class Meta:
        model = Submission
        fields = (
            'id', 'user', 'user_email', 'user_name', 'task', 'task_title',
            'file_url', 'file_download', 'external_link', 'notes',
            'status', 'rating', 'feedback',
            'submitted_at', 'reviewed_at',
        )
        read_only_fields = ('user', 'status', 'rating', 'feedback', 'reviewed_at')

    def get_file_download(self, obj):
        if obj.file_url:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file_url.url)
            return obj.file_url.url
        return None


class SubmissionUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = ('task', 'file_url', 'external_link', 'notes')


class SubmissionReviewSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=['approved', 'rejected'])
    rating = serializers.IntegerField(min_value=1, max_value=5, required=False, allow_null=True)
    feedback = serializers.CharField(required=False, allow_blank=True, default='')

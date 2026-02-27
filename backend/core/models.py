from django.db import models


class Notification(models.Model):
    """User notifications for task events."""

    TYPE_CHOICES = (
        ('task_approved', 'Task Approved'),
        ('task_rejected', 'Task Rejected'),
        ('task_accepted', 'Task Accepted'),
        ('xp_earned', 'XP Earned'),
        ('new_task', 'New Task Available'),
    )

    user = models.ForeignKey(
        'accounts.User', on_delete=models.CASCADE, related_name='notifications'
    )
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    title = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.email} — {self.title} ({'read' if self.is_read else 'unread'})"

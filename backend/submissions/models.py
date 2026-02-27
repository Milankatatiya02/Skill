from django.db import models


class Submission(models.Model):
    """A work submission by a user for a task."""

    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )

    user = models.ForeignKey(
        'accounts.User', on_delete=models.CASCADE, related_name='submissions'
    )
    task = models.ForeignKey(
        'tasks.Task', on_delete=models.CASCADE, related_name='submissions'
    )
    file_url = models.FileField(upload_to='submissions/', blank=True, null=True)
    external_link = models.URLField(blank=True, default='')
    notes = models.TextField(blank=True, default='')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    rating = models.PositiveSmallIntegerField(null=True, blank=True)
    feedback = models.TextField(blank=True, default='')
    submitted_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-submitted_at']

    def __str__(self):
        return f"{self.user.email} — {self.task.title} ({self.status})"

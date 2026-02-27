from django.db import models
from accounts.models import Skill


class Task(models.Model):
    """A task that students can accept and complete for experience points."""

    DIFFICULTY_CHOICES = (
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    )

    title = models.CharField(max_length=255)
    description = models.TextField()
    skill_required = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name='tasks')
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES, default='easy')
    deadline = models.DateTimeField()
    reward_points = models.PositiveIntegerField(default=10)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class TaskAssignment(models.Model):
    """Tracks which users have accepted/completed which tasks."""

    STATUS_CHOICES = (
        ('accepted', 'Accepted'),
        ('completed', 'Completed'),
    )

    user = models.ForeignKey(
        'accounts.User', on_delete=models.CASCADE, related_name='assignments'
    )
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='assignments')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='accepted')
    assigned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'task')

    def __str__(self):
        return f"{self.user.email} → {self.task.title} ({self.status})"

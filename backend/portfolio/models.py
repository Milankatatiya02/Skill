from django.db import models


class PortfolioItem(models.Model):
    """Auto-generated portfolio entry when a submission is approved."""

    user = models.ForeignKey(
        'accounts.User', on_delete=models.CASCADE, related_name='portfolio_items'
    )
    submission = models.OneToOneField(
        'submissions.Submission', on_delete=models.CASCADE, related_name='portfolio_item'
    )
    task_title = models.CharField(max_length=255)
    work_link = models.URLField(blank=True, default='')
    rating = models.PositiveSmallIntegerField(null=True, blank=True)
    completed_at = models.DateTimeField()

    class Meta:
        ordering = ['-completed_at']

    def __str__(self):
        return f"{self.user.email} — {self.task_title}"

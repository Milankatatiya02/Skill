"""
Skill score calculation utility.

Computes multi-dimensional scores from a user's submission history:
- Quality:         Average rating from approved submissions (scaled 0-100)
- Consistency:     Ratio of approved vs total submissions (0-100)
- Problem-Solving: Difficulty-weighted score (hard=3x, medium=2x, easy=1x)
- Improvement:     Trend comparing recent ratings vs older ones (0-100)
"""
from django.db.models import Avg, Count, Q, F
from django.utils import timezone
from datetime import timedelta


DIFFICULTY_WEIGHTS = {'easy': 1, 'medium': 2, 'hard': 3}

# Weights for overall score
DIMENSION_WEIGHTS = {
    'quality': 0.35,
    'consistency': 0.20,
    'problem_solving': 0.25,
    'improvement': 0.20,
}


def _quality_score(approved_submissions):
    """Average rating scaled to 0-100. No ratings → 0."""
    rated = approved_submissions.filter(rating__isnull=False)
    if not rated.exists():
        return 0
    avg = rated.aggregate(avg=Avg('rating'))['avg'] or 0
    return round((avg / 5) * 100)


def _consistency_score(all_submissions):
    """Approval rate × 100."""
    total = all_submissions.count()
    if total == 0:
        return 0
    approved = all_submissions.filter(status='approved').count()
    return round((approved / total) * 100)


def _problem_solving_score(approved_submissions):
    """
    Difficulty-weighted score.
    Each approved task contributes points based on its difficulty weight.
    Normalized against the theoretical max if all were hard tasks.
    """
    if not approved_submissions.exists():
        return 0

    total_weight = 0
    count = 0
    for sub in approved_submissions.select_related('task'):
        difficulty = sub.task.difficulty
        weight = DIFFICULTY_WEIGHTS.get(difficulty, 1)
        rating = sub.rating or 3  # default to 3 if unrated
        total_weight += weight * rating
        count += 1

    if count == 0:
        return 0

    # Max possible: every task is hard (3x) with rating 5
    max_possible = count * 3 * 5
    return round((total_weight / max_possible) * 100)


def _improvement_score(approved_submissions):
    """
    Compare average rating of recent half vs older half.
    Rising → higher score; no change → 50; declining → lower.
    """
    rated = list(
        approved_submissions
        .filter(rating__isnull=False)
        .order_by('submitted_at')
        .values_list('rating', flat=True)
    )
    if len(rated) < 2:
        return 50  # neutral — not enough data

    mid = len(rated) // 2
    older_avg = sum(rated[:mid]) / mid
    recent_avg = sum(rated[mid:]) / (len(rated) - mid)

    if older_avg == 0:
        return 75 if recent_avg > 0 else 50

    ratio = recent_avg / older_avg
    # ratio > 1 means improving, < 1 means declining
    # Clamp between 0 and 100
    score = 50 + (ratio - 1) * 50
    return round(max(0, min(100, score)))


def calculate_skill_score(user):
    """
    Calculate and persist the multi-dimensional skill score for a user.
    Returns the SkillScore instance.
    """
    from .models import Submission, SkillScore

    all_subs = Submission.objects.filter(user=user)
    approved = all_subs.filter(status='approved')

    quality = _quality_score(approved)
    consistency = _consistency_score(all_subs)
    problem_solving = _problem_solving_score(approved)
    improvement = _improvement_score(approved)

    overall = round(
        quality * DIMENSION_WEIGHTS['quality']
        + consistency * DIMENSION_WEIGHTS['consistency']
        + problem_solving * DIMENSION_WEIGHTS['problem_solving']
        + improvement * DIMENSION_WEIGHTS['improvement']
    )

    score, _ = SkillScore.objects.update_or_create(
        user=user,
        defaults={
            'overall_score': overall,
            'quality_score': quality,
            'consistency_score': consistency,
            'problem_solving_score': problem_solving,
            'improvement_score': improvement,
            'last_calculated': timezone.now(),
        },
    )
    return score

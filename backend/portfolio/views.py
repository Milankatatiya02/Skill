from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import permissions
from django.shortcuts import get_object_or_404
from django.db.models import Avg, Count, Sum

from .models import PortfolioItem
from .serializers import PortfolioItemSerializer
from accounts.models import User
from accounts.serializers import UserSerializer


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def my_portfolio(request):
    """Return the authenticated user's portfolio with rich stats."""
    items = PortfolioItem.objects.filter(
        user=request.user
    ).select_related('submission', 'submission__task', 'submission__task__skill_required')

    # Compute trust stats
    stats = items.aggregate(
        avg_rating=Avg('rating'),
        total_projects=Count('id'),
        total_xp=Sum('submission__task__reward_points'),
    )

    # Skill breakdown: count completed projects per skill
    skill_breakdown = {}
    for item in items:
        try:
            skill = item.submission.task.skill_required.name
            skill_breakdown[skill] = skill_breakdown.get(skill, 0) + 1
        except Exception:
            pass

    return Response({
        'user': UserSerializer(request.user).data,
        'items': PortfolioItemSerializer(items, many=True).data,
        'stats': {
            'total_projects': stats['total_projects'] or 0,
            'avg_rating': round(stats['avg_rating'], 1) if stats['avg_rating'] else None,
            'total_xp': stats['total_xp'] or request.user.experience_points,
            'member_since': request.user.created_at.strftime('%B %Y'),
            'skill_breakdown': skill_breakdown,
        },
    })


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def public_portfolio(request, user_id):
    """Return a public view of a user's portfolio with trust signals."""
    user = get_object_or_404(User, pk=user_id)
    items = PortfolioItem.objects.filter(
        user=user
    ).select_related('submission', 'submission__task', 'submission__task__skill_required')

    stats = items.aggregate(
        avg_rating=Avg('rating'),
        total_projects=Count('id'),
        total_xp=Sum('submission__task__reward_points'),
    )

    skill_breakdown = {}
    for item in items:
        try:
            skill = item.submission.task.skill_required.name
            skill_breakdown[skill] = skill_breakdown.get(skill, 0) + 1
        except Exception:
            pass

    return Response({
        'user': {
            'id': user.id,
            'name': user.name,
            'experience_points': user.experience_points,
            'member_since': user.created_at.strftime('%B %Y'),
            'skills': list(
                user.user_skills.select_related('skill').values_list('skill__name', flat=True)
            ),
        },
        'items': PortfolioItemSerializer(items, many=True).data,
        'stats': {
            'total_projects': stats['total_projects'] or 0,
            'avg_rating': round(stats['avg_rating'], 1) if stats['avg_rating'] else None,
            'total_xp': stats['total_xp'] or user.experience_points,
            'skill_breakdown': skill_breakdown,
        },
    })

from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import (
    SignupSerializer, LoginSerializer, UserSerializer,
    SkillSerializer, SkillSelectSerializer, ProfileUpdateSerializer,
)
from .models import Skill, UserSkill


# ───────────────────── Auth Views ─────────────────────

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def signup(request):
    """Register a new user and return JWT tokens."""
    serializer = SignupSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.save()
    refresh = RefreshToken.for_user(user)
    return Response({
        'user': UserSerializer(user).data,
        'tokens': {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        },
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login(request):
    """Authenticate a user and return JWT tokens."""
    serializer = LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    user = serializer.validated_data['user']
    refresh = RefreshToken.for_user(user)
    return Response({
        'user': UserSerializer(user).data,
        'tokens': {
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        },
    })


@api_view(['GET'])
def me(request):
    """Return the current authenticated user."""
    return Response(UserSerializer(request.user).data)


# ───────────────────── Skill Views ─────────────────────

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def skill_list(request):
    """List all available skills."""
    skills = Skill.objects.all()
    return Response(SkillSerializer(skills, many=True).data)


@api_view(['POST'])
def skill_select(request):
    """Allow authenticated user to select skills."""
    serializer = SkillSelectSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    skill_ids = serializer.validated_data['skill_ids']

    # Clear previous selections and set new ones
    UserSkill.objects.filter(user=request.user).delete()
    skills = Skill.objects.filter(id__in=skill_ids)
    UserSkill.objects.bulk_create(
        [UserSkill(user=request.user, skill=s) for s in skills]
    )
    return Response({'detail': 'Skills updated successfully.'})


# ───────────────────── Profile + Leaderboard ─────────────────────

@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated])
def update_profile(request):
    """Update authenticated user's name and/or bio."""
    serializer = ProfileUpdateSerializer(request.user, data=request.data, partial=True)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(UserSerializer(request.user).data)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def leaderboard(request):
    """Return top 20 students ranked by XP with project counts."""
    from portfolio.models import PortfolioItem
    from django.db.models import Count

    top_users = (
        User.objects
        .filter(role='student', is_active=True)
        .annotate(project_count=Count('portfolio_items'))
        .order_by('-experience_points')[:20]
    )

    data = []
    for rank, u in enumerate(top_users, start=1):
        skills = list(u.user_skills.select_related('skill').values_list('skill__name', flat=True))
        data.append({
            'rank': rank,
            'id': u.id,
            'name': u.name,
            'experience_points': u.experience_points,
            'project_count': u.project_count,
            'skills': skills,
            'is_current_user': u.id == request.user.id,
        })

    return Response(data)

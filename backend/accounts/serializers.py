from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, Skill, UserSkill


class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'password')

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(email=data['email'], password=data['password'])
        if not user:
            raise serializers.ValidationError('Invalid email or password.')
        if not user.is_active:
            raise serializers.ValidationError('Account is deactivated.')
        data['user'] = user
        return data


class UserSerializer(serializers.ModelSerializer):
    skills = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'name', 'email', 'role', 'experience_points', 'bio', 'created_at', 'skills')

    def get_skills(self, obj):
        return list(
            obj.user_skills.select_related('skill').values_list('skill__name', flat=True)
        )


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ('id', 'name')


class SkillSelectSerializer(serializers.Serializer):
    skill_ids = serializers.ListField(
        child=serializers.IntegerField(), min_length=1
    )


class ProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('name', 'bio')
        extra_kwargs = {
            'name': {'required': False, 'allow_blank': False},
            'bio': {'required': False, 'allow_blank': True},
        }

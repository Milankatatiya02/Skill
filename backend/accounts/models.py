from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone

from .managers import UserManager


class User(AbstractBaseUser, PermissionsMixin):
    """Custom user model using email as the login identifier."""

    ROLE_CHOICES = (
        ('student', 'Student'),
        ('admin', 'Admin'),
    )

    email = models.EmailField(unique=True, db_index=True)
    name = models.CharField(max_length=150)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='student')
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    experience_points = models.PositiveIntegerField(default=0)
    bio = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(default=timezone.now)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.email


class Skill(models.Model):
    """Pre-defined skills that users can select."""
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class UserSkill(models.Model):
    """Many-to-many relationship between users and skills."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='user_skills')
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE, related_name='skill_users')

    class Meta:
        unique_together = ('user', 'skill')

    def __str__(self):
        return f"{self.user.email} — {self.skill.name}"

from django.contrib import admin
from .models import Task, TaskAssignment

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'skill_required', 'difficulty', 'reward_points', 'deadline')
    list_filter = ('difficulty', 'skill_required')

@admin.register(TaskAssignment)
class TaskAssignmentAdmin(admin.ModelAdmin):
    list_display = ('user', 'task', 'status', 'assigned_at')

from django.urls import path
from . import views

urlpatterns = [
    path('upload/', views.submission_upload, name='submission-upload'),
    path('my/', views.my_submissions, name='my-submissions'),
    path('all/', views.all_submissions, name='all-submissions'),
    path('<int:pk>/review/', views.review_submission, name='review-submission'),
    path('<int:pk>/edit/', views.edit_submission, name='edit-submission'),
    path('<int:pk>/delete/', views.delete_submission, name='delete-submission'),
    path('stats/', views.admin_stats, name='admin-stats'),
    path('students/', views.admin_student_list, name='admin-student-list'),
    path('skill-score/', views.skill_score_view, name='skill-score'),
]

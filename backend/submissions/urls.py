from django.urls import path
from . import views

urlpatterns = [
    path('upload/', views.submission_upload, name='submission-upload'),
    path('my/', views.my_submissions, name='my-submissions'),
    path('all/', views.all_submissions, name='all-submissions'),
    path('<int:pk>/review/', views.review_submission, name='review-submission'),
]

from django.urls import path
from . import views

urlpatterns = [
    path('', views.task_list, name='task-list'),
    path('create/', views.task_create, name='task-create'),
    path('my/', views.my_tasks, name='my-tasks'),
    path('<int:pk>/', views.task_detail, name='task-detail'),
    path('<int:pk>/accept/', views.task_accept, name='task-accept'),
]

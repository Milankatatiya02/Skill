from django.urls import path
from . import views

urlpatterns = [
    path('', views.skill_list, name='skill-list'),
    path('select/', views.skill_select, name='skill-select'),
    path('add/', views.admin_add_skill, name='admin-add-skill'),
    path('<int:pk>/delete/', views.admin_delete_skill, name='admin-delete-skill'),
]

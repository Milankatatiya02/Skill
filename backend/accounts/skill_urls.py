from django.urls import path
from . import views

urlpatterns = [
    path('', views.skill_list, name='skill-list'),
    path('select/', views.skill_select, name='skill-select'),
]

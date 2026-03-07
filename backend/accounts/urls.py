from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('signup/', views.signup, name='signup'),
    path('login/', views.login, name='login'),
    path('me/', views.me, name='me'),
    path('profile/', views.update_profile, name='update-profile'),
    path('leaderboard/', views.leaderboard, name='leaderboard'),
    path('change-password/', views.change_password, name='change-password'),
    path('delete-account/', views.delete_account, name='delete-account'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
]

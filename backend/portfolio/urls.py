from django.urls import path
from . import views

urlpatterns = [
    path('my/', views.my_portfolio, name='my-portfolio'),
    path('<int:user_id>/', views.public_portfolio, name='public-portfolio'),
]

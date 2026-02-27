"""
SkillBridge URL Configuration.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/skills/', include('accounts.skill_urls')),
    path('api/tasks/', include('tasks.urls')),
    path('api/submissions/', include('submissions.urls')),
    path('api/portfolio/', include('portfolio.urls')),
    path('api/notifications/', include('core.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

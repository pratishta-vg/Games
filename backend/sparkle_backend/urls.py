"""
URL configuration for sparkle_backend project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from django.http import HttpResponse

def home_view(request):
    html_content = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Django Sparkle Backend</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
            .container { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            h1 { color: #333; }
            .endpoint { background: #f8f9fa; padding: 10px; margin: 5px 0; border-radius: 4px; }
            a { color: #007bff; text-decoration: none; }
            a:hover { text-decoration: underline; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 Django Sparkle Backend API</h1>
            <p><strong>Status:</strong> ✅ Running</p>
            <p><strong>Version:</strong> 1.0.0</p>
            
            <h2>Available Endpoints:</h2>
            <div class="endpoint">🔧 <a href="/admin/">Admin Panel</a> - Django administration</div>
            <div class="endpoint">❤️ <a href="/api/health/">Health Check</a> - API status</div>
            <div class="endpoint">ℹ️ <a href="/api/info/">API Info</a> - API information</div>
            <div class="endpoint">👤 <a href="/api/auth/register/">Register</a> - User registration (POST)</div>
            <div class="endpoint">🔐 <a href="/api/auth/login/">Login</a> - User login (POST)</div>
            <div class="endpoint">🎮 <a href="/api/games/">Games</a> - Games list</div>
            
            <h2>Getting Started:</h2>
            <ol>
                <li>Visit the <a href="/admin/">Admin Panel</a> to manage data</li>
                <li>Use the <a href="/api/health/">Health Check</a> to verify API status</li>
                <li>Start your frontend application to connect to this backend</li>
            </ol>
        </div>
    </body>
    </html>
    """
    return HttpResponse(html_content)

urlpatterns = [
    path('', home_view, name='home'),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('api/auth/', include('users.urls')),
    path('api/games/', include('games.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

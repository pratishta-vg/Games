from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


def health_check(request):
    """Health check endpoint"""
    return JsonResponse({
        'status': 'healthy',
        'message': 'Django Sparkle Backend is running!',
        'version': '1.0.0'
    })


def api_info(request):
    """API information endpoint"""
    return JsonResponse({
        'name': 'Django Sparkle API',
        'version': '1.0.0',
        'description': 'Backend API for the Sparkle gaming platform',
        'message': 'Basic Django backend is running. Install djangorestframework for full API functionality.'
    })

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils import timezone
from django.db.models import Q, Sum, Count
import json
from .models import Game, GameSession, Achievement, UserAchievement, Leaderboard


def game_list(request):
    """List all active games"""
    games = Game.objects.filter(is_active=True)
    games_data = []
    for game in games:
        games_data.append({
            'id': game.id,
            'title': game.title,
            'description': game.description,
            'game_type': game.game_type,
            'difficulty': game.difficulty,
            'max_score': game.max_score,
            'time_limit': game.time_limit
        })
    return JsonResponse({'games': games_data})


def user_stats(request):
    """Get user statistics"""
    if not request.user.is_authenticated:
        return JsonResponse({'error': 'Not authenticated'}, status=401)
    
    user = request.user
    sessions = GameSession.objects.filter(user=user, status='completed')
    
    total_games = sessions.count()
    total_score = sessions.aggregate(Sum('score'))['score__sum'] or 0
    avg_score = total_score / total_games if total_games > 0 else 0
    
    return JsonResponse({
        'total_games': total_games,
        'total_score': total_score,
        'average_score': round(avg_score, 2),
        'level': user.level,
        'experience_points': user.experience_points,
    })

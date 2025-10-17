from rest_framework import serializers
from .models import Game, GameSession, Achievement, UserAchievement, Leaderboard


class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ['id', 'title', 'description', 'game_type', 'difficulty', 'max_score', 'time_limit', 'is_active', 'created_at']


class GameSessionSerializer(serializers.ModelSerializer):
    game_title = serializers.CharField(source='game.title', read_only=True)
    user_username = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = GameSession
        fields = ['id', 'user', 'game', 'game_title', 'user_username', 'score', 'status', 'start_time', 'end_time', 'duration']
        read_only_fields = ['user', 'start_time']


class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ['id', 'name', 'description', 'achievement_type', 'icon', 'requirement_value', 'points', 'is_active']


class UserAchievementSerializer(serializers.ModelSerializer):
    achievement = AchievementSerializer(read_only=True)
    
    class Meta:
        model = UserAchievement
        fields = ['id', 'achievement', 'earned_at']


class LeaderboardSerializer(serializers.ModelSerializer):
    user_username = serializers.CharField(source='user.username', read_only=True)
    user_avatar = serializers.ImageField(source='user.avatar', read_only=True)
    game_title = serializers.CharField(source='game.title', read_only=True)
    
    class Meta:
        model = Leaderboard
        fields = ['id', 'user_username', 'user_avatar', 'game_title', 'period', 'total_score', 'games_played', 'rank', 'period_start', 'period_end']

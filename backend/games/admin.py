from django.contrib import admin
from .models import Game, GameSession, Achievement, UserAchievement, Leaderboard


@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    list_display = ('title', 'game_type', 'difficulty', 'max_score', 'is_active', 'created_at')
    list_filter = ('game_type', 'difficulty', 'is_active')
    search_fields = ('title', 'description')
    ordering = ('title',)


@admin.register(GameSession)
class GameSessionAdmin(admin.ModelAdmin):
    list_display = ('user', 'game', 'score', 'status', 'start_time', 'duration')
    list_filter = ('status', 'game__game_type', 'start_time')
    search_fields = ('user__username', 'game__title')
    ordering = ('-start_time',)


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ('name', 'achievement_type', 'requirement_value', 'points', 'is_active')
    list_filter = ('achievement_type', 'is_active')
    search_fields = ('name', 'description')


@admin.register(UserAchievement)
class UserAchievementAdmin(admin.ModelAdmin):
    list_display = ('user', 'achievement', 'earned_at')
    list_filter = ('achievement__achievement_type', 'earned_at')
    search_fields = ('user__username', 'achievement__name')


@admin.register(Leaderboard)
class LeaderboardAdmin(admin.ModelAdmin):
    list_display = ('user', 'game', 'period', 'total_score', 'rank', 'period_start')
    list_filter = ('period', 'game')
    search_fields = ('user__username', 'game__title')
    ordering = ('period', 'rank')

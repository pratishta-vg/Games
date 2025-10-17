from django.db import models
from django.conf import settings


class Game(models.Model):
    GAME_TYPES = [
        ('quiz', 'Quiz'),
        ('puzzle', 'Puzzle'),
        ('memory', 'Memory Game'),
        ('word', 'Word Game'),
        ('math', 'Math Game'),
        ('shooting', 'Shooting Game'),
        ('history', 'History Game'),
    ]
    
    DIFFICULTY_LEVELS = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    game_type = models.CharField(max_length=20, choices=GAME_TYPES)
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_LEVELS)
    max_score = models.IntegerField(default=100)
    time_limit = models.IntegerField(help_text="Time limit in seconds", null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title


class GameSession(models.Model):
    STATUS_CHOICES = [
        ('started', 'Started'),
        ('completed', 'Completed'),
        ('abandoned', 'Abandoned'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    score = models.IntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='started')
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True)
    duration = models.IntegerField(help_text="Duration in seconds", null=True, blank=True)
    
    class Meta:
        ordering = ['-start_time']
    
    def __str__(self):
        return f"{self.user.username} - {self.game.title} - {self.score}"


class Achievement(models.Model):
    ACHIEVEMENT_TYPES = [
        ('score', 'Score Based'),
        ('streak', 'Streak Based'),
        ('completion', 'Completion Based'),
        ('time', 'Time Based'),
    ]
    
    name = models.CharField(max_length=200)
    description = models.TextField()
    achievement_type = models.CharField(max_length=20, choices=ACHIEVEMENT_TYPES)
    icon = models.CharField(max_length=50, default='trophy')  # Icon name for frontend
    requirement_value = models.IntegerField(help_text="Required value to unlock achievement")
    points = models.IntegerField(default=10, help_text="Points awarded for this achievement")
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return self.name


class UserAchievement(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    achievement = models.ForeignKey(Achievement, on_delete=models.CASCADE)
    earned_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['user', 'achievement']
    
    def __str__(self):
        return f"{self.user.username} - {self.achievement.name}"


class Leaderboard(models.Model):
    PERIOD_CHOICES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('all_time', 'All Time'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    game = models.ForeignKey(Game, on_delete=models.CASCADE, null=True, blank=True)
    period = models.CharField(max_length=20, choices=PERIOD_CHOICES)
    total_score = models.IntegerField(default=0)
    games_played = models.IntegerField(default=0)
    rank = models.IntegerField(default=0)
    period_start = models.DateTimeField()
    period_end = models.DateTimeField()
    
    class Meta:
        unique_together = ['user', 'game', 'period', 'period_start']
        ordering = ['rank']
    
    def __str__(self):
        game_name = self.game.title if self.game else "Overall"
        return f"{self.user.username} - {game_name} - {self.period} - Rank {self.rank}"

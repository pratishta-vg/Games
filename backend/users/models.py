from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    email = models.EmailField(unique=True)
    bio = models.TextField(max_length=500, blank=True)
    location = models.CharField(max_length=100, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Gaming related fields
    total_score = models.IntegerField(default=0)
    games_played = models.IntegerField(default=0)
    level = models.IntegerField(default=1)
    experience_points = models.IntegerField(default=0)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    def __str__(self):
        return self.username
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}".strip()


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    theme_preference = models.CharField(
        max_length=20,
        choices=[('light', 'Light'), ('dark', 'Dark'), ('auto', 'Auto')],
        default='auto'
    )
    notifications_enabled = models.BooleanField(default=True)
    email_notifications = models.BooleanField(default=True)
    privacy_level = models.CharField(
        max_length=20,
        choices=[('public', 'Public'), ('friends', 'Friends Only'), ('private', 'Private')],
        default='public'
    )
    
    def __str__(self):
        return f"{self.user.username}'s Profile"

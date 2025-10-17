from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, UserProfile


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'total_score', 'level')
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'date_joined', 'level')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    ordering = ('username',)
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Gaming Info', {
            'fields': ('total_score', 'games_played', 'level', 'experience_points')
        }),
        ('Profile Info', {
            'fields': ('avatar', 'bio', 'location', 'birth_date')
        }),
    )


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'theme_preference', 'notifications_enabled', 'privacy_level')
    list_filter = ('theme_preference', 'notifications_enabled', 'privacy_level')
    search_fields = ('user__username', 'user__email')

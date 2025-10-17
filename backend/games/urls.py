from django.urls import path
from . import views

urlpatterns = [
    path('', views.game_list, name='game-list'),
    path('stats/', views.user_stats, name='user-stats'),
]

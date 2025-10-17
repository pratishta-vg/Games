#!/usr/bin/env python
"""
Script to create the Historical Dates Gun Shooting game entry in the database.
Run this after activating the virtual environment and ensuring Django is set up.
"""

import os
import sys
import django

# Add the backend directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sparkle_backend.settings')
django.setup()

from games.models import Game

def create_history_shooting_game():
    """Create the Historical Dates Gun Shooting game entry."""
    
    # Check if the game already exists
    existing_game = Game.objects.filter(title="Historical Dates Gun Shooting").first()
    if existing_game:
        print(f"Game '{existing_game.title}' already exists with ID: {existing_game.id}")
        return existing_game
    
    # Create the new game
    game = Game.objects.create(
        title="Historical Dates Gun Shooting",
        description="Test your knowledge of historical dates in this exciting shooting game! Shoot the correct historical dates while avoiding wrong answers. Each level gets progressively harder with more dates to remember.",
        game_type="history",
        difficulty="medium",
        max_score=10000,
        time_limit=600,  # 10 minutes
        is_active=True
    )
    
    print(f"Successfully created game: {game.title} (ID: {game.id})")
    return game

if __name__ == "__main__":
    try:
        game = create_history_shooting_game()
        print("Game creation completed successfully!")
    except Exception as e:
        print(f"Error creating game: {e}")
        sys.exit(1)

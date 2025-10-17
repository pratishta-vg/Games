# Django Sparkle Backend

A Django REST API backend for the Sparkle gaming platform.

## Features

- User authentication and profiles
- Game management system
- Game sessions tracking
- Achievements system
- Leaderboards
- RESTful API endpoints
- CORS enabled for frontend integration

## Quick Start

### Prerequisites

- Python 3.8+
- pip

### Installation

1. **Clone the repository** (if not already done)

2. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

3. **Create a virtual environment:**
   ```bash
   python -m venv venv
   ```

4. **Activate the virtual environment:**
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

5. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

6. **Create environment file:**
   ```bash
   copy .env.example .env
   ```
   Edit the `.env` file with your settings if needed.

7. **Run migrations:**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

8. **Create a superuser (optional):**
   ```bash
   python manage.py createsuperuser
   ```

9. **Run the development server:**
   ```bash
   python manage.py runserver
   ```

The API will be available at `http://localhost:8000/`

## API Endpoints

### Authentication
- `POST /api/auth/register/` - User registration
- `POST /api/auth/login/` - User login
- `POST /api/auth/logout/` - User logout
- `GET/PATCH /api/auth/profile/` - User profile

### Games
- `GET /api/games/` - List all games
- `GET /api/games/{id}/` - Get game details
- `GET /api/games/{id}/stats/` - Get game statistics
- `GET /api/games/stats/` - Get user statistics
- `GET/POST /api/games/sessions/` - Game sessions
- `GET/PATCH /api/games/sessions/{id}/` - Game session details
- `GET /api/games/achievements/` - List achievements
- `GET /api/games/user-achievements/` - User achievements
- `GET /api/games/leaderboard/` - Leaderboard

### Health Check
- `GET /api/health/` - Health check endpoint
- `GET /api/info/` - API information

## Models

### User
Extended Django user model with gaming-specific fields:
- Basic user information
- Gaming stats (score, level, XP)
- Profile settings

### Game
Game definitions with:
- Title, description, type
- Difficulty levels
- Scoring system
- Time limits

### GameSession
Individual game play sessions:
- User and game references
- Score and duration tracking
- Session status

### Achievement
Achievement system:
- Different achievement types
- Requirements and rewards
- User achievement tracking

### Leaderboard
Ranking system:
- Period-based rankings
- Game-specific and overall rankings

## Development

### Running Tests
```bash
python manage.py test
```

### Admin Interface
Access the Django admin at `http://localhost:8000/admin/` with your superuser credentials.

### Database
The project uses SQLite by default for development. For production, configure PostgreSQL in your `.env` file.

## Frontend Integration

The backend is configured with CORS to work with the React frontend running on `http://localhost:5173`.

Make sure both backend and frontend are running:
1. Backend: `python manage.py runserver` (port 8000)
2. Frontend: `npm run dev` (port 5173)

## Production Deployment

1. Set `DEBUG=False` in your environment
2. Configure a production database (PostgreSQL recommended)
3. Set up proper static file serving
4. Use a production WSGI server like Gunicorn
5. Configure proper CORS settings for your domain

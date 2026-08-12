# 🚀 Task Management API

A production-ready task management system built with **FastAPI**, **SQLAlchemy**, and **JWT Authentication**.

## 📁 Project Structure

```
task-management-api/
├── app/
│   ├── core/           # Config, database, security, dependencies
│   ├── models/         # Database tables (User, Team, Task)
│   ├── schemas/        # Pydantic models (data validation)
│   ├── routers/        # API endpoints (auth, teams, tasks)
│   └── main.py         # App entry point
├── tests/              # pytest test suite
├── alembic/            # Database migrations
├── requirements.txt    # Python dependencies
├── Dockerfile          # Container setup
├── docker-compose.yml  # Multi-container setup
└── .env                # Environment variables
```

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 JWT Auth | Login with username/password, get a token |
| 👥 Teams | Create teams, add members |
| ✅ Tasks | CRUD operations with status & priority |
| 🔒 RBAC | Role-based access (Admin/Manager/Member) |
| 🧪 Tests | Full pytest coverage |
| 🐳 Docker | One-command deployment |

## 🛠️ Quick Start (No Docker)

### Step 1: Create virtual environment
```bash
python -m venv venv

# Windows:
venv\Scripts\activate

# Mac/Linux:
source venv/bin/activate
```

### Step 2: Install dependencies
```bash
pip install -r requirements.txt
```

### Step 3: Run the app
```bash
uvicorn app.main:app --reload
```

### Step 4: Open in browser
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## 🐳 Quick Start (With Docker)

```bash
docker-compose up --build
```

This starts:
- PostgreSQL database on port 5432
- FastAPI app on port 8000

## 🧪 Running Tests

```bash
pytest tests/ -v
```

## 📖 How to Use the API

### 1. Register a User
```bash
curl -X POST "http://localhost:8000/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "username": "admin",
    "password": "admin123",
    "role": "admin"
  }'
```

### 2. Login
```bash
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin&password=admin123"
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer"
}
```

### 3. Create a Team (needs token)
```bash
curl -X POST "http://localhost:8000/teams/" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Engineering",
    "description": "Development team"
  }'
```

### 4. Create a Task
```bash
curl -X POST "http://localhost:8000/tasks/" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Build API",
    "description": "Create task management API",
    "team_id": 1,
    "priority": "high"
  }'
```

## 🔑 API Endpoints

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/auth/register` | POST | No | Create new account |
| `/auth/login` | POST | No | Get JWT token |
| `/teams/` | POST | Yes | Create team |
| `/teams/` | GET | Yes | List my teams |
| `/teams/{id}/members` | POST | Yes | Add member |
| `/tasks/` | POST | Yes | Create task |
| `/tasks/` | GET | Yes | List tasks |
| `/tasks/{id}` | PUT | Yes | Update task |
| `/tasks/{id}` | DELETE | Yes | Delete task |
| `/health` | GET | No | Check if API is up |

## 🗄️ Database Migrations (Alembic)

When you change models, create a migration:

```bash
# Generate migration from model changes
alembic revision --autogenerate -m "description"

# Apply migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1
```

## 🎓 Learning Path

1. **Understand the flow**: `main.py` → `routers/` → `schemas/` → `models/` → `database`
2. **Add a new feature**: Try adding "comments on tasks"
3. **Deploy**: Push to GitHub, deploy on Render/Railway

## ⚠️ Production Checklist

- [ ] Change `SECRET_KEY` in `.env`
- [ ] Use PostgreSQL (not SQLite)
- [ ] Set `allow_origins` to specific domains
- [ ] Add rate limiting
- [ ] Use HTTPS
- [ ] Add logging

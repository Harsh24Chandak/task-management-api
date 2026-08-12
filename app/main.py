"""
Main application file - this is where everything comes together.
Run this file to start the server.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base
from app.routers import auth, teams, tasks

# Create all database tables automatically
# In production, use Alembic migrations instead
Base.metadata.create_all(bind=engine)

# Create the FastAPI app
app = FastAPI(
    title="Task Management API",
    description="""
    A production-ready task management system with:
    - JWT Authentication
    - Team Management
    - Role-Based Access Control
    - Task CRUD with filtering
    """,
    version="1.0.0"
)

# Allow frontend apps to talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routers
app.include_router(auth.router)
app.include_router(teams.router)
app.include_router(tasks.router)


@app.get("/")
def root():
    """Welcome message with useful links."""
    return {
        "message": "Task Management API is running!",
        "docs": "/docs",
        "health": "/health",
        "version": "1.0.0"
    }


@app.get("/health")
def health_check():
    """Simple health check endpoint."""
    return {"status": "healthy"}

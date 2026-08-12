"""
Configuration settings for the app.
Reads from .env file automatically.
"""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """All app settings in one place."""

    # Database
    DATABASE_URL: str = "sqlite:///./app.db"

    # JWT Authentication
    SECRET_KEY: str = "dev-secret-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Environment
    ENVIRONMENT: str = "development"

    class Config:
        env_file = ".env"


# Create one settings object to use everywhere
settings = Settings()

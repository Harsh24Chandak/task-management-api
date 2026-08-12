"""
Tests for team endpoints.
"""
import pytest
from tests.test_auth import client, setup_db


def get_token(role="admin"):
    """Helper: register and login to get a token."""
    client.post("/auth/register", json={
        "email": f"{role}@example.com",
        "username": role,
        "password": "password123",
        "role": role
    })
    response = client.post("/auth/login", data={
        "username": role,
        "password": "password123"
    })
    return response.json()["access_token"]


def test_create_team():
    """Test creating a team."""
    token = get_token()
    response = client.post("/teams/", 
        json={"name": "Engineering", "description": "Dev team"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Engineering"
    assert data["created_by"] == 1  # First user


def test_get_teams():
    """Test listing teams."""
    token = get_token()
    client.post("/teams/", 
        json={"name": "Engineering", "description": "Dev team"},
        headers={"Authorization": f"Bearer {token}"}
    )
    response = client.get("/teams/", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_create_team_unauthorized():
    """Test that you need a token to create a team."""
    response = client.post("/teams/", json={"name": "Engineering"})
    assert response.status_code == 401

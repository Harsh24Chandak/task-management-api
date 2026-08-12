"""
Tests for task endpoints.
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


def test_create_task():
    """Test creating a task."""
    token = get_token()

    # Create a team first
    client.post("/teams/", 
        json={"name": "Engineering", "description": "Dev team"},
        headers={"Authorization": f"Bearer {token}"}
    )

    # Create task in that team
    response = client.post("/tasks/", 
        json={
            "title": "Fix bug",
            "description": "Critical bug fix",
            "team_id": 1,
            "priority": "high"
        },
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Fix bug"
    assert data["status"] == "todo"


def test_get_tasks():
    """Test listing tasks."""
    token = get_token()

    client.post("/teams/", 
        json={"name": "Engineering"},
        headers={"Authorization": f"Bearer {token}"}
    )
    client.post("/tasks/", 
        json={"title": "Task 1", "team_id": 1},
        headers={"Authorization": f"Bearer {token}"}
    )

    response = client.get("/tasks/", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_update_task():
    """Test updating a task."""
    token = get_token()

    client.post("/teams/", 
        json={"name": "Engineering"},
        headers={"Authorization": f"Bearer {token}"}
    )
    client.post("/tasks/", 
        json={"title": "Task 1", "team_id": 1},
        headers={"Authorization": f"Bearer {token}"}
    )

    response = client.put("/tasks/1", 
        json={"status": "in_progress"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json()["status"] == "in_progress"


def test_delete_task():
    """Test deleting a task."""
    token = get_token()

    client.post("/teams/", 
        json={"name": "Engineering"},
        headers={"Authorization": f"Bearer {token}"}
    )
    client.post("/tasks/", 
        json={"title": "Task 1", "team_id": 1},
        headers={"Authorization": f"Bearer {token}"}
    )

    response = client.delete("/tasks/1", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 204

"""
Task router - handles task CRUD operations.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.user import User, UserRole
from app.models.team import Team, team_members
from app.models.task import Task, TaskStatus
from app.schemas.task import TaskCreate, TaskResponse, TaskUpdate
from app.core.deps import get_current_user

router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new task in a team. You must be a member of that team."""
    is_member = db.execute(
        team_members.select().where(
            (team_members.c.team_id == task.team_id) & 
            (team_members.c.user_id == current_user.id)
        )
    ).fetchone()

    if not is_member and current_user.role != UserRole.ADMIN.value:
        raise HTTPException(status_code=403, detail="Not a member of this team")

    db_task = Task(
        title=task.title,
        description=task.description,
        status=task.status.value,  # Store as string
        priority=task.priority.value,  # Store as string
        team_id=task.team_id,
        assignee_id=task.assignee_id,
        created_by=current_user.id,
        due_date=task.due_date
    )
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


@router.get("/", response_model=List[TaskResponse])
def get_tasks(
    team_id: Optional[int] = None,
    status: Optional[TaskStatus] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get tasks from teams you are a member of."""
    query = db.query(Task).join(team_members, Task.team_id == team_members.c.team_id).filter(
        team_members.c.user_id == current_user.id
    )

    if team_id:
        query = query.filter(Task.team_id == team_id)
    if status:
        query = query.filter(Task.status == status.value)

    return query.all()


@router.put("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    task_update: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a task. Only the assignee, creator, or admin can update."""
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if (current_user.role != UserRole.ADMIN.value and 
        task.assignee_id != current_user.id and 
        task.created_by != current_user.id):
        raise HTTPException(status_code=403, detail="Not authorized to update this task")

    update_data = task_update.model_dump(exclude_unset=True)
    # Convert enum values to strings for storage
    if "status" in update_data and update_data["status"] is not None:
        update_data["status"] = update_data["status"].value
    if "priority" in update_data and update_data["priority"] is not None:
        update_data["priority"] = update_data["priority"].value

    for field, value in update_data.items():
        setattr(task, field, value)

    db.commit()
    db.refresh(task)
    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a task. Only the creator or admin can delete."""
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if current_user.role != UserRole.ADMIN.value and task.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this task")

    db.delete(task)
    db.commit()
    return None

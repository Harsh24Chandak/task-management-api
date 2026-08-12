"""
Team router - handles team creation and member management.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.user import User, UserRole
from app.models.team import Team, team_members
from app.schemas.team import TeamCreate, TeamResponse, TeamDetail, TeamMemberAdd
from app.core.deps import get_current_user

router = APIRouter(prefix="/teams", tags=["Teams"])


@router.post("/", response_model=TeamResponse, status_code=status.HTTP_201_CREATED)
def create_team(
    team: TeamCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new team. You automatically become a member."""
    db_team = Team(
        name=team.name,
        description=team.description,
        created_by=current_user.id
    )
    db.add(db_team)
    db.commit()
    db.refresh(db_team)

    db.execute(
        team_members.insert().values(team_id=db_team.id, user_id=current_user.id)
    )
    db.commit()

    return db_team


@router.get("/", response_model=List[TeamResponse])
def get_teams(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all teams you are a member of."""
    teams = db.query(Team).join(team_members).filter(
        team_members.c.user_id == current_user.id
    ).all()
    return teams


@router.post("/{team_id}/members", response_model=TeamDetail)
def add_member(
    team_id: int,
    member: TeamMemberAdd,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add a member to a team. Only admins or the team creator can do this."""
    team = db.query(Team).filter(Team.id == team_id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")

    # Compare with string value since role is stored as string
    if current_user.role != UserRole.ADMIN.value and team.created_by != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to add members")

    existing = db.execute(
        team_members.select().where(
            (team_members.c.team_id == team_id) & 
            (team_members.c.user_id == member.user_id)
        )
    ).fetchone()

    if existing:
        raise HTTPException(status_code=400, detail="User already in team")

    db.execute(
        team_members.insert().values(team_id=team_id, user_id=member.user_id)
    )
    db.commit()
    db.refresh(team)
    return team

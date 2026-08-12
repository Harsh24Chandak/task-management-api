"""
Pydantic schemas for Team.
"""
from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime


class TeamBase(BaseModel):
    name: str
    description: Optional[str] = None


class TeamCreate(TeamBase):
    pass


class TeamResponse(TeamBase):
    id: int
    created_by: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class TeamMemberAdd(BaseModel):
    user_id: int


class TeamDetail(TeamResponse):
    members: List[dict] = []

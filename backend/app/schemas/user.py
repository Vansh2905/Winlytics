from  pydantic import BaseModel
from typing import Optional
from enum import Enum

class MatchFormat(str,Enum):
    T20="T20"
    ODI="ODI"
    Test="Test"
    other="Other"

class User(BaseModel):
    team1: str
    team2: str
    event: str
    format:MatchFormat=MatchFormat.T20
    venue: Optional[str] = "Unknown Venue"
    city: Optional[str]='Unknown City'

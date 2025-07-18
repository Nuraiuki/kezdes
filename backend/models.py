from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional

class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str
    answers: List[str]

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(UserBase):
    id: int
    personality: Optional[str]
    answers: Optional[List[str]]
    status: Optional[str] = None
    class Config:
        from_attributes = True

class CommentBase(BaseModel):
    author: str
    text: str

class CommentCreate(CommentBase):
    pass

class Comment(CommentBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class EventBase(BaseModel):
    title: str
    category: str
    description: str
    location: str
    lat: str
    lng: str
    date: datetime
    image_url: Optional[str] = None

class EventCreate(EventBase):
    pass

class Event(EventBase):
    id: int
    rsvp_going: int
    rsvp_maybe: int
    rsvp_cant: int
    comments: List[Comment] = []
    class Config:
        from_attributes = True 
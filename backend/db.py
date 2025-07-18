from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import declarative_base, sessionmaker, relationship
from datetime import datetime

Base = declarative_base()
engine = create_engine("sqlite:///./kezdes.db", connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)
    personality = Column(String)
    answers = Column(JSON)
    rsvps = relationship("EventRSVP", back_populates="user")

class Event(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    category = Column(String)
    description = Column(Text)
    location = Column(String)
    lat = Column(String)
    lng = Column(String)
    date = Column(DateTime)
    image_url = Column(String)
    rsvp_going = Column(Integer, default=0)
    rsvp_maybe = Column(Integer, default=0)
    rsvp_cant = Column(Integer, default=0)
    comments = relationship("Comment", back_populates="event")
    rsvps = relationship("EventRSVP", back_populates="event")

class EventRSVP(Base):
    __tablename__ = "event_rsvp"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    event_id = Column(Integer, ForeignKey("events.id"))
    status = Column(String)  # going, maybe, cant
    user = relationship("User", back_populates="rsvps")
    event = relationship("Event", back_populates="rsvps")

class Comment(Base):
    __tablename__ = "comments"
    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"))
    author = Column(String)
    text = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    event = relationship("Event", back_populates="comments")

def init_db():
    Base.metadata.create_all(bind=engine) 
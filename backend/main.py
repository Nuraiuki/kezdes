from fastapi import FastAPI, Depends, HTTPException, Request, Query
from sqlalchemy.orm import Session
from db import SessionLocal, init_db, Event, Comment, User, EventRSVP
from models import Event as EventModel, EventCreate, Comment as CommentModel, CommentCreate, UserCreate, UserLogin, UserOut
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from passlib.hash import bcrypt
from fastapi.responses import JSONResponse
from typing import Optional
import openai
import os
from dotenv import load_dotenv
load_dotenv()

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")

app = FastAPI()
init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/events", response_model=list[EventModel])
def get_events(db: Session = Depends(get_db)):
    return db.query(Event).all()

@app.post("/events", response_model=EventModel)
def create_event(event: EventCreate, db: Session = Depends(get_db)):
    db_event = Event(**event.dict())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

@app.get("/events/{event_id}", response_model=EventModel)
def get_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event



@app.get("/events/{event_id}/comments", response_model=list[CommentModel])
def get_comments(event_id: int, db: Session = Depends(get_db)):
    return db.query(Comment).filter(Comment.event_id == event_id).all()

@app.post("/events/{event_id}/comments", response_model=CommentModel)
def add_comment(event_id: int, comment: CommentCreate, db: Session = Depends(get_db)):
    db_comment = Comment(event_id=event_id, **comment.dict())
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

# --- Регистрация ---
def calc_personality(answers: list[str]) -> str:
    a = answers.count("A")
    b = answers.count("Б")
    if a >= 2:
        return "экстраверт"
    if b >= 2:
        return "интроверт"
    return "амбиверт"

@app.post("/register", response_model=UserOut)
def register(user: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(status_code=400, detail="Email уже зарегистрирован")
    personality = calc_personality(user.answers)
    user_obj = User(
        email=user.email,
        name=user.name,
        password_hash=bcrypt.hash(user.password),
        personality=personality,
        answers=user.answers
    )
    db.add(user_obj)
    db.commit()
    db.refresh(user_obj)
    return user_obj

# --- Вход ---
@app.post("/login", response_model=UserOut)
def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not bcrypt.verify(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Неверный email или пароль")
    return user 

@app.get("/events/{event_id}/participants", response_model=list[UserOut])
def get_event_participants(event_id: int, status: str = Query(None), db: Session = Depends(get_db)):
    query = db.query(EventRSVP).filter(EventRSVP.event_id == event_id)
    if status:
        query = query.filter(EventRSVP.status == status)
    rsvps = query.all()
    user_ids = [rsvp.user_id for rsvp in rsvps]
    users = db.query(User).filter(User.id.in_(user_ids)).all()
    user_map = {u.id: u for u in users}
    result = []
    for rsvp in rsvps:
        u = user_map.get(rsvp.user_id)
        if u:
            user_out = UserOut.from_orm(u)
            user_out.status = rsvp.status
            result.append(user_out)
    return result

@app.get("/events/{event_id}/my_rsvp")
def get_my_rsvp(event_id: int, request: Request, db: Session = Depends(get_db)):
    # Для MVP: user_id из query params (в реале — из токена)
    user_id = int(request.query_params.get("user_id", 0))
    rsvp = db.query(EventRSVP).filter_by(event_id=event_id, user_id=user_id).first()
    return {"status": rsvp.status if rsvp else None}

@app.post("/events/{event_id}/rsvp")
async def rsvp_event_individual(event_id: int, request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    status = data.get("status")
    user_id = int(request.query_params.get("user_id", 0))
    if status not in ("going", "maybe", "cant"):
        raise HTTPException(status_code=400, detail="Invalid RSVP status")
    rsvp = db.query(EventRSVP).filter_by(event_id=event_id, user_id=user_id).first()
    if rsvp:
        rsvp.status = status
    else:
        rsvp = EventRSVP(event_id=event_id, user_id=user_id, status=status)
        db.add(rsvp)
    db.commit()
    # Возвращаем обновлённый список участников
    rsvps = db.query(EventRSVP).filter(EventRSVP.event_id == event_id).all()
    user_ids = [rsvp.user_id for rsvp in rsvps]
    users = db.query(User).filter(User.id.in_(user_ids)).all()
    user_map = {u.id: u for u in users}
    result = []
    for rsvp in rsvps:
        u = user_map.get(rsvp.user_id)
        if u:
            user_out = UserOut.from_orm(u)
            user_out.status = rsvp.status
            result.append(user_out)
    return result 

@app.post("/api/assistant")
async def assistant_endpoint(request: Request):
    data = await request.json()
    user_message = data.get("message")
    if not user_message:
        raise HTTPException(status_code=400, detail="Message is required")
    try:
        if not OPENAI_API_KEY:
            raise HTTPException(status_code=500, detail="OpenAI API ключ не найден на сервере")
        openai.api_key = OPENAI_API_KEY
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": 'Если тебя приветствуют (например, "привет", "здравствуй", "добрый день") или спрашивают "как дела", отвечай дружелюбно: "Привет! Я Айсұлу. Готова помочь по вопросам мероприятий, знакомств и участия в событиях!". Ты дружелюбный ассистент для мероприятия Kezdes. Отвечай только на вопросы, связанные с мероприятиями, знакомствами, волнениями участников, советами по участию. Если вопрос не по теме (например, про политику, финансы, технологии и т.д.), отвечай: "Я могу отвечать только на вопросы, связанные с мероприятиями Kezdes, знакомствами и участием в событиях." Отвечай кратко, понятно, по-русски.'},
                {"role": "user", "content": user_message}
            ],
            max_tokens=300,
            temperature=0.7
        )
        answer = response.choices[0].message["content"].strip()
        return {"answer": answer}
    except Exception as e:
        print("OpenAI error:", e)
        return JSONResponse(status_code=500, content={"error": str(e)}) 
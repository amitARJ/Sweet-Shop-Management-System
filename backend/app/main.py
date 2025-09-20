from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, metadata
from app.routers import auth, sweets
from sqlalchemy.orm import Session
from app.schemas import UserCreate
from app.crud import create_user, get_user_by_email
from app.database import SessionLocal
from fastapi import FastAPI
from app.routers import auth  # adjust import path if needed


app = FastAPI()
app.include_router(auth.router, prefix="/api/auth")
app.include_router(sweets.router, prefix="/api/sweets")

# Create all tables in the database before app runs
metadata.create_all(bind=engine)

app = FastAPI()

# CORS allowed origins for React frontend dev server
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(sweets.router, prefix="/api/sweets", tags=["sweets"])

@app.get("/")
async def root():
    return {"message": "Sweet Shop Backend Running"}

def init_demo_accounts():
    db = SessionLocal()
    try:
        if not get_user_by_email(db, "admin@sweetshop.com"):
            create_user(
                db,
                UserCreate(
                    username="admin",
                    email="admin@sweetshop.com",
                    password="admin123"
                ),
                is_admin=True
            )
        if not get_user_by_email(db, "demo@sweetshop.com"):
            create_user(
                db,
                UserCreate(
                    username="demo",
                    email="demo@sweetshop.com",
                    password="demo123"
                ),
                is_admin=False
            )
        print("Demo accounts initialized.")
    finally:
        db.close()

# Initialize demo accounts on startup
init_demo_accounts()

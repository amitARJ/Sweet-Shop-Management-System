from fastapi import APIRouter, Depends, HTTPException, status, Security
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.schemas import SweetCreate, SweetOut, SweetUpdate
from app.crud import (
    get_all_sweets, get_sweets_by_filters, create_sweet, update_sweet,
    delete_sweet, get_sweet_by_id, purchase_sweet, restock_sweet
)
from app.security import decode_access_token
from fastapi import APIRouter, Query
from typing import Optional, List
from pydantic import BaseModel

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication credentials")
    user = db.execute("SELECT * FROM users WHERE email = :email", {"email": payload.get("sub")}).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid user")
    return user

def admin_required(user=Security(get_current_user)):
    if not user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin privileges required")
    return user

@router.post("/", response_model=None)
def add_sweet(sweet: SweetCreate, user=Depends(get_current_user), db: Session = Depends(get_db)):
    create_sweet(db, sweet.dict())
    return

@router.get("/", response_model=list[SweetOut])
def list_sweets(user=Depends(get_current_user), db: Session = Depends(get_db)):
    sweets = get_all_sweets(db)
    return sweets

@router.get("/search", response_model=list[SweetOut])
def search_sweets(name: str = None, category: str = None, price_min: float = None, price_max: float = None, user=Depends(get_current_user), db: Session = Depends(get_db)):
    results = get_sweets_by_filters(db, name, category, price_min, price_max)
    return results

@router.put("/{id}", response_model=None)
def update_sweet_details(id: int, sweet: SweetUpdate, user=Depends(get_current_user), db: Session = Depends(get_db)):
    if not get_sweet_by_id(db, id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sweet not found")
    update_sweet(db, id, sweet.dict())
    return

@router.delete("/{id}", response_model=None)
def delete_sweet_item(id: int, user=Depends(admin_required), db: Session = Depends(get_db)):
    if not get_sweet_by_id(db, id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sweet not found")
    delete_sweet(db, id)
    return

@router.post("/{id}/purchase", response_model=None)
def purchase_sweet_item(id: int, user=Depends(get_current_user), db: Session = Depends(get_db)):
    if not purchase_sweet(db, id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Purchase failed")
    return

@router.post("/{id}/restock", response_model=None)
def restock_sweet_item(id: int, quantity: int, user=Depends(admin_required), db: Session = Depends(get_db)):
    if not restock_sweet(db, id, quantity):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Restock failed")
    return
@router.get("/sweets")
def get_sweets(
    name: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    price_min: Optional[float] = Query(None),
    price_max: Optional[float] = Query(None),
    sort: Optional[str] = Query(None)
):
    query = db.query(Sweet)  # Adjust to your ORM

    if name:
        query = query.filter(Sweet.name.ilike(f"%{name}%"))
    if category:
        query = query.filter(Sweet.category == category)
    if price_min is not None:
        query = query.filter(Sweet.price >= price_min)
    if price_max is not None:
        query = query.filter(Sweet.price <= price_max)

    if sort == "price_asc":
        query = query.order_by(Sweet.price.asc())
    elif sort == "price_desc":
        query = query.order_by(Sweet.price.desc())
    elif sort == "name_asc":
        query = query.order_by(Sweet.name.asc())
    elif sort == "name_desc":
        query = query.order_by(Sweet.name.desc())

    sweets = query.all()
    return sweets

from sqlalchemy.orm import Session
from app.models import users, sweets
from app.security import get_password_hash, verify_password
from app.schemas import UserCreate

def get_user_by_email(db: Session, email: str):
    return db.query(users).filter(users.c.email == email).first()

def get_user_by_username(db: Session, username: str):
    return db.query(users).filter(users.c.username == username).first()

def create_user(db: Session, user: UserCreate, is_admin: bool = False):
    hashed_pw = get_password_hash(user.password)
    db_user = {
        "username": user.username,
        "email": user.email,
        "hashed_password": hashed_pw,
        "is_admin": is_admin,
    }
    insert = users.insert().values(**db_user)
    db.execute(insert)
    db.commit()
    return get_user_by_email(db, user.email)

def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

def get_all_sweets(db: Session):
    return db.execute(sweets.select()).fetchall()

def get_sweets_by_filters(db: Session, name=None, category=None, price_min=None, price_max=None):
    query = sweets.select()
    conditions = []
    if name:
        conditions.append(sweets.c.name.ilike(f"%{name}%"))
    if category:
        conditions.append(sweets.c.category.ilike(f"%{category}%"))
    if price_min is not None:
        conditions.append(sweets.c.price >= price_min)
    if price_max is not None:
        conditions.append(sweets.c.price <= price_max)
    if conditions:
        query = query.where(*conditions)
    return db.execute(query).fetchall()

def get_sweet_by_id(db: Session, sweet_id: int):
    return db.execute(sweets.select().where(sweets.c.id == sweet_id)).first()

def create_sweet(db: Session, sweet_data: dict):
    insert = sweets.insert().values(**sweet_data)
    db.execute(insert)
    db.commit()

def update_sweet(db: Session, sweet_id: int, sweet_data: dict):
    update_stmt = sweets.update().where(sweets.c.id == sweet_id).values(**sweet_data)
    db.execute(update_stmt)
    db.commit()

def delete_sweet(db: Session, sweet_id: int):
    delete_stmt = sweets.delete().where(sweets.c.id == sweet_id)
    db.execute(delete_stmt)
    db.commit()

def purchase_sweet(db: Session, sweet_id: int):
    sweet = get_sweet_by_id(db, sweet_id)
    if not sweet:
        return False
    if sweet.quantity <= 0:
        return False
    new_quantity = sweet.quantity - 1
    update_sweet(db, sweet_id, {"quantity": new_quantity})
    return True

def restock_sweet(db: Session, sweet_id: int, quantity: int):
    sweet = get_sweet_by_id(db, sweet_id)
    if not sweet:
        return False
    new_quantity = sweet.quantity + quantity
    update_sweet(db, sweet_id, {"quantity": new_quantity})
    return True

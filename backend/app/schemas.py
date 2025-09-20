from pydantic import BaseModel, EmailStr, constr
from typing import Optional

class UserCreate(BaseModel):
    username: constr(min_length=3, max_length=50)
    email: EmailStr
    password: constr(min_length=6)

class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    is_admin: bool

    class Config:
        orm_mode = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class SweetBase(BaseModel):
    name: str
    category: str
    price: float
    quantity: int

class SweetCreate(SweetBase):
    pass

class SweetUpdate(SweetBase):
    pass

class SweetOut(SweetBase):
    id: int

    class Config:
        orm_mode = True

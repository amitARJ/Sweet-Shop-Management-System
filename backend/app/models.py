from sqlalchemy import Table, Column, Integer, String, Boolean, Float
from sqlalchemy.sql.schema import ForeignKey
from app.database import metadata

users = Table(
    "users", metadata,
    Column("id", Integer, primary_key=True, index=True),
    Column("username", String, unique=True, index=True, nullable=False),
    Column("email", String, unique=True, index=True, nullable=False),
    Column("hashed_password", String, nullable=False),
    Column("is_admin", Boolean, default=False),
)

sweets = Table(
    "sweets", metadata,
    Column("id", Integer, primary_key=True, index=True),
    Column("name", String, unique=True, index=True, nullable=False),
    Column("category", String, index=True, nullable=False),
    Column("price", Float, nullable=False),
    Column("quantity", Integer, nullable=False),
)

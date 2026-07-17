from sqlalchemy import Column, Integer, String, ForeignKey, Date, Float
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class RawMaterial(Base):
    __tablename__ = "raw_materials"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    unit_type = Column(String)
    expected_yield = Column(Integer, default=0)

class Branch(Base):
    __tablename__ = "branches"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    location = Column(String)

class DailyClosing(Base):
    __tablename__ = "daily_closings"
    id = Column(Integer, primary_key=True, index=True)
    branch_id = Column(Integer, ForeignKey("branches.id"))
    date = Column(Date)
    flour_sacks_used = Column(Integer, default=0)
    yeast_packs_used = Column(Integer, default=0)
    gas_cylinders_used = Column(Integer, default=0)
    actual_bread_produced = Column(Integer, default=0)

class Client(Base):
    __tablename__ = "clients"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    phone = Column(String, nullable=True)
    current_balance = Column(Float, default=0.0)

class Invoice(Base):
    __tablename__ = "invoices"
    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"))
    date = Column(Date)
    total_amount = Column(Float, default=0.0)
    paid_amount = Column(Float, default=0.0)
    remaining_amount = Column(Float, default=0.0)

# --- NEW: Products Table (Bread Types) ---
class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    price = Column(Float, default=0.0)
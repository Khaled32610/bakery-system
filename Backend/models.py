from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.orm import declarative_base

Base = declarative_base()

# 1. Raw Materials Table
class RawMaterial(Base):
    __tablename__ = "raw_materials"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)           # e.g., Flour, Yeast, Gas
    unit_type = Column(String)                  # e.g., Sack, Pack, Cylinder
    expected_yield = Column(Integer, default=0) # How many loaves a single unit produces

# 2. Branches Table
class Branch(Base):
    __tablename__ = "branches"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    location = Column(String)

# 3. Daily Closing Table (Consumption and Production Tracking)
class DailyClosing(Base):
    __tablename__ = "daily_closings"
    
    id = Column(Integer, primary_key=True, index=True)
    branch_id = Column(Integer, ForeignKey("branches.id"))
    date = Column(Date)
    
    # Consumption (Inputs)
    flour_sacks_used = Column(Integer, default=0)
    yeast_packs_used = Column(Integer, default=0)
    gas_cylinders_used = Column(Integer, default=0)
    
    # Actual Production (Outputs)
    actual_bread_produced = Column(Integer, default=0)
    
    # Note for future logic: 
    # Variance (Deficit/Surplus) = actual_bread_produced - (flour_sacks_used * expected_yield)

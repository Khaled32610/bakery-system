from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import engine, SessionLocal
import models
import schemas

# Create all database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Bakery Management System API")

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Welcome to the Bakery System API. The database is connected!"}

# API Endpoint: Create a new raw material
@app.post("/materials/", response_model=schemas.RawMaterialResponse)
def create_material(material: schemas.RawMaterialCreate, db: Session = Depends(get_db)):
    # Convert schema to dict and unpack into SQLAlchemy model
    db_material = models.RawMaterial(**material.model_dump())
    db.add(db_material)
    db.commit()
    db.refresh(db_material)
    return db_material

# API Endpoint: Get all raw materials
@app.get("/materials/", response_model=list[schemas.RawMaterialResponse])
def get_materials(db: Session = Depends(get_db)):
    return db.query(models.RawMaterial).all()

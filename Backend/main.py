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

# --- Raw Materials APIs ---
@app.post("/materials/", response_model=schemas.RawMaterialResponse)
def create_material(material: schemas.RawMaterialCreate, db: Session = Depends(get_db)):
    db_material = models.RawMaterial(**material.model_dump())
    db.add(db_material)
    db.commit()
    db.refresh(db_material)
    return db_material

@app.get("/materials/", response_model=list[schemas.RawMaterialResponse])
def get_materials(db: Session = Depends(get_db)):
    return db.query(models.RawMaterial).all()

# --- Branches APIs ---
@app.post("/branches/", response_model=schemas.BranchResponse)
def create_branch(branch: schemas.BranchCreate, db: Session = Depends(get_db)):
    db_branch = models.Branch(**branch.model_dump())
    db.add(db_branch)
    db.commit()
    db.refresh(db_branch)
    return db_branch

@app.get("/branches/", response_model=list[schemas.BranchResponse])
def get_branches(db: Session = Depends(get_db)):
    return db.query(models.Branch).all()

# --- Clients APIs ---
@app.post("/clients/", response_model=schemas.ClientResponse)
def create_client(client: schemas.ClientCreate, db: Session = Depends(get_db)):
    db_client = models.Client(**client.model_dump())
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client

@app.get("/clients/", response_model=list[schemas.ClientResponse])
def get_clients(db: Session = Depends(get_db)):
    return db.query(models.Client).all()
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import engine, SessionLocal
import models
import schemas

models.Base.metadata.create_all(bind=engine)
app = FastAPI(title="Bakery Management System API")

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

# Materials
@app.post("/materials/", response_model=schemas.RawMaterialResponse)
def create_material(material: schemas.RawMaterialCreate, db: Session = Depends(get_db)):
    db_item = models.RawMaterial(**material.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.get("/materials/", response_model=list[schemas.RawMaterialResponse])
def get_materials(db: Session = Depends(get_db)):
    return db.query(models.RawMaterial).all()

# Branches
@app.post("/branches/", response_model=schemas.BranchResponse)
def create_branch(branch: schemas.BranchCreate, db: Session = Depends(get_db)):
    db_item = models.Branch(**branch.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.get("/branches/", response_model=list[schemas.BranchResponse])
def get_branches(db: Session = Depends(get_db)):
    return db.query(models.Branch).all()

# Clients
@app.post("/clients/", response_model=schemas.ClientResponse)
def create_client(client: schemas.ClientCreate, db: Session = Depends(get_db)):
    db_item = models.Client(**client.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.get("/clients/", response_model=list[schemas.ClientResponse])
def get_clients(db: Session = Depends(get_db)):
    return db.query(models.Client).all()

# --- NEW: Products APIs ---
@app.post("/products/", response_model=schemas.ProductResponse)
def create_product(product: schemas.ProductCreate, db: Session = Depends(get_db)):
    db_item = models.Product(**product.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.get("/products/", response_model=list[schemas.ProductResponse])
def get_products(db: Session = Depends(get_db)):
    return db.query(models.Product).all()

# --- Invoices APIs ---
@app.post("/invoices/", response_model=schemas.InvoiceResponse)
def create_invoice(invoice: schemas.InvoiceCreate, db: Session = Depends(get_db)):
    # Calculate remaining amount
    invoice.remaining_amount = invoice.total_amount - invoice.paid_amount
    
    db_invoice = models.Invoice(**invoice.model_dump())
    db.add(db_invoice)
    
    # Auto-update the Client's balance
    client = db.query(models.Client).filter(models.Client.id == invoice.client_id).first()
    if client:
        client.current_balance += invoice.remaining_amount
        
    db.commit()
    db.refresh(db_invoice)
    return db_invoice

@app.get("/invoices/", response_model=list[schemas.InvoiceResponse])
def get_invoices(db: Session = Depends(get_db)):
    return db.query(models.Invoice).all()

# --- Daily Closings APIs ---
@app.post("/closings/", response_model=schemas.DailyClosingResponse)
def create_closing(closing: schemas.DailyClosingCreate, db: Session = Depends(get_db)):
    db_closing = models.DailyClosing(**closing.model_dump())
    db.add(db_closing)
    db.commit()
    db.refresh(db_closing)
    return db_closing

@app.get("/closings/", response_model=list[schemas.DailyClosingResponse])
def get_closings(db: Session = Depends(get_db)):
    return db.query(models.DailyClosing).all()
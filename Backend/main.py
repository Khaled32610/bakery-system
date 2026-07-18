from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import sessionmaker, Session, declarative_base
from pydantic import BaseModel

# ==========================================
# 1. إعدادات قاعدة البيانات
# ==========================================
DATABASE_URL = "sqlite:///./bakery.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# ==========================================
# 2. جداول قاعدة البيانات (Models)
# ==========================================
class RawMaterialDB(Base):
    __tablename__ = "raw_materials"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    quantity = Column(Float)
    unit = Column(String)

class BranchDB(Base):
    __tablename__ = "branches"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    location = Column(String, default="")

class ProductDB(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    price = Column(Float)

class ClientDB(Base):
    __tablename__ = "clients"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    contact_info = Column(String)
    current_balance = Column(Float, default=0.0)

class InvoiceDB(Base):
    __tablename__ = "invoices"
    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"))
    product_id = Column(Integer, ForeignKey("products.id"))
    date = Column(String)
    quantity = Column(Integer)
    total_amount = Column(Float)
    paid_amount = Column(Float)
    remaining_amount = Column(Float)

class ClosingDB(Base):
    __tablename__ = "closings"
    id = Column(Integer, primary_key=True, index=True)
    branch_id = Column(Integer, ForeignKey("branches.id"))
    date = Column(String)
    flour_sacks_used = Column(Integer)
    yeast_packs_used = Column(Integer)
    gas_cylinders_used = Column(Integer)
    actual_bread_produced = Column(Integer)

# إنشاء الجداول
Base.metadata.create_all(bind=engine)

# ==========================================
# 3. خادم FastAPI
# ==========================================
app = FastAPI(title="Bakery ERP API")

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

# ==========================================
# 4. Pydantic Schemas
# ==========================================
class MaterialCreate(BaseModel):
    name: str
    quantity: float
    unit: str

class BranchCreate(BaseModel):
    name: str
    location: str = ""

class ProductCreate(BaseModel):
    name: str
    price: float

class ClientCreate(BaseModel):
    name: str
    contact_info: str
    current_balance: float = 0.0

class InvoiceCreate(BaseModel):
    client_id: int
    product_id: int
    date: str
    quantity: int
    total_amount: float
    paid_amount: float
    remaining_amount: float

class ClosingCreate(BaseModel):
    branch_id: int
    date: str
    flour_sacks_used: int
    yeast_packs_used: int
    gas_cylinders_used: int
    actual_bread_produced: int

# ==========================================
# 5. مسارات الـ API (Endpoints)
# ==========================================

# --- المواد الخام ---
@app.post("/materials/")
def create_material(material: MaterialCreate, db: Session = Depends(get_db)):
    db_mat = RawMaterialDB(**material.model_dump())
    db.add(db_mat)
    db.commit()
    db.refresh(db_mat)
    return db_mat

@app.get("/materials/")
def get_materials(db: Session = Depends(get_db)):
    return db.query(RawMaterialDB).all()

# --- الفروع ---
@app.post("/branches/")
def create_branch(branch: BranchCreate, db: Session = Depends(get_db)):
    db_branch = BranchDB(**branch.model_dump())
    db.add(db_branch)
    db.commit()
    db.refresh(db_branch)
    return db_branch

@app.get("/branches/")
def get_branches(db: Session = Depends(get_db)):
    return db.query(BranchDB).all()

# --- المنتجات (أنواع العيش) ---
@app.post("/products/")
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    db_product = ProductDB(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@app.get("/products/")
def get_products(db: Session = Depends(get_db)):
    return db.query(ProductDB).all()

# --- العملاء والمحلات ---
@app.post("/clients/")
def create_client(client: ClientCreate, db: Session = Depends(get_db)):
    db_client = ClientDB(**client.model_dump())
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client

@app.get("/clients/")
def get_clients(db: Session = Depends(get_db)):
    return db.query(ClientDB).all()

# --- الفواتير وتحديث المديونية ---
@app.post("/invoices/")
def create_invoice(invoice: InvoiceCreate, db: Session = Depends(get_db)):
    db_invoice = InvoiceDB(**invoice.model_dump())
    db.add(db_invoice)
    
    # تحديث مديونية العميل
    if invoice.remaining_amount > 0:
        client = db.query(ClientDB).filter(ClientDB.id == invoice.client_id).first()
        if client:
            client.current_balance += invoice.remaining_amount
            
    db.commit()
    db.refresh(db_invoice)
    return db_invoice

@app.get("/invoices/")
def get_invoices(db: Session = Depends(get_db)):
    return db.query(InvoiceDB).all()

# --- التقفيل اليومي ---
@app.post("/closings/")
def create_closing(closing: ClosingCreate, db: Session = Depends(get_db)):
    db_closing = ClosingDB(**closing.model_dump())
    db.add(db_closing)
    db.commit()
    db.refresh(db_closing)
    return db_closing

@app.get("/closings/")
def get_closings(db: Session = Depends(get_db)):
    return db.query(ClosingDB).all()
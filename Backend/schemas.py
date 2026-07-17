from pydantic import BaseModel

class RawMaterialBase(BaseModel):
    name: str
    unit_type: str
    expected_yield: int = 0
class RawMaterialCreate(RawMaterialBase): pass
class RawMaterialResponse(RawMaterialBase):
    id: int
    class Config: from_attributes = True

class BranchBase(BaseModel):
    name: str
    location: str
class BranchCreate(BranchBase): pass
class BranchResponse(BranchBase):
    id: int
    class Config: from_attributes = True

class ClientBase(BaseModel):
    name: str
    phone: str | None = None
    current_balance: float = 0.0
class ClientCreate(ClientBase): pass
class ClientResponse(ClientBase):
    id: int
    class Config: from_attributes = True

# --- NEW: Product Schemas ---
class ProductBase(BaseModel):
    name: str
    price: float = 0.0
class ProductCreate(ProductBase): pass
class ProductResponse(ProductBase):
    id: int
    class Config: from_attributes = True

from datetime import date

# --- Invoice Schemas ---
class InvoiceBase(BaseModel):
    client_id: int
    product_id: int
    date: date
    quantity: int
    total_amount: float = 0.0
    paid_amount: float = 0.0
    remaining_amount: float = 0.0

class InvoiceCreate(InvoiceBase): 
    pass

class InvoiceResponse(InvoiceBase):
    id: int

    class Config: 
        from_attributes = True

from datetime import date

# --- Daily Closing Schemas ---
class DailyClosingBase(BaseModel):
    branch_id: int
    date: date
    flour_sacks_used: int = 0
    yeast_packs_used: int = 0
    gas_cylinders_used: int = 0
    actual_bread_produced: int = 0

class DailyClosingCreate(DailyClosingBase):
    pass

class DailyClosingResponse(DailyClosingBase):
    id: int

    class Config:
        from_attributes = True        
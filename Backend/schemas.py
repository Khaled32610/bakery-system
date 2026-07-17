from pydantic import BaseModel

# --- Raw Material Schemas ---
class RawMaterialBase(BaseModel):
    name: str
    unit_type: str
    expected_yield: int = 0

class RawMaterialCreate(RawMaterialBase):
    pass

class RawMaterialResponse(RawMaterialBase):
    id: int

    class Config:
        from_attributes = True

# --- Branch Schemas ---
class BranchBase(BaseModel):
    name: str
    location: str

class BranchCreate(BranchBase):
    pass

class BranchResponse(BranchBase):
    id: int

    class Config:
        from_attributes = True

# --- Client Schemas ---
class ClientBase(BaseModel):
    name: str
    phone: str | None = None
    current_balance: float = 0.0

class ClientCreate(ClientBase):
    pass

class ClientResponse(ClientBase):
    id: int

    class Config:
        from_attributes = True
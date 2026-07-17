from pydantic import BaseModel

# Base schema for Raw Material
class RawMaterialBase(BaseModel):
    name: str
    unit_type: str
    expected_yield: int = 0

# Schema for creating a new Raw Material
class RawMaterialCreate(RawMaterialBase):
    pass

# Schema for returning Raw Material data (includes ID from DB)
class RawMaterialResponse(RawMaterialBase):
    id: int

    class Config:
        from_attributes = True

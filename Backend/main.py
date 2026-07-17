from fastapi import FastAPI
from database import engine
import models

# Create all database tables based on models.py
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Bakery Management System API")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Bakery System API. The database is connected!"}

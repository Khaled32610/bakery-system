from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Database connection URL (PostgreSQL)
SQLALCHEMY_DATABASE_URL = "postgresql://bakery_user:admin123@localhost/bakery_db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

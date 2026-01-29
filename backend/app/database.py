from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# URL SQLAlchemy
DATABASE_URL = f"mysql+pymysql://u4owyzyzlcdb4zvd:7J6mYIZa6yTFb4PuUTuz@bxm5t56itadh9tuzysxf-mysql.services.clever-cloud.com:3306/bxm5t56itadh9tuzysxf"
# Création engine SQLAlchemy
engine = create_engine(DATABASE_URL, echo=True)
# Session pour CRUD
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# Base pour déclarer les modèles
Base = declarative_base()
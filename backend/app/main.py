from fastapi import FastAPI, UploadFile, File, Depends, Body
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pathlib import Path
import shutil
from pydantic import BaseModel
import numpy as np

from app.database import SessionLocal, engine
from app.models import Base, CV, Job
from app.crud import (
    add_cv, create_job,
    get_cv_by_id, get_job_by_id,
    save_matching_score
)
from app.ia_module.extraction import extract_text
from app.ia_module.preprocessing import preprocess_text
from app.ia_module.vectorization import vectorize_bert
from app.ia_module.matching import match_bert

# Initialisation FastAPI
app = FastAPI()

# Création des tables
@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dossier pour uploads
UPLOAD_FOLDER = Path("./uploads")
UPLOAD_FOLDER.mkdir(exist_ok=True)

# DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Modèle Pydantic pour Job
class JobCreate(BaseModel):
    title: str
    description: str

# Routes
@app.get("/")
def home():
    return {"message": "Welcome to my API!"}

@app.post("/upload_cv/")
async def upload_cv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        file_path = UPLOAD_FOLDER / file.filename

        with open(file_path, "wb+") as f:
            shutil.copyfileobj(file.file, f)

        raw_text = extract_text(file_path)
        new_cv = add_cv(db, filename=file.filename, raw_text=raw_text)

        return {
            "id": new_cv.id,
            "filename": new_cv.filename,
            "status": "uploaded"
        }
    except Exception as e:
        return {"error": str(e)}

@app.post("/job/upload")
def upload_job(job: JobCreate, db: Session = Depends(get_db)):
    # Utilisation du modèle Pydantic
    job_obj = create_job(db, job.title, job.description)
    return {
        "message": "Job enregistré avec succès",
        "job_id": job_obj.id,
        "title": job_obj.title
    }

@app.get("/job/all")
def get_all_jobs(db: Session = Depends(get_db)):
    jobs = db.query(Job).all()
    return [{"id": job.id, "title": job.title, "description": job.description} for job in jobs]

@app.post("/match/job/{job_id}")
def match_job_with_all_cvs(job_id: int, payload: dict = Body(default={}), db: Session = Depends(get_db)):
    job = get_job_by_id(db, job_id)
    if not job:
        return {"error": "Job introuvable"}

    cvs = db.query(CV).all()
    if not cvs:
        return {"error": "Aucun CV trouvé"}

    results = []
    job_clean = preprocess_text(job.description)
    job_vector = vectorize_bert(job_clean)

    for cv in cvs:
        cv_clean = preprocess_text(cv.raw_text)
        cv_vector = vectorize_bert(cv_clean)
        score = match_bert(cv_vector, job_vector)
        score = float(score)
        save_matching_score(db, cv.id, job.id, score)

        results.append({
            "cv_id": cv.id,
            "filename": cv.filename,
            "score": score
        })

    results.sort(key=lambda x: x["score"], reverse=True)

    return {
        "job_id": job.id,
        "job_title": job.title,
        "ranking": results
    }

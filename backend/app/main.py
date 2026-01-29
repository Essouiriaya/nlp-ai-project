from fastapi import FastAPI, UploadFile, File, Depends
from sqlalchemy.orm import Session
from pathlib import Path
import shutil

from app.database import SessionLocal, engine
from app.models import Base, CV, Job
from app.crud import add_cv, create_job, get_cv_by_id, get_job_by_id
from app.ia_module.extraction import extract_text
from app.ia_module.preprocessing import preprocess_text
from app.ia_module.vectorization import vectorize_bert
from app.ia_module.matching import match_bert

Base.metadata.create_all(bind=engine)

app = FastAPI()
UPLOAD_FOLDER = Path("./uploads")
UPLOAD_FOLDER.mkdir(exist_ok=True)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def home():
    return {"message": "Welcome to my API!"}

@app.post("/upload_cv/")
async def upload_cv(file: UploadFile = File(...), db: Session = Depends(get_db)):
    file_path = UPLOAD_FOLDER / file.filename
    with open(file_path, "wb+") as f:
        shutil.copyfileobj(file.file, f)
    raw_text = extract_text(file_path)
    new_cv = add_cv(db, filename=file.filename, raw_text=raw_text)
    return {"id": new_cv.id, "filename": new_cv.filename, "status": "uploaded"}


@app.post("/job/upload")
def upload_job(title: str, description: str, db: Session = Depends(get_db)):
    job = create_job(db, title, description)
    return {
        "message": "Job enregistré avec succès",
        "job_id": job.id,
        "title": job.title
    }

@app.post("/match/{cv_id}/{job_id}")
def match_cv_job(cv_id: int, job_id: int, db: Session = Depends(get_db)):
    cv = get_cv_by_id(db, cv_id)
    job = get_job_by_id(db, job_id)

    if not cv or not job:
        return {"error": "CV ou Job introuvable"}

    cv_clean = preprocess_text(cv.raw_text)
    job_clean = preprocess_text(job.description)

    vectors = vectorize_bert(cv_clean, job_clean)

    score = match_bert(vectors)

    return {
        "cv_id": cv_id,
        "job_id": job_id,
        "matching_score": score
    }
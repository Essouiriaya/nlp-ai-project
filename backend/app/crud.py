from sqlalchemy.orm import Session
from app.models import CV, Job

def add_cv(db: Session, filename: str, raw_text: str):
    new_cv = CV(filename=filename, raw_text=raw_text)
    db.add(new_cv)
    db.commit()
    db.refresh(new_cv)
    return new_cv

def get_cv_by_id(db: Session, cv_id: int):
    return db.query(CV).filter(CV.id == cv_id).first()

def create_job(db: Session, title: str, description: str):
    job = Job(title=title, description=description)
    db.add(job)
    db.commit()
    db.refresh(job)
    return job

def get_job_by_id(db: Session, job_id: int):
    return db.query(Job).filter(Job.id == job_id).first()
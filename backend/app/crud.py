from sqlalchemy.orm import Session
from app.models import CV, Job, MatchingScore

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

def save_matching_score(db, cv_id: int, job_id: int, score: float):
    match = MatchingScore(
        cv_id=cv_id,
        job_id=job_id,
        score=score
    )
    db.add(match)
    db.commit()
    db.refresh(match)
    return match


def get_scores_by_job(db, job_id: int):
    return (
        db.query(MatchingScore)
        .filter(MatchingScore.job_id == job_id)
        .order_by(MatchingScore.score.desc())
        .all()
    )

from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

def match_bert(cv_vector, job_vector):
    similarity = cosine_similarity(
        [cv_vector],
        [job_vector]
    )
    return round(similarity[0][0] * 100, 2)
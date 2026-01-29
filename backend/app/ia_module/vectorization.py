from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")

def vectorize_bert(text: str):
    return model.encode(text)
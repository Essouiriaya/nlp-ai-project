import re
import nltk
from nltk.corpus import stopwords

nltk.download("stopwords")

STOP_WORDS = set(stopwords.words("english"))

def preprocess_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r"\n", " ", text)
    text = re.sub(r"[^a-zA-Z0-9 ]", "", text)

    tokens = text.split()
    tokens = [t for t in tokens if t not in STOP_WORDS]

    return " ".join(tokens)
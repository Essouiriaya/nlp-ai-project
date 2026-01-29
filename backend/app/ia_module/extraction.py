import pdfplumber
import docx
from pathlib import Path

def extract_text(file_path: Path) -> str:
    # Gestion PDF
    if file_path.suffix.lower() == ".pdf":
        text = ""
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        return text
    # Gestion DOCX (fichier Word)
    elif file_path.suffix.lower() == ".docx":
        doc = docx.Document(file_path)
        return "\n".join([p.text for p in doc.paragraphs])
    else:
        return ""
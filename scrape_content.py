import json
import os
import PyPDF2
from docx import Document

DOCUMENTS_FILE = r"c:\Users\Vinay Singh\Desktop\hack\Unstoppabl-e-HACKS\data\documents.json"
OUTPUT_FILE = r"c:\Users\Vinay Singh\Desktop\hack\Unstoppabl-e-HACKS\data\documents_with_content.json"
BASE_DIR = r"c:\Users\Vinay Singh\Desktop\hack\Unstoppabl-e-HACKS"

def extract_pdf_text(filepath, max_pages=3):
    text = ""
    try:
        with open(filepath, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            num_pages = min(len(reader.pages), max_pages)
            for i in range(num_pages):
                page = reader.pages[i]
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
    except Exception as e:
        print(f"Error reading PDF {filepath}: {e}")
    return text.strip()

def extract_docx_text(filepath):
    text = ""
    try:
        doc = Document(filepath)
        for para in doc.paragraphs:
            text += para.text + "\n"
    except Exception as e:
        print(f"Error reading DOCX {filepath}: {e}")
    return text.strip()

with open(DOCUMENTS_FILE, 'r') as f:
    documents = json.load(f)

print(f"Processing {len(documents)} documents...")

for doc in documents:
    # Construct absolute path
    # doc['path'] is like "dataset/filename.ext"
    rel_path = doc['path']
    abs_path = os.path.join(BASE_DIR, rel_path)
    
    content = ""
    if abs_path.lower().endswith('.pdf'):
        content = extract_pdf_text(abs_path)
    elif abs_path.lower().endswith('.docx'):
        content = extract_docx_text(abs_path)
    
    # Clean up content a bit (remove excessive whitespace)
    content = ' '.join(content.split())
    
    # Store snippet and full content length (or full content if not too huge? Let's keep it reasonable)
    # We'll store the first 1000 chars as 'excerpt' for the UI
    doc['excerpt'] = content[:1000] + "..." if len(content) > 1000 else content
    # doc['full_content'] = content # Uncomment if we want full text, but might be large
    doc['has_content'] = len(content) > 0
    
    print(f"Processed {doc['filename']}: {len(content)} chars extracted.")

# Write back to documents.json (overwriting or new file)
# I'll overwrite documents.json because that's what the app will use
with open(DOCUMENTS_FILE, 'w') as f:
    json.dump(documents, f, indent=4)

print("Done.")

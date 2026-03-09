from pypdf import PdfReader
import docx

def extract_text_from_pdf(file_path):
    
    reader = PdfReader(file_path)
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text

def extract_text_from_docx(file_path):
    doc = docx.Document(file_path)
    text = ""
    for para in doc.paragraphs:
        text += para.text + "\n"
        
    return text

# General text extraction function that determines the file type and calls the appropriate extraction function
def extract_text(file_path, file_type):
    if file_type == 'pdf':
        return extract_text_from_pdf(file_path)
    
    if file_type == 'docx':
        return extract_text_from_docx(file_path)
    
    if file_type == 'txt':
        with open(file_path, 'r', encoding = 'utf-8') as f:
            return f.read()
        
# Function to split text into chunks of a specified size (e.g., 1000 characters) for better processing and analysis
def split_into_chunks(text, chunk_size = 500, overlap = 50):
    word = text.split()
    chunks = []
    start = 0
    while(start < len(word)):
        end = start + chunk_size
        chunk_word = word[start:end]
        chunk_text = " ".join(chunk_word)
        chunks.append(chunk_text)
        start += chunk_size - overlap
        
    return chunks
    
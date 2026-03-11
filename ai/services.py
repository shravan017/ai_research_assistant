
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

# Function to create embeddings for a given text using the SentenceTransformer model (e.g., "all-MiniLM-L6-v2") for semantic search and analysis
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")
def create_embeddings(text):
    vector = model.encode(text)
    return vector.tolist()

# to find the cosine similarity between two vectors (e.g., for semantic search and analysis)
import numpy as np

def cosine_similarity(vec1, vec2):
    v1 = np.array(vec1)
    v2 = np.array(vec2)
    
    similarity = np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))
    return similarity

# semantic search function to find the most relevant document chunks based on a query by calculating the cosine similarity between the query embedding and the chunk embeddings
from documents.models import DocumentChunk
def semantic_search(question, workspace_id, top_k = 5):
    question_embeding = create_embeddings(question)
    chunks = DocumentChunk.objects.filter(
        document__workspace_id = workspace_id
    )
    results = []
    for chunk in chunks:
        score = cosine_similarity(question_embeding, chunk.embedding)
        results.append((score, chunk))
    
    results.sort(key = lambda x : x[0], reverse=True)
    top_chunks = [chunk for score, chunk in results[:top_k]]
    return top_chunks
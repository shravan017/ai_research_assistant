
import json

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
from rest_framework import response
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

# LLM service function to generate a response from a language model (e.g., OpenAI's GPT-3) based on a given prompt.
import requests
from django.conf import settings

def generate_answer(prompt):
    
    API_URL = "https://router.huggingface.co/v1/chat/completions"
    
    headers = {
        "Authorization": f"Bearer {settings.HF_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "mistralai/Mistral-7B-Instruct-v0.2:featherless-ai",
        "messages": [
            {
                "role":"system",
                "content": """You are a helpful AI research assistant. 
                Answer only using the provided context.
                Do not make up information.

                If the answer is not in the context, say "I don't know based on the provided documents"."""
            },
            {
                "role":"user",
                "content": prompt
            }
        ],
        "max_tokens": 200,
        "temperature": 0.3
    }
    
    try:
        response = requests.post(API_URL, headers=headers, json=payload)

        print("Status Code:", response.status_code)
        print("Raw Response:", response.text)

        
        if response.status_code != 200:
            return f"LLM API error: {response.status_code}"

        
        result = response.json()

        
        if "choices" in result:
            return result["choices"][0]["message"]["content"]

        return "LLM returned unexpected response."

    except Exception as e:
        print("LLM ERROR:", str(e))
        return "LLM request failed."


# Streaming LLM answer function to generate a response from a language model in a streaming manner, allowing for real-time updates as the model generates the answer.
def stream_llm_answer(question, chunks):
    
    context = "\n\n".join([c.content[:500] for c in chunks])
    API_URL = "https://router.huggingface.co/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {settings.HF_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "mistralai/Mistral-7B-Instruct-v0.2:featherless-ai",
        "messages": [
            {
                "role":"system",
                "content": """You are a helpful AI research assistant.
                Answer only using the provided context.
                Do not make up information.

                If the answer is not in the context, say "I don't know based on the provided documents".
                """
            },
            {
                "role":"user",
                "content":f"""
                Context:
                {context}
                
                Question:
                {question}
                """
            }
        ],
        "max_tokens": 200,
        "temperature": 0.3,
        "stream": True
    }
    
    try:
        response = requests.post(API_URL, headers=headers, json=payload, stream=True)
        for line in response.iter_lines():
            if line:
                decoded = line.decode('utf-8')
                if decoded.startswith("data: "):
                    data = decoded.replace("data: ", "")
                    
                    if data == "[DONE]":
                        break
                    
                    chunk = json.loads(data)
                    
                    if "choices" in chunk:
                        delta = chunk["choices"][0]["delta"]
                        
                        if "content" in delta:
                            yield delta["content"]
                            
                            
    except Exception as e:
        yield "Streaming LLM request failed."
                
        
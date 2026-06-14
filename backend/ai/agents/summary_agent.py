from ai.services import semantic_search
from ai.services import generate_answer

def summary_agent(question, workspace_id, user):
    
    chunks = semantic_search(question, workspace_id)
    context = " ".join(
        [chunk.content for chunk in chunks[:5]]
    )
    prompt = f"""
    You are a helpful AI Assistant.
    
    Summarize the following content:
    {context}
    
    Instructions:
    -Make it short.
    -Use bullet points.
    -Answer clearly
    
    User request:
    {question}
    """
    answer = generate_answer(prompt)
    return {
        "answer": answer,
        "sources": []
    }
    
from .agent_tool import search_document
from .services import generate_answer

def research_agent(question, workspace_id):
    # search for the relevent documents
    documents = search_document(question, workspace_id)
    
    context_blocks = []
    for doc, chunks in documents.items():
        combined = " ".join(chunks[:2]) # take the first 2 chunks for context
        block = f"{doc}:\n{combined}"
        context_blocks.append(block)
    context = "\n\n".join(context_blocks)
    
    chunks = []
    class Fakechunk:
        def __init__(self, content):
            self.content = content
            
    for block in context_blocks:
        chunks.append(Fakechunk(block))
    # generate an answer using the LLM
    answer = generate_answer(question, chunks)
    
    return answer
    
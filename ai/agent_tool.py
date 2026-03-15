from .services import semantic_search

def search_document(question, workspace_id):
    
    chunks = semantic_search(question, workspace_id)
    grouped = {}
    
    for chunk in chunks:
        doc_title = chunk.document.title
        
        if doc_title not in grouped:
            grouped[doc_title] = []
        
        grouped[doc_title].append(chunk.content)
        
    return grouped
    
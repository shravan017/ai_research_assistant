from ai.models import Conversation, Message
from ai.agent_tool import search_document
from ai.services import generate_answer



def research_agent(question, workspace_id, user):
    
    # Get or Create a conversation for the workspace
    conversation, _ = Conversation.objects.get_or_create(
        workspace_id = workspace_id,
        user=user
    )
    
    # Save User Message
    Message.objects.create(
        conversation = conversation,
        role = "user",
        content=question
    )
    # search for the relevent documents(RAG)
    documents = search_document(question, workspace_id)
    
    context_blocks = []
    for doc, chunks in documents.items():
        combined = " ".join(chunks[:2]) # take the first 2 chunks for context
        block = f"{doc}:\n{combined}"
        context_blocks.append(block)
    context = "\n\n".join(context_blocks)
    
    # Get History of the conversation
    history = Message.objects.filter(
        conversation = conversation
    ).order_by("-created_at")[:5] # get last 5 messages
    
    history_text = ""
    
    for msg in reversed(history):
        history_text += f"{msg.role}:{msg.content}\n"
        
    # Build final prompt for the LLM
    final_prompt = f"""
    Conversation History:
    {history_text}
    
    Document Context:
    {context}
    
    Question:
    {question}
    """ 
    # generate an answer using the LLM
    answer = generate_answer(final_prompt)
    sources = []

    for doc in documents.keys():
        sources.append({
            "document": doc
        }) 
    
    # save AI response
    Message.objects.create(
        conversation = conversation,
        role = "assistant",
        content = answer
    )
    
    return {"answer":answer, "sources":sources}
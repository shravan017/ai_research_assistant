from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .services import semantic_search, generate_answer, stream_llm_answer
from django.http import StreamingHttpResponse
from ai.agents.manager import manager_agent
from .models import Conversation
from .serializers import MessageSerializer

class AskResearchAgent(APIView):
    
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        question = request.data.get("question")
        workspace_id = request.data.get("workspace_id")
        
        chunks = semantic_search(question, workspace_id)[:3]
        
        answer = generate_answer(question, chunks)
        sources = []
        
        for chunk in chunks:
            sources.append({
                "document":chunk.document.title,
                "chunk_index": chunk.chunk_index,
            })
        return Response({
            "question":question,
            "answer":answer,
            "sources":sources
        })


#streaming response for LLM answer generation
class StreamResearchAgent(APIView):
    
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        question = request.data.get("question")
        workspace_id = request.data.get("workspace_id")
        
        chunks = semantic_search(question, workspace_id)[:4]
        response = StreamingHttpResponse(
            stream_llm_answer(question, chunks),
            content_type = "text/plain"
        )
        
        return response
   
class ResearchAgentView(APIView):
    
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        question = request.data.get("question")
        workspace_id = request.data.get("workspace_id")
        
        result = manager_agent(question, workspace_id, request.user)
        
        
        return Response({
            "question": question,
            "answer": result["answer"],
            "sources": result["sources"]
        })
    
class ConversationHistoryView(APIView):
    permission_classes = [IsAuthenticated,]

    def get(self, request, workspace_id):
        conversation = Conversation.objects.filter(
            workspace_id = workspace_id,
            user = request.user
        ).first()
        if not conversation: return Response([])

        messages = conversation.messages.all().order_by("created_at")

        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)
        
        
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .services import semantic_search, generate_answer


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

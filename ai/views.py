from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .services import semantic_search


class AskResearchAgent(APIView):
    
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        question = request.data.get("question")
        workspace_id = request.data.get("workspace_id")
        
        chunks = semantic_search(question, workspace_id)
        result = []
        
        for chunk in chunks:
            result.append({
                "document":chunk.document.title,
                "content": chunk.content,
            })
        return Response({
            "question":question,
            "result":result,
        })

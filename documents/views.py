from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from research.models import Workspace
from django.shortcuts import get_object_or_404
from .models import Document
from .serializers import DocumentSerializer

class DocumentUploadView(APIView):
    
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        serializer = DocumentSerializer(data = request.data)
        
        if serializer.is_valid():
            
            workspace = get_object_or_404(
                Workspace,
                id = request.data.get('workspace_id'),
                owner = request.user
            )
            serializer.save(uploaded_by = request.user, workspace = workspace) #set the uploaded_by field to the authenticated user when saving the document (ownership-based access control
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    

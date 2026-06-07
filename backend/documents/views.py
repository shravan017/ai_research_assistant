from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from research.models import Workspace
from django.shortcuts import get_object_or_404
from .models import Document, DocumentChunk
from .serializers import DocumentSerializer
from ai.services import extract_text, split_into_chunks, create_embeddings


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
            #set the uploaded_by field to the authenticated user when saving the document (ownership-based access control
            document = serializer.save(uploaded_by = request.user, workspace = workspace)
            
            #get the file path of the uploaded document to extract its content
            file_path = document.file.path 
            
            # extract the text content from the uploaded document using the extract_text function from ai.services
            text = extract_text(file_path, document.file_type) 
            document.content = text     #save the extracted content to the document instance
            document.save()             #save the document instance with the extracted content to the database
            #split the extracted text into chunks for better processing
            chunks = split_into_chunks(text)
            for index, chunk in enumerate(chunks):
                embedding = create_embeddings(chunk)
                DocumentChunk.objects.create(
                    document = document,
                    content = chunk,
                    embedding = embedding,
                    chunk_index = index
                )
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    

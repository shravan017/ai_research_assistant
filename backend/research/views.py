from django.shortcuts import render
from rest_framework import viewsets
from .models import Workspace
from .serializers import WorkspaceSerializer
from rest_framework.permissions import IsAuthenticated

class WorkspaceViewSet(viewsets.ModelViewSet):
    
    serializer_class = WorkspaceSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Workspace.objects.filter(owner = self.request.user) #filter workspaces to only those owned by the authenticated user (ownership-based access control)
    
    def perform_create(self, serializer):
        return serializer.save(owner = self.request.user) #set the owner of the workspace to the authenticated user when creating a new workspace (ownership-based access control)
    
    #User only sees their own workspaces
    #This is ownership-based access control.

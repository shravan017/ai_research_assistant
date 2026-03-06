from rest_framework import serializers
from .models import Workspace

class WorkspaceSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Workspace
        fields = ['id','name','created_at']
        
        """ do not include owner in the fields, as it will be set automatically to the authenticated user 
        when creating a workspace (Secure API Design)"""
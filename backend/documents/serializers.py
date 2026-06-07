from rest_framework import serializers
from .models import Document

class DocumentSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Document
        fields = "__all__"
        read_only_fields = ['uploaded_by', 'workspace'] #set uploaded_by and workspace as read-only fields, as they will be set automatically in the view (Secure API Design)
        
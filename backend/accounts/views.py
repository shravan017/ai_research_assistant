from django.shortcuts import render
from rest_framework.generics import CreateAPIView
from .serializers import RegisterSerializer
from rest_framework.permissions import AllowAny

# Create your views here.
class RegisterAPIView(CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
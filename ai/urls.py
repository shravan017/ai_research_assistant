from django.urls import path
from .views import AskResearchAgent

urlpatterns = [
    path('ask/', AskResearchAgent.as_view()),
]
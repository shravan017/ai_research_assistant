from django.urls import path
from .views import AskResearchAgent, StreamResearchAgent

urlpatterns = [
    path('ask/', AskResearchAgent.as_view()),
    path('stream/', StreamResearchAgent.as_view())
]
from django.urls import path
from .views import AskResearchAgent, StreamResearchAgent, ResearchAgentView

urlpatterns = [
    path('ask/', AskResearchAgent.as_view()),
    path('stream/', StreamResearchAgent.as_view()),
    path('agent/', ResearchAgentView.as_view()),
]
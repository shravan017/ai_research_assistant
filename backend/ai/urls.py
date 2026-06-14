from django.urls import path
from .views import AskResearchAgent, StreamResearchAgent, ResearchAgentView, ConversationHistoryView

urlpatterns = [
    path('ask/', AskResearchAgent.as_view()),
    path('stream/', StreamResearchAgent.as_view()),
    path('agent/', ResearchAgentView.as_view()),
    path("history/<int:workspace_id>/", ConversationHistoryView.as_view()),
]
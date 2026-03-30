from .research_agent import research_agent
from .summary_agent import summary_agent

def manager_agent(question, workspace_id, user):
    
    if "summary" in question.lower() or "summarize" in question.lower():
        return summary_agent(question, workspace_id, user)
    
    return research_agent(question, workspace_id, user)
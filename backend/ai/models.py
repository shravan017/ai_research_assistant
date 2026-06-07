from django.db import models
from django.conf import settings
from research.models import Workspace

User = settings.AUTH_USER_MODEL

#conversation model to store conversation history
class Conversation(models.Model):
    
    workspace = models.ForeignKey(
        Workspace,
        on_delete=models.CASCADE,
        related_name="conversations"
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
# message model stores message history
class Message(models.Model):
    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name="messages"
    )
    role = models.CharField(max_length=20) #user/assistant(ai)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

import React from 'react'
import api from '../api/axios'
import { useState } from 'react'

export default function useChat(id, selectedConversation) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadHistory = async () => {
        try {
          const response = await api.get(`/ai/history/${selectedConversation}/`);
          const history = response.data.map((msg) => ({
            role: msg.role,
            content: msg.content,
            timestamp: msg.created_at,
            sources: [],
          }));
          setMessages(history);
        } catch (error) {
          console.error(error);
        }
      };

      const sendQuestion = async () => {
          if (!question.trim()) return;
          const userMessage = { role: "user", content: question, timestamp: new Date() };
          setMessages((prev) => [...prev, userMessage]);
          setLoading(true);
          try {
            const response = await api.post("/ai/agent/", {
              question,
              conversation_id: selectedConversation,
            });
            fetchConversations();
            const aiMessage = {
              role: "assistant",
              content: response.data.answer,
              sources: response.data.sources || [],
              timestamp: new Date(),
            };
            setMessages((prev) => [...prev, aiMessage]);
          } catch (error) {
            console.error(error);
          } finally {
            setLoading(false);
          }
          setQuestion("");
    };
    return {
        messages,
        loading,
        sendQuestion,
        loadHistory,
        setMessages
    }

  
}

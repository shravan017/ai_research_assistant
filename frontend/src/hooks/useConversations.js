import React from 'react'
import { useState } from 'react';
import api from '../api/axios';

export default function useConversations(id) {
  
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [conversationSearch, setConversationSearch] = useState("");

    const fetchConversations = async () => {
        try {
        const response = await api.get(`/ai/conversations/${id}/`);
        setConversations(response.data);
        } catch (error) {
        console.error(error);
        }
    };

    const createConversation = async () => {
        try {
        const response = await api.post("/ai/conversations/create/", {
            workspace_id: id,
        });
        setSelectedConversation(response.data.id);
        fetchConversations();
        } catch (error) {
        console.error(error);
        }
    };
    const deleteConversation = async (conversationId) => {
        const confirmed = window.confirm(
          "Are you sure you want to delete this conversation ? "
        )
        if (!confirmed) return;
        try {
          await api.delete(`/ai/conversations/${conversationId}/delete/`);
          if (selectedConversation === conversationId) {
            setSelectedConversation(null);
            setMessages([]);
          }
          fetchConversations();
        } catch (error) {
          console.error(error);
        }
      };
    
      const renameConversation = async (conversationId) => {
        const newTitle = prompt("Enter new conversation title:");
        if (!newTitle || !newTitle.trim()) return;
        try {
          await api.patch(`/ai/conversations/${conversationId}/rename/`, {
            title: newTitle,
          });
          fetchConversations();
        } catch (error) {
          console.error(error);
        }
      };

    return{
        conversations,
        conversationSearch,
        setConversations,
        setConversationSearch,
        selectedConversation,
        setSelectedConversation,
        fetchConversations,
        createConversation,
        renameConversation,
        deleteConversation
    }

}

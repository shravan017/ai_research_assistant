import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import ReactMarkdown from "react-markdown";
import { formatDistanceToNow } from "date-fns";
import ConversationItem from "../components/conversation/ConversationItem";
import DocumentItem from "../components/document/DocumentItem";
import ChatMessage from "../components/chat/ChatMessage";
import ChatInput from "../components/chat/ChatInput";
import Sidebar from "../components/workspace/Sidebar";
import useDocument from "../hooks/useDocument";
import useConversations from "../hooks/useConversations";
import useChat from "../hooks/useChat";

function Workspace() {
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const {documents, uploading, fetchDocuments, handleUpload} = useDocument(id)
  const {conversations, selectedConversation, conversationSearch, setConversationSearch, setSelectedConversation, fetchConversations, createConversation, renameConversation, deleteConversation} = useConversations(id)
  const {messages, loading, sendQuestion, loadHistory} = useChat(id, selectedConversation);

  const [question, setQuestion] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    fetchDocuments();
    fetchConversations();
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (selectedConversation) loadHistory();
  }, [selectedConversation]);


  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendQuestion();
    }
  };

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(conversationSearch.toLowerCase())
  );

  return (
    <div className="h-screen w-screen bg-zinc-950 text-white flex overflow-hidden fixed inset-0">
      {/* ── Sidebar ── */}
      <Sidebar 
        documents={documents}
        uploading={uploading}
        handleUpload={handleUpload}
        fileInputRef={fileInputRef}
        conversations={conversations}
        filteredConversations={filteredConversations}
        conversationSearch={conversationSearch}
        setConversationSearch={setConversationSearch}
        selectedConversation={selectedConversation}
        setSelectedConversation={setSelectedConversation}
        createConversation={createConversation}
        renameConversation={renameConversation}
        deleteConversation={deleteConversation}
        Sidebar={Sidebar}
        sidebarOpen={sidebarOpen}
      />

      {/* ── Chat area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat topbar */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-zinc-800 shrink-0">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="text-zinc-400 hover:text-white hover:bg-zinc-800 p-2 rounded-lg transition-colors"
            title="Toggle sidebar"
          >
            ☰
          </button>
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-zinc-200">
              {selectedConversation
                ? conversations.find((c) => c.id === selectedConversation)?.title || "Chat"
                : "AI Research Assistant"}
            </h2>
            <p className="text-xs text-zinc-500">
              {documents.length} document{documents.length !== 1 ? "s" : ""} in workspace
            </p>
          </div>
          {!selectedConversation && (
            <button
              onClick={createConversation}
              className="text-sm bg-green-600 hover:bg-green-500 px-3 py-1.5 rounded-lg transition-colors font-medium"
            >
              + New Chat
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-5">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center text-zinc-500 pb-16">
              <div className="text-6xl mb-5">🤖</div>
              <h3 className="text-xl font-bold text-zinc-200 mb-2">
                Ask anything about your research
              </h3>
              <p className="text-sm text-zinc-500 max-w-sm">
                {selectedConversation
                  ? "Type a question below to get started."
                  : "Create a new chat from the sidebar or use the button above."}
              </p>
            </div>
          )}

          {messages.map((message, index) => (
            <ChatMessage 
              key={index}
              message={message}
            />
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-green-900/60 border border-green-700/40 flex items-center justify-center text-sm shrink-0">
                🤖
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce [animation-delay:0ms]"></span>
                <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce [animation-delay:150ms]"></span>
                <span className="w-2 h-2 bg-green-400 rounded-full animate-bounce [animation-delay:300ms]"></span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input bar */}
       <ChatInput 
        question={question}
        setQuestion={setQuestion}
        loading={loading}
        selectedConversation={selectedConversation}
        sendQuestion={sendQuestion}
        handleKeyDown={handleKeyDown}
       />
      </div>
    </div>
  );
}

export default Workspace;
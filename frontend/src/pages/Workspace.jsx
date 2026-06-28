import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import ReactMarkdown from "react-markdown";
import { formatDistanceToNow } from "date-fns";

function Workspace() {
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversationSearch, setConversationSearch] = useState("");
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

  const fetchDocuments = async () => {
    try {
      const response = await api.get(`/documents/?workspace_id=${id}`);
      setDocuments(response.data);
    } catch (error) {
      console.error(error);
    }
  };

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

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", file.name);
    formData.append("file_type", "pdf");
    formData.append("workspace_id", id);
    setUploading(true);
    try {
      await api.post("/documents/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchDocuments();
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

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

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendQuestion();
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

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(conversationSearch.toLowerCase())
  );

  return (
    <div className="h-screen w-screen bg-zinc-950 text-white flex overflow-hidden fixed inset-0">
      {/* ── Sidebar ── */}
      <aside
        className={`${
          sidebarOpen ? "w-72" : "w-0"
        } transition-all duration-300 overflow-hidden shrink-0 border-r border-zinc-800 flex flex-col bg-zinc-950`}
      >
        <div className="flex flex-col h-full p-4 min-w-[18rem]">
          {/* Back + brand */}
          <div className="flex items-center gap-2 mb-5">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-zinc-400 hover:text-white transition-colors p-1 rounded hover:bg-zinc-800"
              title="Back to Dashboard"
            >
              ←
            </button>
            <span className="text-green-400">⬡</span>
            <span className="font-bold text-sm tracking-tight">ResearchAI</span>
          </div>

          {/* Documents section */}
          <div className="mb-5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
                Documents ({documents.length})
              </span>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-xs bg-zinc-800 hover:bg-zinc-700 px-2 py-1 rounded text-zinc-300 transition-colors"
                disabled={uploading}
              >
                {uploading ? "Uploading…" : "+ Upload"}
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleUpload}
              className="hidden"
              accept=".pdf"
            />
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {documents.length === 0 ? (
                <p className="text-zinc-600 text-xs py-2">No documents yet.</p>
              ) : (
                documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-2 rounded-lg text-xs text-zinc-300"
                  >
                    <span className="text-base shrink-0">📄</span>
                    <span className="truncate">{doc.title}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="border-t border-zinc-800 mb-4" />

          {/* Conversations section */}
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
              Chats ({conversations.length})
            </span>
            <button
              onClick={createConversation}
              className="text-xs bg-green-700 hover:bg-green-600 px-2 py-1 rounded text-white transition-colors"
            >
              + New
            </button>
          </div>

          <input
            type="text"
            placeholder="Search chats…"
            value={conversationSearch}
            onChange={(e) => setConversationSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-600 focus:outline-none rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 mb-3 transition-colors"
          />

          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {filteredConversations.length === 0 && (
              <p className="text-zinc-600 text-xs py-2">No chats found.</p>
            )}
            {filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedConversation(conv.id)}
                className={`group flex items-start gap-1 p-2.5 rounded-xl cursor-pointer transition-colors ${
                  selectedConversation === conv.id
                    ? "bg-green-700/30 border border-green-700/50"
                    : "bg-zinc-900 border border-transparent hover:border-zinc-700"
                }`}
              >
                <span className="text-base shrink-0">💬</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{conv.title}</p>
                  <p className="text-zinc-500 text-xs truncate mt-0.5">
                    {conv.last_message || "No messages yet"}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-1">
                    {formatDistanceToNow(new Date(conv.created_at), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                
                <div className="flex gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      renameConversation(conv.id);
                    }}
                    className="p-1 rounded hover:bg-zinc-700 text-xs"
                    title="Rename"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(conv.id);
                    }}
                    className="p-1 rounded hover:bg-red-900/40 text-xs"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

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
            <div
              key={index}
              className={`flex gap-3 ${
                message.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 ${
                  message.role === "user"
                    ? "bg-blue-700"
                    : "bg-green-900/60 border border-green-700/40"
                }`}
              >
                {message.role === "user" ? "👤" : "🤖"}
              </div>

              {/* Bubble */}
              <div
                className={`max-w-2xl rounded-2xl px-4 py-3 text-sm ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-100"
                }`}
              >
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>

                {message.sources && message.sources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-zinc-700">
                    <p className="text-xs font-semibold text-zinc-400 mb-1.5">Sources</p>
                    {message.sources.map((source, i) => (
                      <div
                        key={i}
                        className="bg-zinc-950 border border-zinc-800 px-2.5 py-1.5 rounded-lg text-xs text-zinc-400 mb-1"
                      >
                        📄 {source.document}
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-xs text-zinc-500 mt-2">
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
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
        <div className="border-t border-zinc-800 px-4 sm:px-8 py-4 shrink-0">
          {!selectedConversation && (
            <p className="text-xs text-yellow-500/80 mb-2 text-center">
              ⚠ Select or create a chat to start asking questions.
            </p>
          )}
          <div className="flex gap-3 items-end">
            <textarea
              rows={1}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                selectedConversation
                  ? "Ask a question… (Enter to send)"
                  : "Create a chat first…"
              }
              disabled={!selectedConversation}
              className="flex-1 resize-none bg-zinc-900 border border-zinc-700 focus:border-green-600 focus:outline-none rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ maxHeight: "140px", overflowY: "auto" }}
            />
            <button
              onClick={sendQuestion}
              disabled={loading || !selectedConversation || !question.trim()}
              className="bg-green-600 hover:bg-green-500 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-white font-semibold px-5 py-3 rounded-xl transition-colors shrink-0"
            >
              {loading ? "…" : "Send →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Workspace;
import React from 'react'
import DocumentItem from '../document/DocumentItem'
import ConversationItem from '../conversation/ConversationItem'

export default function Sidebar({
    documents, uploading, handleUpload, fileInputRef, conversations, filteredConversations, conversationSearch,
    setConversationSearch, selectedConversation, setSelectedConversation, createConversation, renameConversation,
    deleteConversation, Sidebar, sidebarOpen
}) {
  return (
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
                    <DocumentItem 
                    key={doc.id}
                    doc={doc}
                    />
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
                <ConversationItem 
                    key={conv.id}
                    conv={conv}
                    selectedConversation={selectedConversation}
                    setSelectedConversation={setSelectedConversation}
                    renameConversation={renameConversation}
                    deleteConversation={deleteConversation}
                />
            ))}
            </div>
        </div>
    </aside>
  )
}

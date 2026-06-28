import React from 'react'
import { formatDistanceToNow } from "date-fns";

export default function ConversationItem({
    conv,
    selectedConversation,
    setSelectedConversation,
    renameConversation,
    deleteConversation,
}) {

  return (
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
  )
}

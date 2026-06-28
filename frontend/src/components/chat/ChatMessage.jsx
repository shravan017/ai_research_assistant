import React from 'react'
import ReactMarkdown from "react-markdown";


export default function ChatMessage({index, message}) {
  return (
    
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
    
  )
}

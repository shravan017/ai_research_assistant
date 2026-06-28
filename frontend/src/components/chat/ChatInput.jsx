import React from 'react'

export default function ChatInput({
    question,
    setQuestion,
    loading,
    selectedConversation,
    sendQuestion,
    handleKeyDown
}) {
  return (
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
  )
}

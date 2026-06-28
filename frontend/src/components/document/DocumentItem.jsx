import React from 'react'

export default function DocumentItem({doc}) {
  return (
    <div
      key={doc.id}
      className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 p-2 rounded-lg text-xs text-zinc-300"
    >
      <span className="text-base shrink-0">📄</span>
      <span className="truncate">{doc.title}</span>
    </div>
  )
}

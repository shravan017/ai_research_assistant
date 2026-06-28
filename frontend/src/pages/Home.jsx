import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 left-0 z-50 flex justify-between items-center px-8 py-5 border-b border-zinc-800 ">
        <div className="flex items-center gap-2">
          <span className="text-green-400 text-2xl">⬡</span>
          <span className="font-bold text-lg tracking-tight">ResearchAI</span>
        </div>
        <div className="flex gap-3">
          <Link
            to="/login"
            className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 rounded-lg text-sm font-medium bg-green-600 hover:bg-green-500 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-zinc-800 border border-zinc-700 text-green-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-8 uppercase tracking-widest">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
          AI-Powered Research
        </div>

        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight mb-6 max-w-4xl">
          Your Research{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
            Assistant
          </span>
        </h1>

        <p className="text-zinc-400 text-lg sm:text-xl max-w-xl mb-12 leading-relaxed">
          Upload research papers, chat directly with documents, generate summaries,
          and uncover insights — all in one workspace.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <Link
            to="/register"
            className="px-8 py-3.5 rounded-xl bg-green-600 hover:bg-green-500 font-semibold text-base transition-colors shadow-lg shadow-green-900/30"
          >
            Start for free →
          </Link>
          <Link
            to="/login"
            className="px-8 py-3.5 rounded-xl border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800 font-semibold text-base transition-colors text-zinc-300"
          >
            Sign in
          </Link>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3 text-sm text-zinc-400">
          {[
            "📄 PDF Upload",
            "🤖 AI Chat",
            "🔍 Smart Search",
            "📝 Summaries",
            "📂 Workspaces",
          ].map((feat) => (
            <span
              key={feat}
              className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-full"
            >
              {feat}
            </span>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-zinc-600 text-xs py-6 border-t border-zinc-800">
        © {new Date().getFullYear()} ResearchAI. All rights reserved.
      </footer>
    </div>
  );
}
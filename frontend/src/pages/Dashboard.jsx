import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [workspaces, setWorkspaces] = useState([]);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const fetchWorkspaces = async () => {
    try {
      const response = await api.get("/workspaces/");
      setWorkspaces(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const createWorkspace = async () => {
    if (!name.trim()) return;
    setCreating(true);
    try {
      await api.post("/workspaces/", { name });
      setName("");
      fetchWorkspaces();
    } catch (error) {
      console.error(error);
    } finally {
      setCreating(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") createWorkspace();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur border-b border-zinc-800 px-6 sm:px-10 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-green-400 text-xl">⬡</span>
          <span className="font-bold text-base tracking-tight">ResearchAI</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-red-400 hover:bg-zinc-800 px-3 py-2 rounded-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
          </svg>
          Log out
        </button>
      </header>

      <main className="flex-1 px-6 sm:px-10 py-10 max-w-4xl mx-auto w-full">
        {/* Page heading */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight mb-1">Workspaces</h1>
          <p className="text-zinc-400 text-sm">Organize your research into separate workspaces.</p>
        </div>

        {/* Create workspace */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-10">
          <p className="text-sm font-semibold text-zinc-300 mb-3">New Workspace</p>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="e.g. Climate Research 2025"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-zinc-800 border border-zinc-700 focus:border-green-500 focus:outline-none rounded-lg px-4 py-2.5 text-sm text-white placeholder-zinc-500 transition-colors"
            />
            <button
              onClick={createWorkspace}
              disabled={creating || !name.trim()}
              className="bg-green-600 hover:bg-green-500 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
            >
              {creating ? "Creating…" : "+ Create"}
            </button>
          </div>
        </div>

        {/* Workspaces grid */}
        {workspaces.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-24 text-zinc-500">
            <div className="text-5xl mb-4">📂</div>
            <p className="text-lg font-semibold text-zinc-300 mb-1">No workspaces yet</p>
            <p className="text-sm">Create your first workspace to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {workspaces.map((workspace, i) => (
              <div
                key={workspace.id}
                className="group bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-2xl p-5 flex justify-between items-start transition-colors"
              >
                <div className="flex gap-3 items-start">
                  <div className="w-10 h-10 rounded-xl bg-green-900/40 text-green-400 flex items-center justify-center text-lg shrink-0">
                    📁
                  </div>
                  <div>
                    <h2 className="font-semibold text-base">{workspace.name}</h2>
                    <p className="text-zinc-500 text-xs mt-0.5">Workspace #{i + 1}</p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/workspace/${workspace.id}`)}
                  className="text-sm bg-zinc-800 group-hover:bg-green-600 text-zinc-300 group-hover:text-white px-3 py-1.5 rounded-lg font-medium transition-colors shrink-0"
                >
                  Open →
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
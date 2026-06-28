import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const Login = () => {

  const navigate = useNavigate()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setError("")
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const response = await api.post("/token/", formData);
      login(response.data.access, response.data.refresh);
      navigate("/dashboard")
    } catch (err) {
      console.log(err.response?.data);
      setError("Invalid email or password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-sm relative">
        {/* Brand */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="text-green-400 text-2xl">⬡</span>
          <span className="text-white font-bold text-lg tracking-tight">ResearchAI</span>
        </div>

        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          <div className="mb-7 text-center">
            <h1 className="text-2xl font-extrabold text-white mb-1">Welcome back</h1>
            <p className="text-sm text-zinc-500">Sign in to your account to continue</p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="flex items-center gap-2 bg-red-900/30 border border-red-700/40 text-red-400 text-sm px-4 py-3 rounded-xl mb-5">
              <span>⚠</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-green-500 focus:outline-none rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-500 transition-colors"
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  className="w-full bg-zinc-800 border border-zinc-700 focus:border-green-500 focus:outline-none rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-zinc-500 transition-colors"
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors text-sm"
                  tabIndex={-1}
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-500 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors text-sm mt-2"
            >
              {loading ? "Signing in…" : "Sign in →"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            Don't have an account?{" "}
            <Link to="/register" className="text-green-400 hover:text-green-300 font-medium transition-colors">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const DASHBOARD_PASSWORD = import.meta.env.VITE_DASHBOARD_PASSWORD || 'admin1234'

export default function LoginPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (password === DASHBOARD_PASSWORD) {
      sessionStorage.setItem('dashboard_auth', 'true')
      navigate('/dashboard')
    } else {
      setError('Incorrect password.')
    }
  }

  return (
    <div className="min-h-screen bg-sky-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            🏠 Property Maintenance
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Landlord Dashboard</h1>
          <p className="text-gray-500 mt-1 text-sm">Enter your password to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-lg border border-sky-100 p-8 space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-sky-200 rounded-xl px-3 py-2.5 text-sm bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3.5 rounded-xl text-sm transition-colors"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  )
}

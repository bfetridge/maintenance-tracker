import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const STEPS = [
  { key: 'submitted', label: 'Submitted', icon: '📋' },
  { key: 'received', label: 'Received', icon: '👀' },
  { key: 'in_progress', label: 'Working On It', icon: '🔧' },
  { key: 'resolved', label: 'Resolved', icon: '✅' },
]

function stepIndex(status) {
  return STEPS.findIndex(s => s.key === status)
}

export default function TrackPage() {
  const { ticketId } = useParams()
  const [ticket, setTicket] = useState(null)
  const [updates, setUpdates] = useState([])
  const [unit, setUnit] = useState(null)
  const [building, setBuilding] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function load() {
      const { data: t, error: e } = await supabase
        .from('tickets')
        .select('*')
        .eq('id', ticketId)
        .single()
      if (e || !t) { setError('Ticket not found.'); setLoading(false); return }
      setTicket(t)

      const [{ data: u }, { data: upd }] = await Promise.all([
        supabase.from('units').select('*, buildings(*)').eq('id', t.unit_id).single(),
        supabase.from('ticket_updates').select('*').eq('ticket_id', ticketId).order('created_at'),
      ])
      if (u) { setUnit(u); setBuilding(u.buildings) }
      if (upd) setUpdates(upd)
      setLoading(false)
    }
    load()
  }, [ticketId])

  if (loading) return <div className="min-h-screen bg-sky-50 flex items-center justify-center text-gray-500">Loading…</div>
  if (error) return (
    <div className="min-h-screen bg-sky-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-red-600 text-lg">{error}</p>
        <Link to="/submit" className="mt-4 inline-block text-sky-600 underline">Submit a new request</Link>
      </div>
    </div>
  )

  const currentStep = stepIndex(ticket.status)

  return (
    <div className="min-h-screen bg-sky-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            🏠 Property Maintenance
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Request Status</h1>
          <p className="text-gray-400 mt-1 font-mono text-xs">#{ticket.id}</p>
        </div>

        {ticket.is_emergency && (
          <div className="mb-6 bg-red-100 border border-red-300 rounded-2xl p-4 text-center text-red-700 font-semibold">
            🚨 Emergency Request — High Priority
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-lg border border-sky-100 p-8 mb-6">
          <div className="relative flex items-start justify-between">
            <div className="absolute top-6 left-0 right-0 h-0.5 bg-sky-100 z-0">
              <div
                className="h-full bg-sky-500 transition-all duration-500"
                style={{ width: currentStep === 0 ? '0%' : `${(currentStep / (STEPS.length - 1)) * 100}%` }}
              />
            </div>
            {STEPS.map((step, i) => {
              const done = i <= currentStep
              const active = i === currentStep
              return (
                <div key={step.key} className="relative z-10 flex flex-col items-center flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl border-2 transition-all duration-300 ${
                    done ? 'bg-sky-500 border-sky-500 shadow-md' : 'bg-white border-sky-200'
                  } ${active ? 'ring-4 ring-sky-200' : ''}`}>
                    <span className={done ? 'opacity-100' : 'opacity-30'}>{step.icon}</span>
                  </div>
                  <p className={`mt-2 text-xs font-semibold text-center leading-tight ${done ? 'text-sky-600' : 'text-gray-400'}`}>
                    {step.label}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-lg border border-sky-100 p-6 mb-6">
          <h2 className="font-bold text-gray-900 mb-4">Request Details</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Tenant</dt>
              <dd className="font-medium text-gray-900">{ticket.tenant_name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Location</dt>
              <dd className="font-medium text-gray-900">{building?.name} — {unit?.unit_number}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Category</dt>
              <dd className="font-medium text-gray-900">{ticket.category}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Submitted</dt>
              <dd className="font-medium text-gray-900">{new Date(ticket.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</dd>
            </div>
            <div className="pt-3 border-t border-sky-50">
              <dt className="text-gray-500 mb-1">Description</dt>
              <dd className="text-gray-800 leading-relaxed">{ticket.description}</dd>
            </div>
          </dl>
        </div>

        {updates.filter(u => u.note).length > 0 && (
          <div className="bg-white rounded-3xl shadow-lg border border-sky-100 p-6">
            <h2 className="font-bold text-gray-900 mb-4">Messages from Your Landlord</h2>
            <div className="space-y-4">
              {updates.filter(u => u.note).map(u => (
                <div key={u.id} className="bg-sky-50 border border-sky-100 rounded-2xl p-4">
                  <p className="text-sm text-sky-900">{u.note}</p>
                  <p className="text-xs text-sky-400 mt-2">{new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center mt-6">
          <Link to="/submit" className="text-sm text-sky-600 hover:underline">Submit another request</Link>
        </div>
      </div>
    </div>
  )
}

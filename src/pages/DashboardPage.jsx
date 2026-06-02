import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const STATUS_LABELS = {
  submitted: 'Submitted',
  received: 'Received',
  in_progress: 'In Progress',
  resolved: 'Resolved',
}

const STATUS_COLORS = {
  submitted: 'bg-yellow-100 text-yellow-800',
  received: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-purple-100 text-purple-800',
  resolved: 'bg-green-100 text-green-800',
}

const STATUS_ORDER = ['submitted', 'received', 'in_progress', 'resolved']

export default function DashboardPage() {
  const navigate = useNavigate()
  const [tickets, setTickets] = useState([])
  const [buildings, setBuildings] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [note, setNote] = useState('')
  const [newStatus, setNewStatus] = useState('')
  const [updating, setUpdating] = useState(false)
  const [updateMsg, setUpdateMsg] = useState('')

  const [filterBuilding, setFilterBuilding] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  useEffect(() => {
    if (sessionStorage.getItem('dashboard_auth') !== 'true') {
      navigate('/login')
    }
  }, [navigate])

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)
    const [{ data: t }, { data: b }] = await Promise.all([
      supabase
        .from('tickets')
        .select('*, units(unit_number, buildings(name))')
        .order('created_at', { ascending: false }),
      supabase.from('buildings').select('*').order('name'),
    ])
    if (t) setTickets(t)
    if (b) setBuildings(b)
    setLoading(false)
  }

  async function loadTicketUpdates(ticketId) {
    const { data } = await supabase
      .from('ticket_updates')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at')
    return data || []
  }

  async function openTicket(ticket) {
    const updates = await loadTicketUpdates(ticket.id)
    setSelected({ ...ticket, updates })
    setNewStatus(ticket.status)
    setNote('')
    setUpdateMsg('')
  }

  async function handleUpdate(e) {
    e.preventDefault()
    if (!newStatus) return
    setUpdating(true)
    setUpdateMsg('')

    const { error } = await supabase
      .from('tickets')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', selected.id)

    if (!error) {
      await supabase.from('ticket_updates').insert({
        ticket_id: selected.id,
        status: newStatus,
        note: note.trim() || null,
      })

      const fnBase = import.meta.env.VITE_SUPABASE_URL?.replace('.supabase.co', '.supabase.co/functions/v1')
      await fetch(`${fnBase}/notify-tenant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ ticketId: selected.id, status: newStatus, note: note.trim() }),
      }).catch(() => {})

      setUpdateMsg('Updated successfully!')
      await loadData()
      const updates = await loadTicketUpdates(selected.id)
      setSelected(prev => ({ ...prev, status: newStatus, updates }))
      setNote('')
    } else {
      setUpdateMsg('Error saving update.')
    }
    setUpdating(false)
  }

  const filtered = tickets.filter(t => {
    if (filterBuilding && t.units?.buildings?.name !== filterBuilding) return false
    if (filterStatus && t.status !== filterStatus) return false
    return true
  })

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">Loading…</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Maintenance Dashboard</h1>
          <p className="text-sm text-gray-500">{filtered.filter(t => t.status !== 'resolved').length} open tickets</p>
        </div>
        <button
          onClick={() => { sessionStorage.removeItem('dashboard_auth'); navigate('/login') }}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Log out
        </button>
      </header>

      <div className="flex h-[calc(100vh-65px)]">
        {/* Ticket list */}
        <div className="w-full md:w-1/2 lg:w-2/5 border-r border-gray-200 bg-white flex flex-col">
          {/* Filters */}
          <div className="p-4 border-b border-gray-100 flex gap-2">
            <select
              value={filterBuilding}
              onChange={e => setFilterBuilding(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Buildings</option>
              {buildings.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
            </select>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              {STATUS_ORDER.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
            </select>
          </div>

          {/* List */}
          <div className="overflow-y-auto flex-1">
            {filtered.length === 0 && (
              <div className="text-center text-gray-400 py-12">No tickets found</div>
            )}
            {filtered.map(ticket => (
              <button
                key={ticket.id}
                onClick={() => openTicket(ticket)}
                className={`w-full text-left px-4 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${selected?.id === ticket.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      {ticket.is_emergency && <span className="text-red-600 text-xs font-bold">🚨 EMERGENCY</span>}
                      <span className="font-medium text-gray-900 text-sm truncate">{ticket.category}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {ticket.units?.buildings?.name} · {ticket.units?.unit_number}
                    </p>
                    <p className="text-xs text-gray-400 truncate mt-1">{ticket.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[ticket.status]}`}>
                      {STATUS_LABELS[ticket.status]}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        <div className="hidden md:flex flex-1 flex-col overflow-y-auto">
          {!selected ? (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <p>Select a ticket to view details</p>
            </div>
          ) : (
            <div className="p-6 max-w-2xl">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    {selected.is_emergency && <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">🚨 EMERGENCY</span>}
                    <h2 className="text-xl font-bold text-gray-900">{selected.category}</h2>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {selected.units?.buildings?.name} · {selected.units?.unit_number} · {selected.tenant_name} ({selected.tenant_email})
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 font-mono">#{selected.id}</p>
                </div>
                <Link
                  to={`/track/${selected.id}`}
                  target="_blank"
                  className="text-xs text-blue-600 hover:underline"
                >
                  Tenant view ↗
                </Link>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-800 leading-relaxed">{selected.description}</p>
              </div>

              {/* Update history */}
              {selected.updates?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Update History</h3>
                  <div className="space-y-2">
                    {selected.updates.map(u => (
                      <div key={u.id} className="flex items-start gap-3 text-sm">
                        <span className={`mt-0.5 px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[u.status]}`}>
                          {STATUS_LABELS[u.status]}
                        </span>
                        <div className="flex-1">
                          {u.note && <p className="text-gray-700">{u.note}</p>}
                          <p className="text-xs text-gray-400">{new Date(u.created_at).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Update form */}
              <form onSubmit={handleUpdate} className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-gray-700">Update This Ticket</h3>
                {updateMsg && (
                  <div className={`text-sm px-3 py-2 rounded-lg ${updateMsg.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                    {updateMsg}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={newStatus}
                    onChange={e => setNewStatus(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {STATUS_ORDER.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message to Tenant <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    placeholder="e.g. A plumber will be there Thursday between 9am–noon."
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={updating}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
                >
                  {updating ? 'Saving…' : 'Save Update & Notify Tenant'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const CATEGORIES = ['Plumbing', 'HVAC', 'Electrical', 'Windows', 'Doors/Locks', 'Pest Control', 'Other']

export default function SubmitPage() {
  const navigate = useNavigate()
  const [buildings, setBuildings] = useState([])
  const [units, setUnits] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    building_id: '',
    unit_id: '',
    tenant_name: '',
    tenant_email: '',
    category: '',
    description: '',
    is_emergency: false,
  })

  useEffect(() => {
    supabase.from('buildings').select('*').order('name').then(({ data }) => {
      if (data) setBuildings(data)
    })
  }, [])

  useEffect(() => {
    if (!form.building_id) { setUnits([]); return }
    supabase
      .from('units')
      .select('*')
      .eq('building_id', form.building_id)
      .order('unit_number')
      .then(({ data }) => { if (data) setUnits(data) })
  }, [form.building_id])

  function set(field, value) {
    if (field === 'building_id') {
      setForm(prev => ({ ...prev, building_id: value, unit_id: '' }))
    } else {
      setForm(prev => ({ ...prev, [field]: value }))
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.building_id) { setError('Please select a building.'); return }
    if (!form.unit_id) { setError('Please select a unit.'); return }
    if (!form.tenant_name) { setError('Please enter your name.'); return }
    if (!form.tenant_email) { setError('Please enter your email.'); return }
    if (!form.category) { setError('Please select a category.'); return }
    if (!form.description) { setError('Please describe the issue.'); return }

    setLoading(true)
    try {
      const { data: ticket, error: ticketError } = await supabase
        .from('tickets')
        .insert({
          unit_id: form.unit_id,
          category: form.category,
          description: form.description,
          is_emergency: form.is_emergency,
          status: 'submitted',
          tenant_email: form.tenant_email,
          tenant_name: form.tenant_name,
        })
        .select()
        .single()

      if (ticketError) throw ticketError

      await supabase.from('ticket_updates').insert({
        ticket_id: ticket.id,
        status: 'submitted',
        note: null,
      })

      const fnBase = import.meta.env.VITE_SUPABASE_URL?.replace('.supabase.co', '.supabase.co/functions/v1')
      await fetch(`${fnBase}/notify-landlord`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ ticketId: ticket.id }),
      }).catch(() => {})

      navigate(`/track/${ticket.id}`)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-sky-50 flex items-start justify-center py-10 px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            🏠 Property Maintenance
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Submit a Request</h1>
          <p className="text-gray-500 mt-2 text-sm">We'll get back to you as soon as possible.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-lg p-8 space-y-5 border border-sky-100">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm">{error}</div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Building</label>
              <select
                value={form.building_id}
                onChange={e => set('building_id', e.target.value)}
                className="w-full border border-sky-200 rounded-xl px-3 py-2.5 text-sm bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-400"
              >
                <option value="">Select building…</option>
                {buildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Unit</label>
              <select
                value={form.unit_id}
                onChange={e => set('unit_id', e.target.value)}
                disabled={!form.building_id}
                className="w-full border border-sky-200 rounded-xl px-3 py-2.5 text-sm bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-400 disabled:opacity-50"
              >
                <option value="">Select unit…</option>
                {units.map(u => <option key={u.id} value={u.id}>{u.unit_number}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Name</label>
              <input
                type="text"
                value={form.tenant_name}
                onChange={e => set('tenant_name', e.target.value)}
                placeholder="Jane Smith"
                className="w-full border border-sky-200 rounded-xl px-3 py-2.5 text-sm bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Email</label>
              <input
                type="email"
                value={form.tenant_email}
                onChange={e => set('tenant_email', e.target.value)}
                placeholder="jane@email.com"
                className="w-full border border-sky-200 rounded-xl px-3 py-2.5 text-sm bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
            <select
              value={form.category}
              onChange={e => set('category', e.target.value)}
              className="w-full border border-sky-200 rounded-xl px-3 py-2.5 text-sm bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              <option value="">Select category…</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Describe the issue in as much detail as possible…"
              rows={4}
              className="w-full border border-sky-200 rounded-xl px-3 py-2.5 text-sm bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none"
            />
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-3 space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="emergency"
                checked={form.is_emergency}
                onChange={e => set('is_emergency', e.target.checked)}
                className="w-4 h-4 accent-red-500"
              />
              <label htmlFor="emergency" className="text-sm text-red-600 font-semibold">
                This is an emergency (no heat, gas leak, flooding, major electrical issue)
              </label>
            </div>
            {form.is_emergency && (
              <div className="bg-red-100 border border-red-300 rounded-lg px-4 py-3 text-center">
                <p className="text-red-700 font-bold text-sm">⚠️ For emergencies, call or text your landlord immediately:</p>
                <a href="tel:7736208639" className="text-red-700 font-bold text-xl mt-1 block hover:underline">
                  (773) 620-8639
                </a>
                <p className="text-red-500 text-xs mt-1">Don't wait for an email — call now.</p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white font-bold py-3.5 rounded-xl text-sm transition-colors"
          >
            {loading ? 'Submitting…' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  )
}

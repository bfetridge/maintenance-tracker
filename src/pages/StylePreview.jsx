import { Link } from 'react-router-dom'

function OptionA() {
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
        <div className="bg-white rounded-3xl shadow-lg p-8 space-y-5 border border-sky-100">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Building</label>
              <select className="w-full border border-sky-200 rounded-xl px-3 py-2.5 text-sm bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-400">
                <option>1717 N. Orleans</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Unit</label>
              <select className="w-full border border-sky-200 rounded-xl px-3 py-2.5 text-sm bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-400">
                <option>Floor 1</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Name</label>
              <input placeholder="Jane Smith" className="w-full border border-sky-200 rounded-xl px-3 py-2.5 text-sm bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-400" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Email</label>
              <input placeholder="jane@email.com" className="w-full border border-sky-200 rounded-xl px-3 py-2.5 text-sm bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
            <select className="w-full border border-sky-200 rounded-xl px-3 py-2.5 text-sm bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-400">
              <option>Plumbing</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
            <textarea rows={3} placeholder="Describe the issue…" className="w-full border border-sky-200 rounded-xl px-3 py-2.5 text-sm bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none" />
          </div>
          <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-xl">
            <input type="checkbox" className="w-4 h-4 accent-red-500" />
            <label className="text-sm text-red-600 font-semibold">This is an emergency</label>
          </div>
          <button className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3.5 rounded-xl text-sm transition-colors">
            Submit Request
          </button>
        </div>
      </div>
    </div>
  )
}

function OptionB() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-start justify-center py-10 px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-slate-200 text-slate-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            🏠 Property Maintenance
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Submit a Request</h1>
          <p className="text-gray-500 mt-2 text-sm">We'll get back to you as soon as possible.</p>
        </div>
        <div className="bg-white rounded-3xl shadow-lg p-8 space-y-5 border border-slate-200">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Building</label>
              <select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400">
                <option>1717 N. Orleans</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Unit</label>
              <select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400">
                <option>Floor 1</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Name</label>
              <input placeholder="Jane Smith" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Email</label>
              <input placeholder="jane@email.com" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
            <select className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400">
              <option>Plumbing</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
            <textarea rows={3} placeholder="Describe the issue…" className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 resize-none" />
          </div>
          <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-xl">
            <input type="checkbox" className="w-4 h-4 accent-red-500" />
            <label className="text-sm text-red-600 font-semibold">This is an emergency</label>
          </div>
          <button className="w-full bg-slate-700 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl text-sm transition-colors">
            Submit Request
          </button>
        </div>
      </div>
    </div>
  )
}

function OptionC() {
  return (
    <div className="min-h-screen bg-indigo-50 flex items-start justify-center py-10 px-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            🏠 Property Maintenance
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Submit a Request</h1>
          <p className="text-gray-500 mt-2 text-sm">We'll get back to you as soon as possible.</p>
        </div>
        <div className="bg-white rounded-3xl shadow-lg p-8 space-y-5 border border-indigo-100">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Building</label>
              <select className="w-full border border-indigo-200 rounded-xl px-3 py-2.5 text-sm bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-400">
                <option>1717 N. Orleans</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Unit</label>
              <select className="w-full border border-indigo-200 rounded-xl px-3 py-2.5 text-sm bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-400">
                <option>Floor 1</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Name</label>
              <input placeholder="Jane Smith" className="w-full border border-indigo-200 rounded-xl px-3 py-2.5 text-sm bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Email</label>
              <input placeholder="jane@email.com" className="w-full border border-indigo-200 rounded-xl px-3 py-2.5 text-sm bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
            <select className="w-full border border-indigo-200 rounded-xl px-3 py-2.5 text-sm bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-400">
              <option>Plumbing</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
            <textarea rows={3} placeholder="Describe the issue…" className="w-full border border-indigo-200 rounded-xl px-3 py-2.5 text-sm bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none" />
          </div>
          <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-xl">
            <input type="checkbox" className="w-4 h-4 accent-red-500" />
            <label className="text-sm text-red-600 font-semibold">This is an emergency</label>
          </div>
          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl text-sm transition-colors">
            Submit Request
          </button>
        </div>
      </div>
    </div>
  )
}

export default function StylePreview() {
  return (
    <div>
      <div className="bg-gray-800 text-white text-center py-3 text-sm font-semibold sticky top-0 z-50">
        Style Preview — <Link to="/submit" className="underline text-blue-300">Back to real app</Link>
      </div>
      <div className="text-center bg-sky-500 text-white py-4 text-lg font-bold">Option A — Sky Blue (light & airy)</div>
      <OptionA />
      <div className="text-center bg-slate-700 text-white py-4 text-lg font-bold">Option B — Warm Gray (neutral & calm)</div>
      <OptionB />
      <div className="text-center bg-indigo-600 text-white py-4 text-lg font-bold">Option C — Indigo (trustworthy & serious)</div>
      <OptionC />
    </div>
  )
}

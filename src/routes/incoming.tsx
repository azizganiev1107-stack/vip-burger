import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { 
  ArrowDownLeft, 
  Plus, 
  Trash2, 
  Save,
  Package,
  Calendar
} from 'lucide-react'
import { INITIAL_ITEMS } from '../types'

export const Route = createFileRoute('/incoming')({
  component: Incoming,
})

interface IncomingItem {
  id: string;
  quantity: number;
  date: string;
}

function Incoming() {
  const [items, setItems] = useState<IncomingItem[]>([
    { id: INITIAL_ITEMS[0].id, quantity: 0, date: new Date().toISOString().split('T')[0] }
  ])

  const addItem = () => {
    setItems([...items, { id: INITIAL_ITEMS[0].id, quantity: 0, date: new Date().toISOString().split('T')[0] }])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: keyof IncomingItem, value: any) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-display font-extrabold text-slate-800">Jańa kiris</h1>
        <p className="text-slate-500 mt-1">Skladqa kelgen zatlardı dizimge alıu</p>
      </div>

      <div className="glass-card rounded-3xl p-8 space-y-6">
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
              <div className="md:col-span-5 space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Zat atı</label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select 
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 appearance-none transition-all cursor-pointer"
                    value={item.id}
                    onChange={(e) => updateItem(index, 'id', e.target.value)}
                  >
                    {INITIAL_ITEMS.map(it => (
                      <option key={it.id} value={it.id}>{it.name} ({it.unit})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="md:col-span-3 space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Muǵdarı</label>
                <input 
                  type="number" 
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  placeholder="0"
                  value={item.quantity || ''}
                  onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value))}
                />
              </div>

              <div className="md:col-span-3 space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Sáne</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="date" 
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all cursor-pointer"
                    value={item.date}
                    onChange={(e) => updateItem(index, 'date', e.target.value)}
                  />
                </div>
              </div>

              <div className="md:col-span-1 flex justify-center">
                <button 
                  onClick={() => removeItem(index)}
                  className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-4 pt-4 border-t border-slate-100">
          <button 
            onClick={addItem}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all"
          >
            <Plus className="w-5 h-5" /> Basqa zat qosıu
          </button>
          <button className="btn-primary flex-[2] flex items-center justify-center gap-2">
            <Save className="w-5 h-5" /> Kiristi saqlau
          </button>
        </div>
      </div>

      {/* Summary Section */}
      <div className="bg-primary-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-primary-500/40">
        <div className="relative z-10">
          <h3 className="text-xl font-display font-bold mb-4">Jámi muǵdarı</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <p className="text-primary-200 text-sm font-medium">Zatlar sanı</p>
              <p className="text-3xl font-display font-bold">{items.length}</p>
            </div>
            <div>
              <p className="text-primary-200 text-sm font-medium">Dizimge alınǵan sáne</p>
              <p className="text-3xl font-display font-bold">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <ArrowDownLeft className="w-32 h-32" />
        </div>
      </div>
    </div>
  )
}
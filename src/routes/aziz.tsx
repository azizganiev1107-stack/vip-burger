import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { 
  Send, 
  Plus, 
  Trash2, 
  Package,
  User,
  Calculator
} from 'lucide-react'
import { INITIAL_ITEMS } from '../types'

export const Route = createFileRoute('/aziz')({
  component: AzizTransfer,
})

interface TransferItem {
  id: string;
  quantity: number;
}

function AzizTransfer() {
  // Items typically sent to Aziz based on user request
  const azizItemIds = [
    'cola-1.5', 'cola-2.0', 'cola-1.0', 'cola-0.5', 'max-tea', 'ice-tea', 
    'cola-bottle', 'dinay', 'energy', 'water-1.5', 'water-0.5',
    'patir-lavash', 'buns', 'lavash-std', 'lavash-big', 'tomat', 'coffee',
    'napkins', 'potatoes', 'carrots', 'chili', 'meat', 'fillet-meat', 'fillet-lavash',
    'white-sauce'
  ]

  const azizItems = INITIAL_ITEMS.filter(it => azizItemIds.includes(it.id))

  const [items, setItems] = useState<TransferItem[]>([
    { id: azizItems[0]?.id || INITIAL_ITEMS[0].id, quantity: 0 }
  ])

  const addItem = () => {
    setItems([...items, { id: azizItems[0]?.id || INITIAL_ITEMS[0].id, quantity: 0 }])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: keyof TransferItem, value: any) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-extrabold text-slate-800">3 filial</h1>
          <p className="text-slate-500 mt-1">3 filialına jiberilgen zatlardı basqarıu</p>
        </div>
        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 shadow-lg shadow-blue-500/20">
          <User className="w-8 h-8" />
        </div>
      </div>

      <div className="glass-card rounded-3xl p-8 space-y-6">
        <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100 mb-6">
          <div className="p-3 bg-blue-500 text-white rounded-xl">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <p className="font-bold text-blue-900">Esap-kitap ushın eskertpe</p>
            <p className="text-sm text-blue-700">"Ak saуыs" bul jerde tek esap-kitap ushın qosılǵan hám skladtaǵı qaldıqqa tásir etpeydi.</p>
          </div>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="md:col-span-7 space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Zat atı</label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select 
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 appearance-none transition-all cursor-pointer"
                    value={item.id}
                    onChange={(e) => updateItem(index, 'id', e.target.value)}
                  >
                    {azizItems.map(it => (
                      <option key={it.id} value={it.id}>{it.name} ({it.unit})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="md:col-span-4 space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Muǵdarı</label>
                <input 
                  type="number" 
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  placeholder="0"
                  value={item.quantity || ''}
                  onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value))}
                />
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
          <button className="btn-primary flex-[2] flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/30">
            <Send className="w-5 h-5" /> 3 filialiga jiberiudi tastıyıqlau
          </button>
        </div>
      </div>
    </div>
  )
}

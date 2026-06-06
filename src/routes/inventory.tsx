import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Tag
} from 'lucide-react'
import { CATEGORIES, INITIAL_ITEMS } from '../types'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const Route = createFileRoute('/inventory')({
  component: Inventory,
})

function Inventory() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = Object.values(CATEGORIES)

  const filteredItems = INITIAL_ITEMS.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory ? item.category === selectedCategory : true
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-extrabold text-slate-800">Skladtaǵı zatlar</h1>
          <p className="text-slate-500 mt-1">Skladtaǵı barlıq zatlardı qadaǵalau hám basqarıu</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
            <input 
              type="text" 
              placeholder="İzleú..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 w-64 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            <Filter className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button 
          onClick={() => setSelectedCategory(null)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all",
            !selectedCategory 
              ? "bg-primary-600 text-white shadow-lg shadow-primary-600/20" 
              : "bg-white text-slate-600 border border-slate-200 hover:border-primary-200"
          )}
        >
          Barlıq zatlar
        </button>
        {categories.map((cat) => (
          <button 
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all",
              selectedCategory === cat 
                ? "bg-primary-600 text-white shadow-lg shadow-primary-600/20" 
                : "bg-white text-slate-600 border border-slate-200 hover:border-primary-200"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Items Table */}
      <div className="glass-card rounded-3xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Zat atı</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Kategoriya</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Muǵdarı</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Birligi</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredItems.map((item) => (
              <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                      <Tag className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-slate-800">{item.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">
                    {item.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-lg font-display font-bold text-slate-800">{item.currentStock}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-slate-500 font-medium">{item.unit}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  {item.currentStock > 10 ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Barlar
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-bold">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                      Az qalǵan
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredItems.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-500 font-medium">İzleú boyınsha zat tabılmadı</p>
          </div>
        )}
      </div>
    </div>
  )
}

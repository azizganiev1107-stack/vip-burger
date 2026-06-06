import { createFileRoute } from '@tanstack/react-router'
import { 
  TrendingUp, 
  Package, 
  AlertCircle,
  ArrowUpRight,
  ArrowDownLeft,
  Truck
} from 'lucide-react'
import { INITIAL_ITEMS } from '../types'

export const Route = createFileRoute('/')({
  component: Dashboard,
})

function Dashboard() {
  const stats = [
    { label: 'Jámi zatlar', value: INITIAL_ITEMS.length, icon: Package, color: 'bg-blue-500' },
    { label: 'Az qalǵanlar', value: 3, icon: AlertCircle, color: 'bg-red-500' },
    { label: 'Kiris (Búgin)', value: 12, icon: ArrowDownLeft, color: 'bg-emerald-500' },
    { label: 'Shıǵıs (Búgin)', value: 8, icon: ArrowUpRight, color: 'bg-orange-500' },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card p-6 rounded-3xl group hover:scale-[1.02] transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                <p className="text-3xl font-display font-bold mt-1 text-slate-800">{stat.value}</p>
              </div>
              <div className={`${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-${stat.color.split('-')[1]}-500/30`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="text-emerald-500 font-bold flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" /> +12%
              </span>
              <span className="text-slate-400">ótken háptege qaraǵanda</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 glass-card rounded-3xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-display font-bold">Jańa háreketler</h3>
            <button className="text-primary-600 font-semibold text-sm hover:underline">Hámmasin kóriú</button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <div className={i % 2 === 0 ? "bg-emerald-100 text-emerald-600 p-3 rounded-xl" : "bg-orange-100 text-orange-600 p-3 rounded-xl"}>
                  {i % 2 === 0 ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">Ун казак</p>
                  <p className="text-sm text-slate-500">Sklad jańalandı</p>
                </div>
                <div className="text-right">
                  <p className={i % 2 === 0 ? "font-bold text-emerald-600" : "font-bold text-orange-600"}>
                    {i % 2 === 0 ? '+' : '-'}{i * 5} кг
                  </p>
                  <p className="text-xs text-slate-400">12:45</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-3xl p-8">
          <h3 className="text-xl font-display font-bold mb-8 text-center">Tez háreketler</h3>
          <div className="grid gap-4">
            <button className="btn-primary w-full flex items-center justify-center gap-2 py-4">
              <ArrowDownLeft className="w-5 h-5" /> Jańa kiris
            </button>
            <button className="btn-secondary w-full flex items-center justify-center gap-2 py-4">
              <ArrowUpRight className="w-5 h-5" /> Shıǵıs jazıu
            </button>
            <button className="btn-secondary w-full flex items-center justify-center gap-2 py-4 border-dashed border-2 bg-slate-50/50">
              <Truck className="w-5 h-5" /> 3 filial fiberu
            </button>
          </div>
          
          <div className="mt-12 p-6 bg-primary-50 rounded-2xl border border-primary-100">
            <p className="text-primary-800 font-bold mb-2">Sklad jaǵdayı</p>
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-primary-500 w-[75%] rounded-full"></div>
            </div>
            <p className="text-xs text-primary-600 mt-2 font-medium">Zatlardıń 75% i jeterli dárejede</p>
          </div>
        </div>
      </div>
    </div>
  )
}

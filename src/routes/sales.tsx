import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { 
  Plus, 
  Trash2, 
  ShoppingCart, 
  Coins, 
  CreditCard, 
  Search,
  CheckCircle,
  Calendar,
  AlertCircle,
  TrendingUp
} from 'lucide-react'
import { INITIAL_ITEMS } from '../types'

export const Route = createFileRoute('/sales')({
  component: Sales,
})

interface SaleItemInput {
  itemId: string;
  quantity: number;
  pricePerUnit: number;
}

interface Sale {
  id: string;
  items: {
    itemId: string;
    itemName: string;
    unit: string;
    quantity: number;
    pricePerUnit: number;
    total: number;
  }[];
  paymentMethod: 'cash' | 'card';
  totalAmount: number;
  date: string; // YYYY-MM-DD HH:mm
}

function Sales() {
  // Load initial sales from localStorage
  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('vip_burger_sales')
    return saved ? JSON.parse(saved) : []
  })

  // Form states
  const [formItems, setFormItems] = useState<SaleItemInput[]>([
    { itemId: INITIAL_ITEMS[0].id, quantity: 1, pricePerUnit: 0 }
  ])
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash')
  const [searchTerm, setSearchTerm] = useState('')
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Persist sales to localStorage
  useEffect(() => {
    localStorage.setItem('vip_burger_sales', JSON.stringify(sales))
  }, [sales])

  const addFormItem = () => {
    setFormItems([...formItems, { itemId: INITIAL_ITEMS[0].id, quantity: 1, pricePerUnit: 0 }])
  }

  const removeFormItem = (index: number) => {
    setFormItems(formItems.filter((_, i) => i !== index))
  }

  const updateFormItem = (index: number, field: keyof SaleItemInput, value: any) => {
    const updated = [...formItems]
    updated[index] = { ...updated[index], [field]: value }
    setFormItems(updated)
  }

  // Handle sales submit
  const handleConfirmSale = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate
    const validItems = formItems.filter(item => item.quantity > 0 && item.pricePerUnit >= 0)
    if (validItems.length === 0) {
      alert('Iltimas, keminde bir zattıń muǵdarı hám bahasın kiritiń!')
      return
    }

    const saleItems = validItems.map(item => {
      const dbItem = INITIAL_ITEMS.find(it => it.id === item.itemId)
      const itemName = dbItem ? dbItem.name : 'Belgisiz zat'
      const unit = dbItem ? dbItem.unit : 'шт'
      const total = item.quantity * item.pricePerUnit
      return {
        itemId: item.itemId,
        itemName,
        unit,
        quantity: item.quantity,
        pricePerUnit: item.pricePerUnit,
        total
      }
    })

    const totalAmount = saleItems.reduce((sum, item) => sum + item.total, 0)
    
    const now = new Date()
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

    const newSale: Sale = {
      id: `sale-${Date.now()}`,
      items: saleItems,
      paymentMethod,
      totalAmount,
      date: formattedDate
    }

    setSales([newSale, ...sales])
    
    // Reset form
    setFormItems([{ itemId: INITIAL_ITEMS[0].id, quantity: 1, pricePerUnit: 0 }])
    setPaymentMethod('cash')
    
    // Show success message
    setSuccessMessage('Satıw tabıslı saqlandı!')
    setTimeout(() => setSuccessMessage(null), 3000)
  }

  // Handle delete sale
  const handleDeleteSale = (id: string) => {
    if (confirm('Bul satıwdı óshiriwge isenimińiz kámilme?')) {
      setSales(sales.filter(s => s.id !== id))
    }
  }

  // Filter sales based on search term
  const filteredSales = sales.filter(sale => {
    if (!searchTerm) return true
    return sale.items.some(item => 
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  // Calculate stats for today
  const todayStr = new Date().toISOString().split('T')[0] // YYYY-MM-DD
  const todaySales = sales.filter(sale => sale.date.startsWith(todayStr))
  
  const totalTodayAmount = todaySales.reduce((sum, s) => sum + s.totalAmount, 0)
  const totalTodayItemsCount = todaySales.reduce((sum, s) => 
    sum + s.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
  )
  const cashTodayAmount = todaySales
    .filter(s => s.paymentMethod === 'cash')
    .reduce((sum, s) => sum + s.totalAmount, 0)
  const cardTodayAmount = todaySales
    .filter(s => s.paymentMethod === 'card')
    .reduce((sum, s) => sum + s.totalAmount, 0)

  // Format currency helpers
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('uz-UZ').format(value) + ' swm'
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-extrabold text-slate-800">Satıw Bólimi</h1>
          <p className="text-slate-500 mt-1">Zatlardı satıw hám kúnlik sawda esap-kitabı</p>
        </div>
        <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-600 shadow-lg shadow-primary-500/20">
          <ShoppingCart className="w-8 h-8" />
        </div>
      </div>

      {/* Success alert */}
      {successMessage && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-2xl animate-slide-up">
          <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />
          <span className="font-bold">{successMessage}</span>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-3xl group hover:scale-[1.02] transition-all duration-300 border-l-4 border-l-primary-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Búgingi jámi sawda</p>
              <p className="text-2xl font-display font-bold mt-1 text-slate-800">
                {formatCurrency(totalTodayAmount)}
              </p>
            </div>
            <div className="bg-primary-500 w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
              <Coins className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
            <span className="text-primary-500 font-bold flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" /> +100%
            </span>
            <span>búgin ámelge asqan</span>
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl group hover:scale-[1.02] transition-all duration-300 border-l-4 border-l-emerald-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Naq pul túsisi</p>
              <p className="text-2xl font-display font-bold mt-1 text-slate-800">
                {formatCurrency(cashTodayAmount)}
              </p>
            </div>
            <div className="bg-emerald-500 w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
              <Coins className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-400">
            Naq pul arqalı sawda summası
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl group hover:scale-[1.02] transition-all duration-300 border-l-4 border-l-blue-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Plastik karta túsisi</p>
              <p className="text-2xl font-display font-bold mt-1 text-slate-800">
                {formatCurrency(cardTodayAmount)}
              </p>
            </div>
            <div className="bg-blue-500 w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <CreditCard className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-400">
            Terminal / Karta arqalı sawda summası
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl group hover:scale-[1.02] transition-all duration-300 border-l-4 border-l-orange-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Satılǵan zatlar sanı</p>
              <p className="text-2xl font-display font-bold mt-1 text-slate-800">
                {totalTodayItemsCount} dana
              </p>
            </div>
            <div className="bg-orange-500 w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
              <ShoppingCart className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-400">
            Jámi satılǵan zatlar muǵdarı
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales input form */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xl font-display font-bold text-slate-800">Satıw forması</h3>
            <p className="text-sm text-slate-500">Satılǵan zatlardı hám olardıń bahaların kiritiń</p>
          </div>

          <form onSubmit={handleConfirmSale} className="space-y-6">
            <div className="space-y-4">
              {formItems.map((item, index) => {
                const dbItem = INITIAL_ITEMS.find(it => it.id === item.itemId)
                const unit = dbItem ? dbItem.unit : 'шт'
                return (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end p-4 bg-slate-50 rounded-2xl border border-slate-100 relative group">
                    {/* Item selector */}
                    <div className="md:col-span-5 space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Zat atı</label>
                      <select 
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 appearance-none transition-all cursor-pointer font-medium text-slate-700"
                        value={item.itemId}
                        onChange={(e) => updateFormItem(index, 'itemId', e.target.value)}
                      >
                        {INITIAL_ITEMS.map(it => (
                          <option key={it.id} value={it.id}>{it.name} ({it.unit})</option>
                        ))}
                      </select>
                    </div>

                    {/* Quantity */}
                    <div className="md:col-span-3 space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Muǵdarı ({unit})</label>
                      <input 
                        type="number" 
                        step="any"
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-semibold"
                        placeholder="0"
                        value={item.quantity || ''}
                        onChange={(e) => updateFormItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                      />
                    </div>

                    {/* Price Per Unit */}
                    <div className="md:col-span-3 space-y-1.5">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Birligi bahası (swm)</label>
                      <input 
                        type="number" 
                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-semibold"
                        placeholder="0"
                        value={item.pricePerUnit || ''}
                        onChange={(e) => updateFormItem(index, 'pricePerUnit', parseFloat(e.target.value) || 0)}
                      />
                    </div>

                    {/* Remove button */}
                    <div className="md:col-span-1 flex justify-center pb-1">
                      <button 
                        type="button"
                        onClick={() => removeFormItem(index)}
                        disabled={formItems.length === 1}
                        className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between pt-4 border-t border-slate-100">
              <button 
                type="button"
                onClick={addFormItem}
                className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all active:scale-95"
              >
                <Plus className="w-5 h-5" /> Basqa zat qosıu
              </button>

              {/* Payment method selector */}
              <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all text-sm ${paymentMethod === 'cash' ? 'bg-white text-emerald-600 shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  <Coins className="w-4 h-4" /> Naq pul
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all text-sm ${paymentMethod === 'card' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  <CreditCard className="w-4 h-4" /> Karta
                </button>
              </div>

              {/* Submit Button */}
              <button 
                type="submit"
                className="w-full md:w-auto btn-primary flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-500/20"
              >
                <ShoppingCart className="w-5 h-5" /> Satıwdı tastıyıqlaw
              </button>
            </div>
          </form>
        </div>

        {/* Info card / Summary */}
        <div className="glass-card rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br from-slate-900 via-secondary-900 to-slate-950 text-white shadow-2xl">
          <div className="relative z-10 space-y-6">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Házirgi tranzakciya</p>
              <h4 className="text-xl font-display font-extrabold mt-1">Ulıwma esap</h4>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-slate-300 text-sm">
                <span>Zatlar sanı:</span>
                <span className="font-bold text-white">{formItems.length} túr</span>
              </div>
              <div className="flex justify-between text-slate-300 text-sm">
                <span>Tólem túri:</span>
                <span className="font-bold text-white uppercase">{paymentMethod === 'cash' ? 'Naq pul' : 'Karta'}</span>
              </div>
              <div className="h-px bg-slate-800" />
              <div className="flex justify-between items-end">
                <span className="text-slate-400 text-sm">Jámi summa:</span>
                <span className="text-3xl font-display font-black text-primary-400">
                  {formatCurrency(
                    formItems.reduce((sum, item) => sum + (item.quantity * item.pricePerUnit), 0)
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-12 p-4 bg-white/5 border border-white/10 rounded-2xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-300 leading-relaxed">
              Satıw tastıyıqlanǵan soń, maǵlıumatlar kúnlik esabatlarǵa qosıladı hám tariyx baǵnasında kórinedi.
            </p>
          </div>

          {/* Background decoration */}
          <div className="absolute -bottom-12 -right-12 w-36 h-36 bg-primary-500/10 rounded-full blur-2xl" />
        </div>
      </div>

      {/* Sales History */}
      <div className="glass-card rounded-3xl overflow-hidden p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-display font-bold text-slate-800">Satıwlar tariyxı</h3>
            <p className="text-sm text-slate-500">Barlıq ámelge asırılǵan satıw tranzakciyaları</p>
          </div>

          {/* Search filter */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Zat boyınsha izlew..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 w-64 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* History Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Sáne / Waqıt</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Satılǵan zatlar</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Tólem túri</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Jámi summa</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Háreket</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="group hover:bg-slate-50/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-slate-600 font-medium text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {sale.date}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {sale.items.map((item, idx) => (
                        <div key={idx} className="text-slate-800 text-sm font-semibold">
                          {item.itemName} - <span className="text-primary-600 font-bold">{item.quantity} {item.unit}</span>
                          <span className="text-slate-400 text-xs font-medium ml-2">({formatCurrency(item.pricePerUnit)} / birlik)</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {sale.paymentMethod === 'cash' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold">
                        <Coins className="w-3.5 h-3.5" />
                        Naq pul
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">
                        <CreditCard className="w-3.5 h-3.5" />
                        Karta
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-md font-display font-black text-slate-800">
                      {formatCurrency(sale.totalAmount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => handleDeleteSale(sale.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                      title="Satıwdı óshiriw"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredSales.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <p className="text-slate-500 font-medium">Házirshe satıwlar dizimi bos</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

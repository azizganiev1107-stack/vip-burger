import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-hot-toast'
import { 
  useGetOrders, 
  useCreateOrder, 
  usePatchOrder, 
  useDeleteOrder,
  useGetProducts
} from '@/services/orders'
import type { IOrder, IOrderItem } from '@/services/orders'
import { useGetBranches } from '@/services/branches'
import { useGetUsers } from '@/services/users'
import { useGetShifts } from '@/services/shifts'
import { ShoppingBag, Plus, Edit2, Trash2, Loader2, X } from 'lucide-react'
import { clsx } from 'clsx'

const getProductId = (product: any): number => {
  if (!product) return 0
  if (typeof product === 'object') {
    return Number(product.id || 0)
  }
  return Number(product)
}

export const Route = createFileRoute('/orders')({
  component: OrdersPage,
})

function OrdersPage() {
  const { t } = useTranslation()

  // Filter States
  const [showFilters, setShowFilters] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const [phoneFilter, setPhoneFilter] = useState('')
  const [branchFilter, setBranchFilter] = useState<number | ''>('')
  const [userFilter, setUserFilter] = useState<number | ''>('')
  const [shiftFilter, setShiftFilter] = useState<number | ''>('')
  const [paymentTypeFilter, setPaymentTypeFilter] = useState<string | ''>('')
  const [statusFilter, setStatusFilter] = useState<string | ''>('')
  const [isPaidFilter, setIsPaidFilter] = useState<boolean | null | ''>('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  // Query Hook with filters
  const { data, isLoading } = useGetOrders({
    limit: 100,
    search: searchVal || undefined,
    phone: phoneFilter || undefined,
    branch: branchFilter || undefined,
    user: userFilter || undefined,
    shift: shiftFilter || undefined,
    payment_type: paymentTypeFilter || undefined,
    status: statusFilter || undefined,
    is_paid: isPaidFilter === true ? true : isPaidFilter === false ? false : undefined,
    min_total_price: minPrice || undefined,
    max_total_price: maxPrice || undefined,
    start_date: startDate ? `${startDate}T00:00:00` : undefined,
    end_date: endDate ? `${endDate}T23:59:59` : undefined,
  })

  const { data: productsData } = useGetProducts({ limit: 100 })
  const { data: branchesData } = useGetBranches({ limit: 100 })
  const { data: usersData } = useGetUsers({ limit: 100 })
  const { data: shiftsData } = useGetShifts({ limit: 100 })

  const createOrder = useCreateOrder()
  const patchOrder = usePatchOrder()
  const deleteOrder = useDeleteOrder()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingOrder, setEditingOrder] = useState<IOrder | null>(null)
  
  // Form state
  const [phone, setPhone] = useState('')
  const [paymentType, setPaymentType] = useState('cash')
  const [isPaid, setIsPaid] = useState(false)
  const [isFree, setIsFree] = useState(false)
  const [status, setStatus] = useState('pending')
  const [items, setItems] = useState<IOrderItem[]>([])
  
  // Temp item form
  const [tempProductId, setTempProductId] = useState('')
  const [tempQuantity, setTempQuantity] = useState('1')

  const handleResetFilters = () => {
    setSearchVal('')
    setPhoneFilter('')
    setBranchFilter('')
    setUserFilter('')
    setShiftFilter('')
    setPaymentTypeFilter('')
    setStatusFilter('')
    setIsPaidFilter('')
    setMinPrice('')
    setMaxPrice('')
    setStartDate('')
    setEndDate('')
  }

  const openCreateModal = () => {
    setEditingOrder(null)
    setPhone('')
    setPaymentType('cash')
    setIsPaid(false)
    setIsFree(false)
    setStatus('pending')
    setItems([])
    setTempProductId('')
    setTempQuantity('1')
    setIsModalOpen(true)
  }

  const openEditModal = (order: IOrder) => {
    setEditingOrder(order)
    setPhone(order.phone || '')
    setPaymentType(order.payment_type || 'cash')
    setIsPaid(order.is_paid || false)
    setIsFree(order.is_free || false)
    setStatus(order.status || 'pending')
    setItems(order.items?.map(i => ({ product: getProductId(i.product), quantity: Number(i.quantity || 0), price: i.price })) || [])
    setTempProductId('')
    setTempQuantity('1')
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingOrder(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const payload: any = {
      total_amount: calculatedTotal.toFixed(2),
      phone,
      payment_type: paymentType,
      is_paid: isPaid,
      is_free: isFree,
      status,
      items: items.map(item => ({
        product: getProductId(item.product),
        quantity: Number(item.quantity)
      }))
    }

    if (editingOrder) {
      patchOrder.mutate(
        { id: editingOrder.id, payload },
        { 
          onSuccess: () => { toast.success(t('common.updated')); closeModal(); },
          onError: () => toast.error(t('common.error'))
        }
      )
    } else {
      createOrder.mutate(
        payload,
        { 
          onSuccess: () => { toast.success(t('common.created')); closeModal(); },
          onError: () => toast.error(t('common.error'))
        }
      )
    }
  }

  const handleDelete = (id: number) => {
    if (window.confirm(t('orders.modal.delete_confirm'))) {
      deleteOrder.mutate(id, {
        onSuccess: () => toast.success(t('common.deleted')),
        onError: () => toast.error(t('common.error'))
      })
    }
  }

  const orders = data?.data || []
  const availableProducts = productsData?.data || []
  const branches = branchesData?.data || []
  const users = usersData?.data || []
  const shifts = shiftsData?.data || []

  const calculatedTotal = items.reduce((sum, item) => {
    const prod = availableProducts.find(p => p.id === getProductId(item.product))
    return sum + (prod ? parseFloat(prod.price) * item.quantity : 0)
  }, 0)

  const handleAddItem = () => {
    if (!tempProductId || !tempQuantity) return
    setItems([...items, { product: getProductId(tempProductId), quantity: parseInt(tempQuantity) }])
    setTempProductId('')
    setTempQuantity('1')
  }

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-100 p-2 rounded-xl">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{t('orders.title')}</h2>
            <p className="text-sm text-slate-500 mt-1">{t('orders.subtitle')}</p>
          </div>
        </div>
        <button onClick={openCreateModal} className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-5 rounded-xl transition-colors shadow-sm">
          <Plus className="w-5 h-5" /> {t('orders.new_order')}
        </button>
      </div>

      {/* Search and Filters panel */}
      <div className="p-6 border-b border-slate-200 bg-slate-50/20 space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 w-full">
            <div className="relative w-full">
              <input
                type="text"
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                placeholder={t('orders.filters.search') || "İzlew..."}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <span className="absolute left-3.5 top-3.5 text-slate-400 text-sm">🔍</span>
            </div>
            <div className="relative w-full">
              <input
                type="text"
                value={phoneFilter}
                onChange={e => setPhoneFilter(e.target.value)}
                placeholder={t('orders.modal.phone_label') || "Telefon nomeri"}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
              />
              <span className="absolute left-3.5 top-3.5 text-slate-400 text-sm">📞</span>
            </div>
          </div>

          <div className="flex gap-2 w-full md:w-auto justify-end">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2.5 text-sm font-medium border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <span>{showFilters ? '▲' : '▼'}</span> {t('orders.filters.more') || "Filtrler"}
            </button>
            {(searchVal || phoneFilter || branchFilter || userFilter || shiftFilter || paymentTypeFilter || statusFilter || isPaidFilter !== '' || minPrice || maxPrice || startDate || endDate) && (
              <button
                onClick={handleResetFilters}
                className="px-4 py-2.5 text-sm font-medium border border-red-200 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
              >
                {t('orders.filters.reset') || "Tazalaw"}
              </button>
            )}
          </div>
        </div>

        {/* Collapsible filters grid */}
        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-200/60 animate-in fade-in duration-200">
            {/* Branch */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">{t('sidebar.branches') || "Filial"}</label>
              <CustomSelect
                value={branchFilter}
                onChange={setBranchFilter}
                placeholder={t('orders.modal.not_selected')}
                options={branches.map((b: any) => ({ value: b.id, label: b.name }))}
              />
            </div>

            {/* User / Kassir */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">{t('orders.table.employee') || "Kassir"}</label>
              <CustomSelect
                value={userFilter}
                onChange={setUserFilter}
                placeholder={t('orders.modal.not_selected')}
                options={users.map((u: any) => ({ 
                  value: u.id, 
                  label: u.first_name ? `${u.first_name} ${u.last_name || ''}`.trim() : u.username 
                }))}
              />
            </div>

            {/* Shift */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">{t('shifts.title') || "Smena"}</label>
              <CustomSelect
                value={shiftFilter}
                onChange={setShiftFilter}
                placeholder={t('orders.modal.not_selected')}
                options={shifts.map((s: any) => ({ 
                  value: s.id, 
                  label: `Shift #${s.id} (${s.start_time ? new Date(s.start_time).toLocaleDateString() : ''})` 
                }))}
              />
            </div>

            {/* Payment Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">{t('orders.modal.payment_type') || "Tólew túri"}</label>
              <CustomSelect
                value={paymentTypeFilter}
                onChange={setPaymentTypeFilter}
                placeholder={t('orders.filters.all') || "Barlıǵı"}
                options={[
                  { value: 'cash', label: t('orders.filters.pay_cash') || "Naq pul" },
                  { value: 'card', label: t('orders.filters.pay_card') || "Karta" },
                  { value: 'online', label: t('orders.filters.pay_online') || "Online" }
                ]}
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Status</label>
              <CustomSelect
                value={statusFilter}
                onChange={setStatusFilter}
                placeholder={t('orders.filters.all') || "Barlıǵı"}
                options={[
                  { value: 'pending', label: t('orders.filters.status_pending') || "Kútpekte" },
                  { value: 'completed', label: t('orders.filters.status_completed') || "Tawsıldı" },
                  { value: 'cancelled', label: t('orders.filters.status_cancelled') || "Biykarlandı" }
                ]}
              />
            </div>

            {/* Paid status */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">{t('orders.table.payment_status') || "Tólew statusı"}</label>
              <CustomSelect
                value={isPaidFilter}
                onChange={setIsPaidFilter}
                placeholder={t('orders.filters.all') || "Barlıǵı"}
                options={[
                  { value: true, label: t('orders.filters.is_paid') || "Tólengen" },
                  { value: false, label: t('orders.filters.not_paid') || "Tólenbegen" }
                ]}
              />
            </div>

            {/* Min & Max Price */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">{t('orders.filters.min_price') || "Min. summa"}</label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={e => setMinPrice(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">{t('orders.filters.max_price') || "Maks. summa"}</label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={e => setMaxPrice(e.target.value)}
                  placeholder="999k+"
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            {/* Start & End Date */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">{t('orders.filters.start_date') || "Baslanıw sánesi"}</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">{t('orders.filters.end_date') || "Tamamlanıw sánesi"}</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 overflow-x-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">{t('orders.table.id')}</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">{t('orders.modal.phone_label')}</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">{t('orders.table.amount')}</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">{t('orders.table.is_free') || 'Biypul'}</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">{t('orders.table.payment_status')}</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">{t('orders.table.employee') || 'Kassir'}</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">{t('orders.table.date') || 'Sáne'}</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">{t('orders.table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-slate-500">
                    {t('orders.table.not_found')}
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">#{order.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-700 font-medium">{order.phone || '-'}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{order.total_amount}</td>
                    <td className="px-6 py-4">
                      {order.is_free ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border bg-purple-50 text-purple-700 border-purple-100">
                          {t('orders.table.is_free') || 'Biypul'}
                        </span>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border bg-blue-50 text-blue-700 border-blue-100`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${order.is_paid ? 'bg-green-50 text-green-700 border-green-100' : 'bg-orange-50 text-orange-700 border-orange-100'}`}>
                        {order.is_paid ? t('orders.status.paid') : t('orders.status.pending')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {order.user_details ? (
                        `${order.user_details.first_name || ''} ${order.user_details.last_name || ''}`.trim() || order.user_details.username
                      ) : (
                        order.user || '-'
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {order.created_at ? new Date(order.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEditModal(order)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(order.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={closeModal}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-lg font-semibold text-slate-800">
                {editingOrder ? t('orders.modal.edit_title') : t('orders.modal.new_title')}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('orders.modal.phone_label')}</label>
                  <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select value={status} onChange={e => setStatus(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all">
                    <option value="pending">Kútpekte (Pending)</option>
                    <option value="processing">Processte</option>
                    <option value="completed">Tawsıldı (Completed)</option>
                    <option value="cancelled">Biykarlaw (Cancelled)</option>
                  </select>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                  <label className="block text-sm font-medium text-slate-700 mb-2">{t('orders.modal.items_label') || 'Ónimler'}</label>
                  
                  {items.length > 0 && (
                    <div className="mb-3 space-y-2">
                      {items.map((item, idx) => {
                        const prod = availableProducts.find(p => p.id === getProductId(item.product))
                        return (
                          <div key={idx} className="flex items-center justify-between bg-white p-2 border border-slate-200 rounded-lg text-sm">
                            <span>{prod ? prod.name : `ID: ${getProductId(item.product)}`} x {item.quantity}</span>
                            <button type="button" onClick={() => handleRemoveItem(idx)} className="text-red-500 hover:text-red-700">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <select 
                      value={tempProductId} 
                      onChange={e => setTempProductId(e.target.value)} 
                      className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    >
                      <option value="">{t('orders.modal.select_product') || 'Ónimdi tańlań...'}</option>
                      {availableProducts.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.price})</option>
                      ))}
                    </select>
                    <input 
                      type="number" 
                      min="1" 
                      value={tempQuantity} 
                      onChange={e => setTempQuantity(e.target.value)} 
                      className="w-20 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    />
                    <button 
                      type="button" 
                      onClick={handleAddItem}
                      disabled={!tempProductId}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
                    >
                      {t('orders.modal.add_btn') || 'Qosıw'}
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-4 pt-2">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="isPaid" checked={isPaid} onChange={e => setIsPaid(e.target.checked)} className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" />
                    <label htmlFor="isPaid" className="text-sm font-medium text-slate-700 cursor-pointer">
                      {t('orders.modal.is_paid_label')}
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="isFree" checked={isFree} onChange={e => setIsFree(e.target.checked)} className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" />
                    <label htmlFor="isFree" className="text-sm font-medium text-slate-700 cursor-pointer">
                      {t('orders.modal.is_free_label') || 'Biypul'}
                    </label>
                  </div>
                </div>

                <div className="bg-emerald-50 rounded-xl p-4 mt-4 flex items-center justify-between border border-emerald-100">
                  <span className="text-emerald-800 font-medium">Ulıwma summa:</span>
                  <span className="text-emerald-900 font-bold text-lg">{calculatedTotal.toLocaleString('ru-RU')} UZS</span>
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={closeModal} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors">{t('orders.modal.cancel')}</button>
                  <button type="submit" disabled={createOrder.isPending || patchOrder.isPending} className="flex-1 px-4 py-2.5 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70">
                    {(createOrder.isPending || patchOrder.isPending) && <Loader2 className="w-4 h-4 animate-spin" />} {t('orders.modal.save')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function CustomSelect({
  value,
  onChange,
  options,
  placeholder,
  disabled
}: {
  value: any,
  onChange: (val: any) => void,
  options: { value: any, label: string }[],
  placeholder: string,
  disabled?: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const selectedOption = options.find(o => o.value === value)

  useEffect(() => {
    if (!isOpen) return
    const handleOutsideClick = () => setIsOpen(false)
    window.addEventListener('click', handleOutsideClick)
    return () => window.removeEventListener('click', handleOutsideClick)
  }, [isOpen])

  return (
    <div className="relative" onClick={e => e.stopPropagation()}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 text-sm text-left bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none flex justify-between items-center disabled:opacity-50"
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <span className="text-slate-400 text-xs ml-2">▼</span>
      </button>
      {isOpen && (
        <div className="absolute z-[110] w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {placeholder && (
            <div 
              onClick={() => { onChange(''); setIsOpen(false); }}
              className="px-3 py-2 text-sm text-slate-400 hover:bg-slate-50 cursor-pointer truncate"
            >
              {placeholder}
            </div>
          )}
          {options.map(o => (
            <div
              key={String(o.value)}
              onClick={() => { onChange(o.value); setIsOpen(false); }}
              className={clsx(
                "px-3 py-2 text-sm hover:bg-indigo-50 hover:text-indigo-600 cursor-pointer truncate",
                value === o.value && "bg-indigo-50 text-indigo-600 font-semibold"
              )}
            >
              {o.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
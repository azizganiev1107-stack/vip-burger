import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-hot-toast'
import { 
  useGetOrders, 
  useCreateOrder, 
  usePatchOrder, 
  useDeleteOrder 
} from '@/services/orders'
import type { IOrder } from '@/services/orders'
import { ShoppingBag, Plus, Edit2, Trash2, Loader2, X } from 'lucide-react'

export const Route = createFileRoute('/orders')({
  component: OrdersPage,
})

function OrdersPage() {
  const { t } = useTranslation()
  const { data, isLoading } = useGetOrders({ limit: 100 })
  const createOrder = useCreateOrder()
  const patchOrder = usePatchOrder()
  const deleteOrder = useDeleteOrder()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingOrder, setEditingOrder] = useState<IOrder | null>(null)
  
  // Form state
  const [totalAmount, setTotalAmount] = useState('')
  const [phone, setPhone] = useState('')
  const [paymentType, setPaymentType] = useState('cash')
  const [isPaid, setIsPaid] = useState(false)
  const [status, setStatus] = useState('pending')

  const openCreateModal = () => {
    setEditingOrder(null)
    setTotalAmount('')
    setPhone('')
    setPaymentType('cash')
    setIsPaid(false)
    setStatus('pending')
    setIsModalOpen(true)
  }

  const openEditModal = (order: IOrder) => {
    setEditingOrder(order)
    setTotalAmount(order.total_amount || '')
    setPhone(order.phone || '')
    setPaymentType(order.payment_type || 'cash')
    setIsPaid(order.is_paid || false)
    setStatus(order.status || 'pending')
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingOrder(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const payload: any = {
      total_amount: totalAmount,
      phone,
      payment_type: paymentType,
      is_paid: isPaid,
      status
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
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">{t('orders.table.payment_status')}</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">{t('orders.table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
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
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border bg-blue-50 text-blue-700 border-blue-100`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${order.is_paid ? 'bg-green-50 text-green-700 border-green-100' : 'bg-orange-50 text-orange-700 border-orange-100'}`}>
                        {order.is_paid ? t('orders.status.paid') : t('orders.status.pending')}
                      </span>
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
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('orders.table.amount')} *</label>
                  <input type="number" value={totalAmount} onChange={e => setTotalAmount(e.target.value)} required min="0" step="0.01" className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
                </div>
                
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

                <div className="flex items-center gap-2 mt-4 pt-2">
                  <input type="checkbox" id="isPaid" checked={isPaid} onChange={e => setIsPaid(e.target.checked)} className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" />
                  <label htmlFor="isPaid" className="text-sm font-medium text-slate-700 cursor-pointer">
                    {t('orders.modal.is_paid_label')}
                  </label>
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
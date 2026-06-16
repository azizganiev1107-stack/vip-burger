import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-hot-toast'
import { 
  useGetTransactions, 
  useCreateTransaction, 
  usePatchTransaction, 
  useDeleteTransaction,
  useGetCategories,
  useCreateCategory,
  usePatchCategory,
  useDeleteCategory
} from '@/services/finance'
import type { ITransaction, ITransactionCategory } from '@/services/finance'
import { Wallet, TrendingUp, TrendingDown, Plus, Edit2, Trash2, Loader2, X, CreditCard, Landmark, Coins } from 'lucide-react'

export const Route = createFileRoute('/finance')({
  component: FinancePage,
})

function FinancePage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<'transactions' | 'categories'>('transactions')

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <Wallet className="w-8 h-8 text-indigo-500" />
            {t('finance.title')}
          </h1>
          <p className="text-slate-500 mt-1">{t('finance.subtitle')}</p>
        </div>
        
        <div className="flex p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'transactions' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t('finance.tabs.transactions')}
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'categories' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {t('finance.tabs.categories')}
          </button>
        </div>
      </div>

      {activeTab === 'transactions' ? <TransactionsView /> : <CategoriesView />}
    </div>
  )
}

function TransactionsView() {
  const { t } = useTranslation()
  const { data, isLoading } = useGetTransactions()
  const { data: categoriesData, isLoading: isLoadingCategories } = useGetCategories({ limit: 100 })
  const createTx = useCreateTransaction()
  const patchTx = usePatchTransaction()
  const deleteTx = useDeleteTransaction()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTx, setEditingTx] = useState<ITransaction | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  // Form State
  const [type, setType] = useState<'income' | 'expense'>('income')
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'transfer'>('cash')
  const [categoryId, setCategoryId] = useState<number | ''>('')
  const [description, setDescription] = useState('')

  const openCreateModal = () => {
    setEditingTx(null)
    setType('income')
    setAmount('')
    setPaymentMethod('cash')
    setCategoryId('')
    setDescription('')
    setErrorMsg('')
    setIsModalOpen(true)
  }

  const openEditModal = (tx: ITransaction) => {
    setEditingTx(tx)
    setType((tx.type as any) || 'income')
    setAmount(tx.amount)
    setPaymentMethod((tx.payment_method as any) || 'cash')
    setCategoryId(tx.category || tx.category_details?.id || '')
    setDescription(tx.description || '')
    setErrorMsg('')
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingTx(null)
    setErrorMsg('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      type,
      amount,
      payment_method: paymentMethod,
      category: categoryId ? Number(categoryId) : null,
      description: description || null
    }

    if (editingTx) {
      patchTx.mutate(
        { id: editingTx.id, payload },
        { 
          onSuccess: () => { toast.success(t('common.updated')); closeModal(); },
          onError: (err: any) => setErrorMsg(err.response?.data?.errors?.[0] || t('common.error'))
        }
      )
    } else {
      createTx.mutate(
        payload,
        { 
          onSuccess: () => { toast.success(t('common.created')); closeModal(); },
          onError: (err: any) => setErrorMsg(err.response?.data?.errors?.[0] || t('common.error'))
        }
      )
    }
  }

  const handleDelete = (id: number) => {
    if (window.confirm(t('finance.transactions.modal.delete_confirm'))) {
      deleteTx.mutate(id, { onSuccess: () => toast.success(t('common.deleted')), onError: () => toast.error(t('common.error')) })
    }
  }

  const transactions = data?.data || []
  const categoriesList = categoriesData?.data || []

  const filteredCategories = categoriesList.filter(cat => 
    type === 'income' ? cat.type === 'INCOME' : cat.type === 'EXPENSE'
  )

  useEffect(() => {
    if (categoryId) {
      const selectedCat = categoriesList.find(c => c.id === categoryId)
      if (selectedCat) {
        const expectedType = type === 'income' ? 'INCOME' : 'EXPENSE'
        if (selectedCat.type !== expectedType) {
          setCategoryId('')
        }
      }
    }
  }, [type, categoryId, categoriesList])

  const formatMoney = (val: string) => {
    const num = Number(val)
    return isNaN(num) ? val : num.toLocaleString('ru-RU') + ' UZS'
  }

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'card': return <CreditCard className="w-4 h-4" />
      case 'transfer':
      case 'bank_transfer':
        return <Landmark className="w-4 h-4" />
      case 'click':
      case 'online':
        return <Wallet className="w-4 h-4" />
      default: return <Coins className="w-4 h-4" />
    }
  }

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'card': return t('finance.transactions.methods.card')
      case 'transfer': return t('finance.transactions.methods.transfer')
      case 'click': return t('finance.transactions.methods.click')
      case 'online': return t('finance.transactions.methods.online')
      case 'bank_transfer': return t('finance.transactions.methods.bank_transfer')
      default: return t('finance.transactions.methods.cash')
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
        <h2 className="text-lg font-semibold text-slate-800">{t('finance.transactions.title')}</h2>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-xl transition-colors shadow-sm text-sm"
        >
          <Plus className="w-4 h-4" />
          {t('finance.transactions.new_tx')}
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">{t('finance.transactions.table.id')}</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">{t('finance.transactions.table.type')}</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">{t('finance.transactions.table.category')}</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">{t('finance.transactions.table.amount')}</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">{t('finance.transactions.table.date')}</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">{t('finance.transactions.table.employee')}</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">{t('finance.transactions.table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                    {t('finance.transactions.not_found')}
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => {
                  const isIncome = tx.type === 'income'
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">#{tx.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {isIncome ? (
                            <TrendingUp className="w-4 h-4 text-green-500" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-red-500" />
                          )}
                          <span className={isIncome ? 'text-green-700 font-medium text-sm' : 'text-red-700 font-medium text-sm'}>
                            {isIncome ? t('finance.transactions.income') : t('finance.transactions.expense')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                          {tx.category_details?.name || t('finance.transactions.no_category')}
                        </span>
                        {tx.description && <p className="text-xs text-slate-400 mt-1">{tx.description}</p>}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className={`text-sm font-bold ${isIncome ? 'text-green-600' : 'text-slate-900'}`}>
                            {isIncome ? '+' : '-'}{formatMoney(tx.amount)}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-slate-500 mt-0.5 capitalize">
                            {getPaymentIcon(tx.payment_method)}
                            {getPaymentMethodName(tx.payment_method)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(tx.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-6 py-4">
                        {tx.user_details ? (
                          <span className="text-sm font-medium text-slate-700">
                            {tx.user_details.first_name}
                          </span>
                        ) : (
                          <span className="text-sm text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(tx)}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(tx.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">
                {editingTx ? t('finance.transactions.modal.edit_title') : t('finance.transactions.modal.new_title')}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {errorMsg && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">{errorMsg}</div>}
              
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${type === 'income' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-500'}`}
                >
                  <TrendingUp className="w-4 h-4" /> {t('finance.transactions.income')}
                </button>
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${type === 'expense' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500'}`}
                >
                  <TrendingDown className="w-4 h-4" /> {t('finance.transactions.expense')}
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('finance.transactions.modal.amount')}</label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('finance.transactions.modal.method')}</label>
                  <select
                    required
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="cash">{t('finance.transactions.methods.cash')}</option>
                    <option value="card">{t('finance.transactions.methods.card')}</option>
                    <option value="click">{t('finance.transactions.methods.click')}</option>
                    <option value="online">{t('finance.transactions.methods.online')}</option>
                    <option value="bank_transfer">{t('finance.transactions.methods.bank_transfer')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('finance.transactions.modal.category')}</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    disabled={isLoadingCategories}
                  >
                    <option value="">{t('finance.transactions.no_category')}</option>
                    {filteredCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('finance.transactions.modal.desc')}</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t('finance.transactions.modal.desc_placeholder')}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-20"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors">{t('finance.transactions.modal.cancel')}</button>
                <button type="submit" disabled={createTx.isPending || patchTx.isPending} className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70">
                  {(createTx.isPending || patchTx.isPending) && <Loader2 className="w-4 h-4 animate-spin" />}
                  {t('finance.transactions.modal.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function CategoriesView() {
  const { t } = useTranslation()
  const { data, isLoading } = useGetCategories({ limit: 100 })
  const createCategory = useCreateCategory()
  const patchCategory = usePatchCategory()
  const deleteCategory = useDeleteCategory()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<ITransactionCategory | null>(null)
  
  const [name, setName] = useState('')
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('INCOME')
  const [isActive, setIsActive] = useState(true)

  const openCreateModal = () => {
    setEditingCategory(null)
    setName('')
    setType('INCOME')
    setIsActive(true)
    setIsModalOpen(true)
  }

  const openEditModal = (cat: ITransactionCategory) => {
    setEditingCategory(cat)
    setName(cat.name)
    setType(cat.type || 'INCOME')
    setIsActive(cat.is_active)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingCategory(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingCategory) {
      patchCategory.mutate(
        { id: editingCategory.id, payload: { name, type, is_active: isActive } },
        { 
          onSuccess: () => { toast.success(t('common.updated')); closeModal(); },
          onError: () => toast.error(t('common.error'))
        }
      )
    } else {
      createCategory.mutate(
        { name, type, is_active: isActive },
        { 
          onSuccess: () => { toast.success(t('common.created')); closeModal(); },
          onError: () => toast.error(t('common.error'))
        }
      )
    }
  }

  const categories = data?.data || []

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
        <h2 className="text-lg font-semibold text-slate-800">{t('finance.categories.title')}</h2>
        <button onClick={openCreateModal} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-xl text-sm transition-colors">
          <Plus className="w-4 h-4" /> {t('finance.categories.new_cat')}
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">{t('finance.categories.table.id')}</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">{t('finance.categories.table.name')}</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">{t('finance.transactions.table.type')}</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">{t('finance.categories.table.status')}</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">{t('finance.categories.table.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {categories.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">{t('finance.categories.not_found')}</td></tr>
            ) : (
              categories.map(cat => {
                const isIncome = cat.type === 'INCOME'
                return (
                  <tr key={cat.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">#{cat.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{cat.name}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">
                      <div className="flex items-center gap-1.5">
                        {isIncome ? (
                          <TrendingUp className="w-4 h-4 text-green-500" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded ${isIncome ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                          {isIncome ? t('finance.transactions.income') : t('finance.transactions.expense')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {cat.is_active ? 
                        <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-md">{t('finance.categories.active')}</span> : 
                        <span className="px-2 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-md">{t('finance.categories.inactive')}</span>
                      }
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEditModal(cat)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => { if(window.confirm(t('finance.categories.modal.delete_confirm'))) deleteCategory.mutate(cat.id) }} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      )}

      {/* Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">{editingCategory ? t('finance.categories.modal.edit_title') : t('finance.categories.modal.new_title')}</h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('finance.categories.modal.name')}</label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder={t('finance.categories.modal.name_placeholder')} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('finance.transactions.table.type')}</label>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setType('INCOME')}
                    className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${type === 'INCOME' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-500'}`}
                  >
                    <TrendingUp className="w-4 h-4" /> {t('finance.transactions.income')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('EXPENSE')}
                    className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 ${type === 'EXPENSE' ? 'bg-white text-red-600 shadow-sm' : 'text-slate-500'}`}
                  >
                    <TrendingDown className="w-4 h-4" /> {t('finance.transactions.expense')}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" id="isActiveCat" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500" />
                <label htmlFor="isActiveCat" className="text-sm font-medium text-slate-700">{t('finance.categories.modal.is_active')}</label>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={closeModal} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50">{t('finance.categories.modal.cancel')}</button>
                <button type="submit" disabled={createCategory.isPending || patchCategory.isPending} className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2">
                  {(createCategory.isPending || patchCategory.isPending) && <Loader2 className="w-4 h-4 animate-spin" />} {t('finance.categories.modal.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

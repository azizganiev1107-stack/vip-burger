import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { 
  useGetUserSalaries, 
  useCreateUserSalary, 
  usePatchUserSalary, 
  useDeleteUserSalary 
} from '@/services/user-salaries'
import { useGetUsers } from '@/services/users'
import type { IUserSalary } from '@/services/user-salaries'
import { Banknote, Plus, Edit2, Trash2, Loader2, X } from 'lucide-react'
import { toast } from 'react-hot-toast'

export const Route = createFileRoute('/admins/user-salaries')({
  component: UserSalariesPage,
})

function UserSalariesPage() {
  const { t } = useTranslation()
  const { data, isLoading } = useGetUserSalaries()
  const { data: usersData, isLoading: isLoadingUsers } = useGetUsers({ limit: 1000 })
  const createSalary = useCreateUserSalary()
  const patchSalary = usePatchUserSalary()
  const deleteSalary = useDeleteUserSalary()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSalary, setEditingSalary] = useState<IUserSalary | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  
  // Form state
  const [userId, setUserId] = useState<number | ''>('')
  const [amount, setAmount] = useState('')
  const [month, setMonth] = useState('')

  const openCreateModal = () => {
    setEditingSalary(null)
    setUserId('')
    setAmount('')
    setMonth('')
    setErrorMsg('')
    setIsModalOpen(true)
  }

  const openEditModal = (salary: IUserSalary) => {
    setEditingSalary(salary)
    setUserId(salary.user?.id || salary.user_id || '')
    setAmount(salary.amount)
    setMonth(salary.month || '')
    setErrorMsg('')
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setUserId('')
    setAmount('')
    setMonth('')
    setEditingSalary(null)
    setErrorMsg('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!userId) return;

    if (editingSalary) {
      patchSalary.mutate(
        { 
          id: editingSalary.id, 
          payload: { 
            user_id: Number(userId), 
            amount, 
            month: month || null 
          } 
        },
        { 
          onSuccess: () => {
            toast.success(t('common.updated'))
            closeModal()
          },
          onError: () => toast.error(t('common.error'))
        }
      )
    } else {
      createSalary.mutate(
        { 
          user_id: Number(userId), 
          amount, 
          month: month || null 
        },
        { 
          onSuccess: () => {
            toast.success(t('common.created'))
            closeModal()
          },
          onError: () => toast.error(t('common.error'))
        }
      )
    }
  }

  const handleDelete = (id: number) => {
    if (window.confirm(t('salaries.modal.delete_confirm'))) {
      deleteSalary.mutate(id, {
        onSuccess: () => toast.success(t('common.deleted')),
        onError: () => toast.error(t('common.error'))
      })
    }
  }

  const salaries = data?.data || []
  const usersList = usersData?.data || []

  // Formatting amount for display
  const formatMoney = (val: string) => {
    const num = Number(val)
    return isNaN(num) ? val : num.toLocaleString('ru-RU') + ' UZS'
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <Banknote className="w-8 h-8 text-green-500" />
            {t('salaries.title')}
          </h1>
          <p className="text-slate-500 mt-1">{t('salaries.subtitle')}</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-5 rounded-xl transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          {t('salaries.add_salary')}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-green-500" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">{t('salaries.table.id')}</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">{t('salaries.table.employee')}</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">{t('salaries.table.amount')}</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">{t('salaries.table.month_date')}</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">{t('salaries.table.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {salaries.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      {t('salaries.not_found')}
                    </td>
                  </tr>
                ) : (
                  salaries.map((salary) => (
                    <tr key={salary.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">#{salary.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-900">
                            {salary.user?.first_name} {salary.user?.last_name}
                          </span>
                          <span className="text-xs text-slate-500">
                            {salary.user?.phone || `User ID: ${salary.user?.id || salary.user_id}`}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-bold bg-green-50 text-green-700 border border-green-100">
                          {formatMoney(salary.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {salary.month ? salary.month : new Date(salary.created_at || '').toLocaleDateString('ru-RU')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(salary)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title={t('salaries.modal.edit_title')}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(salary.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">
                {editingSalary ? t('salaries.modal.edit_title') : t('salaries.modal.new_title')}
              </h2>
              <button 
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">
                  {errorMsg}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('salaries.modal.employee')}</label>
                <select
                  required
                  value={userId}
                  onChange={(e) => setUserId(e.target.value === '' ? '' : Number(e.target.value))}
                  disabled={isLoadingUsers}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all disabled:opacity-50"
                >
                  <option value="">{t('salaries.modal.select_employee')}</option>
                  {usersList.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.first_name} {user.last_name} ({user.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('salaries.modal.amount')}</label>
                <input
                  type="text"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={t('salaries.modal.amount_placeholder')}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('salaries.modal.month')}</label>
                <input
                  type="date"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                >
                  {t('salaries.modal.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={createSalary.isPending || patchSalary.isPending}
                  className="flex-1 px-4 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {(createSalary.isPending || patchSalary.isPending) && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingSalary ? t('salaries.modal.save') : t('salaries.modal.add')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
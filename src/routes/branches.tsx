import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { 
  useGetBranches, 
  useCreateBranch, 
  usePatchBranch, 
  useDeleteBranch 
} from '@/services/branches'
import type { IBranch } from '@/services/branches'
import { MapPin, Plus, Edit2, Trash2, Loader2, X, Eye } from 'lucide-react'
import { toast } from 'react-hot-toast'

export const Route = createFileRoute('/branches')({
  component: BranchesPage,
})

function BranchesPage() {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const { data, isLoading } = useGetBranches({ search: searchQuery })
  const createBranch = useCreateBranch()
  const patchBranch = usePatchBranch()
  const deleteBranch = useDeleteBranch()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBranch, setEditingBranch] = useState<IBranch | null>(null)
  
  // Form state
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [isActive, setIsActive] = useState(true)

  const openCreateModal = () => {
    setEditingBranch(null)
    setName('')
    setAddress('')
    setPhone('')
    setIsActive(true)
    setIsModalOpen(true)
  }

  const openEditModal = (branch: IBranch) => {
    setEditingBranch(branch)
    setName(branch.name)
    setAddress(branch.address || '')
    setPhone(branch.phone || '')
    setIsActive(branch.is_active ?? true)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setName('')
    setAddress('')
    setPhone('')
    setIsActive(true)
    setEditingBranch(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingBranch) {
      patchBranch.mutate(
        { 
          id: editingBranch.id, 
          payload: { 
            name, 
            address, 
            phone, 
            is_active: isActive 
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
      createBranch.mutate(
        { 
          name, 
          address, 
          phone, 
          is_active: isActive 
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
    if (window.confirm(t('branches.modal.delete_confirm'))) {
      deleteBranch.mutate(id, {
        onSuccess: () => toast.success(t('common.deleted')),
        onError: () => toast.error(t('common.error'))
      })
    }
  }

  const branches = data?.data || []

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <MapPin className="w-8 h-8 text-primary-500" />
            {t('branches.title')}
          </h1>
          <p className="text-slate-500 mt-1">{t('branches.subtitle')}</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 px-5 rounded-xl transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          {t('branches.add_branch')}
        </button>
      </div>

      {/* Search Input */}
      <div className="mb-6 max-w-md">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('warehouse.items.table.name') + '...'}
          className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">{t('branches.table.id')}</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">{t('branches.table.name')}</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">{t('branches.table.address')}</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">{t('branches.table.phone')}</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">{t('branches.table.status')}</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">{t('branches.table.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {branches.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                      {t('branches.table.not_found')}
                    </td>
                  </tr>
                ) : (
                  branches.map((branch: IBranch) => (
                    <tr key={branch.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">#{branch.id}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-800">{branch.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{branch.address || '-'}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{branch.phone || '-'}</td>
                      <td className="px-6 py-4">
                        {branch.is_active === false ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-red-50 text-red-700">
                            {t('branches.status.inactive')}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-green-50 text-green-700">
                            {t('branches.status.active')}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to="/branches/$id"
                            params={{ id: branch.id.toString() }}
                            className="p-2 text-slate-400 hover:text-slate-950 hover:bg-slate-100 rounded-lg transition-colors"
                            title={t('branches.detail.title')}
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => openEditModal(branch)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title={t('branches.modal.edit_title')}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(branch.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title={t('branches.modal.delete_confirm')}
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
                {editingBranch ? t('branches.modal.edit_title') : t('branches.modal.new_title')}
              </h2>
              <button 
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('branches.modal.name')}</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="VIP Burger Central"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('branches.modal.address')}</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Nukis q., E. Alakoz ko'shesi"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('branches.modal.phone')}</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+998901234567"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="isActive" 
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-primary-600 rounded border-slate-300 focus:ring-primary-500" 
                />
                <label htmlFor="isActive" className="text-sm font-medium text-slate-700">{t('branches.modal.is_active')}</label>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                >
                  {t('branches.modal.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={createBranch.isPending || patchBranch.isPending}
                  className="flex-1 px-4 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {(createBranch.isPending || patchBranch.isPending) && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingBranch ? t('branches.modal.save') : t('branches.modal.save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

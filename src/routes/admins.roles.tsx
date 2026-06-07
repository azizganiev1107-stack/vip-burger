import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { 
  useGetRoles, 
  useCreateRole, 
  usePatchRole, 
  useDeleteRole 
} from '@/services/roles'
import type { IRole } from '@/services/roles'
import { Shield, Plus, Edit2, Trash2, Loader2, X } from 'lucide-react'
import { toast } from 'react-hot-toast'

export const Route = createFileRoute('/admins/roles')({
  component: RolesPage,
})

function RolesPage() {
  const { t } = useTranslation()
  const { data, isLoading } = useGetRoles()
  const createRole = useCreateRole()
  const patchRole = usePatchRole()
  const deleteRole = useDeleteRole()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<IRole | null>(null)
  
  // Form state
  const [name, setName] = useState('')
  const [code, setCode] = useState('')

  const openCreateModal = () => {
    setEditingRole(null)
    setName('')
    setCode('')
    setIsModalOpen(true)
  }

  const openEditModal = (role: IRole) => {
    setEditingRole(role)
    setName(role.name)
    setCode(role.code)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setName('')
    setCode('')
    setEditingRole(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingRole) {
      patchRole.mutate(
        { id: editingRole.id, payload: { name, code } },
        { 
          onSuccess: () => {
            toast.success(t('common.updated'))
            closeModal()
          },
          onError: () => toast.error(t('common.error'))
        }
      )
    } else {
      createRole.mutate(
        { name, code },
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
    if (window.confirm(t('roles.modal.delete_confirm'))) {
      deleteRole.mutate(id, {
        onSuccess: () => toast.success(t('common.deleted')),
        onError: () => toast.error(t('common.error'))
      })
    }
  }

  const roles = data?.data || []

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary-500" />
            {t('roles.title')}
          </h1>
          <p className="text-slate-500 mt-1">{t('roles.subtitle')}</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 px-5 rounded-xl transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          {t('roles.add_role')}
        </button>
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
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">{t('roles.table.id')}</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">{t('roles.table.name')}</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">{t('roles.table.code')}</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">{t('roles.table.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {roles.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                      {t('roles.not_found')}
                    </td>
                  </tr>
                ) : (
                  roles.map((role: IRole) => (
                    <tr key={role.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">#{role.id}</td>
                      <td className="px-6 py-4 text-sm text-slate-700 font-medium">{role.name}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                          {role.code}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(role)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title={t('roles.modal.edit_title')}
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(role.id)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title={t('roles.modal.delete_confirm')}
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
                {editingRole ? t('roles.modal.edit_title') : t('roles.modal.new_title')}
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
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('roles.modal.name')}</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('roles.modal.name_placeholder')}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('roles.modal.code')}</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder={t('roles.modal.code_placeholder')}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                >
                  {t('roles.modal.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={createRole.isPending || patchRole.isPending}
                  className="flex-1 px-4 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {(createRole.isPending || patchRole.isPending) && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingRole ? t('roles.modal.save') : t('roles.modal.add')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { 
  useGetUsers, 
  useCreateUser, 
  usePatchUser, 
  useDeleteUser 
} from '@/services/users'
import { useGetRoles } from '@/services/roles'
import type { IUser } from '@/services/users'
import { Users as UsersIcon, Plus, Edit2, Trash2, Loader2, X } from 'lucide-react'
import { toast } from 'react-hot-toast'

export const Route = createFileRoute('/admins/users')({
  component: UsersPage,
})

function UsersPage() {
  const { t } = useTranslation()
  const { data, isLoading } = useGetUsers()
  const { data: rolesData, isLoading: isLoadingRoles } = useGetRoles({ limit: 100 })
  const createUser = useCreateUser()
  const patchUser = usePatchUser()
  const deleteUser = useDeleteUser()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<IUser | null>(null)
  const [errorMsg, setErrorMsg] = useState('')
  
  // Form state
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [roleId, setRoleId] = useState<number | ''>('')
  const [isActive, setIsActive] = useState(true)

  const openCreateModal = () => {
    setEditingUser(null)
    setFirstName('')
    setLastName('')
    setPhone('')
    setPassword('')
    setRoleId('')
    setIsActive(true)
    setErrorMsg('')
    setIsModalOpen(true)
  }

  const openEditModal = (user: IUser) => {
    setEditingUser(user)
    setFirstName(user.first_name)
    setLastName(user.last_name)
    setPhone(user.phone)
    setPassword('') // Don't show existing password
    setRoleId(user.role?.id || '')
    setIsActive(user.is_active ?? true)
    setErrorMsg('')
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingUser(null)
    setErrorMsg('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!roleId) return

    if (editingUser) {
      patchUser.mutate(
        { 
          id: editingUser.id, 
          payload: { 
            first_name: firstName,
            last_name: lastName,
            phone,
            ...(password ? { password } : {}), // only send password if changed
            role_id: Number(roleId),
            is_active: isActive
          } 
        },
        { 
          onSuccess: () => {
            toast.success(t('common.updated'))
            closeModal()
          },
          onError: (err: any) => {
             const message = err.response?.data?.errors?.[0] || err.message || t('common.error')
             toast.error(message)
          }
        }
      )
    } else {
      if (!password) {
        setErrorMsg(t('users.modal.password_required'))
        return
      }
      createUser.mutate(
        { 
          first_name: firstName,
          last_name: lastName,
          phone,
          password,
          role_id: Number(roleId),
          is_active: isActive
        },
        { 
          onSuccess: () => {
            toast.success(t('common.created'))
            closeModal()
          },
          onError: (err: any) => {
             const message = err.response?.data?.errors?.[0] || err.message || t('common.error')
             toast.error(message)
          }
        }
      )
    }
  }

  const handleDelete = (id: number) => {
    if (window.confirm(t('users.modal.delete_confirm'))) {
      deleteUser.mutate(id, {
        onSuccess: () => toast.success(t('common.deleted')),
        onError: () => toast.error(t('common.error'))
      })
    }
  }

  const users = data?.data || []
  const rolesList = rolesData?.data || []

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <UsersIcon className="w-8 h-8 text-blue-500" />
            {t('users.title')}
          </h1>
          <p className="text-slate-500 mt-1">{t('users.subtitle')}</p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-5 rounded-xl transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          {t('users.add_user')}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">{t('users.table.id')}</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">{t('users.table.employee')}</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">{t('users.table.role')}</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600">{t('users.table.status')}</th>
                  <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">{t('users.table.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      {t('users.not_found')}
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">#{user.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-900">
                            {user.first_name} {user.last_name}
                          </span>
                          <span className="text-xs text-slate-500">{user.phone}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                          {user.role?.name || `Role ID: ${user.role?.id}`}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {user.is_active === false ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-red-50 text-red-700">{t('users.inactive')}</span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-green-50 text-green-700">{t('users.active')}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(user)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
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
                {editingUser ? t('users.modal.edit_title') : t('users.modal.new_title')}
              </h2>
              <button 
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto max-h-[70vh]">
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {errorMsg && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">
                    {errorMsg}
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('users.modal.first_name')}</label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Иван"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('users.modal.last_name')}</label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Иванов"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('users.modal.phone')}</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+998901234567"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('users.modal.password')} {editingUser && t('users.modal.password_hint')}</label>
                  <input
                    type="text"
                    required={!editingUser}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="***"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('users.modal.role')}</label>
                  <select
                    required
                    value={roleId}
                    onChange={(e) => setRoleId(e.target.value === '' ? '' : Number(e.target.value))}
                    disabled={isLoadingRoles}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  >
                    <option value="">{t('users.modal.select_role')}</option>
                    {rolesList.map(role => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input 
                    type="checkbox" 
                    id="isActive" 
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" 
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-slate-700">{t('users.modal.is_active')}</label>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    {t('users.modal.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={createUser.isPending || patchUser.isPending}
                    className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {(createUser.isPending || patchUser.isPending) && <Loader2 className="w-4 h-4 animate-spin" />}
                    {editingUser ? t('users.modal.save') : t('users.modal.add')}
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

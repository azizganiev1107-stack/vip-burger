import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-hot-toast'
import { 
  useGetShifts, 
  useCreateShift, 
  usePatchShift, 
  useDeleteShift 
} from '@/services/shifts'
import type { IShift } from '@/services/shifts'
import { Clock, Plus, Edit2, Trash2, Loader2, X } from 'lucide-react'

export const Route = createFileRoute('/shifts')({
  component: ShiftsPage,
})

function ShiftsPage() {
  const { t } = useTranslation()
  const { data, isLoading } = useGetShifts({ limit: 100 })
  const createShift = useCreateShift()
  const patchShift = usePatchShift()
  const deleteShift = useDeleteShift()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingShift, setEditingShift] = useState<IShift | null>(null)
  
  // Form state
  const [type, setType] = useState<string>('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')

  const openCreateModal = () => {
    setEditingShift(null)
    setType('')
    setStartTime('')
    setEndTime('')
    setIsModalOpen(true)
  }

  const openEditModal = (shift: IShift) => {
    setEditingShift(shift)
    setType(shift.type ? shift.type.toString() : '')
    setStartTime(shift.start_time || '')
    setEndTime(shift.end_time || '')
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingShift(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const payload: any = {
      type: type ? parseInt(type, 10) : undefined,
      start_time: startTime || undefined,
      end_time: endTime || undefined
    }

    if (editingShift) {
      patchShift.mutate(
        { id: editingShift.id, payload },
        { 
          onSuccess: () => { toast.success(t('common.updated')); closeModal(); },
          onError: () => toast.error(t('common.error'))
        }
      )
    } else {
      createShift.mutate(
        payload,
        { 
          onSuccess: () => { toast.success(t('common.created')); closeModal(); },
          onError: () => toast.error(t('common.error'))
        }
      )
    }
  }

  const handleDelete = (id: number) => {
    if (window.confirm(t('shifts.modal.delete_confirm'))) {
      deleteShift.mutate(id, {
        onSuccess: () => toast.success(t('common.deleted')),
        onError: () => toast.error(t('common.error'))
      })
    }
  }

  const shifts = data?.data || []

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="bg-purple-100 p-2 rounded-xl">
            <Clock className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{t('shifts.title')}</h2>
            <p className="text-sm text-slate-500 mt-1">{t('shifts.subtitle')}</p>
          </div>
        </div>
        <button onClick={openCreateModal} className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 px-5 rounded-xl transition-colors shadow-sm">
          <Plus className="w-5 h-5" /> {t('shifts.add_shift')}
        </button>
      </div>

      <div className="p-6 overflow-x-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">{t('shifts.table.id')}</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">{t('shifts.table.type')}</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">{t('shifts.table.start')}</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">{t('shifts.table.end')}</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">{t('shifts.table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shifts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    {t('shifts.table.not_found')}
                  </td>
                </tr>
              ) : (
                shifts.map((shift) => (
                  <tr key={shift.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">#{shift.id}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-100">
                        {t('shifts.type_prefix')} {shift.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700 font-medium">
                      {shift.start_time ? new Date(shift.start_time).toLocaleString() : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      {shift.end_time ? new Date(shift.end_time).toLocaleString() : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEditModal(shift)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(shift.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
                {editingShift ? t('shifts.modal.edit_title') : t('shifts.modal.new_title')}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('shifts.modal.shift_type')}</label>
                  <input type="number" value={type} onChange={e => setType(e.target.value)} required className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('shifts.modal.start_time')}</label>
                  <input type="datetime-local" value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('shifts.modal.end_time')}</label>
                  <input type="datetime-local" value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={closeModal} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors">{t('shifts.modal.cancel')}</button>
                  <button type="submit" disabled={createShift.isPending || patchShift.isPending} className="flex-1 px-4 py-2.5 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70">
                    {(createShift.isPending || patchShift.isPending) && <Loader2 className="w-4 h-4 animate-spin" />} {t('shifts.modal.save')}
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
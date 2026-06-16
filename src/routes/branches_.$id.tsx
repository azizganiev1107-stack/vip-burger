import { createFileRoute, Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useGetBranchById } from '@/services/branches'
import { ArrowLeft, MapPin, Loader2, Calendar, Phone, Home, Shield } from 'lucide-react'
import { format } from 'date-fns'

export const Route = createFileRoute('/branches_/$id')({
  component: BranchDetailPage,
})

function BranchDetailPage() {
  const { id } = Route.useParams()
  const { t } = useTranslation()
  const branchId = Number(id)
  
  const { data: branch, isLoading, error } = useGetBranchById(branchId)

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-'
    try {
      return format(new Date(dateStr), 'dd.MM.yyyy HH:mm')
    } catch (e) {
      return dateStr
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Back Link */}
      <div className="mb-6">
        <Link
          to="/branches"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          {t('branches.detail.back')}
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      ) : error || !branch ? (
        <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl shadow-sm text-red-500 font-medium">
          {t('common.error')}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Header Accent */}
          <div className="h-3 bg-gradient-to-r from-primary-500 to-orange-500" />
          
          <div className="p-8">
            {/* Title & Icon */}
            <div className="flex items-start gap-4 mb-8">
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 flex-shrink-0 shadow-sm">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {branch.name}
                </h1>
                <p className="text-slate-500 mt-0.5">#{branch.id} — {t('branches.detail.title')}</p>
              </div>
            </div>

            {/* Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5" />
                    {t('branches.detail.name')}
                  </h3>
                  <p className="text-base font-semibold text-slate-800 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">
                    {branch.name}
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    {t('branches.detail.address')}
                  </h3>
                  <p className="text-base font-medium text-slate-700 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 min-h-[46px]">
                    {branch.address || '-'}
                  </p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" />
                    {t('branches.detail.phone')}
                  </h3>
                  <p className="text-base font-medium text-slate-700 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">
                    {branch.phone || '-'}
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    {t('branches.detail.status')}
                  </h3>
                  <div className="bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 flex items-center min-h-[46px]">
                    {branch.is_active === false ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                        {t('branches.status.inactive')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                        {t('branches.status.active')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Date Info */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{t('branches.detail.created_at')}: {formatDate(branch.created_at)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

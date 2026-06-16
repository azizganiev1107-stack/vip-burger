import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { 
  useGetAdminProfile, 
  usePatchAdminProfile, 
  useChangePassword 
} from '@/services/profile'
import { User, Lock, Save, Loader2 } from 'lucide-react'

export const Route = createFileRoute('/admins/profile')({
  component: AdminProfilePage,
})

function AdminProfilePage() {
  const { t } = useTranslation()
  const { data: profile, isLoading } = useGetAdminProfile()
  const patchProfile = usePatchAdminProfile()
  const changePassword = useChangePassword()

  // Profile Form State
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' })

  // Password Form State
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' })

  // Sync profile data to state when loaded
  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || '')
      setLastName(profile.last_name || '')
    }
  }, [profile])

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setProfileMsg({ type: '', text: '' })

    patchProfile.mutate(
      { first_name: firstName, last_name: lastName },
      {
        onSuccess: () => {
          setProfileMsg({ type: 'success', text: t('profile.personal_data.success') })
          setTimeout(() => setProfileMsg({ type: '', text: '' }), 3000)
        },
        onError: (error: any) => {
          setProfileMsg({ type: 'error', text: error.response?.data?.errors?.[0] || error.message || t('profile.personal_data.error') })
        }
      }
    )
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordMsg({ type: '', text: '' })

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: t('profile.password.mismatch') })
      return
    }

    changePassword.mutate(
      { old_password: oldPassword, new_password: newPassword },
      {
        onSuccess: () => {
          setPasswordMsg({ type: 'success', text: t('profile.password.success') })
          setOldPassword('')
          setNewPassword('')
          setConfirmPassword('')
          setTimeout(() => setPasswordMsg({ type: '', text: '' }), 3000)
        },
        onError: (error: any) => {
          setPasswordMsg({ type: 'error', text: error.response?.data?.errors?.[0] || error.message || t('profile.password.error') })
        }
      }
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{t('profile.title')}</h1>
        <p className="text-slate-500 mt-1">{t('profile.subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Profile Info Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <User className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">{t('profile.personal_data.title')}</h2>
          </div>
          
          <form onSubmit={handleProfileSubmit} className="p-6 space-y-5">
            {profileMsg.text && (
              <div className={`p-3 rounded-lg text-sm ${profileMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                {profileMsg.text}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('profile.personal_data.first_name')}</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('profile.personal_data.last_name')}</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('profile.personal_data.role')}</label>
              <input
                type="text"
                value={typeof profile?.role === 'object' ? profile?.role?.name || profile?.role?.code || '' : profile?.role || 'Admin'}
                disabled
                className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={patchProfile.isPending}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-70"
            >
              {patchProfile.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {t('profile.personal_data.save')}
            </button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
              <Lock className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">{t('profile.password.title')}</h2>
          </div>
          
          <form onSubmit={handlePasswordSubmit} className="p-6 space-y-5">
            {passwordMsg.text && (
              <div className={`p-3 rounded-lg text-sm ${passwordMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                {passwordMsg.text}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('profile.password.current')}</label>
              <input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('profile.password.new')}</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t('profile.password.confirm')}</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={changePassword.isPending}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 px-4 rounded-lg transition-colors disabled:opacity-70"
            >
              {changePassword.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
              {t('profile.password.update')}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
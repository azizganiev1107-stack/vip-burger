import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { authService } from '@/services/auth'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-hot-toast'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const { mutate: login, isPending } = useMutation({
    mutationFn: authService.login,
    onSuccess: (res) => {
      if (res.data?.token) {
        localStorage.setItem('token', res.data.token)
      } else if (res.data?.access) {
        localStorage.setItem('token', res.data.access)
      }
      
      localStorage.setItem('auth', JSON.stringify({ state: { user: res } }))

      toast.success(t('common.login_success'))
      navigate({ to: '/products', replace: true })
    },
    onError: (err: any) => {
      setErrorMsg(err.message || t('login.error'))
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')
    
    const formattedPhone = phone.replace(/\s/g, '')
    
    login({ phone: formattedPhone, password })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">VIP BURGER</h2>
          <p className="text-slate-500 mt-2">{t('login.subtitle')}</p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg text-sm text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('login.phone')}
            </label>
            <input
              type="text"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+998 90 123 45 67"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t('login.password')}
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPending ? t('login.loading') : t('login.submit')}
          </button>
        </form>
      </div>
    </div>
  )
}
import { useRegisterSW } from 'virtual:pwa-register/react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles, RefreshCw, X } from 'lucide-react'

export default function ReloadPrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r: ServiceWorkerRegistration | undefined) {
      console.log('SW Registered:', r)
    },
    onRegisterError(error: any) {
      console.error('SW registration error', error)
    },
  })

  const close = () => {
    setNeedRefresh(false)
  }

  return (
    <AnimatePresence>
      {needRefresh && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 right-6 z-[9999] max-w-sm w-full bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-indigo-100 overflow-hidden flex flex-col"
        >
          <div className="p-5 flex gap-4">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0 animate-pulse">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-slate-900">VIP Burger ózgerisleri</h3>
              <p className="text-xs text-slate-500 mt-1">
                Sayıtta taza jańalanıw bar. Jańalıqlardı kóriw ushın sayttı jańalań.
              </p>
            </div>
            <button
              onClick={close}
              className="text-slate-400 hover:text-slate-600 self-start transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="px-5 pb-5 pt-1 flex gap-3">
            <button
              onClick={close}
              className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors"
            >
              Keyinrek
            </button>
            <button
              onClick={() => updateServiceWorker(true)}
              className="flex-1 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
              Jańalaw
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

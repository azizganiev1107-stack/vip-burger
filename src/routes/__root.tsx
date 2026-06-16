import { createRootRoute, Link, Outlet, useLocation, useNavigate } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { useGetAdminProfile } from '@/services/profile'
import { 
  Package, 
  Menu,
  ChevronRight,
  Users,
  UserCircle,
  Shield,
  Banknote,
  Wallet,
  ShoppingBag,
  PackageSearch,
  CalendarClock,
  LogOut,
  MapPin
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  const { t } = useTranslation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024
    }
    return true
  })
  const location = useLocation()
  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  const { data: profile } = useGetAdminProfile({ enabled: !!token })

  const isSatiwshi = profile?.role?.id === 4 || profile?.role?.code === 'satiwshi' || profile?.role?.name === 'satiwshi' || profile?.role === 'satiwshi'

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsSidebarOpen(false)
    }
  }, [location.pathname])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token && location.pathname !== '/login') {
      navigate({ to: '/login', replace: true })
      return
    }

    if (token && profile && isSatiwshi && location.pathname !== '/warehouse') {
      navigate({ to: '/warehouse', replace: true })
    }
  }, [location.pathname, profile, isSatiwshi, navigate])

  if (location.pathname === '/login') {
    return <Outlet />
  }

  const navItems = [
    { label: t('sidebar.products'), to: '/products', icon: PackageSearch },
    { label: t('sidebar.orders'), to: '/orders', icon: ShoppingBag },
    { label: t('sidebar.shifts'), to: '/shifts', icon: CalendarClock },
    { label: t('sidebar.warehouse'), to: '/warehouse', icon: Package },
    { label: t('sidebar.finance'), to: '/finance', icon: Wallet },
    { label: t('sidebar.users'), to: '/admins/users', icon: Users },
    { label: t('sidebar.salaries'), to: '/admins/user-salaries', icon: Banknote },
    { label: t('sidebar.roles'), to: '/admins/roles', icon: Shield },
    { label: t('sidebar.branches'), to: '/branches', icon: MapPin },
    { label: t('sidebar.profile'), to: '/admins/profile', icon: UserCircle },
  ]

  const filteredNavItems = isSatiwshi
    ? navItems.filter(item => item.to === '/warehouse')
    : navItems

  return (
    <div className="h-screen overflow-hidden bg-slate-50 flex">
      {/* Decorative Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-primary-200/20 blur-[120px] rounded-full animate-float" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-orange-200/20 blur-[120px] rounded-full animate-float" style={{ animationDelay: '-1.5s' }} />
      </div>

      {/* Sidebar Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-secondary-900 text-white transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
          !isSidebarOpen && "-translate-x-full lg:w-20"
        )}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center justify-between">
            <div className={cn("flex items-center gap-3 overflow-hidden", !isSidebarOpen && "lg:hidden")}>
              <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                <Package className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-display font-extrabold tracking-tight">VIP BURGER</span>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-secondary-800 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
            {filteredNavItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeProps={{
                  className: "bg-primary-600 text-white shadow-lg shadow-primary-600/20",
                }}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-secondary-800 group",
                  !isSidebarOpen && "lg:justify-center"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className={cn("font-medium transition-opacity", !isSidebarOpen && "lg:hidden")}>
                  {item.label}
                </span>
                {isSidebarOpen && (
                  <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 flex-shrink-0 flex items-center justify-between z-40">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors lg:hidden text-slate-600"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-display font-bold text-slate-800">
              {/* Overview */}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                localStorage.removeItem('token')
                localStorage.removeItem('auth')
                navigate({ to: '/login', replace: true })
              }}
              className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4 flex-shrink-0" />
              <span className="hidden sm:inline">{t('header.logout')}</span>
            </button>
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
              <img src="https://ui-avatars.com/api/?name=Admin&background=f97316&color=fff" alt="Avatar" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
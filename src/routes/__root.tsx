import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { 
  LayoutDashboard, 
  Package, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Send, 
  History,
  Menu,
  ChevronRight,
  ShoppingCart,
  Users
} from 'lucide-react'
import { useState } from 'react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const navItems = [
    { label: 'Dashboard', to: '/', icon: LayoutDashboard },
    { label: 'Sklad', to: '/inventory', icon: Package },
    { label: 'Kiris', to: '/incoming', icon: ArrowDownLeft },
    { label: 'Shıǵıs', to: '/outgoing', icon: ArrowUpRight },
    { label: '3 filial', to: '/aziz', icon: Send },
    { label: 'Satıw', to: '/sales', icon: ShoppingCart },
    { label: 'Xızmetkerler', to: '/employees', icon: Users },
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Decorative Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] bg-primary-200/20 blur-[120px] rounded-full animate-float" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-orange-200/20 blur-[120px] rounded-full animate-float" style={{ animationDelay: '-1.5s' }} />
      </div>

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

          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => (
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

          <div className={cn("p-6 border-t border-secondary-800", !isSidebarOpen && "lg:hidden")}>
            <div className="bg-secondary-800 rounded-2xl p-4">
              <p className="text-xs text-secondary-400 uppercase tracking-wider font-bold mb-1">Admin Panel</p>
              <p className="text-sm font-medium">Warehouse Manager</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-40">
          <h2 className="text-xl font-display font-bold text-slate-800">
            {/* Dynamic Title based on route can be added here */}
            Overview
          </h2>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <History className="w-6 h-6" />
            </button>
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden">
              <img src="https://ui-avatars.com/api/?name=Admin&background=f97316&color=fff" alt="Avatar" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>

      <TanStackRouterDevtools />
    </div>
  )
}

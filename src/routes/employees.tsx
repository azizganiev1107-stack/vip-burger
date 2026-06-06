import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  Users,
  Plus,
  Trash2,
  Coins,
  CreditCard,
  Phone,
  Briefcase,
  User,
  CheckCircle,
  Calendar,
  X,
  Pencil,
  DollarSign,
  TrendingUp,
  UserCheck,
  BadgeCheck
} from 'lucide-react'

export const Route = createFileRoute('/employees')({
  component: Employees,
})

type PaymentMethod = 'cash' | 'card'
type EmployeeStatus = 'active' | 'inactive'
type Position = 'Oshpaz' | 'Kassir' | 'Ofisiant' | 'Sklad xızmeti' | 'Administrator' | 'Temizlovchi' | 'Haydovchi' | 'Basqa'

interface Employee {
  id: string
  fullName: string
  position: Position
  phone: string
  dailySalary: number
  status: EmployeeStatus
  startDate: string
}

interface SalaryPayment {
  id: string
  employeeId: string
  employeeName: string
  amount: number
  paymentMethod: PaymentMethod
  note: string
  date: string
}

const POSITIONS: Position[] = ['Oshpaz', 'Kassir', 'Ofisiant', 'Sklad xızmeti', 'Administrator', 'Temizlovchi', 'Haydovchi', 'Basqa']

const EMPTY_EMPLOYEE: Omit<Employee, 'id'> = {
  fullName: '',
  position: 'Oshpaz',
  phone: '',
  dailySalary: 0,
  status: 'active',
  startDate: new Date().toISOString().split('T')[0],
}

function Employees() {
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('vip_burger_employees')
    return saved ? JSON.parse(saved) : []
  })

  const [payments, setPayments] = useState<SalaryPayment[]>(() => {
    const saved = localStorage.getItem('vip_burger_salary_payments')
    return saved ? JSON.parse(saved) : []
  })

  const [showEmployeeModal, setShowEmployeeModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const [empForm, setEmpForm] = useState<Omit<Employee, 'id'>>(EMPTY_EMPLOYEE)

  const [payForm, setPayForm] = useState({
    employeeId: '',
    amount: 0,
    paymentMethod: 'cash' as PaymentMethod,
    note: '',
  })

  useEffect(() => {
    localStorage.setItem('vip_burger_employees', JSON.stringify(employees))
  }, [employees])

  useEffect(() => {
    localStorage.setItem('vip_burger_salary_payments', JSON.stringify(payments))
  }, [payments])

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(null), 3000)
  }

  const openAddEmployee = () => {
    setEditingEmployee(null)
    setEmpForm(EMPTY_EMPLOYEE)
    setShowEmployeeModal(true)
  }

  const openEditEmployee = (emp: Employee) => {
    setEditingEmployee(emp)
    setEmpForm({
      fullName: emp.fullName,
      position: emp.position,
      phone: emp.phone,
      dailySalary: emp.dailySalary,
      status: emp.status,
      startDate: emp.startDate,
    })
    setShowEmployeeModal(true)
  }

  const handleSaveEmployee = (e: React.FormEvent) => {
    e.preventDefault()
    if (!empForm.fullName.trim()) return

    if (editingEmployee) {
      setEmployees(employees.map(emp =>
        emp.id === editingEmployee.id ? { ...empForm, id: editingEmployee.id } : emp
      ))
      showSuccess('Xızmetker maǵlıumatları jańalandı!')
    } else {
      const newEmp: Employee = {
        ...empForm,
        id: `emp-${Date.now()}`,
      }
      setEmployees([...employees, newEmp])
      showSuccess('Jańa xızmetker qosıldı!')
    }

    setShowEmployeeModal(false)
    setEmpForm(EMPTY_EMPLOYEE)
  }

  const handleDeleteEmployee = (id: string) => {
    if (confirm('Bul xızmekerni óshiriwge isenimińiz kámilme?')) {
      setEmployees(employees.filter(emp => emp.id !== id))
      setPayments(payments.filter(p => p.employeeId !== id))
      showSuccess('Xızmetker óshirildi.')
    }
  }

  const openPaymentModal = (empId?: string) => {
    setPayForm({
      employeeId: empId || (employees[0]?.id || ''),
      amount: 0,
      paymentMethod: 'cash',
      note: '',
    })
    setShowPaymentModal(true)
  }

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!payForm.employeeId || payForm.amount <= 0) {
      alert('Iltimas, xızmetker hám tólem muǵdarın kiritiń!')
      return
    }

    const emp = employees.find(e => e.id === payForm.employeeId)
    const now = new Date()
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

    const newPayment: SalaryPayment = {
      id: `pay-${Date.now()}`,
      employeeId: payForm.employeeId,
      employeeName: emp?.fullName || 'Belgisiz',
      amount: payForm.amount,
      paymentMethod: payForm.paymentMethod,
      note: payForm.note,
      date: formattedDate,
    }

    setPayments([newPayment, ...payments])
    setShowPaymentModal(false)
    showSuccess(`${emp?.fullName || 'Xızmetker'}ge is haqı tólendi!`)
  }

  const handleDeletePayment = (id: string) => {
    if (confirm('Bul tólendi óshiriwge isenimińiz kámilme?')) {
      setPayments(payments.filter(p => p.id !== id))
    }
  }

  const activeEmployees = employees.filter(e => e.status === 'active').length
  const todayStr = new Date().toISOString().split('T')[0]
  const todayPayments = payments.filter(p => p.date.startsWith(todayStr))
  const totalTodayPaid = todayPayments.reduce((s, p) => s + p.amount, 0)
  const totalAllTimePaid = payments.reduce((s, p) => s + p.amount, 0)
  const cashPaid = payments.filter(p => p.paymentMethod === 'cash').reduce((s, p) => s + p.amount, 0)

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('uz-UZ').format(val) + ' swm'

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-extrabold text-slate-800">Xızmetkerler</h1>
          <p className="text-slate-500 mt-1">Xızmetkerlerdi hám is haqı tólewlerin basqarıu</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => openPaymentModal()}
            disabled={employees.length === 0}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all active:scale-95 shadow-lg shadow-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <DollarSign className="w-5 h-5" /> Is haqı tólew
          </button>
          <button
            onClick={openAddEmployee}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all active:scale-95 shadow-lg shadow-primary-500/20"
          >
            <Plus className="w-5 h-5" /> Xızmetker qosıu
          </button>
        </div>
      </div>

      {/* Success */}
      {successMsg && (
        <div className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-2xl animate-slide-up">
          <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0" />
          <span className="font-bold">{successMsg}</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-6 rounded-3xl hover:scale-[1.02] transition-all duration-300 border-l-4 border-l-primary-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Jámi xızmetkerler</p>
              <p className="text-3xl font-display font-bold mt-1 text-slate-800">{employees.length}</p>
            </div>
            <div className="bg-primary-500 w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-400">Dizimde bar barlıq xızmetkerler</div>
        </div>

        <div className="glass-card p-6 rounded-3xl hover:scale-[1.02] transition-all duration-300 border-l-4 border-l-emerald-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Aktiv xızmetkerler</p>
              <p className="text-3xl font-display font-bold mt-1 text-slate-800">{activeEmployees}</p>
            </div>
            <div className="bg-emerald-500 w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
              <UserCheck className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-400">Házirgide jumısta barlar</div>
        </div>

        <div className="glass-card p-6 rounded-3xl hover:scale-[1.02] transition-all duration-300 border-l-4 border-l-orange-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Búgingi tólewler</p>
              <p className="text-2xl font-display font-bold mt-1 text-slate-800">{formatCurrency(totalTodayPaid)}</p>
            </div>
            <div className="bg-orange-500 w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/30">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-400">{todayPayments.length} tranzakciya</div>
        </div>

        <div className="glass-card p-6 rounded-3xl hover:scale-[1.02] transition-all duration-300 border-l-4 border-l-blue-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Jámi tólengen</p>
              <p className="text-2xl font-display font-bold mt-1 text-slate-800">{formatCurrency(totalAllTimePaid)}</p>
            </div>
            <div className="bg-blue-500 w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <Coins className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 text-sm text-slate-400">Naq: {formatCurrency(cashPaid)}</div>
        </div>
      </div>

      {/* Employees Table */}
      <div className="glass-card rounded-3xl overflow-hidden">
        <div className="p-8 border-b border-slate-100">
          <h3 className="text-xl font-display font-bold text-slate-800">Xızmetkerler dizimi</h3>
          <p className="text-sm text-slate-500 mt-1">Barlıq xızmetkerler hám olardıń maǵlıumatları</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Xızmetker</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Lawazımı</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Telefon</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Kúnlik is haqı</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Háreket</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map((emp) => (
                <tr key={emp.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm flex-shrink-0">
                        {emp.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{emp.fullName}</p>
                        <p className="text-xs text-slate-400">{emp.startDate} den beri</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold">
                      <Briefcase className="w-3.5 h-3.5" />
                      {emp.position}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
                      <Phone className="w-4 h-4 text-slate-400" />
                      {emp.phone || '—'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-lg font-display font-black text-slate-800">{formatCurrency(emp.dailySalary)}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {emp.status === 'active' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Aktiv
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold">
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                        Aktiv emes
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => openPaymentModal(emp.id)}
                        className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all"
                        title="Is haqı tólew"
                      >
                        <DollarSign className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditEmployee(emp)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                        title="Tahrirlew"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEmployee(emp.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        title="Óshiriw"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {employees.length === 0 && (
            <div className="p-16 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-slate-400" />
              </div>
              <p className="text-slate-600 font-bold text-lg">Xızmetkerler tizimi bos</p>
              <p className="text-slate-400 text-sm mt-1">Joqarıdaǵı "Xızmetker qosıu" tugmasın basıp, birinshi xızmekerni qosıń.</p>
            </div>
          )}
        </div>
      </div>

      {/* Payments History */}
      <div className="glass-card rounded-3xl overflow-hidden">
        <div className="p-8 border-b border-slate-100">
          <h3 className="text-xl font-display font-bold text-slate-800">Is haqı tólewleri tariyxı</h3>
          <p className="text-sm text-slate-500 mt-1">Barlıq ámelge asırılǵan is haqı tólewleri</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Sáne / Waqıt</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Xızmetker</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Eskertpe</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Tólem túri</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Summa</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((pay) => (
                <tr key={pay.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-slate-600 font-medium text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {pay.date}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs flex-shrink-0">
                        {pay.employeeName.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-semibold text-slate-800">{pay.employeeName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-sm">{pay.note || '—'}</td>
                  <td className="px-6 py-4 text-center">
                    {pay.paymentMethod === 'cash' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold">
                        <Coins className="w-3.5 h-3.5" /> Naq pul
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">
                        <CreditCard className="w-3.5 h-3.5" /> Karta
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-md font-display font-black text-slate-800">{formatCurrency(pay.amount)}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => handleDeletePayment(pay.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {payments.length === 0 && (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Coins className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium">Házirshe tólewler dizimi bos</p>
            </div>
          )}
        </div>
      </div>

      {/* Employee Add/Edit Modal */}
      {showEmployeeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowEmployeeModal(false)}
          />
          <div className="relative z-10 w-full max-w-lg bg-white rounded-3xl shadow-2xl flex flex-col animate-slide-up max-h-[90vh]">
            {/* Sticky header */}
            <div className="flex items-center justify-between px-7 pt-6 pb-4 border-b border-slate-100 flex-shrink-0">
              <div>
                <h3 className="text-lg font-display font-extrabold text-slate-800">
                  {editingEmployee ? 'Xızmetkerni tahrirlew' : 'Jańa xızmetker qosıu'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Maǵlıumatlardı toltırıń hám saqlań</p>
              </div>
              <button
                onClick={() => setShowEmployeeModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto flex-1 px-7 py-5">
              <form id="emp-form" onSubmit={handleSaveEmployee} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Atı-jóni *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="Mısalı: Aliyev Baxtiyor"
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm"
                      value={empForm.fullName}
                      onChange={(e) => setEmpForm({ ...empForm, fullName: e.target.value })}
                    />
                  </div>
                </div>

                {/* Position + Status */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lawazımı</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <select
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 appearance-none transition-all cursor-pointer text-sm"
                        value={empForm.position}
                        onChange={(e) => setEmpForm({ ...empForm, position: e.target.value as Position })}
                      >
                        {POSITIONS.map(pos => (
                          <option key={pos} value={pos}>{pos}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</label>
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl h-[38px]">
                      <button
                        type="button"
                        onClick={() => setEmpForm({ ...empForm, status: 'active' })}
                        className={`flex-1 flex items-center justify-center gap-1 py-1 rounded-lg font-bold transition-all text-xs ${empForm.status === 'active' ? 'bg-white text-emerald-600 shadow' : 'text-slate-500'}`}
                      >
                        <BadgeCheck className="w-3.5 h-3.5" /> Aktiv
                      </button>
                      <button
                        type="button"
                        onClick={() => setEmpForm({ ...empForm, status: 'inactive' })}
                        className={`flex-1 flex items-center justify-center gap-1 py-1 rounded-lg font-bold transition-all text-xs ${empForm.status === 'inactive' ? 'bg-white text-slate-600 shadow' : 'text-slate-500'}`}
                      >
                        <X className="w-3.5 h-3.5" /> Emes
                      </button>
                    </div>
                  </div>
                </div>

                {/* Phone + Daily Salary */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Telefon</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        placeholder="+998 90..."
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm"
                        value={empForm.phone}
                        onChange={(e) => setEmpForm({ ...empForm, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kúnlik is haqı</label>
                    <div className="relative">
                      <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="number"
                        placeholder="0"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-semibold text-sm"
                        value={empForm.dailySalary || ''}
                        onChange={(e) => setEmpForm({ ...empForm, dailySalary: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                </div>

                {/* Start Date */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Jumısqa kirgen sáne</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="date"
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all cursor-pointer text-sm"
                      value={empForm.startDate}
                      onChange={(e) => setEmpForm({ ...empForm, startDate: e.target.value })}
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Sticky footer */}
            <div className="flex gap-3 px-7 py-4 border-t border-slate-100 flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowEmployeeModal(false)}
                className="flex-1 px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all active:scale-95 text-sm"
              >
                Biykar etiw
              </button>
              <button
                type="submit"
                form="emp-form"
                className="flex-[2] btn-primary flex items-center justify-center gap-2 text-sm"
              >
                <CheckCircle className="w-4 h-4" />
                {editingEmployee ? 'Saqlau' : 'Qosıu'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Salary Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowPaymentModal(false)}
          />
          <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl flex flex-col animate-slide-up max-h-[90vh]">
            <div className="flex items-center justify-between px-7 pt-6 pb-4 border-b border-slate-100 flex-shrink-0">
              <div>
                <h3 className="text-lg font-display font-extrabold text-slate-800">Is haqı tólew</h3>
                <p className="text-xs text-slate-400 mt-0.5">Xızmetker hám tólem muǵdarın kiritiń</p>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-7 py-5">
              <form id="pay-form" onSubmit={handleSavePayment} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Xızmetker *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select
                      required
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 appearance-none cursor-pointer transition-all text-sm"
                      value={payForm.employeeId}
                      onChange={(e) => setPayForm({ ...payForm, employeeId: e.target.value })}
                    >
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.fullName} — {emp.position}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tólem muǵdarı (swm) *</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      required
                      placeholder="0"
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-semibold text-sm"
                      value={payForm.amount || ''}
                      onChange={(e) => setPayForm({ ...payForm, amount: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tólem túri</label>
                  <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => setPayForm({ ...payForm, paymentMethod: 'cash' })}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold transition-all text-sm ${payForm.paymentMethod === 'cash' ? 'bg-white text-emerald-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      <Coins className="w-4 h-4" /> Naq pul
                    </button>
                    <button
                      type="button"
                      onClick={() => setPayForm({ ...payForm, paymentMethod: 'card' })}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-bold transition-all text-sm ${payForm.paymentMethod === 'card' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      <CreditCard className="w-4 h-4" /> Karta
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Eskertpe (ixtiyariy)</label>
                  <input
                    type="text"
                    placeholder="Mısalı: May ayı is haqısı"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm"
                    value={payForm.note}
                    onChange={(e) => setPayForm({ ...payForm, note: e.target.value })}
                  />
                </div>
              </form>
            </div>

            <div className="flex gap-3 px-7 py-4 border-t border-slate-100 flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 px-5 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all active:scale-95 text-sm"
              >
                Biykar etiw
              </button>
              <button
                type="submit"
                form="pay-form"
                className="flex-[2] flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all active:scale-95 shadow-lg shadow-emerald-500/20 text-sm"
              >
                <CheckCircle className="w-4 h-4" /> Tólendi tastıyıqlaw
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
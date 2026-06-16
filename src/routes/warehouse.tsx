import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-hot-toast'
import { 
  PackageSearch, 
  Boxes, 
  ArrowRightLeft, 
  Truck, 
  Settings2,
  Loader2,
  Building2,
  Ruler,
  Tags,
  X
} from 'lucide-react'
import { clsx } from 'clsx'

// Import all hooks
import {
  useGetWarehouseItems,
  useCreateWarehouseItem,
  usePatchWarehouseItem,
  useDeleteWarehouseItem,
  useGetWarehouseInventory,
  useGetWarehouseMovements,
  useCreateWarehouseMovement,
  useGetWarehouseSuppliers,
  useCreateWarehouseSupplier,
  usePatchWarehouseSupplier,
  useDeleteWarehouseSupplier,
  useGetWarehouseCategories,
  useCreateWarehouseCategory,
  useDeleteWarehouseCategory,
  useGetWarehouseUnits,
  useCreateWarehouseUnit,
  useDeleteWarehouseUnit,
  useGetWarehouses,
  useCreateWarehouse,
  useDeleteWarehouse
} from '@/services/warehouse'

export const Route = createFileRoute('/warehouse')({
  component: RouteComponent,
})

function RouteComponent() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<'items' | 'inventory' | 'movements' | 'suppliers' | 'settings'>('items')

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{t('warehouse.title')}</h1>
          <p className="text-slate-500 mt-1">{t('warehouse.subtitle')}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <TabButton active={activeTab === 'items'} onClick={() => setActiveTab('items')} icon={<PackageSearch className="w-4 h-4" />} label={t('warehouse.tabs.items')} />
        <TabButton active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} icon={<Boxes className="w-4 h-4" />} label={t('warehouse.tabs.inventory')} />
        <TabButton active={activeTab === 'movements'} onClick={() => setActiveTab('movements')} icon={<ArrowRightLeft className="w-4 h-4" />} label={t('warehouse.tabs.movements')} />
        <TabButton active={activeTab === 'suppliers'} onClick={() => setActiveTab('suppliers')} icon={<Truck className="w-4 h-4" />} label={t('warehouse.tabs.suppliers')} />
        <TabButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<Settings2 className="w-4 h-4" />} label={t('warehouse.tabs.settings')} />
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[400px]">
        {activeTab === 'items' && <ItemsTab />}
        {activeTab === 'inventory' && <InventoryTab />}
        {activeTab === 'movements' && <MovementsTab />}
        {activeTab === 'suppliers' && <SuppliersTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </div>
    </div>
  )
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "flex items-center gap-2 px-4 py-2.5 rounded-t-xl font-medium text-sm transition-all relative top-[3px]",
        active 
          ? "text-indigo-600 bg-white border border-slate-200 border-b-white shadow-sm" 
          : "text-slate-500 hover:text-slate-700 hover:bg-slate-50 border border-transparent"
      )}
    >
      {icon} {label}
    </button>
  )
}

// --- TABS ---

function ItemsTab() {
  const { t } = useTranslation()
  const { data, isLoading } = useGetWarehouseItems({ limit: 100 })
  const { data: suppliersData } = useGetWarehouseSuppliers({ limit: 100 })
  const { data: unitsData } = useGetWarehouseUnits({ limit: 100 })

  const createItem = useCreateWarehouseItem()
  const patchItem = usePatchWarehouseItem()
  const deleteItem = useDeleteWarehouseItem()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [errorMsg, setErrorMsg] = useState('')

  const [name, setName] = useState('')
  const [supplier, setSupplier] = useState<number | ''>('')
  const [unit, setUnit] = useState<number | ''>('')
  const [price, setPrice] = useState('')

  const items = data?.data || []
  const suppliers = suppliersData?.data || []
  const units = unitsData?.data || []

  const openCreateModal = () => {
    setEditingItem(null)
    setName('')
    setSupplier('')
    setUnit('')
    setPrice('')
    setErrorMsg('')
    setIsModalOpen(true)
  }

  const openEditModal = (item: any) => {
    setEditingItem(item)
    setName(item.name || '')
    setSupplier(item.supplier || '')
    setUnit(item.unit || '')
    setPrice(item.purchase_price || item.price || '')
    setErrorMsg('')
    setIsModalOpen(true)
  }

  const closeModal = () => setIsModalOpen(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      name,
      supplier: supplier ? Number(supplier) : null,
      unit: unit ? Number(unit) : null,
      purchase_price: price || '0'
    }

    if (editingItem) {
      patchItem.mutate(
        { id: editingItem.id, payload },
        {
          onSuccess: () => { toast.success(t('common.updated')); closeModal(); },
          onError: (err: any) => setErrorMsg(err.response?.data?.errors?.[0] || t('common.error'))
        }
      )
    } else {
      createItem.mutate(
        payload,
        {
          onSuccess: () => { toast.success(t('common.created')); closeModal(); },
          onError: (err: any) => setErrorMsg(err.response?.data?.errors?.[0] || t('common.error'))
        }
      )
    }
  }

  const handleDelete = (id: number) => {
    if (window.confirm(t('warehouse.items.modal.delete_confirm'))) {
      deleteItem.mutate(id, { onSuccess: () => toast.success(t('common.deleted')), onError: () => toast.error(t('common.error')) })
    }
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="flex flex-col h-full relative">
      <div className="p-4 border-b border-slate-200 flex justify-end">
        <button
          onClick={openCreateModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          {t('warehouse.items.new_item')}
        </button>
      </div>
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold">{t('warehouse.items.table.id')}</th>
              <th className="px-6 py-4 font-semibold">{t('warehouse.items.table.name')}</th>
              <th className="px-6 py-4 font-semibold">{t('warehouse.items.table.supplier')}</th>
              <th className="px-6 py-4 font-semibold">{t('warehouse.items.table.unit')}</th>
              <th className="px-6 py-4 font-semibold">{t('warehouse.items.table.price')}</th>
              <th className="px-6 py-4 font-semibold text-right">{t('warehouse.items.table.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item: any) => (
              <tr key={item.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 text-sm font-medium text-slate-900">#{item.id}</td>
                <td className="px-6 py-4 font-medium">{item.name || '-'}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{item.supplier_details?.name || item.supplier || '-'}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{item.unit_details?.name || item.unit || '-'}</td>
                <td className="px-6 py-4 text-sm text-slate-600 font-medium">{item.purchase_price || '-'}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => openEditModal(item)} className="text-indigo-600 hover:text-indigo-900 mx-2">{t('warehouse.items.table.edit')}</button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900">{t('warehouse.items.table.delete')}</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <EmptyState text={t('warehouse.items.not_found')} />}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex-none flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">
                {editingItem ? t('warehouse.items.modal.edit_title') : t('warehouse.items.modal.new_title')}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                &times;
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">{errorMsg}</div>}
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('warehouse.items.modal.name')}</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('warehouse.items.modal.supplier')}</label>
                  <select
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="">{t('warehouse.items.modal.not_selected')}</option>
                    {suppliers.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('warehouse.items.modal.unit')}</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="">{t('warehouse.items.modal.not_selected')}</option>
                    {units.map((u: any) => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('warehouse.items.modal.price')}</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={closeModal} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors">{t('warehouse.items.modal.cancel')}</button>
                  <button type="submit" disabled={createItem.isPending || patchItem.isPending} className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                    {(createItem.isPending || patchItem.isPending) && <Loader2 className="w-4 h-4 animate-spin" />} {t('warehouse.items.modal.save')}
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

function InventoryTab() {
  const { t } = useTranslation()
  const { data, isLoading } = useGetWarehouseInventory({ limit: 100 })
  const inventory = data?.data || []

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 font-semibold">{t('warehouse.inventory.table.id')}</th>
            <th className="px-6 py-4 font-semibold">{t('warehouse.inventory.table.item')}</th>
            <th className="px-6 py-4 font-semibold">{t('warehouse.inventory.table.warehouse')}</th>
            <th className="px-6 py-4 font-semibold">{t('warehouse.inventory.table.quantity')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {inventory.map((inv: any) => (
            <tr key={inv.id} className="hover:bg-slate-50/50">
              <td className="px-6 py-4 text-sm font-medium text-slate-900">#{inv.id}</td>
              <td className="px-6 py-4 font-medium text-slate-950">
                {inv.item_details?.name || `Item ID: ${inv.item}`}
              </td>
              <td className="px-6 py-4 text-sm text-slate-600">
                {inv.warehouse_details?.name || `Warehouse ID: ${inv.warehouse}`}
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex px-2.5 py-1 rounded-md text-sm font-bold bg-green-50 text-green-700 border border-green-100">
                  {inv.quantity}
                </span>
              </td>
            </tr>
          ))}
          {inventory.length === 0 && <EmptyState text={t('warehouse.inventory.not_found')} />}
        </tbody>
      </table>
    </div>
  )
}

function MovementsTab() {
  const { t } = useTranslation()
  const { data, isLoading } = useGetWarehouseMovements({ limit: 100 })
  const { data: itemsData } = useGetWarehouseItems({ limit: 100 })
  const { data: warehousesData } = useGetWarehouses({ limit: 100 })

  const createMovement = useCreateWarehouseMovement()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const [item, setItem] = useState<number | ''>('')
  const [quantity, setQuantity] = useState('')
  const [type, setType] = useState('in')
  const [warehouse, setWarehouse] = useState<number | ''>('')
  const [destinationWarehouse, setDestinationWarehouse] = useState<number | ''>('')

  const movements = data?.data || []
  const items = itemsData?.data || []
  const warehouses = warehousesData?.data || []

  const openCreateModal = () => {
    setItem('')
    setQuantity('')
    setType('in')
    setWarehouse('')
    setDestinationWarehouse('')
    setErrorMsg('')
    setIsModalOpen(true)
  }

  const closeModal = () => setIsModalOpen(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      item: item ? Number(item) : null,
      quantity: quantity || '1',
      movement_type: type,
      warehouse: warehouse ? Number(warehouse) : null,
      destination_warehouse: type === 'transfer' && destinationWarehouse ? Number(destinationWarehouse) : null,
    }

    createMovement.mutate(
      payload,
      {
        onSuccess: () => { toast.success(t('common.created')); closeModal(); },
        onError: (err: any) => setErrorMsg(err.response?.data?.errors?.[0] || t('common.error'))
      }
    )
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="flex flex-col h-full relative">
      <div className="p-4 border-b border-slate-200 flex justify-end">
        <button
          onClick={openCreateModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          {t('warehouse.movements.new_movement')}
        </button>
      </div>
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold">{t('warehouse.movements.table.id')}</th>
              <th className="px-6 py-4 font-semibold">{t('warehouse.movements.table.item')}</th>
              <th className="px-6 py-4 font-semibold">{t('warehouse.movements.table.quantity')}</th>
              <th className="px-6 py-4 font-semibold">{t('warehouse.movements.table.type')}</th>
              <th className="px-6 py-4 font-semibold">{t('warehouse.movements.table.warehouse')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {movements.map((m: any) => (
              <tr key={m.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 text-sm font-medium text-slate-900">#{m.id}</td>
                <td className="px-6 py-4 text-sm text-slate-700 font-medium">
                  {m.item_details?.name || `Item ID: ${m.item}`}
                </td>
                <td className="px-6 py-4 text-sm font-bold">{m.quantity}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={clsx(
                    "inline-flex px-2.5 py-1 rounded-md text-xs font-semibold",
                    m.movement_type === 'in' && "bg-green-50 text-green-700 border border-green-100",
                    m.movement_type === 'out' && "bg-red-50 text-red-700 border border-red-100",
                    m.movement_type === 'transfer' && "bg-blue-50 text-blue-700 border border-blue-100"
                  )}>
                    {m.movement_type === 'in' && t('warehouse.movements.modal.type_in')}
                    {m.movement_type === 'out' && t('warehouse.movements.modal.type_out')}
                    {m.movement_type === 'transfer' && t('warehouse.movements.modal.type_transfer')}
                    {!['in', 'out', 'transfer'].includes(m.movement_type || '') && (m.movement_type || m.type || '-')}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  {m.movement_type === 'transfer' ? (
                    <div className="flex items-center gap-1.5">
                      <span>{m.warehouse_details?.name || `W: ${m.warehouse}`}</span>
                      <span className="text-slate-400">→</span>
                      <span className="font-semibold text-slate-700">
                        {m.destination_warehouse_details?.name || `W: ${m.destination_warehouse}`}
                      </span>
                    </div>
                  ) : (
                    m.warehouse_details?.name || `W: ${m.warehouse}`
                  )}
                </td>
              </tr>
            ))}
            {movements.length === 0 && <EmptyState text={t('warehouse.movements.not_found')} />}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex-none flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">{t('warehouse.movements.modal.title')}</h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">&times;</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">{errorMsg}</div>}
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('warehouse.movements.modal.item')}</label>
                  <select
                    value={item}
                    onChange={(e) => setItem(e.target.value === '' ? '' : Number(e.target.value))}
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="">{t('warehouse.movements.modal.select_item')}</option>
                    {items.map((i: any) => <option key={i.id} value={i.id}>{i.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('warehouse.movements.modal.quantity')}</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('warehouse.movements.modal.type')}</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="in">{t('warehouse.movements.modal.type_in')}</option>
                    <option value="out">{t('warehouse.movements.modal.type_out')}</option>
                    <option value="transfer">{t('warehouse.movements.modal.type_transfer')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('warehouse.movements.modal.warehouse')}</label>
                  <select
                    value={warehouse}
                    onChange={(e) => setWarehouse(e.target.value === '' ? '' : Number(e.target.value))}
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="">{t('warehouse.movements.modal.select_warehouse')}</option>
                    {warehouses.map((w: any) => <option key={w.id} value={w.id}>{w.name}</option>)}
                  </select>
                </div>

                {type === 'transfer' && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('warehouse.movements.modal.destination_warehouse')}</label>
                    <select
                      value={destinationWarehouse}
                      onChange={(e) => setDestinationWarehouse(e.target.value === '' ? '' : Number(e.target.value))}
                      required
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="">{t('warehouse.movements.modal.select_destination_warehouse')}</option>
                      {warehouses
                        .filter((w: any) => w.id !== Number(warehouse))
                        .map((w: any) => <option key={w.id} value={w.id}>{w.name}</option>)}
                    </select>
                  </div>
                )}

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={closeModal} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors">{t('warehouse.items.modal.cancel')}</button>
                  <button type="submit" disabled={createMovement.isPending} className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                    {createMovement.isPending && <Loader2 className="w-4 h-4 animate-spin" />} {t('warehouse.items.modal.save')}
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

function SuppliersTab() {
  const { t } = useTranslation()
  const { data, isLoading } = useGetWarehouseSuppliers({ limit: 100 })
  const createSupplier = useCreateWarehouseSupplier()
  const patchSupplier = usePatchWarehouseSupplier()
  const deleteSupplier = useDeleteWarehouseSupplier()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<any>(null)
  const [errorMsg, setErrorMsg] = useState('')

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')

  const suppliers = data?.data || []

  const openCreateModal = () => {
    setEditingSupplier(null)
    setName('')
    setPhone('')
    setAddress('')
    setErrorMsg('')
    setIsModalOpen(true)
  }

  const openEditModal = (supplier: any) => {
    setEditingSupplier(supplier)
    setName(supplier.name || '')
    setPhone(supplier.phone || '')
    setAddress(supplier.address || '')
    setErrorMsg('')
    setIsModalOpen(true)
  }

  const closeModal = () => setIsModalOpen(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = { name, phone, address }

    if (editingSupplier) {
      patchSupplier.mutate(
        { id: editingSupplier.id, payload },
        {
          onSuccess: () => { toast.success(t('common.updated')); closeModal(); },
          onError: (err: any) => setErrorMsg(err.response?.data?.errors?.[0] || t('common.error'))
        }
      )
    } else {
      createSupplier.mutate(
        payload,
        {
          onSuccess: () => { toast.success(t('common.created')); closeModal(); },
          onError: (err: any) => setErrorMsg(err.response?.data?.errors?.[0] || t('common.error'))
        }
      )
    }
  }

  const handleDelete = (id: number) => {
    if (window.confirm(t('warehouse.suppliers.modal.delete_confirm'))) {
      deleteSupplier.mutate(id, { onSuccess: () => toast.success(t('common.deleted')), onError: () => toast.error(t('common.error')) })
    }
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="flex flex-col h-full relative">
      <div className="p-4 border-b border-slate-200 flex justify-end">
        <button
          onClick={openCreateModal}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          {t('warehouse.suppliers.new_supplier')}
        </button>
      </div>
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-sm border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold">{t('warehouse.suppliers.table.id')}</th>
              <th className="px-6 py-4 font-semibold">{t('warehouse.suppliers.table.name')}</th>
              <th className="px-6 py-4 font-semibold">{t('warehouse.suppliers.table.phone')}</th>
              <th className="px-6 py-4 font-semibold">{t('warehouse.suppliers.table.address')}</th>
              <th className="px-6 py-4 font-semibold text-right">{t('warehouse.suppliers.table.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {suppliers.map((s: any) => (
              <tr key={s.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4 text-sm font-medium text-slate-900">#{s.id}</td>
                <td className="px-6 py-4 font-medium">{s.name || '-'}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{s.phone || '-'}</td>
                <td className="px-6 py-4 text-sm text-slate-600">{s.address || '-'}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => openEditModal(s)} className="text-indigo-600 hover:text-indigo-900 mx-2">{t('warehouse.suppliers.table.edit')}</button>
                  <button onClick={() => handleDelete(s.id)} className="text-red-600 hover:text-red-900">{t('warehouse.suppliers.table.delete')}</button>
                </td>
              </tr>
            ))}
            {suppliers.length === 0 && <EmptyState text={t('warehouse.suppliers.not_found')} />}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex-none flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">
                {editingSupplier ? t('warehouse.suppliers.modal.edit_title') : t('warehouse.suppliers.modal.new_title')}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                &times;
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">{errorMsg}</div>}
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('warehouse.suppliers.modal.name')}</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('warehouse.suppliers.modal.phone')}</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('warehouse.suppliers.modal.address')}</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={closeModal} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors">{t('warehouse.items.modal.cancel')}</button>
                  <button type="submit" disabled={createSupplier.isPending || patchSupplier.isPending} className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                    {(createSupplier.isPending || patchSupplier.isPending) && <Loader2 className="w-4 h-4 animate-spin" />} {t('warehouse.items.modal.save')}
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

function SettingsTab() {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col md:flex-row min-h-[400px]">
      <div className="flex-1 border-r border-slate-200">
        <SettingsSubSection title={t('warehouse.settings.categories')} icon={<Tags className="w-5 h-5" />} component={<CategoriesList />} />
      </div>
      <div className="flex-1 border-r border-slate-200">
        <SettingsSubSection title={t('warehouse.settings.units')} icon={<Ruler className="w-5 h-5" />} component={<UnitsList />} />
      </div>
      <div className="flex-1">
        <SettingsSubSection title={t('warehouse.settings.warehouses')} icon={<Building2 className="w-5 h-5" />} component={<WarehousesList />} />
      </div>
    </div>
  )
}

function SettingsSubSection({ title, icon, component }: { title: string, icon: React.ReactNode, component: React.ReactNode }) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2 font-bold text-slate-700">
        {icon} {title}
      </div>
      <div className="flex-1 p-4 overflow-y-auto">
        {component}
      </div>
    </div>
  )
}

function CategoriesList() {
  const { t } = useTranslation()
  const { data, isLoading } = useGetWarehouseCategories({ limit: 100 })
  const createCategory = useCreateWarehouseCategory()
  const deleteCategory = useDeleteWarehouseCategory()

  const [isModalOpen, setIsModalOpen] = useState(false)

  if (isLoading) return <LoadingSpinner small />
  const list = data?.data || []

  const handleSubmit = (values: Record<string, string>) => {
    if (values.name) {
      createCategory.mutate({ name: values.name }, {
        onSuccess: () => { toast.success(t('common.created')); setIsModalOpen(false); },
        onError: () => toast.error(t('common.error'))
      })
    }
  }

  return (
    <div className="flex flex-col h-full">
      <ul className="space-y-2 flex-1">
        {list.map((c: any) => (
          <li key={c.id} className="p-3 bg-white border border-slate-100 rounded-lg text-sm font-medium shadow-sm flex justify-between items-center group">
            {c.name}
            <button onClick={() => deleteCategory.mutate(c.id)} className="text-red-500 opacity-0 group-hover:opacity-100 text-xs hover:text-red-700">{t('warehouse.settings.delete')}</button>
          </li>
        ))}
        {list.length === 0 && <li className="text-sm text-slate-400">{t('warehouse.settings.empty')}</li>}
      </ul>
      <button onClick={() => setIsModalOpen(true)} disabled={createCategory.isPending} className="mt-4 w-full py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100">
        {t('warehouse.settings.add')}
      </button>

      <PromptModal
        isOpen={isModalOpen}
        title={t('warehouse.settings.add')}
        fields={[{ name: 'name', label: t('warehouse.settings.prompts.category_name'), required: true }]}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        isPending={createCategory.isPending}
      />
    </div>
  )
}

function UnitsList() {
  const { t } = useTranslation()
  const { data, isLoading } = useGetWarehouseUnits({ limit: 100 })
  const createUnit = useCreateWarehouseUnit()
  const deleteUnit = useDeleteWarehouseUnit()

  const [isModalOpen, setIsModalOpen] = useState(false)

  if (isLoading) return <LoadingSpinner small />
  const list = data?.data || []

  const handleSubmit = (values: Record<string, string>) => {
    if (values.name && values.abbreviation) {
      createUnit.mutate({ name: values.name, abbreviation: values.abbreviation }, {
        onSuccess: () => { toast.success(t('common.created')); setIsModalOpen(false); },
        onError: () => toast.error(t('common.error'))
      })
    }
  }

  return (
    <div className="flex flex-col h-full">
      <ul className="space-y-2 flex-1">
        {list.map((u: any) => (
          <li key={u.id} className="p-3 bg-white border border-slate-100 rounded-lg text-sm shadow-sm flex justify-between items-center group">
            <span><span className="font-bold">{u.name}</span> <span className="text-slate-400 text-xs ml-2">({u.abbreviation || u.code})</span></span>
            <button onClick={() => deleteUnit.mutate(u.id)} className="text-red-500 opacity-0 group-hover:opacity-100 text-xs hover:text-red-700">{t('warehouse.settings.delete')}</button>
          </li>
        ))}
        {list.length === 0 && <li className="text-sm text-slate-400">{t('warehouse.settings.empty')}</li>}
      </ul>
      <button onClick={() => setIsModalOpen(true)} disabled={createUnit.isPending} className="mt-4 w-full py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100">
        {t('warehouse.settings.add')}
      </button>

      <PromptModal
        isOpen={isModalOpen}
        title={t('warehouse.settings.add')}
        fields={[
          { name: 'name', label: t('warehouse.settings.prompts.unit_name'), required: true },
          { name: 'abbreviation', label: t('warehouse.settings.prompts.unit_abbr'), required: true }
        ]}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        isPending={createUnit.isPending}
      />
    </div>
  )
}

function WarehousesList() {
  const { t } = useTranslation()
  const { data, isLoading } = useGetWarehouses({ limit: 100 })
  const createWarehouse = useCreateWarehouse()
  const deleteWarehouse = useDeleteWarehouse()

  const [isModalOpen, setIsModalOpen] = useState(false)

  if (isLoading) return <LoadingSpinner small />
  const list = data?.data || []

  const handleSubmit = (values: Record<string, string>) => {
    if (values.name) {
      createWarehouse.mutate({ name: values.name, location: values.location || '' }, {
        onSuccess: () => { toast.success(t('common.created')); setIsModalOpen(false); },
        onError: () => toast.error(t('common.error'))
      })
    }
  }

  return (
    <div className="flex flex-col h-full">
      <ul className="space-y-2 flex-1">
        {list.map((w: any) => (
          <li key={w.id} className="p-3 bg-white border border-slate-100 rounded-lg text-sm shadow-sm flex justify-between items-start group">
            <div>
              <div className="font-bold">{w.name}</div>
              <div className="text-xs text-slate-500 mt-1">{w.location}</div>
            </div>
            <button onClick={() => deleteWarehouse.mutate(w.id)} className="text-red-500 opacity-0 group-hover:opacity-100 text-xs hover:text-red-700 mt-1">{t('warehouse.settings.delete')}</button>
          </li>
        ))}
        {list.length === 0 && <li className="text-sm text-slate-400">{t('warehouse.settings.empty')}</li>}
      </ul>
      <button onClick={() => setIsModalOpen(true)} disabled={createWarehouse.isPending} className="mt-4 w-full py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-100">
        {t('warehouse.settings.add')}
      </button>

      <PromptModal
        isOpen={isModalOpen}
        title={t('warehouse.settings.add')}
        fields={[
          { name: 'name', label: t('warehouse.settings.prompts.warehouse_name'), required: true },
          { name: 'location', label: t('warehouse.settings.prompts.warehouse_loc'), required: false }
        ]}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        isPending={createWarehouse.isPending}
      />
    </div>
  )
}

// --- Utility Components ---

function PromptModal({
  isOpen,
  title,
  fields,
  onClose,
  onSubmit,
  isPending
}: {
  isOpen: boolean,
  title: string,
  fields: { name: string, label: string, required?: boolean, type?: string }[],
  onClose: () => void,
  onSubmit: (values: Record<string, string>) => void,
  isPending?: boolean
}) {
  const { t } = useTranslation()
  const [values, setValues] = useState<Record<string, string>>({})

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(values)
  }

  const handleClose = () => {
    setValues({})
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex-none flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">{title}</h2>
          <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {fields.map(f => (
            <div key={f.name}>
              <label className="block text-sm font-medium text-slate-700 mb-1">{f.label}</label>
              <input
                type={f.type || "text"}
                required={f.required}
                value={values[f.name] || ''}
                onChange={e => setValues({...values, [f.name]: e.target.value})}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
              />
            </div>
          ))}
          <div className="pt-2 flex gap-3">
            <button type="button" onClick={handleClose} className="flex-1 px-4 py-2 border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors">
              {t('warehouse.items.modal.cancel')}
            </button>
            <button type="submit" disabled={isPending} className="flex-1 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
              {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />} {t('warehouse.items.modal.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function LoadingSpinner({ small }: { small?: boolean }) {
  return (
    <div className={`flex justify-center items-center ${small ? 'p-4' : 'h-64'}`}>
      <Loader2 className={`animate-spin text-indigo-500 ${small ? 'w-5 h-5' : 'w-8 h-8'}`} />
    </div>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <tr>
      <td colSpan={10} className="px-6 py-12 text-center text-slate-500">
        {text}
      </td>
    </tr>
  )
}
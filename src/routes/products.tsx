import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-hot-toast'
import { 
  useGetProducts, 
  useCreateProduct, 
  usePatchProduct, 
  useDeleteProduct 
} from '@/services/orders'
import type { IProduct } from '@/services/orders'
import { PackageSearch, Plus, Edit2, Trash2, Loader2, X, Image as ImageIcon } from 'lucide-react'

export const Route = createFileRoute('/products')({
  component: ProductsPage,
})

function ProductsPage() {
  const { t } = useTranslation()
  const { data, isLoading } = useGetProducts({ limit: 100 })
  const createProduct = useCreateProduct()
  const patchProduct = usePatchProduct()
  const deleteProduct = useDeleteProduct()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null)
  
  // Form state
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [image, setImage] = useState<File | string>('')
  const [isActive, setIsActive] = useState(true)

  const openCreateModal = () => {
    setEditingProduct(null)
    setName('')
    setDescription('')
    setPrice('')
    setImage('')
    setIsActive(true)
    setIsModalOpen(true)
  }

  const openEditModal = (product: IProduct) => {
    setEditingProduct(product)
    setName(product.name)
    setDescription(product.description || '')
    setPrice(product.price)
    setImage(product.image || '')
    setIsActive(product.is_active)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const payload: any = {
      name,
      description: description || null,
      price,
      image: image || null,
      is_active: isActive
    }

    if (editingProduct) {
      patchProduct.mutate(
        { id: editingProduct.id, payload },
        { 
          onSuccess: () => { toast.success(t('common.updated')); closeModal(); },
          onError: () => toast.error(t('common.error'))
        }
      )
    } else {
      createProduct.mutate(
        payload,
        { 
          onSuccess: () => { toast.success(t('common.created')); closeModal(); },
          onError: () => toast.error(t('common.error'))
        }
      )
    }
  }

  const handleDelete = (id: number) => {
    if (window.confirm(t('products.modal.delete_confirm'))) {
      deleteProduct.mutate(id, {
        onSuccess: () => toast.success(t('common.deleted')),
        onError: () => toast.error(t('common.error'))
      })
    }
  }

  const products = data?.data || []

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-100 p-2 rounded-xl">
            <PackageSearch className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{t('products.title')}</h2>
            <p className="text-sm text-slate-500 mt-1">{t('products.subtitle')}</p>
          </div>
        </div>
        <button onClick={openCreateModal} className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-5 rounded-xl transition-colors shadow-sm">
          <Plus className="w-5 h-5" /> {t('products.add_product')}
        </button>
      </div>

      <div className="p-6 overflow-x-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200">
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">{t('products.table.id')}</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">{t('products.table.photo')}</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">{t('products.table.name')}</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">{t('products.table.price')}</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">{t('products.table.status')}</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">{t('products.table.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    {t('products.table.not_found')}
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-slate-900">#{product.id}</td>
                    <td className="px-6 py-4">
                      {product.image ? (
                        <img src={typeof product.image === 'string' ? product.image : ''} alt={product.name} className="w-12 h-12 object-cover rounded-lg border border-slate-200" />
                      ) : (
                        <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200 text-slate-400">
                          <ImageIcon className="w-5 h-5" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700 font-medium">{product.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{product.price}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${product.is_active ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
                        {product.is_active ? t('products.status.active') : t('products.status.inactive')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEditModal(product)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
                {editingProduct ? t('products.modal.edit_title') : t('products.modal.new_title')}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-1.5 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('products.modal.name_label')} *</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder={t('products.modal.name_placeholder')} className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('products.modal.desc_label')}</label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder={t('products.modal.desc_placeholder')} className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('products.modal.price_label')} *</label>
                  <input type="number" value={price} onChange={e => setPrice(e.target.value)} required min="0" step="0.01" placeholder={t('products.modal.price_placeholder')} className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" />
                </div>

                <div className="flex items-center gap-2 mt-4 pt-2">
                  <input type="checkbox" id="isActive" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" />
                  <label htmlFor="isActive" className="text-sm font-medium text-slate-700 cursor-pointer">
                    {t('products.modal.is_active_label')}
                  </label>
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={closeModal} className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors">{t('products.modal.cancel')}</button>
                  <button type="submit" disabled={createProduct.isPending || patchProduct.isPending} className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70">
                    {(createProduct.isPending || patchProduct.isPending) && <Loader2 className="w-4 h-4 animate-spin" />} {t('products.modal.save')}
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
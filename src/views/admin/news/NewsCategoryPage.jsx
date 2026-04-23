import { Layout, LayoutBody } from '@/components/custom/Layout'
import { useDispatch, useSelector } from 'react-redux'
import { getNewsCategories, createNewsCategory, updateNewsCategory, deleteNewsCategory } from '@/stores/NewsSlice'
import { useEffect, useState } from 'react'
import { Button } from '@/components/custom/Button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Plus, Pencil, Trash2, Search, FolderOpen, Tag,
  Hash, AlignLeft, RotateCcw, ChevronRight,
} from 'lucide-react'

/* ── Form Dialog (Create / Edit) ───────────────────────── */
function CategoryFormDialog({ open, onOpenChange, category, onSubmit, loading }) {
  const [form, setForm] = useState({ categoryName: '', slug: '', description: '' })

  useEffect(() => {
    if (category) {
      setForm({
        categoryName: category.categoryName || '',
        slug: category.slug || '',
        description: category.description || '',
      })
    } else {
      setForm({ categoryName: '', slug: '', description: '' })
    }
  }, [category, open])

  const autoSlug = (name) => name
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()

  const handleName = (val) => {
    setForm(f => ({
      ...f,
      categoryName: val,
      slug: category ? f.slug : autoSlug(val),
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Tag size={18} className="text-blue-500" />
            {category ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
          </DialogTitle>
          <DialogDescription>
            {category ? 'Cập nhật thông tin danh mục bài viết' : 'Tạo danh mục mới để phân loại bài viết'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label htmlFor="cat-name">Tên danh mục <span className="text-red-500">*</span></Label>
            <Input
              id="cat-name"
              value={form.categoryName}
              onChange={e => handleName(e.target.value)}
              placeholder="Ví dụ: Tin tức, Sản phẩm, Khuyến mãi..."
              required
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cat-slug" className="flex items-center gap-1">
              <Hash size={13} /> Slug (URL)
            </Label>
            <Input
              id="cat-slug"
              value={form.slug}
              onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
              placeholder="tin-tuc"
            />
            <p className="text-xs text-muted-foreground">Dùng để tạo URL thân thiện. Tự động sinh từ tên.</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cat-desc" className="flex items-center gap-1">
              <AlignLeft size={13} /> Mô tả
            </Label>
            <Textarea
              id="cat-desc"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Mô tả ngắn về danh mục..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
            <Button type="submit" disabled={loading || !form.categoryName.trim()}>
              {loading ? 'Đang lưu...' : category ? 'Cập nhật' : 'Tạo danh mục'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

/* ── Category Card ─────────────────────────────────────── */
function CategoryCard({ category, onEdit, onDelete }) {
  return (
    <div className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 hover:-translate-y-0.5">
      {/* Color stripe */}
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-gradient-to-b from-blue-500 to-indigo-600" />

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center border border-blue-200 dark:border-blue-800">
            <FolderOpen size={18} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate text-sm">
              {category.categoryName}
            </h3>
            {category.slug && (
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                <Hash size={10} />
                <span className="font-mono truncate">{category.slug}</span>
              </p>
            )}
          </div>
        </div>

        {/* Actions - visible on hover */}
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            type="button"
            onClick={() => onEdit(category)}
            className="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
            title="Chỉnh sửa"
          >
            <Pencil size={14} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(category)}
            className="p-1.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
            title="Xóa"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {category.description && (
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
          {category.description}
        </p>
      )}

      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
        <Badge variant="secondary" className="text-xs px-2 py-0.5 font-normal">
          {category._count?.news ?? category.newsCount ?? 0} bài viết
        </Badge>
        <button
          type="button"
          onClick={() => onEdit(category)}
          className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Sửa <ChevronRight size={12} />
        </button>
      </div>
    </div>
  )
}

/* ── Main Page ─────────────────────────────────────────── */
export default function NewsCategoryPage() {
  const dispatch = useDispatch()
  const categories = useSelector(s => s.news.categories)
  const categoriesLoading = useSelector(s => s.news.categoriesLoading)

  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    document.title = 'Danh mục bài viết'
    dispatch(getNewsCategories())
  }, [dispatch])

  const filtered = (categories || []).filter(c =>
    c.categoryName?.toLowerCase().includes(search.toLowerCase()) ||
    c.slug?.toLowerCase().includes(search.toLowerCase())
  )

  const handleCreate = () => {
    setEditTarget(null)
    setFormOpen(true)
  }

  const handleEdit = (cat) => {
    setEditTarget(cat)
    setFormOpen(true)
  }

  const handleSubmit = async (form) => {
    setSubmitting(true)
    try {
      if (editTarget) {
        await dispatch(updateNewsCategory({ id: editTarget.id, data: form })).unwrap()
      } else {
        await dispatch(createNewsCategory(form)).unwrap()
      }
      setFormOpen(false)
    } catch (_) {
      // toast already shown in slice
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await dispatch(deleteNewsCategory(deleteTarget.id)).unwrap()
    } finally {
      setDeleteTarget(null)
    }
  }

  return (
    <Layout>
      <LayoutBody className="flex flex-col">
        {/* ── Header ── */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-2 sm:px-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
              <FolderOpen className="text-blue-500" size={24} />
              Danh mục bài viết
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Quản lý {categories?.length ?? 0} danh mục để phân loại bài viết
            </p>
          </div>
          <Button onClick={handleCreate} className="flex items-center gap-2 shrink-0">
            <Plus size={16} />
            Thêm danh mục
          </Button>
        </div>

        {/* ── Search bar ── */}
        <div className="relative mb-6 max-w-sm px-2 sm:px-0">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm danh mục..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 pr-9"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <RotateCcw size={13} />
            </button>
          )}
        </div>

        {/* ── Grid ── */}
        <div className="flex-1 px-2 sm:px-0">
          {categoriesLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-32 rounded-xl" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center mb-4 border border-blue-200 dark:border-blue-800">
                <FolderOpen size={28} className="text-blue-400" />
              </div>
              <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300 mb-1">
                {search ? 'Không tìm thấy danh mục' : 'Chưa có danh mục nào'}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {search ? `Không có kết quả cho "${search}"` : 'Tạo danh mục đầu tiên để phân loại bài viết'}
              </p>
              {!search && (
                <Button onClick={handleCreate} size="sm" variant="outline">
                  <Plus size={14} className="mr-1" /> Tạo danh mục
                </Button>
              )}
            </div>
          ) : (
            <>
              <p className="text-xs text-muted-foreground mb-3">
                Hiển thị {filtered.length} / {categories?.length ?? 0} danh mục
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map(cat => (
                  <CategoryCard
                    key={cat.id}
                    category={cat}
                    onEdit={handleEdit}
                    onDelete={setDeleteTarget}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </LayoutBody>

      {/* ── Form Dialog ── */}
      <CategoryFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        category={editTarget}
        onSubmit={handleSubmit}
        loading={submitting}
      />

      {/* ── Delete Confirm ── */}
      <AlertDialog open={!!deleteTarget} onOpenChange={v => !v && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 size={18} /> Xóa danh mục?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc muốn xóa danh mục{' '}
              <strong className="text-foreground">"{deleteTarget?.categoryName}"</strong>?
              Hành động này không thể hoàn tác. Các bài viết thuộc danh mục này sẽ không còn danh mục.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Xóa danh mục
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  )
}

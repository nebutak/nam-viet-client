import { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createNews, uploadNewsThumbnail } from '@/stores/NewsSlice'
import { Button } from '@/components/custom/Button'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Plus, Upload, X, ImageIcon } from 'lucide-react'
import RichTextEditor from '@/components/custom/RichTextEditor'

export default function CreateNewsDialog() {
  const dispatch = useDispatch()
  const categories = useSelector((state) => state.news.categories)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    contentType: 'article',
    featuredImage: '',
    categoryId: '',
    status: 'draft',
    isFeatured: false,
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
  })

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Auto-generate slug from title
    if (field === 'title' && !formData.slug) {
      const slug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      setFormData((prev) => ({ ...prev, slug }))
    }
  }

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview ngay lập tức
    const objectUrl = URL.createObjectURL(file)
    setImagePreview(objectUrl)

    // Upload lên server
    setImageUploading(true)
    try {
      const url = await dispatch(uploadNewsThumbnail(file)).unwrap()
      handleChange('featuredImage', url)
    } catch {
      setImagePreview(null)
    } finally {
      setImageUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    handleChange('featuredImage', '')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Frontend validation
    if (!formData.categoryId) {
      toast.error('Vui lòng chọn danh mục bài viết')
      return
    }
    if (!formData.featuredImage) {
      toast.error('Vui lòng chọn ảnh đại diện cho bài viết')
      return
    }
    if (!formData.content || formData.content === '<p></p>' || formData.content.trim() === '') {
      toast.error('Vui lòng nhập nội dung bài viết')
      return
    }

    setLoading(true)
    try {
      await dispatch(createNews({
        ...formData,
        categoryId: parseInt(formData.categoryId, 10),
      })).unwrap()

      setOpen(false)
      setImagePreview(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      setFormData({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        contentType: 'article',
        featuredImage: '',
        categoryId: '',
        status: 'draft',
        isFeatured: false,
        metaTitle: '',
        metaDescription: '',
        metaKeywords: '',
      })
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-8">
          <Plus className="mr-2 h-4 w-4" />
          Tạo bài viết
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo bài viết mới</DialogTitle>
          <DialogDescription>
            Điền thông tin để tạo bài viết mới
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Tiêu đề *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Nhập tiêu đề bài viết"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                placeholder="slug-bai-viet"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="categoryId">Danh mục *</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => handleChange('categoryId', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.categoryName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="contentType">Loại nội dung</Label>
                <Select
                  value={formData.contentType}
                  onValueChange={(value) => handleChange('contentType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="article">Bài viết</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="excerpt">Mô tả ngắn</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => handleChange('excerpt', e.target.value)}
                placeholder="Mô tả ngắn về bài viết"
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label>Nội dung *</Label>
              <RichTextEditor
                value={formData.content}
                onChange={(html) => handleChange('content', html)}
                placeholder="Nhập nội dung bài viết..."
                minHeight={420}
              />
            </div>

            <div className="grid gap-2">
              <Label>Ảnh đại diện *</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                onChange={handleImageFileChange}
              />

              {imagePreview || formData.featuredImage ? (
                <div className="relative group w-full h-48 rounded-lg overflow-hidden border bg-muted">
                  <img
                    src={imagePreview || formData.featuredImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  {imageUploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-white text-sm flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Đang tải lên...
                      </div>
                    </div>
                  )}
                  {!imageUploading && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="w-4 h-4 mr-1" /> Đổi ảnh
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={handleRemoveImage}
                      >
                        <X className="w-4 h-4 mr-1" /> Xóa
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-48 rounded-lg border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors cursor-pointer bg-muted/30 hover:bg-primary/5"
                >
                  <ImageIcon className="w-10 h-10" />
                  <span className="text-sm font-medium">Chọn ảnh từ máy tính</span>
                  <span className="text-xs">JPG, PNG, WebP · Tối đa 5MB</span>
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isFeatured"
                checked={formData.isFeatured}
                onCheckedChange={(checked) => handleChange('isFeatured', checked)}
              />
              <Label htmlFor="isFeatured">Bài viết nổi bật</Label>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Nháp</SelectItem>
                  <SelectItem value="published">Xuất bản</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* SEO Fields */}
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium mb-3">Tối ưu SEO</h3>

              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    value={formData.metaTitle}
                    onChange={(e) => handleChange('metaTitle', e.target.value)}
                    placeholder="Tiêu đề SEO"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    value={formData.metaDescription}
                    onChange={(e) => handleChange('metaDescription', e.target.value)}
                    placeholder="Mô tả SEO"
                    rows={2}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="metaKeywords">Meta Keywords</Label>
                  <Input
                    id="metaKeywords"
                    value={formData.metaKeywords}
                    onChange={(e) => handleChange('metaKeywords', e.target.value)}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Đang tạo...' : 'Tạo bài viết'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

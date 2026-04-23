import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createNews, uploadNewsImage } from '@/stores/NewsSlice'
import { Button } from '@/components/custom/Button'
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
import { ImageIcon, Plus } from 'lucide-react'
import RichTextEditor from '@/components/custom/RichTextEditor'

export default function CreateNewsDialog() {
  const dispatch = useDispatch()
  const categories = useSelector((state) => state.news.categories)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState('')

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

  const resetForm = () => {
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
    setSelectedImage(null)
    setImagePreview('')
  }

  const handleOpenChange = (nextOpen) => {
    setOpen(nextOpen)
    if (!nextOpen) {
      resetForm()
    }
  }

  const handleImageChange = (event) => {
    const file = event.target.files?.[0] || null
    setSelectedImage(file)
  }

  useEffect(() => {
    if (!selectedImage) {
      setImagePreview('')
      return
    }

    const previewUrl = URL.createObjectURL(selectedImage)
    setImagePreview(previewUrl)

    return () => URL.revokeObjectURL(previewUrl)
  }, [selectedImage])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const featuredImage = selectedImage
        ? await dispatch(uploadNewsImage(selectedImage)).unwrap()
        : formData.featuredImage

      await dispatch(createNews({
        ...formData,
        featuredImage,
        categoryId: parseInt(formData.categoryId),
      })).unwrap()

      handleOpenChange(false)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
              <Label htmlFor="featuredImage">Ảnh đại diện *</Label>
              <Input
                id="featuredImage"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageChange}
                required
              />
              {imagePreview && (
                <div className="mt-2 flex items-center gap-3 rounded-md border p-3">
                  <div className="h-20 w-28 overflow-hidden rounded border bg-muted">
                    <img
                      src={imagePreview}
                      alt="Ảnh đại diện xem trước"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 text-sm">
                    <div className="flex items-center gap-2 font-medium">
                      <ImageIcon className="h-4 w-4" />
                      <span className="truncate">{selectedImage?.name}</span>
                    </div>
                    <p className="mt-1 text-muted-foreground">
                      JPG, PNG hoặc WebP. Tối đa 5MB.
                    </p>
                  </div>
                </div>
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
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
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

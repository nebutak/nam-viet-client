import { Layout, LayoutBody } from '@/components/custom/Layout'
import { Button } from '@/components/custom/Button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { dateFormat } from '@/utils/date-format'
import {
  deleteNewsComment,
  getNewsComments,
  updateNewsCommentStatus,
} from '@/stores/NewsSlice'
import { Check, Search, Trash2, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const STATUS_LABELS = {
  pending: 'Chờ duyệt',
  approved: 'Đã duyệt',
  rejected: 'Từ chối',
}

const STATUS_CLASSES = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
}

export default function NewsCommentsPage() {
  const dispatch = useDispatch()
  const comments = useSelector((state) => state.news.comments)
  const loading = useSelector((state) => state.news.commentsLoading)
  const pagination = useSelector((state) => state.news.commentsPagination)
  const [status, setStatus] = useState('pending')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const params = useMemo(() => ({
    page,
    limit: 20,
    status: status !== 'all' ? status : undefined,
    search: search || undefined,
  }), [page, search, status])

  useEffect(() => {
    document.title = 'Duyệt bình luận bài viết'
  }, [])

  useEffect(() => {
    dispatch(getNewsComments(params))
  }, [dispatch, params])

  const updateStatus = (id, nextStatus) => {
    dispatch(updateNewsCommentStatus({ id, status: nextStatus, params }))
  }

  const removeComment = (id) => {
    if (window.confirm('Bạn có chắc muốn xóa bình luận này?')) {
      dispatch(deleteNewsComment({ id, params }))
    }
  }

  return (
    <Layout>
      <LayoutBody className="flex flex-col" fixedHeight>
        <div className="mb-4 flex flex-col gap-3 px-2 sm:flex-row sm:items-center sm:justify-between sm:px-0">
          <div>
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
              Duyệt bình luận bài viết
            </h2>
            <p className="text-sm text-muted-foreground">
              Quản lý bình luận công khai trên trang cộng đồng
            </p>
          </div>
          <div className="flex gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => {
                  setPage(1)
                  setSearch(event.target.value)
                }}
                placeholder="Tìm bình luận..."
                className="pl-8"
              />
            </div>
            <Select
              value={status}
              onValueChange={(value) => {
                setPage(1)
                setStatus(value)
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Chờ duyệt</SelectItem>
                <SelectItem value="approved">Đã duyệt</SelectItem>
                <SelectItem value="rejected">Từ chối</SelectItem>
                <SelectItem value="all">Tất cả</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex-1 overflow-auto rounded-md border bg-white">
          <table className="w-full min-w-[980px] text-sm">
            <thead className="border-b bg-muted/50 text-left">
              <tr>
                <th className="px-4 py-3 font-medium">Bài viết</th>
                <th className="px-4 py-3 font-medium">Người bình luận</th>
                <th className="px-4 py-3 font-medium">Nội dung</th>
                <th className="px-4 py-3 font-medium">Trạng thái</th>
                <th className="px-4 py-3 font-medium">Ngày gửi</th>
                <th className="px-4 py-3 text-right font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                    Đang tải bình luận...
                  </td>
                </tr>
              ) : comments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                    Không có bình luận
                  </td>
                </tr>
              ) : comments.map((comment) => (
                <tr key={comment.id} className="border-b align-top last:border-b-0">
                  <td className="max-w-[220px] px-4 py-3 font-medium">
                    <div className="line-clamp-2">{comment.news?.title || 'Không rõ'}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{comment.authorName}</div>
                    {comment.authorEmail && (
                      <div className="text-xs text-muted-foreground">{comment.authorEmail}</div>
                    )}
                  </td>
                  <td className="max-w-[360px] px-4 py-3">
                    <div className="whitespace-pre-line line-clamp-4">{comment.content}</div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={STATUS_CLASSES[comment.status] || ''}>
                      {STATUS_LABELS[comment.status] || comment.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {dateFormat(comment.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {comment.status !== 'approved' && (
                        <Button size="sm" variant="outline" onClick={() => updateStatus(comment.id, 'approved')}>
                          <Check className="mr-1 h-4 w-4" />
                          Duyệt
                        </Button>
                      )}
                      {comment.status !== 'rejected' && (
                        <Button size="sm" variant="outline" onClick={() => updateStatus(comment.id, 'rejected')}>
                          <X className="mr-1 h-4 w-4" />
                          Từ chối
                        </Button>
                      )}
                      <Button size="sm" variant="destructive" onClick={() => removeComment(comment.id)}>
                        <Trash2 className="mr-1 h-4 w-4" />
                        Xóa
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex items-center justify-end gap-2">
          <Button
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage((value) => Math.max(1, value - 1))}
          >
            Trang trước
          </Button>
          <span className="text-sm text-muted-foreground">
            Trang {page} / {pagination?.totalPages || 1}
          </span>
          <Button
            variant="outline"
            disabled={page >= (pagination?.totalPages || 1)}
            onClick={() => setPage((value) => value + 1)}
          >
            Trang sau
          </Button>
        </div>
      </LayoutBody>
    </Layout>
  )
}

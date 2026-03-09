import { Layout, LayoutBody } from '@/components/custom/Layout'
import { ProductDataTable } from './components/ProductDataTable'
import { useDispatch, useSelector } from 'react-redux'
import { getProducts, updateProductInStore } from '@/stores/ProductSlice'
import { useEffect, useState } from 'react'
import { columns } from './components/Column'
import useSocketEvent from '@/hooks/UseSocketEvent'
import { toast } from 'sonner'

const ProductPage = () => {
  const dispatch = useDispatch()
  const products = useSelector((state) => state.product.products)
  const loading = useSelector((state) => state.product.loading)
  const serverPagination = useSelector((state) => state.product.pagination)

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  })
  const [columnFilters, setColumnFilters] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')

  useEffect(() => {
    document.title = 'Quản lý sản phẩm'

    const filtersParams = columnFilters.reduce((acc, filter) => {
      acc[filter.id] = filter.value.join ? filter.value.join(',') : filter.value
      return acc
    }, {})

    dispatch(getProducts({
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      search: globalFilter || undefined,
      ...filtersParams
    }))
  }, [dispatch, pagination.pageIndex, pagination.pageSize, columnFilters, globalFilter])

  // Listen for real-time price updates
  useSocketEvent({
    product_price_updated: (updatedProduct) => {
      // Update product in Redux store
      dispatch(updateProductInStore(updatedProduct))

      // Show toast notification
      toast.success(`Giá sản phẩm "${updatedProduct.name}" đã được cập nhật`, {
        description: `Giá mới: ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(updatedProduct.price)}`,
        duration: 3000,
      })
    }
  })

  return (
    <Layout>
      <LayoutBody className="flex flex-col" fixedHeight>
        <div className="mb-2 flex items-center justify-between space-y-2 px-2 sm:px-0">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Danh sách sản phẩm
            </h2>
          </div>
        </div>
        <div className="flex-1 overflow-auto px-2 sm:px-0">
          {products && (
            <ProductDataTable
              data={products}
              columns={columns}
              loading={loading}
              pagination={pagination}
              pageCount={serverPagination?.totalPages || 1}
              rowCount={serverPagination?.total || 0}
              onPaginationChange={setPagination}
              columnFilters={columnFilters}
              onColumnFiltersChange={setColumnFilters}
              globalFilter={globalFilter}
              onGlobalFilterChange={setGlobalFilter}
            />
          )}
        </div>
      </LayoutBody>
    </Layout>
  )
}

export default ProductPage

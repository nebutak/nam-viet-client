import { Layout, LayoutBody } from '@/components/custom/Layout'
import { useDispatch, useSelector } from 'react-redux'
import { columns } from '@/views/admin/user/components/Column'
import { useEffect, useState } from 'react'
import { getUsers } from '@/stores/UserSlice'
import { UserDataTable } from '@/views/admin/user/components/UserDataTable'

const EmployeePage = () => {
  const dispatch = useDispatch()
  const users = useSelector((state) => state.user.users)
  const loading = useSelector((state) => state.user.loading)
  const serverPagination = useSelector((state) => state.user.pagination)

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 20,
  })
  const [columnFilters, setColumnFilters] = useState([])
  const [globalFilter, setGlobalFilter] = useState('')

  useEffect(() => {
    document.title = 'Quản lý nhân viên'

    const filtersParams = columnFilters.reduce((acc, filter) => {
      acc[filter.id] = filter.value.join ? filter.value.join(',') : filter.value
      return acc
    }, {})

    dispatch(getUsers({
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      search: globalFilter || undefined,
      ...filtersParams,
    }))
  }, [dispatch, pagination.pageIndex, pagination.pageSize, columnFilters, globalFilter])

  return (
    <Layout>
      <LayoutBody className="flex flex-col" fixedHeight>
        <div className="mb-2 flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Danh sách nhân viên
            </h2>
          </div>
        </div>
        <div className="-mx-4 flex-1 overflow-y-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          {users && (
            <UserDataTable
              data={users}
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

export default EmployeePage

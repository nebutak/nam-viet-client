import { Layout, LayoutBody } from '@/components/custom/Layout'
import { WarrantyDataTable } from './components/WarrantyDataTable'
import { columns } from './components/Column'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getWarranties } from '@/stores/WarrantySlice'

const WarrantyPage = () => {
  const dispatch = useDispatch()
  const warranties = useSelector((state) => state.warranty.warranties)
  const loading = useSelector((state) => state.warranty.loading)

  useEffect(() => {
    document.title = 'Quản lý bảo hành'
    dispatch(getWarranties())
  }, [dispatch])

  return (
    <Layout>
      <LayoutBody className="flex flex-col" fixedHeight>
        <div className="mb-2 flex items-center justify-between space-y-2 -mx-4 px-1 sm:mx-0 sm:px-0">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Danh sách bảo hành
            </h2>
          </div>
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-1 sm:px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          {warranties && (
            <WarrantyDataTable
              data={warranties}
              columns={columns}
              loading={loading}
            />
          )}
        </div>
      </LayoutBody>
    </Layout>
  )
}

export default WarrantyPage

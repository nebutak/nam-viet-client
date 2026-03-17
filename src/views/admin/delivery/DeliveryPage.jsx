import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDeliveries } from '@/stores/DeliverySlice'
import { columns } from './components/Column'
import { DeliveryDataTable } from './components/DeliveryDataTable'
import { IconTruck } from '@tabler/icons-react'

export default function DeliveryPage() {
  const dispatch = useDispatch()
  const { deliveries, loading, meta } = useSelector((state) => state.delivery)

  useEffect(() => {
    dispatch(getDeliveries())
  }, [dispatch])

  return (
    <div className='flex-col md:flex h-full'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <div className='flex items-center justify-between space-y-2 mb-4'>
          <h2 className='text-2xl font-bold tracking-tight'>
            Quản lý giao hàng
          </h2>
        </div>
        
        <DeliveryDataTable 
          columns={columns} 
          data={deliveries} 
          loading={loading} 
        />
      </div>
    </div>
  )
}

import { getCategories } from '@/stores/CategorySlice'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Layout, LayoutBody } from '@/components/custom/Layout'
import { CategoryDataTable } from './components/CategoryDataTable'
import { getColumns } from './components/Column'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState } from 'react'

const CategoryPage = () => {
  const dispatch = useDispatch()
  const [type, setType] = useState('PRODUCT')
  const categories = useSelector((state) => state.category.categories)
  const loading = useSelector((state) => state.category.loading)
  const columns = getColumns(type)

  useEffect(() => {
    document.title = type === 'PRODUCT' ? 'Danh mục sản phẩm' : 'Danh mục nguyên liệu'
    dispatch(getCategories({ type }))
  }, [dispatch, type])

  return (
    <Layout>
      <LayoutBody className="flex flex-col" fixedHeight>
        <div className="mb-2 flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {type === 'PRODUCT' ? 'Danh mục sản phẩm' : 'Danh mục nguyên liệu'}
            </h2>
          </div>
          <Tabs value={type} onValueChange={setType} className="w-[300px]">
             <TabsList className="grid w-full grid-cols-2">
               <TabsTrigger value="PRODUCT">Sản phẩm</TabsTrigger>
               <TabsTrigger value="MATERIAL">Nguyên liệu</TabsTrigger>
             </TabsList>
           </Tabs>
        </div>
        <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
          {categories && (
            <CategoryDataTable
              data={categories}
              columns={columns}
              loading={loading}
              type={type}
            />
          )}
        </div>
      </LayoutBody>
    </Layout>
  )
}

export default CategoryPage

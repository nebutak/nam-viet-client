# Kế hoạch Triển khai Báo cáo Tồn kho

## 🎯 Mục tiêu
Xây dựng hoàn chỉnh tính năng Báo cáo Tồn kho với 2 tabs:
1. **Tab Tổng quan** - Hiển thị tổng quan tồn kho với filters, KPIs, charts, tables
2. **Tab Nhập-Xuất-Tồn** - Báo cáo chi tiết nhập-xuất-tồn theo kỳ

## ⚠️ Nguyên tắc làm việc
- ✅ **CHỈ LÀM CLIENT** - Không động đến server
- ⚠️ **MỌI THAY ĐỔI SERVER** - Phải hỏi ý user trước
- 📝 Nếu thiếu permission/data → Báo user để tự xử lý

---

## 📋 Phase 1: Setup & Chuẩn bị (30 phút)

### 1.1. Kiểm tra API hiện có
- [x] Đã kiểm tra 4 endpoints
- [x] Đã hiểu response structure
- [x] Đã biết ProductType values: `raw_material`, `packaging`, `finished_product`, `goods`

### 1.2. Tham khảo UI từ Revenue Report
- [ ] Xem cấu trúc RevenueFilters.jsx
- [ ] Xem cấu trúc RevenueKPICards.jsx
- [ ] Xem cấu trúc RevenueCharts.jsx
- [ ] Xem cấu trúc RevenueDataTables.jsx
- [ ] Copy pattern tương tự

### 1.3. Chuẩn bị data test
- [ ] Kiểm tra có data inventory trong DB không
- [ ] Nếu không có → Báo user cần seed data
- [ ] Test API bằng Postman/curl trước

---

## 📋 Phase 2: Tab Tổng quan - Filters & KPIs (1-2 giờ)

### 2.1. Tạo InventoryFilters.jsx
**File:** `nam-viet-client/src/views/admin/report/components/InventoryFilters.jsx`

**Chức năng:**
```jsx
- Select: Chi nhánh/Kho (warehouseId)
  - Option: "Tất cả kho"
  - Options: Load từ API /api/warehouses
  
- Select: Danh mục (categoryId)
  - Option: "Tất cả danh mục"
  - Options: Load từ API /api/categories
  
- Select: Loại sản phẩm (productType)
  - Option: "Tất cả loại"
  - Options: 
    - raw_material → "Nguyên liệu"
    - packaging → "Bao bì"
    - finished_product → "Thành phẩm"
    - goods → "Hàng hóa"
    
- Select: Trạng thái tồn (stockStatus)
  - Option: "Tất cả"
  - Option: "An toàn" (quantity >= minStockLevel)
  - Option: "Thấp" (quantity < minStockLevel && quantity > 0)
  - Option: "Hết hàng" (quantity = 0)
  
- Checkbox: Chỉ hiện sắp hết hạn (showExpiring)

- Input: Tìm kiếm theo SKU/Tên (searchTerm)

- Button: "Áp dụng" → Trigger onFilterChange
- Button: "Đặt lại" → Reset về default
```

**Props:**
```typescript
interface InventoryFiltersProps {
  filters: InventoryFilters;
  onFilterChange: (filters: InventoryFilters) => void;
  loading?: boolean;
}
```

### 2.2. Tạo InventoryKPICards.jsx
**File:** `nam-viet-client/src/views/admin/report/components/InventoryKPICards.jsx`

**4 Cards:**
```jsx
1. Tổng giá trị tồn kho
   - Icon: Archive
   - Value: summary.totalValue (format: 123.456.789 ₫)
   - Subtitle: "Tính theo giá nhập"
   
2. Số lượng sản phẩm
   - Icon: Package
   - Value: summary.totalItems
   - Subtitle: "Tổng số SKU trong kho"
   
3. Cảnh báo tồn kho
   - Icon: AlertTriangle (orange)
   - Value: summary.lowStockItems (màu đỏ/cam)
   - Subtitle: "Sản phẩm dưới mức tối thiểu"
   
4. Tổng số lượng
   - Icon: TrendingUp (green)
   - Value: summary.totalQuantity
   - Subtitle: "Tổng số lượng khả dụng"
```

**Props:**
```typescript
interface InventoryKPICardsProps {
  summary: {
    totalItems: number;
    totalValue: number;
    lowStockItems: number;
    totalQuantity: number;
  };
  loading?: boolean;
}
```

### 2.3. Cập nhật InventoryReportPage.jsx - Kết nối API
**File:** `nam-viet-client/src/views/admin/report/InventoryReportPage.jsx`

**State management:**
```jsx
const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'stock-flow'
const [filters, setFilters] = useState({
  warehouseId: null,
  categoryId: null,
  productType: null,
  lowStock: false,
  searchTerm: '',
  showExpiring: false
});
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
```

**API call:**
```jsx
const fetchInventoryReport = async () => {
  setLoading(true);
  setError(null);
  try {
    const response = await axios.get('/api/reports/inventory', {
      params: filters
    });
    setData(response.data.data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchInventoryReport();
}, [filters]);
```

**Layout:**
```jsx
<Layout>
  <LayoutBody>
    {/* Header */}
    <div className="mb-4">
      <h2>Báo cáo Tồn kho</h2>
      <p>Theo dõi tình trạng tồn kho và cảnh báo</p>
    </div>
    
    {/* Tab Navigation */}
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="overview">Tổng quan</TabsTrigger>
        <TabsTrigger value="stock-flow">Nhập-Xuất-Tồn</TabsTrigger>
      </TabsList>
      
      {/* Tab 1: Tổng quan */}
      <TabsContent value="overview">
        <InventoryFilters 
          filters={filters}
          onFilterChange={setFilters}
          loading={loading}
        />
        
        <InventoryKPICards 
          summary={data?.summary}
          loading={loading}
        />
        
        {/* Charts & Tables sẽ thêm sau */}
      </TabsContent>
      
      {/* Tab 2: Nhập-Xuất-Tồn */}
      <TabsContent value="stock-flow">
        {/* Sẽ làm ở Phase 4 */}
      </TabsContent>
    </Tabs>
  </LayoutBody>
</Layout>
```

---

## 📋 Phase 3: Tab Tổng quan - Charts & Tables (2-3 giờ)

### 3.1. Tạo InventoryCharts.jsx
**File:** `nam-viet-client/src/views/admin/report/components/InventoryCharts.jsx`

**2 Charts:**
```jsx
1. Pie Chart: Phân bổ tồn kho theo loại
   - Data: data.byType
   - Hiển thị: productType, value, percentage
   - Colors: Khác nhau cho mỗi loại
   
2. Bar Chart: Số lượng theo loại
   - Data: data.byType
   - X-axis: productType
   - Y-axis: quantity
```

**Props:**
```typescript
interface InventoryChartsProps {
  byType: Array<{
    productType: string;
    quantity: number;
    value: number;
    itemCount: number;
  }>;
  loading?: boolean;
}
```

### 3.2. Tạo InventoryDataTables.jsx
**File:** `nam-viet-client/src/views/admin/report/components/InventoryDataTables.jsx`

**2 Tables:**

**Table 1: Top 10 sản phẩm tồn kho**
```jsx
Columns:
- Mã SKU
- Tên sản phẩm
- Số lượng
- Giá trị (quantity × unitPrice)

Data: data.topProducts
Sort: Theo quantity giảm dần
```

**Table 2: Chi tiết tồn kho**
```jsx
Columns:
- Kho
- Mã SKU
- Tên sản phẩm
- Loại
- Danh mục
- ĐVT
- Tồn kho
- Đã đặt
- Khả dụng
- Mức tối thiểu
- Trạng thái (Badge: An toàn/Thấp/Hết)
- Đơn giá
- Thành tiền
- Hạn sử dụng (nếu có)

Data: data.data
Features:
- Pagination (10/20/50 rows per page)
- Sort by columns
- Row highlight nếu isLowStock = true (màu cam/đỏ)
- Row highlight nếu isExpiring = true (màu vàng)
```

**Props:**
```typescript
interface InventoryDataTablesProps {
  topProducts: Array<{...}>;
  data: Array<{...}>;
  loading?: boolean;
}
```

### 3.3. Tích hợp vào InventoryReportPage.jsx
```jsx
<TabsContent value="overview">
  <InventoryFilters {...} />
  <InventoryKPICards {...} />
  
  {/* Charts */}
  <div className="grid gap-4 md:grid-cols-2 mt-4">
    <InventoryCharts byType={data?.byType} loading={loading} />
  </div>
  
  {/* Tables */}
  <div className="mt-4">
    <InventoryDataTables 
      topProducts={data?.topProducts}
      data={data?.data}
      loading={loading}
    />
  </div>
</TabsContent>
```

---

## 📋 Phase 4: Tab Nhập-Xuất-Tồn (2-3 giờ)

### 4.1. Tạo StockFlowFilters.jsx
**File:** `nam-viet-client/src/views/admin/report/components/StockFlowFilters.jsx`

**Chức năng:**
```jsx
- DatePicker: Từ ngày (fromDate)
  - Default: 7 ngày trước
  
- DatePicker: Đến ngày (toDate)
  - Default: Hôm nay
  
- Preset buttons:
  - "Hôm nay"
  - "7 ngày qua"
  - "Tháng này"
  - "Tháng trước"
  
- Select: Chi nhánh/Kho (warehouseId)
- Select: Danh mục (categoryId)
- Select: Loại sản phẩm (productType)

- Button: "Áp dụng"
- Button: "Đặt lại"
```

**Props:**
```typescript
interface StockFlowFiltersProps {
  filters: StockFlowFilters;
  onFilterChange: (filters: StockFlowFilters) => void;
  loading?: boolean;
}
```

### 4.2. Tạo StockFlowTable.jsx
**File:** `nam-viet-client/src/views/admin/report/components/StockFlowTable.jsx`

**Table:**
```jsx
Columns:
- Mã SKU
- Tên sản phẩm
- ĐVT
- Tồn đầu kỳ
- Nhập trong kỳ
- Xuất trong kỳ
- Tồn cuối kỳ
- Đơn giá
- Thành tiền (endingQuantity × unitPrice)

Footer (Summary row):
- Tổng cộng
- Sum(beginningQuantity)
- Sum(importQuantity)
- Sum(exportQuantity)
- Sum(endingQuantity)
- -
- Sum(totalValue)

Features:
- Pagination
- Sort by columns
- Export Excel
```

**Props:**
```typescript
interface StockFlowTableProps {
  data: Array<{
    productId: number;
    sku: string;
    productName: string;
    unit: string;
    beginningQuantity: number;
    importQuantity: number;
    exportQuantity: number;
    endingQuantity: number;
    unitPrice: number;
  }>;
  loading?: boolean;
}
```

### 4.3. Cập nhật InventoryReportPage.jsx - Tab 2
```jsx
const [stockFlowFilters, setStockFlowFilters] = useState({
  fromDate: subDays(new Date(), 7),
  toDate: new Date(),
  warehouseId: null,
  categoryId: null,
  productType: null
});
const [stockFlowData, setStockFlowData] = useState([]);

const fetchStockFlow = async () => {
  setLoading(true);
  try {
    const response = await axios.get('/api/reports/inventory/stock-flow', {
      params: {
        ...stockFlowFilters,
        fromDate: format(stockFlowFilters.fromDate, 'yyyy-MM-dd'),
        toDate: format(stockFlowFilters.toDate, 'yyyy-MM-dd')
      }
    });
    setStockFlowData(response.data.data);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

<TabsContent value="stock-flow">
  <StockFlowFilters 
    filters={stockFlowFilters}
    onFilterChange={setStockFlowFilters}
    loading={loading}
  />
  
  <StockFlowTable 
    data={stockFlowData}
    loading={loading}
  />
</TabsContent>
```

---

## 📋 Phase 5: Polish & Features (1-2 giờ)

### 5.1. Export Excel
```jsx
- Button "Xuất Excel" ở mỗi table
- Sử dụng thư viện: xlsx hoặc exceljs
- Export với format đẹp, có header, footer
```

### 5.2. Print
```jsx
- Button "In" ở mỗi tab
- CSS print-friendly
- Hide filters khi print
```

### 5.3. Loading & Error States
```jsx
- Skeleton loading cho cards, charts, tables
- Error message với retry button
- Empty state khi không có data
```

### 5.4. Responsive
```jsx
- Mobile: Stack cards vertically
- Tablet: 2 columns
- Desktop: 4 columns
- Tables: Horizontal scroll trên mobile
```

### 5.5. Permissions
```jsx
- Check permission 'view_reports'
- Nếu không có → Hiển thị message
```

---

## 📋 Phase 6: Testing & Bug Fixes (1 giờ)

### 6.1. Test Cases
- [ ] Test với filters khác nhau
- [ ] Test với data rỗng
- [ ] Test với data lớn (>1000 rows)
- [ ] Test responsive trên mobile/tablet
- [ ] Test export Excel
- [ ] Test print
- [ ] Test error handling

### 6.2. Bug Fixes
- [ ] Fix các lỗi phát hiện
- [ ] Optimize performance nếu cần
- [ ] Polish UI/UX

---

## 🎯 Tổng thời gian ước tính: 8-12 giờ

- Phase 1: 0.5h
- Phase 2: 1-2h
- Phase 3: 2-3h
- Phase 4: 2-3h
- Phase 5: 1-2h
- Phase 6: 1h

---

## 📝 Checklist tổng thể

### Components
- [ ] InventoryFilters.jsx
- [ ] InventoryKPICards.jsx
- [ ] InventoryCharts.jsx
- [ ] InventoryDataTables.jsx
- [ ] StockFlowFilters.jsx
- [ ] StockFlowTable.jsx

### Features
- [ ] Tab navigation
- [ ] API integration (2 endpoints)
- [ ] Filters với dropdowns
- [ ] KPI cards động
- [ ] Charts (Pie + Bar)
- [ ] Tables với pagination
- [ ] Export Excel
- [ ] Print
- [ ] Loading states
- [ ] Error handling
- [ ] Responsive design
- [ ] Permission check

### Testing
- [ ] Test tất cả filters
- [ ] Test với data khác nhau
- [ ] Test responsive
- [ ] Test export/print
- [ ] Fix bugs

---

## ⚠️ Lưu ý quan trọng

1. **Không sửa server** - Chỉ làm client
2. **Hỏi trước khi sửa server** - Nếu cần thay đổi gì
3. **ProductType values**: `raw_material`, `packaging`, `finished_product`, `goods`
4. **warehouseId**: Là `number`, không phải string
5. **Date format**: `YYYY-MM-DD`
6. **Tham khảo Revenue Report** - Copy pattern tương tự
7. **Test API trước** - Đảm bảo có data

---

## 🚀 Sẵn sàng bắt đầu?

Bạn muốn bắt đầu từ Phase nào?
- Phase 2: Filters & KPIs (đề xuất)
- Phase 3: Charts & Tables
- Phase 4: Tab Nhập-Xuất-Tồn

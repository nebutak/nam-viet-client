# TODO: Xây dựng Client cho Báo cáo Tồn kho

## ✅ Đã có sẵn
- Server APIs hoàn chỉnh (4 endpoints)
- UI tĩnh cơ bản (InventoryReportPage.jsx)
- Routing đã setup

## 🎯 Cần làm

### 1. Tạo Components cơ bản

#### a. InventoryFilters.jsx
```jsx
// Bộ lọc cho tab Tổng quan
- Dropdown: Chọn kho (warehouseId)
- Dropdown: Chọn danh mục (categoryId)
- Dropdown: Chọn loại sản phẩm (productType)
- Checkbox: Chỉ hiện tồn thấp (lowStock)
- Checkbox: Chỉ hiện sắp hết hạn (showExpiring)
- Input: Tìm kiếm (searchTerm)
- Button: Áp dụng
```

#### b. InventoryKPICards.jsx
```jsx
// 4 cards hiển thị số liệu từ summary
- Tổng giá trị tồn kho (totalValue)
- Số lượng sản phẩm (totalItems)
- Cảnh báo tồn kho (lowStockItems)
- Tổng số lượng (totalQuantity)
```

#### c. InventoryCharts.jsx
```jsx
// Biểu đồ từ data.byType
- Pie chart: Phân bổ theo loại sản phẩm
- Bar chart: Giá trị theo loại
```

#### d. InventoryDataTables.jsx
```jsx
// 2 bảng
1. Top 10 sản phẩm (data.topProducts)
2. Chi tiết tồn kho (data.data) - có pagination
```

### 2. Tạo Tab Nhập-Xuất-Tồn

#### a. StockFlowFilters.jsx
```jsx
// Bộ lọc riêng
- DatePicker: Từ ngày (fromDate)
- DatePicker: Đến ngày (toDate)
- Dropdown: Chọn kho (warehouseId)
- Dropdown: Chọn danh mục (categoryId)
- Dropdown: Chọn loại sản phẩm (productType)
- Button: Áp dụng
```

#### b. StockFlowTable.jsx
```jsx
// Bảng nhập-xuất-tồn
Columns:
- Mã SKU
- Tên sản phẩm
- ĐVT
- Tồn đầu kỳ
- Nhập trong kỳ
- Xuất trong kỳ
- Tồn cuối kỳ
- Đơn giá
- Thành tiền
```

### 3. Cập nhật InventoryReportPage.jsx

```jsx
// Thêm:
- Tab navigation (Tổng quan / Nhập-Xuất-Tồn)
- State management
- API calls
- Loading states
- Error handling
```

### 4. Tích hợp API

```javascript
// API calls
import axios from 'axios';

// Tab 1: Tổng quan
const fetchInventoryReport = async (filters) => {
  const response = await axios.get('/api/reports/inventory', {
    params: filters
  });
  return response.data;
};

// Tab 2: Nhập-Xuất-Tồn
const fetchStockFlow = async (filters) => {
  const response = await axios.get('/api/reports/inventory/stock-flow', {
    params: filters
  });
  return response.data;
};
```

## 📝 Thứ tự thực hiện đề xuất

1. ✅ Tạo InventoryFilters.jsx
2. ✅ Tạo InventoryKPICards.jsx
3. ✅ Cập nhật InventoryReportPage.jsx - kết nối API tab 1
4. ✅ Tạo InventoryDataTables.jsx
5. ✅ Tạo InventoryCharts.jsx
6. ✅ Tạo StockFlowFilters.jsx
7. ✅ Tạo StockFlowTable.jsx
8. ✅ Thêm tab navigation và kết nối API tab 2
9. ✅ Polish: Export, Print, Responsive

## ⚠️ Lưu ý

- **KHÔNG SỬA SERVER** - chỉ làm client
- ProductType values: `raw_material`, `packaging`, `finished_product`, `goods`
- warehouseId là `number`
- Date format: `YYYY-MM-DD`
- Nếu thiếu permission → Báo user tự thêm

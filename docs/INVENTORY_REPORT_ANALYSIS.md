# Phân tích Báo cáo Tồn kho - Trạng thái hiện tại

## 📊 Tổng quan

Sau khi reset về trạng thái ban đầu:
- ✅ **Client**: Đã reset về UI tĩnh cơ bản
- ✅ **Server**: Vẫn giữ nguyên các API đầy đủ

---

## 🔌 API Server hiện có

### 1. GET `/api/reports/inventory` - Báo cáo tồn kho chính

**Query Parameters:**
```typescript
{
  warehouseId?: number;      // Lọc theo kho
  categoryId?: number;       // Lọc theo danh mục
  productType?: string;      // Lọc theo loại (raw_material, packaging, finished_product, goods)
  lowStock?: boolean;        // Chỉ hiện sản phẩm tồn thấp
  searchTerm?: string;       // Tìm kiếm theo SKU hoặc tên
  showExpiring?: boolean;    // Chỉ hiện sản phẩm sắp hết hạn
}
```

**Response Structure:**
```typescript
{
  success: true,
  data: {
    summary: {
      totalItems: number;        // Tổng số SKU
      totalValue: number;        // Tổng giá trị tồn kho
      lowStockItems: number;     // Số sản phẩm tồn thấp
      totalQuantity: number;     // Tổng số lượng
    },
    data: [                      // Chi tiết từng sản phẩm
      {
        warehouseId: number;
        warehouseName: string;
        warehouseType: string;
        productId: number;
        sku: string;
        productName: string;
        productType: string;
        categoryName: string;
        unit: string;
        quantity: number;
        reservedQuantity: number;
        availableQuantity: number;
        minStockLevel: number;
        unitPrice: number;
        totalValue: number;
        isLowStock: boolean;
        expiryDate: Date | null;
        daysUntilExpiry: number | null;
        isExpiring: boolean;
      }
    ],
    byType: [                    // Tổng hợp theo loại
      {
        productType: string;
        quantity: number;
        value: number;
        itemCount: number;
      }
    ],
    topProducts: [               // Top 10 sản phẩm
      {
        productId: number;
        sku: string;
        productName: string;
        quantity: number;
        value: number;
      }
    ]
  },
  timestamp: string;
}
```

---

### 2. GET `/api/reports/inventory/stock-flow` - Báo cáo Nhập-Xuất-Tồn

**Query Parameters:**
```typescript
{
  fromDate?: string;         // Ngày bắt đầu (YYYY-MM-DD)
  toDate?: string;           // Ngày kết thúc (YYYY-MM-DD)
  warehouseId?: number;      // Lọc theo kho
  categoryId?: number;       // Lọc theo danh mục
  productType?: string;      // Lọc theo loại
}
```

**Response Structure:**
```typescript
{
  success: true,
  data: [
    {
      productId: number;
      sku: string;
      productName: string;
      unit: string;
      beginningQuantity: number;    // Tồn đầu kỳ
      importQuantity: number;       // Nhập trong kỳ
      exportQuantity: number;       // Xuất trong kỳ
      endingQuantity: number;       // Tồn cuối kỳ
      unitPrice: number;
    }
  ],
  timestamp: string;
}
```

---

### 3. GET `/api/reports/inventory/by-type` - Tồn kho theo loại

**Query Parameters:**
```typescript
{
  warehouseId?: number;      // Lọc theo kho (optional)
}
```

**Response Structure:**
```typescript
{
  success: true,
  data: [
    {
      productType: string;     // raw_material, packaging, finished_product, goods
      quantity: number;        // Tổng số lượng khả dụng
      value: number;           // Tổng giá trị
      itemCount: number;       // Số lượng SKU
    }
  ],
  timestamp: string;
}
```

---

### 4. GET `/api/reports/inventory/turnover` - Vòng quay kho

**Query Parameters:**
```typescript
{
  fromDate?: string;         // Ngày bắt đầu (YYYY-MM-DD)
  toDate?: string;           // Ngày kết thúc (YYYY-MM-DD)
}
```

**Response Structure:**
```typescript
{
  success: true,
  data: [
    {
      productId: number;
      productName: string;
      sku: string;
      currentStock: number;      // Tồn kho hiện tại
      totalSold: number;         // Tổng đã bán trong kỳ
      turnoverRate: number;      // Tỷ lệ vòng quay (lần)
      daysToSell: number;        // Số ngày để bán hết (ước tính)
    }
  ],
  timestamp: string;
}
```
**Note:** Sắp xếp theo turnoverRate giảm dần

---

## 🎨 Client hiện tại

**File:** `nam-viet-client/src/views/admin/report/InventoryReportPage.jsx`

**Trạng thái:** UI tĩnh với:
- 4 KPI Cards (hardcoded = 0):
  - Tổng giá trị tồn kho
  - Số lượng sản phẩm
  - Cảnh báo tồn kho
  - Vòng quay kho
- 1 Card placeholder cho biểu đồ

**Không có:**
- ❌ Filters
- ❌ Data fetching
- ❌ Charts
- ❌ Tables
- ❌ Tab navigation

---

## 📋 Kế hoạch triển khai

### Phase 1: Trang Tổng quan (Tab 1)
1. Tạo `InventoryFilters.jsx` - Bộ lọc
2. Tạo `InventoryKPICards.jsx` - 4 KPI cards động
3. Tạo `InventoryCharts.jsx` - Biểu đồ
4. Tạo `InventoryDataTables.jsx` - Bảng chi tiết
5. Kết nối API `/api/reports/inventory`

### Phase 2: Tab Nhập-Xuất-Tồn (Tab 2)
1. Tạo `StockFlowFilters.jsx` - Bộ lọc riêng
2. Tạo `StockFlowTable.jsx` - Bảng nhập-xuất-tồn
3. Kết nối API `/api/reports/inventory/stock-flow`

### Phase 3: Polish
1. Export Excel
2. Print
3. Responsive
4. Loading states
5. Error handling

---

## ⚠️ Lưu ý quan trọng

1. **KHÔNG SỬA SERVER** trừ khi được phép
2. Nếu thiếu permission → Báo để user tự thêm
3. Tên trường chính xác: `raw_material`, `packaging`, `finished_product`, `goods` (viết thường, gạch dưới)
4. warehouseId là `number`, không phải string
5. Dates format: `YYYY-MM-DD`

---

## 🎯 Mục tiêu

Xây dựng client hoàn chỉnh để:
- Hiển thị tổng quan tồn kho với filters đầy đủ
- Hiển thị báo cáo nhập-xuất-tồn theo kỳ
- UI đẹp, responsive, dễ sử dụng
- Tương thích 100% với API server hiện có

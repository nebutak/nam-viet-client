# SALES REPORT API DOCUMENTATION

**Ngày:** 10/3/2026  
**Mục đích:** Tài liệu API cho trang Sales Report

---

## 📡 API ENDPOINTS

### 1. Complete Sales Report
```
GET /api/reports/sales
```

**Query Parameters:**
```typescript
{
  fromDate?: string        // YYYY-MM-DD (default: 30 days ago)
  toDate?: string          // YYYY-MM-DD (default: today)
  warehouseId?: number     // Filter by warehouse
  salesChannel?: string    // retail | wholesale | online | distributor
  customerId?: number      // Filter by customer
  createdBy?: number       // Filter by staff (user ID)
  orderStatus?: string     // Filter by order status
}
```

**Response:**
```typescript
{
  period: {
    fromDate: string       // "2024-01-01"
    toDate: string         // "2024-12-31"
    days: number           // 365
  },
  summary: {
    netRevenue: number              // Doanh thu thuần
    netRevenueGrowth: number        // % tăng trưởng so với kỳ trước
    estimatedProfit: number         // Lợi nhuận ước tính
    profitMargin: number            // % tỷ suất lợi nhuận
    totalOrders: number             // Tổng số đơn
    cancelledOrders: number         // Đơn đã hủy
    completedOrders: number         // Đơn hoàn thành
    newDebt: number                 // Công nợ phát sinh
    totalDebt: number               // Tổng công nợ hiện tại
    debtPercentage: number          // % công nợ/doanh thu
  },
  trends: [
    {
      date: string                  // "2024-01-01"
      totalRevenue: number          // Tổng doanh thu
      paidRevenue: number           // Đã thanh toán
      orderCount: number            // Số đơn
      debtAmount: number            // Công nợ
    }
  ],
  byChannel: [
    {
      channel: string               // "retail"
      displayName: string           // "Bán lẻ"
      totalRevenue: number
      netRevenue: number
      discount: number
      tax: number
      shipping: number
      paidAmount: number
      debtAmount: number
      orderCount: number
      percentage: number            // % so với tổng
    }
  ],
  topProducts: [
    {
      productId: number
      sku: string
      productName: string
      quantity: number
      revenue: number
      percentage: number
      unit: { unitName: string }
    }
  ],
  staffPerformance: [
    {
      staffId: number
      staffName: string
      avatar?: string
      totalOrders: number
      totalRevenue: number
      paidRevenue: number
      debtAmount: number
      completionRate: number
    }
  ],
  topCustomers: [
    {
      customerId: number
      customerCode: string
      customerName: string
      orderCount: number
      totalRevenue: number
      currentDebt: number
    }
  ]
}
```

---

### 2. Sales Summary (KPI Cards)
```
GET /api/reports/sales/summary
```

**Query Parameters:** Same as above

**Response:**
```typescript
{
  summary: {
    netRevenue: number
    netRevenueGrowth: number
    estimatedProfit: number
    profitMargin: number
    totalOrders: number
    cancelledOrders: number
    completedOrders: number
    newDebt: number
    totalDebt: number
    debtPercentage: number
  }
}
```

---

### 3. Sales Charts
```
GET /api/reports/sales/charts
```

**Query Parameters:** Same as above

**Response:**
```typescript
{
  trends: [...],      // Line chart data
  byChannel: [...]    // Pie chart data
}
```

---

### 4. Top Analysis
```
GET /api/reports/sales/top
```

**Query Parameters:** Same as above + `type` (products | staff | customers)

**Response:**
```typescript
{
  topProducts?: [...],
  staffPerformance?: [...],
  topCustomers?: [...]
}
```

---

### 5. Filter Options
```
GET /api/reports/sales/filter-options
```

**Query Parameters:**
```typescript
{
  action: 'searchCustomer' | 'getStaff'
  keyword?: string    // For customer search
}
```

**Response:**
```typescript
// For searchCustomer:
{
  customers: [
    {
      id: number
      customerCode: string
      customerName: string
      phone?: string
    }
  ]
}

// For getStaff:
{
  staff: [
    {
      id: number
      fullName: string
      avatarUrl?: string
    }
  ]
}
```

---

## 🔐 PERMISSION REQUIRED

Tất cả endpoints yêu cầu:
- Authentication: Bearer token
- Permission: `GET_SALES_REPORT`

---

## 📝 NOTES

1. **Date Format:** YYYY-MM-DD (e.g., "2024-01-01")
2. **Sales Channels:**
   - `retail` - Bán lẻ
   - `wholesale` - Bán sỉ
   - `online` - Trực tuyến
   - `distributor` - Đại lý
3. **Default Date Range:** Last 30 days
4. **Currency:** VND (Vietnamese Dong)

---

## 🧪 TESTING

Test với curl:
```bash
# Get complete report
curl -X GET "http://localhost:5000/api/reports/sales?fromDate=2024-01-01&toDate=2024-12-31" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get summary only
curl -X GET "http://localhost:5000/api/reports/sales/summary?fromDate=2024-01-01&toDate=2024-12-31" \
  -H "Authorization: Bearer YOUR_TOKEN"
```


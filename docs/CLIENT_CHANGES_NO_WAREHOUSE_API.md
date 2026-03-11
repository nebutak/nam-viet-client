# THAY ĐỔI CLIENT - KHÔNG DÙNG API WAREHOUSE

**Ngày:** 9/3/2026  
**Lý do:** Sếp quyết định chỉ sửa report.routes.ts, không sửa warehouse.routes.ts

---

## VẤN ĐỀ

Client đang gọi API `/api/warehouses` để lấy danh sách kho cho dropdown, nhưng API này yêu cầu quyền `WAREHOUSE_MANAGEMENT` (không tồn tại).

Sếp không muốn sửa `warehouse.routes.ts`, chỉ sửa `report.routes.ts`.

---

## GIẢI PHÁP

**Lấy danh sách warehouse từ dữ liệu báo cáo tồn kho** thay vì gọi API riêng.

### Logic mới:

1. Gọi API `/api/reports/inventory` (không cần filter warehouse)
2. Từ dữ liệu trả về, extract danh sách warehouse unique
3. Hiển thị trong dropdown

### Ưu điểm:

- ✅ Không cần gọi API `/api/warehouses`
- ✅ Không cần quyền `WAREHOUSE_MANAGEMENT`
- ✅ Chỉ cần quyền `GET_INVENTORY_REPORT` và `GET_CATEGORY`
- ✅ Dropdown warehouse tự động cập nhật theo dữ liệu thực tế

### Nhược điểm:

- ⚠️ Chỉ hiển thị warehouse có dữ liệu tồn kho
- ⚠️ Nếu kho không có sản phẩm nào → không hiện trong dropdown

---

## CÁC FILE ĐÃ SỬA

### 1. `InventoryFilters.jsx`

**Thay đổi:**

```javascript
// ❌ TRƯỚC - Gọi API warehouse
useEffect(() => {
  const [warehousesRes, categoriesRes] = await Promise.all([
    api.get('/warehouses'),  // ← Gọi API này
    api.get('/categories')
  ])
  setWarehouses(warehousesRes.data.data)
  setCategories(categoriesRes.data.data)
}, [])

// ✅ SAU - Lấy từ reportData
const warehouses = reportData?.data 
  ? Array.from(
      new Map(
        reportData.data
          .filter(item => item.warehouse)
          .map(item => [item.warehouse.id, item.warehouse])
      ).values()
    )
  : []

// Chỉ fetch categories
useEffect(() => {
  const categoriesRes = await api.get('/categories')
  setCategories(categoriesRes.data.data)
}, [])
```

**Props mới:**
- Thêm prop `reportData` để nhận dữ liệu từ parent

### 2. `InventoryReportPage.jsx`

**Thay đổi:**

```javascript
// ✅ Truyền reportData vào InventoryFilters
<InventoryFilters 
  filters={filters}
  onFilterChange={setFilters}
  loading={loading}
  reportData={data}  // ← Thêm prop này
/>
```

### 3. `PermissionDebug.jsx`

**Thay đổi:**

```javascript
// ❌ TRƯỚC - Kiểm tra 4 quyền
const requiredPermissions = {
  'GET_CATEGORY': {...},
  'GET_WAREHOUSE_IMPORT': {...},      // ← Bỏ
  'GET_WAREHOUSE_EXPORT': {...},      // ← Bỏ
  'GET_INVENTORY_REPORT': {...}
}

// ✅ SAU - Chỉ kiểm tra 2 quyền
const requiredPermissions = {
  'GET_CATEGORY': {...},
  'GET_INVENTORY_REPORT': {...}
}
```

---

## QUYỀN CẦN THIẾT (Cập nhật)

User chỉ cần **2 quyền** để sử dụng trang Báo cáo Tồn kho:

1. ✅ `GET_CATEGORY` - Xem danh mục
2. ✅ `GET_INVENTORY_REPORT` - Xem báo cáo tồn kho

**Không cần nữa:**
- ~~`GET_WAREHOUSE_IMPORT`~~
- ~~`GET_WAREHOUSE_EXPORT`~~
- ~~`WAREHOUSE_MANAGEMENT`~~

---

## KIỂM TRA SAU KHI SỬA

### 1. Đăng xuất và đăng nhập lại

Để có token mới với quyền mới.

### 2. Kiểm tra quyền trong Console

```javascript
const permissions = JSON.parse(localStorage.getItem('permissionCodes') || '[]')
console.log('GET_CATEGORY:', permissions.includes('GET_CATEGORY'))
console.log('GET_INVENTORY_REPORT:', permissions.includes('GET_INVENTORY_REPORT'))
```

Kết quả mong đợi: Cả 2 đều `true`

### 3. Kiểm tra trang hoạt động

- ✅ Không còn lỗi 403 cho `/api/warehouses` (vì không gọi nữa)
- ✅ Dropdown "Danh mục" hiển thị danh sách
- ✅ Dropdown "Chi nhánh/Kho" hiển thị danh sách (từ dữ liệu báo cáo)
- ✅ KPI cards hiển thị số liệu
- ✅ Component debug chỉ hiển thị 2 quyền cần thiết

### 4. Kiểm tra Console

Không còn các lỗi sau:
- ~~`GET /api/warehouses 403`~~
- ~~`❌ Warehouses API error`~~

Chỉ còn:
- ✅ `GET /api/categories 200`
- ✅ `GET /api/reports/inventory 200`

---

## LƯU Ý

### Dropdown warehouse sẽ trống nếu:

1. Database không có dữ liệu tồn kho
2. User chưa có quyền `GET_INVENTORY_REPORT`
3. API báo cáo trả về lỗi

**Giải pháp:** Đảm bảo database có dữ liệu và user có quyền.

### Nếu cần hiển thị tất cả warehouse:

Phải yêu cầu sếp sửa `warehouse.routes.ts` hoặc tạo API mới trong `report.routes.ts` để lấy danh sách warehouse.

---

## TIMELINE

- ✅ **9/3/2026 10:00** - Phát hiện lỗi 403 warehouse
- ✅ **9/3/2026 11:00** - Yêu cầu sếp sửa warehouse.routes.ts
- ✅ **9/3/2026 12:00** - Sếp quyết định không sửa warehouse.routes.ts
- ✅ **9/3/2026 12:30** - Sửa client để không dùng API warehouse
- ⏳ **Tiếp theo** - Test và tiếp tục Phase 3

---

## KẾT LUẬN

Client đã được sửa để không phụ thuộc vào API `/api/warehouses`. Dropdown warehouse sẽ lấy dữ liệu từ báo cáo tồn kho, chỉ hiển thị các kho có dữ liệu thực tế.

Giải pháp này đơn giản, hiệu quả và không cần sửa server thêm.

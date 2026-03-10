# TÓM TẮT VẤN ĐỀ QUYỀN - BÁO CÁO TỒN KHO

**Ngày:** 9/3/2026  
**Trạng thái:** ⏳ Chờ sếp xử lý server

---

## VẤN ĐỀ

Client gọi API bị lỗi **403 Forbidden** khi truy cập trang Báo cáo Tồn kho.

```
GET /api/warehouses → 403 Forbidden
GET /api/categories → 403 Forbidden  
GET /api/reports/inventory → 403 Forbidden
```

---

## NGUYÊN NHÂN

Có 2 vấn đề cần sửa ở SERVER:

### 1. Route đang dùng quyền KHÔNG TỒN TẠI ❌

Server route đang yêu cầu quyền:
- `WAREHOUSE_MANAGEMENT` (không có trong database)
- `view_reports` (không có trong database)

Nhưng database chỉ có:
- `GET_WAREHOUSE_IMPORT`, `GET_WAREHOUSE_EXPORT` ✅
- `GET_INVENTORY_REPORT`, `GET_SALES_REPORT`, `GET_FINANCIAL_REPORT` ✅

### 2. User chưa có quyền ❌

Ngay cả khi sửa route, user vẫn cần được gán quyền.

---

## GIẢI PHÁP (CHO SẾP)

### Bước 1: Sửa route sử dụng quyền có sẵn

**File cần sửa:** 5 file trong `nam-viet-server/src/routes/`

Chi tiết xem file: `nam-viet-server/docs/SUMMARY_FOR_BOSS.md`

### Bước 2: Gán quyền cho user

**Chạy script:**
```bash
cd nam-viet-server
npx ts-node prisma/assign-inventory-permissions.ts admin
```

Hoặc xem hướng dẫn chi tiết: `nam-viet-server/docs/HOW_TO_ASSIGN_PERMISSIONS.md`

---

## ĐÃ LÀM Ở CLIENT

### 1. Thêm component debug quyền ✅

File: `nam-viet-client/src/views/admin/report/components/PermissionDebug.jsx`

Component này sẽ:
- Hiển thị cảnh báo nếu user thiếu quyền
- Liệt kê quyền cần thiết và quyền hiện có
- Chỉ hiện ở môi trường dev (không ảnh hưởng production)

### 2. Cải thiện thông báo lỗi ✅

File: `nam-viet-client/src/views/admin/report/InventoryReportPage.jsx`

- Hiển thị thông báo lỗi rõ ràng hơn
- Giải thích lỗi 403 Forbidden
- Hướng dẫn user kiểm tra quyền

---

## KIỂM TRA SAU KHI SỬA

### 1. User đăng xuất và đăng nhập lại

Quyền được lưu trong JWT token, cần đăng nhập lại để có token mới.

### 2. Kiểm tra quyền trong Console

Mở Console (F12) và chạy:

```javascript
const permissions = JSON.parse(localStorage.getItem('permissionCodes') || '[]')
console.log('Tất cả quyền:', permissions)
console.log('GET_CATEGORY:', permissions.includes('GET_CATEGORY'))
console.log('GET_WAREHOUSE_IMPORT:', permissions.includes('GET_WAREHOUSE_IMPORT'))
console.log('GET_INVENTORY_REPORT:', permissions.includes('GET_INVENTORY_REPORT'))
```

Kết quả mong đợi: Tất cả đều `true`

### 3. Kiểm tra trang hoạt động

- Dropdown "Chi nhánh/Kho" hiển thị danh sách kho ✅
- Dropdown "Danh mục" hiển thị danh sách danh mục ✅
- KPI cards hiển thị số liệu ✅
- Không còn lỗi 403 trong Console ✅

---

## FILE THAM KHẢO

### Cho sếp (Server):
1. `nam-viet-server/docs/SUMMARY_FOR_BOSS.md` - Tóm tắt ngắn gọn
2. `nam-viet-server/docs/FIX_ROUTES_USE_EXISTING_PERMISSIONS.md` - Chi tiết sửa route
3. `nam-viet-server/docs/HOW_TO_ASSIGN_PERMISSIONS.md` - Hướng dẫn gán quyền
4. `nam-viet-server/prisma/assign-inventory-permissions.ts` - Script gán quyền

### Cho team (Client):
1. `nam-viet-client/docs/PERMISSION_ISSUE_SUMMARY.md` - File này
2. `nam-viet-client/src/views/admin/report/components/PermissionDebug.jsx` - Component debug

---

## TIMELINE

- ✅ **9/3/2026 10:00** - Phát hiện lỗi 403
- ✅ **9/3/2026 10:30** - Phân tích nguyên nhân
- ✅ **9/3/2026 11:00** - Tạo tài liệu và script cho sếp
- ✅ **9/3/2026 11:30** - Thêm component debug ở client
- ⏳ **Chờ sếp** - Sửa server và gán quyền

---

## GHI CHÚ

- Chúng ta chỉ làm CLIENT, không sửa SERVER
- Tất cả file hướng dẫn đã được tạo sẵn cho sếp
- Component debug sẽ giúp kiểm tra quyền dễ dàng
- Sau khi sếp sửa xong, user chỉ cần đăng nhập lại là xong

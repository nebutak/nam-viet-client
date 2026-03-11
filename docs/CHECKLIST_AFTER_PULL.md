# CHECKLIST SAU KHI PULL CODE TỪ GIT

**Ngày:** 9/3/2026  
**Mục đích:** Kiểm tra xem sếp đã sửa đúng chưa và test tính năng

---

## 📥 BƯỚC 1: PULL CODE VÀ RESTART

```bash
# Pull code server
cd nam-viet-server
git pull origin main  # hoặc branch đang làm việc

# Restart server
npm run dev  # hoặc lệnh start server
```

---

## ✅ BƯỚC 2: KIỂM TRA SERVER ĐÃ SỬA ĐÚNG CHƯA

### 2.1. Kiểm tra file route đã được sửa

Mở các file sau và kiểm tra:

#### File 1: `src/routes/warehouse.routes.ts`
```typescript
// ✅ ĐÚNG - Phải thấy:
router.get('/', authorize('GET_WAREHOUSE_IMPORT', 'GET_WAREHOUSE_EXPORT'), ...)

// ❌ SAI - Nếu vẫn thấy:
router.get('/', authorize('WAREHOUSE_MANAGEMENT'), ...)
```

#### File 2: `src/routes/report.routes.ts`
```typescript
// ✅ ĐÚNG - Phải thấy:
router.get('/inventory', authorize('GET_INVENTORY_REPORT'), ...)
router.get('/sales', authorize('GET_SALES_REPORT'), ...)
router.get('/dashboard', authorize('GET_DASHBOARD'), ...)

// ❌ SAI - Nếu vẫn thấy:
router.get('/inventory', authorize('view_reports'), ...)
```

### 2.2. Kiểm tra quyền đã được gán cho role admin

```bash
# Chạy script kiểm tra
cd nam-viet-server
npx ts-node prisma/assign-inventory-permissions.ts admin
```

**Kết quả mong đợi:**
```
✅ Role admin đã có đủ tất cả quyền cần thiết
📊 Tổng kết quyền của role admin:
   ✓ GET_CATEGORY: Xem
   ✓ GET_WAREHOUSE_IMPORT: Xem
   ✓ GET_WAREHOUSE_EXPORT: Xem
   ✓ GET_INVENTORY_REPORT: Xem tồn kho
```

---

## 🔄 BƯỚC 3: ĐĂNG XUẤT VÀ ĐĂNG NHẬP LẠI

**QUAN TRỌNG:** Quyền được lưu trong JWT token, phải đăng nhập lại!

1. Mở trình duyệt
2. Đăng xuất khỏi hệ thống
3. Đăng nhập lại với tài khoản admin

---

## 🧪 BƯỚC 4: KIỂM TRA QUYỀN TRONG CLIENT

### 4.1. Kiểm tra localStorage

Mở Console (F12) và chạy:

```javascript
const permissions = JSON.parse(localStorage.getItem('permissionCodes') || '[]')
console.log('📋 Tất cả quyền:', permissions)
console.log('✅ GET_CATEGORY:', permissions.includes('GET_CATEGORY'))
console.log('✅ GET_WAREHOUSE_IMPORT:', permissions.includes('GET_WAREHOUSE_IMPORT'))
console.log('✅ GET_WAREHOUSE_EXPORT:', permissions.includes('GET_WAREHOUSE_EXPORT'))
console.log('✅ GET_INVENTORY_REPORT:', permissions.includes('GET_INVENTORY_REPORT'))
```

**Kết quả mong đợi:** Tất cả đều `true`

### 4.2. Kiểm tra component debug

Vào trang: `/admin/report/inventory`

Component debug sẽ hiển thị:
- ✅ Tất cả quyền đều có dấu tick xanh
- ✅ Không có cảnh báo màu đỏ

---

## 🎯 BƯỚC 5: TEST CHỨC NĂNG

### 5.1. Kiểm tra không còn lỗi 403

Mở Console (F12) → Tab Network:
- ✅ `GET /api/warehouses` → 200 OK
- ✅ `GET /api/categories` → 200 OK
- ✅ `GET /api/reports/inventory` → 200 OK

### 5.2. Kiểm tra UI hoạt động

#### Dropdown "Chi nhánh/Kho"
- ✅ Click vào dropdown
- ✅ Hiển thị danh sách kho (ví dụ: "Kho nguyên liệu trung tâm", "Kho bao bì", etc.)
- ✅ Chọn được kho

#### Dropdown "Danh mục"
- ✅ Click vào dropdown
- ✅ Hiển thị danh sách danh mục
- ✅ Chọn được danh mục

#### KPI Cards
- ✅ Hiển thị 4 card: Tổng giá trị, Số mặt hàng, Cảnh báo tồn thấp, Tổng số lượng
- ✅ Có số liệu (không phải 0 hoặc "Đang tải...")

#### Console
- ✅ Không còn lỗi màu đỏ
- ✅ Không còn lỗi 403 Forbidden

---

## ❌ NẾU VẪN LỖI

### Lỗi 1: Vẫn thấy 403 Forbidden

**Nguyên nhân có thể:**
1. Chưa đăng xuất/đăng nhập lại
2. Sếp chưa chạy script gán quyền
3. Sếp chưa sửa route

**Cách fix:**
1. Đăng xuất và đăng nhập lại
2. Kiểm tra localStorage có quyền chưa (xem Bước 4.1)
3. Nếu không có quyền → Báo sếp chạy script gán quyền
4. Nếu có quyền mà vẫn lỗi → Báo sếp kiểm tra lại route

### Lỗi 2: Dropdown không hiển thị dữ liệu

**Nguyên nhân có thể:**
1. API trả về lỗi
2. Database không có dữ liệu

**Cách fix:**
1. Mở Console → Tab Network → Xem response của API
2. Nếu 403 → Xem "Lỗi 1"
3. Nếu 200 nhưng data rỗng → Kiểm tra database có dữ liệu không

### Lỗi 3: Component debug vẫn hiển thị cảnh báo đỏ

**Nguyên nhân:**
- User chưa có quyền

**Cách fix:**
1. Chụp màn hình component debug
2. Gửi cho sếp hoặc tôi
3. Kiểm tra localStorage (xem Bước 4.1)

---

## 📸 CHỤP SCREENSHOT

Sau khi test xong, chụp màn hình:

1. ✅ Component debug (phần hiển thị quyền)
2. ✅ Console không có lỗi
3. ✅ Dropdown hiển thị dữ liệu
4. ✅ KPI cards có số liệu

Gửi cho tôi để confirm mọi thứ hoạt động đúng!

---

## 🎉 NẾU MỌI THỨ OK

Chúng ta sẽ tiếp tục:
- Phase 3: Implement Charts (Biểu đồ)
- Phase 4: Implement Data Tables (Bảng dữ liệu)
- Phase 5: Implement Stock Flow tab (Tab Nhập-Xuất-Tồn)
- Phase 6: Export Excel, Print

---

## 📞 LIÊN HỆ

Nếu có vấn đề gì, ping tôi với:
- Screenshot lỗi
- Console log
- Kết quả kiểm tra localStorage

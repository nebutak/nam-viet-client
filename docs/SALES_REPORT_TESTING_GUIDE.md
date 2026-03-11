# SALES REPORT TESTING GUIDE

**Ngày:** 10/3/2026  
**Mục đích:** Hướng dẫn test trang Sales Report

---

## 🧪 TEST SCENARIOS

### Scenario 1: Test với API thật (có dữ liệu)

**Điều kiện:**
- Server đang chạy
- Database có dữ liệu invoices
- User có permission `GET_SALES_REPORT`

**Steps:**
1. Mở http://localhost:5173/sales-report
2. Đăng nhập với user có quyền
3. Chọn khoảng thời gian có dữ liệu

**Expected Results:**
- ✅ Loading state hiển thị (skeleton)
- ✅ API call thành công (check Console → Network)
- ✅ Toast: "Tải thành công X đơn hàng"
- ✅ KPI Cards hiển thị số liệu thật
- ✅ Charts hiển thị dữ liệu
- ✅ Tables hiển thị danh sách đơn hàng
- ✅ Debug card hiển thị "Has Data: Yes"

---

### Scenario 2: Test với khoảng thời gian không có dữ liệu

**Steps:**
1. Chọn khoảng thời gian trong tương lai (vd: 2027-01-01 đến 2027-12-31)
2. Click "Áp dụng"

**Expected Results:**
- ✅ API call thành công
- ✅ Toast: "Không có dữ liệu trong khoảng thời gian này"
- ✅ KPI Cards hiển thị số 0
- ✅ Charts hiển thị "Không có dữ liệu"
- ✅ Tables hiển thị "Không có dữ liệu"
- ✅ Debug card: "Total Orders: 0"

---

### Scenario 3: Test lỗi 403 (không có quyền)

**Steps:**
1. Đăng nhập với user KHÔNG có quyền `GET_SALES_REPORT`
2. Truy cập /sales-report

**Expected Results:**
- ✅ API call trả về 403
- ✅ Toast error: "Bạn không có quyền truy cập"
- ✅ Error card hiển thị màu đỏ
- ✅ Components hiển thị empty state

---

### Scenario 4: Test lỗi server (500)

**Steps:**
1. Tắt server
2. Reload trang

**Expected Results:**
- ✅ API call failed
- ✅ Toast error hiển thị
- ✅ Error card hiển thị
- ✅ Loading state tắt

---

### Scenario 5: Test thay đổi filters

**Steps:**
1. Click preset "Hôm nay"
2. Click preset "7 ngày"
3. Click preset "30 ngày"
4. Thay đổi date manually
5. Click "Áp dụng"

**Expected Results:**
- ✅ Mỗi lần thay đổi → API call mới
- ✅ Loading state hiển thị
- ✅ Data cập nhật
- ✅ Console log filters mới

---

## 🔍 DEBUGGING CHECKLIST

### Console Logs cần thấy:
```
📡 Fetching sales report with filters: {...}
✅ Sales report data: {...}
```

### Network Tab cần thấy:
```
Request URL: http://localhost:5000/api/reports/sales?fromDate=...&toDate=...
Request Method: GET
Status Code: 200 OK
Response: { success: true, data: {...} }
```

### Debug Card cần hiển thị:
```
🔧 Debug Info:
Filters: { fromDate: "...", toDate: "...", ... }
Loading: No
Has Data: Yes
Total Orders: 123
```

---

## ⚠️ COMMON ISSUES

### Issue 1: API trả về 403
**Nguyên nhân:** User không có quyền `GET_SALES_REPORT`
**Giải pháp:** 
```bash
cd nam-viet-server
npx ts-node prisma/assign-inventory-permissions.ts admin
```

### Issue 2: API trả về 404
**Nguyên nhân:** Route không tồn tại hoặc server chưa chạy
**Giải pháp:** 
- Kiểm tra server đang chạy
- Kiểm tra route `/api/reports/sales` có tồn tại

### Issue 3: Components không hiển thị data
**Nguyên nhân:** Data structure không đúng
**Giải pháp:** 
- Check Console log response data
- Verify data structure match với components

### Issue 4: Infinite API calls
**Nguyên nhân:** useEffect dependencies không đúng
**Giải pháp:** 
- Check useEffect dependencies
- Đảm bảo chỉ gọi API khi filters thay đổi

---

## 📊 DATA STRUCTURE VALIDATION

### Response từ API phải có:
```typescript
{
  success: true,
  data: {
    period: { fromDate, toDate, days },
    summary: {
      netRevenue, netRevenueGrowth,
      estimatedProfit, profitMargin,
      totalOrders, cancelledOrders, completedOrders,
      newDebt, totalDebt, debtPercentage
    },
    trends: [...],
    byChannel: [...],
    topProducts: [...],
    staffPerformance: [...],
    topCustomers: [...]
  }
}
```

### Nếu thiếu data:
- Code đã có fallbacks
- Sẽ hiển thị empty state
- Không bị crash

---

## ✅ ACCEPTANCE CRITERIA

Trang được coi là hoàn thành khi:
- [ ] Load được dữ liệu từ API
- [ ] Hiển thị đúng KPI cards
- [ ] Hiển thị đúng charts
- [ ] Hiển thị đúng tables
- [ ] Filters hoạt động đúng
- [ ] Loading states đúng
- [ ] Error handling đúng
- [ ] Empty states đúng
- [ ] Responsive design OK
- [ ] No console errors


# Instant Zero-Latency Web App Best Practices (Senior / Staff Level)

Tài liệu hướng dẫn tối ưu hiệu năng để giao diện người dùng (UI) phản hồi **ngay lập tức (0ms delay)** khi chuyển trang hay click thao tác, không phải nhìn màn hình chờ/loading spinner.

---

## 1. Frontend Caching & Warmup Patterns

### A. App Boot Cache Warmup (Khởi động ứng dụng tức thì)
- Ngay sau khi người dùng đăng nhập thành công hoặc load app, khởi chạy các promise prefetch ngầm cho tất cả dữ liệu chính:
  - Wallets list & Categories list
  - Dashboard Summary & Transactions tháng hiện tại
  - Reports (Category breakdown & Monthly trend)
  - Calendar month view
- Lưu kết quả vào SWR RAM memory cache và `localStorage`.

### B. Navigation Hover / Touch Prefetching
- Gắn handler `onMouseEnter` và `onTouchStart` vào các thẻ liên kết / tab menu.
- Khi người dùng đưa con trỏ chuột tới nút bấm (hover) hoặc ngón tay chớm chạm vào màn hình (touch start), tiền tải dữ liệu trang đích trước 100-200ms.
- Khi sự kiện `onClick` kích hoạt, dữ liệu đã sẵn có trong SWR memory cache -> Render ngay lập tức **0ms**.

### C. Persistent LocalStorage Fallback Hydration
- Lưu snapshot của SWR memory cache xuống `localStorage`.
- Khi người dùng bấm F5 hoặc mở lại ứng dụng sau khi đóng trình duyệt, khôi phục ngay dữ liệu cũ từ `localStorage` hiển thị tức thì (0ms), đồng thời kích hoạt revalidation ngầm để đồng bộ dữ liệu mới nhất.

### D. Loại bỏ Re-mount DOM Tree Vô lý
- Không dùng `key={refreshKey}` ở router cấp cao. Việc thay đổi key buộc React phải unmount và mount lại toàn bộ DOM tree, gây chớp nháy màn hình.
- Sử dụng Event Bus hoặc SWR revalidation để cập nhật state cục bộ mượt mà 60fps.

---

## 2. Backend Query Parallelization & Aggregation Patterns

### A. Single Range SQL Query thay cho Sequential Query Loop
- Khi cần lấy dữ liệu thống kê của nhiều mốc thời gian (ví dụ 6 tháng gần nhất):
  - ❌ **Tránh**: Vòng lặp `for` gọi `findMany` 6 lần liên tiếp (6 roundtrips DB).
  - ✅ **Chuẩn**: Quét duy nhất 1 dải ngày từ `oldestStartDate` đến `newestEndDate` bằng 1 câu lệnh SQL `gte` / `lte`, sau đó gom nhóm (grouping) tại server Node.js.

### B. Prisma / SQL Database Aggregation
- ❌ **Tránh**: Kéo hàng nghìn object transaction về RAM Node.js rồi dùng vòng lặp `for` / `reduce` để tính tổng thu chi.
- ✅ **Chuẩn**: Dùng `prisma.transaction.groupBy({ by: ['type'], _sum: { amount: true } })` để tính tổng trực tiếp trong database engine.

### C. Backend Server In-Memory Response Caching
- Sử dụng bộ nhớ đệm TTL (2-5 phút) trên server cho các API đọc nhiều (Categories, Wallets, Monthly trends).
- Tự động xóa cache của user (`serverCache.clearUserCache(userId)`) ngay khi phát sinh các mutation Thêm/Sửa/Xóa.

### D. Composite B-Tree Indexing
- Tạo composite index hỗ trợ query nhiều trường điều kiện cùng lúc: `@@index([walletId, type, transactionDate])`.

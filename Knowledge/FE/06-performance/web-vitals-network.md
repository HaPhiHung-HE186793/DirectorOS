# Web Vitals, Instant Latency & Asset Loading Optimization

> **Tài liệu Senior Performance**: Tối ưu chỉ số INP (Interaction to Next Paint), Asset Loading Strategy, Font Optimization, và Instant 0ms Latency.

---

## 1. TỐI ƯU HÓA CORE WEB VITALS
- **INP Optimization (Interaction to Next Paint)**: Chia nhỏ các Long Tasks (Yield to Main Thread bằng `setTimeout` hoặc `scheduler.yield()`) giúp ứng dụng phản hồi tương tác dưới 50ms.
- **Asset Loading Strategy**: Dynamic Import (`import()`) chỉ khi người dùng rê chuột / tương tác với tính năng.
- **Font Optimization**: Sử dụng `font-display: swap` kết hợp `<link rel="preload">` hiển thị text lập tức.

---

## 2. DYNAMIC PREFETCHING FOR 0MS LATENCY
- Khởi chạy `prefetchService.warmupAppCache()` sau khi login.
- Rê chuột / Chạm Tab Menu → Gọi `prefetchService.prefetchTab(path)` tiền tải dữ liệu trước khi click.

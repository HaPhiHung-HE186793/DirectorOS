# Mở rộng Hệ thống & Hiệu suất (Scalability, Partitioning & Performance)

> **Tài liệu Senior BE**: Chiến lược Phân mảnh (Sharding/Partitioning), Nhân bản (Replication), Caching Multi-layer và Rate Limiting.

---

## 1. PHÂN MẢNH VÀ NHÂN BẢN DỮ LIỆU (PARTITIONING & REPLICATION)

### 1.1 Chiến lược Phân mảnh (Partitioning / Sharding)
- **Key Range vs. Hash Partitioning**: Dữ liệu Key-Value có thể phân mảnh theo dải khóa (Key Range) hoặc mã băm của khóa (Hash of Key) nhằm tránh tải không đều (Skewed workloads) và điểm nóng (Hot spots).
- **Secondary Indexes**: Trong hệ thống phân mảnh, chỉ mục phụ được thiết kế theo Local (Document-based) hoặc Global (Term-based).
- **Request Routing**: Cơ chế định tuyến tự động điều hướng truy vấn đến đúng phân mảnh chứa dữ liệu.

### 1.2 Mô hình Nhân bản (Replication Models)
- **Leader-Follower (Single-leader / Multi-leader / Leaderless)**: Đảm bảo khả năng sẵn sàng cao (High Availability).
- **Replication Lag & Consistency Guarantees**:
  - *Read-Your-Own-Writes*: Đảm bảo người dùng luôn đọc được dữ liệu chính mình vừa ghi.
  - *Monotonic Reads*: Đảm bảo không xảy ra hiện tượng đọc ngược thời gian.
  - *Consistent Prefix Reads*: Đảm bảo thứ tự nguyên nhân - kết quả của dữ liệu được bảo toàn.

### 1.3 Change Data Capture (CDC) & Message Brokers
- **Change Data Capture (CDC)**: Bắt các sự kiện thay đổi từ cơ sở dữ liệu để đồng bộ hóa với hệ thống Search Index hoặc Cache thông qua Stream (Kafka, Debezium).

---

## 2. CHIẾN LƯỢC MULTI-LAYER CACHING

1. **L1 Cache (In-Memory RAM / SWR)**:
   - Truy vấn 0ms cho dữ liệu ít thay đổi (Wallets, Categories, Subscriptions).
   - TTL theo từng Entity (Wallets/Categories: 30 phút, Transactions: 1 phút).

2. **L2 Cache (Shared Redis Cluster)**:
   - Dùng cho Distributed Lock (Redisson / Redlock), Rate Limiting, Temp Tokens.
   - Tránh Thundering Herd Problem bằng Striped Locks.

3. **Deterministic Cache Invalidation**:
   - Khi có bất kỳ mutation (Create/Update/Delete), xóa ngay cache key liên quan trước khi broadcast event.

---

## 3. RATE LIMITING & PROTECTION
- **Sliding Window Log Algorithm**: Sử dụng `express-rate-limit` hoặc Redis sliding window cho các endpoint nhạy cảm (Auth, OTP, SMS Parse).
- **Graceful Degradation**: Khi DB quá tải, trả về fallback cached data thay vì ném lỗi 500.

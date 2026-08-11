# Độ Bền bỉ & Tính Nhất quán (Resilience, Transactions & Consistency)

> **Tài liệu Senior BE**: Mẫu kiến trúc chịu lỗi (Stability Patterns), ACID Isolation Levels, Consensus trong hệ thống phân tán, và Idempotency.

---

## 1. MẪU KIẾN TRÚC BẢO VỆ HỆ THỐNG (STABILITY PATTERNS)

### 1.1 Ngăn chặn Lỗi Dây chuyền (Cascading Failures)
- **Timeouts**: Đặt thời gian chờ tối đa cho mọi cuộc gọi mạng / DB để tránh treo tiến trình.
- **Circuit Breaker**: Tự động ngắt mạch khi dịch vụ phụ thuộc thất bại liên tục, tránh làm sập toàn bộ hệ thống.
- **Bulkheads (Vách ngăn)**: Cô lập tài nguyên (như Thread pool riêng cho từng service) để sự cố ở một module không lan sang module khác.
- **Fail Fast & Let It Crash**: Phát hiện lỗi sớm và dừng ngay lập tức thay vì cố gắng chạy trong trạng thái dữ liệu hỏng.

---

## 2. GIAO DỊCH (TRANSACTIONS) & ISOLATION LEVELS

### 2.1 Mức độ Cô lập (Isolation Levels & MVCC)
- **MVCC (Multi-Version Concurrency Control)**: Đảm bảo các giao dịch đọc không bị chặn bởi các giao dịch ghi và ngược lại.
- **Serializable Isolation**: Mức độ cô lập cao nhất, chống Lost Updates, Phantom Reads bằng Serializable Snapshot Isolation (SSI).

### 2.2 Sự đồng thuận trong Hệ thống Phân tán (Distributed Consensus)
- **Linearizability**: Cam kết an toàn mạnh mẽ nhất nhưng đánh đổi bằng độ trễ mạng.
- **Distributed Transactions (2PC)**: Cẩn trọng khi áp dụng Two-Phase Commit do rủi ro nghẽn cổ chai và bài toán Hai vị tướng (Two Generals' Problem).

---

## 3. IDEMPOTENCY & RUNNING BALANCE PATTERN

### 3.1 Idempotency (Chống Giao dịch Trùng)
- Mọi API thanh toán / QR Code / SMS Capture bắt buộc truyền `Idempotency-Key` hoặc Hash `rawContent` + timestamp.
- Trả về `409 Conflict` nếu cùng một giao dịch được gửi 2 lần trong 5 phút.

### 3.2 FIFO Running Balance & Strategy Fallback
- **FIFO Settlement**: Khi thanh toán nợ / chia tiền nhóm, hệ thống ưu tiên khấu trừ các hóa đơn cũ nhất trước (Ascending by `createdAt`).
- **Strategy A & B Fallback**:
  - *Strategy A*: Tìm qua liên kết `DebtTransaction.sourceMemberId`.
  - *Strategy B*: Fallback tìm trực tiếp qua tên `GroupMember.name == debt.personName` trên tất cả hóa đơn của user để xử lý dữ liệu cũ.

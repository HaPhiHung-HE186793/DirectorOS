# Best Practices for Personal Finance Applications (Senior Level)

## 1. Xử lý tiền tệ (Currency Handling)
- **Tuyệt đối không dùng kiểu `Float` hay `Double`** để lưu trữ tiền tệ. Lỗi làm tròn số có thể gây thất thoát.
- Luôn sử dụng kiểu dữ liệu số nguyên (Integer/BigInt) để lưu giá trị tiền tệ (ví dụ: lưu 1.00 USD dưới dạng 100 cents), hoặc dùng thư viện chuyên dụng như `decimal.js` / `BigDecimal`.
- Hỗ trợ đa tiền tệ (Multi-currency) ngay từ đầu để dễ mở rộng. Lưu tỷ giá quy đổi tại thời điểm giao dịch.

## 2. Bảo mật dữ liệu (Data Security & Privacy)
- Thông tin tài chính cá nhân là dữ liệu cực kỳ nhạy cảm. Toàn bộ API phải được xác thực bằng JWT (Access/Refresh tokens).
- Không bao giờ log dữ liệu nhạy cảm (số dư, số thẻ, password) ra console hay server logs.

## 3. Nguyên tắc kế toán (Accounting Principles)
- Tuân thủ một phần nguyên tắc ghi sổ kép (Double-entry bookkeeping) hoặc luồng giao dịch rõ ràng: Mọi giao dịch (Transaction) phải xác định rõ Nguồn tiền (Source Wallet) và Đích đến (Destination Category/Wallet).

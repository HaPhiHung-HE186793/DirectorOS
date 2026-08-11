# Core Security Foundations: NIST, STRIDE Threat Modeling & Cryptography

> **Tài liệu Security Core**: Khung NIST CSF, Mô hình hóa Mối đe dọa STRIDE, và Cryptography Best Practices.

---

## 1. KHUNG AN NINH MẠNG VÀ MÔ HÌNH HÓA MỐI ĐE DỌA (STRIDE)
- **NIST CSF & CIS Controls**: Tuân thủ Khung An ninh mạng NIST CSF, SP 800-53 và CIS Controls v8.1 bảo vệ tính Bảo mật (Confidentiality), Tính toàn vẹn (Integrity), Tính sẵn sàng (Availability).
- **Mô hình hóa STRIDE (Adam Shostack)**: Đánh giá bảo mật từ khâu thiết kế:
  - *Spoofing*: Giả mạo danh tính → Khắc phục bằng Auth JWT / Argon2.
  - *Tampering*: Thao túng dữ liệu → Khắc phục bằng HMAC / Signature validation.
  - *Repudiation*: Chối bỏ trách nhiệm → Khắc phục bằng Audit Logging.
  - *Information Disclosure*: Rò rỉ thông tin → Khắc phục bằng TLS 1.3 / AES-256-GCM.
  - *Denial of Service*: Từ chối dịch vụ → Khắc phục bằng Rate Limiting.
  - *Elevation of Privilege*: Leo thang đặc quyền → Khắc phục bằng RBAC / Least Privilege.

---

## 2. CRYPTOGRAPHY BEST PRACTICES
- Tuyệt đối không tự viết thuật toán mã hóa tùy chỉnh (Custom Crypto).
- Sử dụng các thuật toán chuẩn mực: SHA-256/SHA-512 cho Hashing, Argon2id/bcrypt cho Mật khẩu, AES-256-GCM cho Mã hóa dữ liệu lưu trữ.

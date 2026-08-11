# Security Ops, DevSecOps, Fuzzing & Incident Response (NIST SP 800-61)

> **Tài liệu Security Ops**: DevSecOps SAST/DAST, Offensive Fuzz Testing, Audit Logging, và NIST SP 800-61 Incident Response.

---

## 1. DEVSECOPS & OFFENSIVE TESTING
- **SAST / DAST Automation**: Tích hợp quét mã tĩnh SAST (SonarQube/Snyk) vào CI pipeline. Tránh "Vibe Coding" không qua kiểm duyệt security.
- **Fuzz Testing**: Đẩy dữ liệu ngẫu nhiên dị dạng vào API để kiểm tra lỗi tràn bộ đệm hoặc crash hệ thống.

---

## 2. AUDIT LOGGING & NIST SP 800-61 INCIDENT RESPONSE
- **Audit Logs**: Ghi vết sự kiện xác thực, phân quyền. Không ghi log thông tin nhạy cảm (Mật khẩu raw, JWT Secret, OTP).
- **Incident Response (NIST SP 800-61)**: Prepare → Detect & Analyze → Contain, Eradicate & Recover → Post-Incident Activity.

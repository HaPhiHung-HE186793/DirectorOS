# JavaScript / TypeScript Testing Rules: Vitest & React Testing Library

> **Tài liệu Testing Language-Specific**: Dữ liệu Test thực tế (Realistic Data) và Phạm vi Unit Test vs Integration Test.

---

## 1. TIÊU CHUẨN KIỂM THỬ JS/TS
- **Realistic Data**: Sử dụng dữ liệu thực tế mang ý nghĩa nghiệp vụ thay vì các chuỗi vô nghĩa (`foo`, `bar`).
- **Phạm vi Unit Test**: Tránh viết Unit Test cho các tương tác UI quá phức tạp (điền form đa bước, upload ảnh). Nhường các tương tác này cho Integration hoặc E2E Tests.

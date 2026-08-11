# Infrastructure as Code (IaC) & Immutable Infrastructure

> **Tài liệu DevOps IaC**: Quản lý hạ tầng bằng code, Hạ tầng bất biến (Immutable Infrastructure) và Configuration Drift.

---

## 1. KHÁI NIỆM CỐT LÕI HẠ TẦNG DẠNG CODE
- **IaC (Infrastructure as Code)**: Quản lý, triển khai máy chủ, mạng, cơ sở dữ liệu qua tệp mã nguồn khai báo (Declarative Code).
- **Hạ tầng Bất biến (Immutable Infrastructure)**: Loại bỏ việc SSH sửa trực tiếp server đang chạy. Thay thế toàn bộ bằng server mới được dựng từ template cấu hình mới nhất.
- **Lợi ích**: Loại bỏ rác cấu hình (Configuration Drift), hỗ trợ Version Control, rollback hạ tầng tức thì.

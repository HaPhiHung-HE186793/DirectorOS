# Secure Architecture, Least Privilege & Tiered Defense

> **Tài liệu Security Architecture**: Đặc quyền Tối thiểu (Least Privilege), Zero Trust, Phân tầng Bảo vệ (Tiered Defense) và Secure by Default.

---

## 1. PRINCIPLE OF LEAST PRIVILEGE & ZERO TRUST
- **Least Privilege**: Cấp cho người dùng/thành phần mức quyền thấp nhất đủ để thực hiện nhiệm vụ (`where: { id, userId: req.userId }`).
- **Zero Trust**: Không tin tưởng bất kỳ thành phần nào (kể cả nội bộ mạng LAN), luôn luôn xác thực và ủy quyền trên mọi request.

---

## 2. KIẾN TRÚC PHÂN TẦNG VÀ SECURE BY DEFAULT
- **Deny-by-Default**: Cấu hình mặc định từ chối tất cả quyền truy cập, trừ các quyền được cấp phép tường minh.
- **Tiered Isolation**: Mỗi tầng (Presentation, Business Logic, DB) chạy dưới các tài khoản hệ điều hành riêng biệt với quyền hạn tối thiểu.

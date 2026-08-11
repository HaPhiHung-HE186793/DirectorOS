# Micro-Frontends System & Module Federation

> **Tài liệu Micro-Frontends**: Vertical Slices, Technology Agnostic, Runtime Isolation, Browser-Native Event Communication và Prefixed Namespacing.

---

## 1. NGUYÊN TẮC THIẾT KẾ MICRO-FRONTENDS
- **Vertical Slices**: Phân tách Monolith thành các phần tính năng độc lập từ UI đến Service do các đội ngũ tự chủ quản lý.
- **Runtime Isolation**: Mỗi Micro-app tự chứa (Self-contained), không phụ thuộc vào biến global toàn cục.
- **Browser-Native Communication**: Sử dụng Custom Events tiêu chuẩn trình duyệt để giao tiếp giữa các Micro-apps.
- **Prefixing Namespacing**: Cô lập CSS, LocalStorage, Cookie bằng tiền tố riêng (ví dụ: `app_debt_`, `app_split_`).

# Test Data Strategy & Environment Isolation

> **Tài liệu QA Architecture**: Dữ liệu kiểm thử Dummy, Cô lập môi trường DB Test.

---

## 1. QUẢN LÝ DỮ LIỆU KIỂM THỬ SẠCH
- **Dummy Reference Data**: Sử dụng tên dữ liệu giả cố tình làm khác sản xuất (như "Dummy wallet 1") phát hiện các giả định ẩn.
- **Database Cleanup Strategy**: Sử dụng Prisma Transaction Rollback hoặc SQLite In-memory cho mỗi bài test đảm bảo tính cô lập tuyệt đối.

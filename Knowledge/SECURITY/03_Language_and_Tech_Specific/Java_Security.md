# Java Enterprise Security Guidelines: PreparedStatement & Bytecode Protection

> **Tài liệu Security Language**: Java Managed Memory, SQL Parameterization, Dynamic Code Execution, và Bytecode Decompilation.

---

## 1. PHÒNG THỦ BẢO MẬT TRONG JAVA ENTERPRISE
- Bắt buộc dùng `java.sql.PreparedStatement` (ví dụ: `setString`, `setInt`) hoặc Spring Data JPA chống SQL Injection.
- Cẩn trọng với `Runtime.getRuntime().exec()` và `ObjectInputFilter` chống Deserialization Attacks.
- Không lưu thông tin mật khẩu / secret key trong client-side Java bytecode.

# .NET / C# Security Guidelines: ASP.NET Core & Data Protection API

> **Tài liệu Security Language**: ASP.NET Core Defenses, Protected Configuration, ViewState Encryption, và Safe Deserialization.

---

## 1. PHÒNG THỦ BẢO MẬT TRONG .NET
- Sử dụng .NET Data Protection API (`IDataProtector`) để mã hóa connection strings và dữ liệu nhạy cảm trong appsettings.
- Mã hóa và xác thực MAC cho ViewState / Cookies.
- Tránh `BinaryFormatter` (deprecated), dùng `System.Text.Json` an toàn.

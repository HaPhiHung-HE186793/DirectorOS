# PHP Security Guidelines: Modern Web Protection (Laravel & Core PHP)

> **Tài liệu Security Language**: Cấu hình php.ini An toàn, Local/Remote File Inclusion (LFI/RFI), CSRF, và Input Array Sanitization.

---

## 1. PHÒNG THỦ BẢO MẬT TRONG PHP
- Tắt các cấu hình nguy hiểm trong `php.ini`: `register_globals = Off`, `magic_quotes_gpc = Off`, `allow_url_include = Off`.
- Kiểm tra nghiêm ngặt `include()` / `require()` tránh lỗ hổng Local File Inclusion (LFI) và Remote File Inclusion (RFI).
- Sanitize các mảng siêu toàn cục `$_GET`, `$_POST`, `$_COOKIE`.

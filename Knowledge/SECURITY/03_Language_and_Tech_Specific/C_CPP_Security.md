# C/C++ Security Guidelines: Memory Safety & Buffer Overflow Mitigations

> **Tài liệu Security Language**: Memory Safety, Buffer Overflows (Stack & Heap), Format String & Integer Vulnerabilities.

---

## 1. PHÒNG CHỐNG LỖ HỔNG BỘ NHỚ TRONG C/C++
- Tuyệt đối tránh các hàm thiếu kiểm tra biên: `strcpy`, `strcat`, `sprintf`, `gets`. Thay thế bằng `strncpy_s`, `snprintf`.
- Tránh Stack/Heap Buffer Overflows, Use-After-Free bằng RAII và Smart Pointers (`std::unique_ptr`, `std::shared_ptr`).
- Kiểm tra dữ liệu chuỗi định dạng (Format string) trong `printf`. Sử dụng AddressSanitizer (`-fsanitize=address`) trong CI/CD.

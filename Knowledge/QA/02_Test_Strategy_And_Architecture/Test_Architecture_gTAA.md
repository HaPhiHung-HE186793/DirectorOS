# Generic Test Automation Architecture (gTAA - ISTQB)

> **Tài liệu Test Architecture**: Kiến trúc Test Automation Framework (TAF Layers).

---

## 1. CÁC TẦNG CỦA TEST AUTOMATION FRAMEWORK
- **Tầng Test Scripts**: Viết kịch bản kiểm thử độc lập, không gọi trực tiếp core libraries.
- **Tầng Business Logic (Page Objects / Drivers)**: Chứa thư viện bọc các thành phần SUT (System Under Test).
- **Tầng Core Libraries**: Các tiện ích kết nối DB, HTTP client, Report logger độc lập với SUT.

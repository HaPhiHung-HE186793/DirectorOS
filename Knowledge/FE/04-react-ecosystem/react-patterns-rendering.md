# React Patterns, Rendering & State Synchronization

> **Tài liệu Senior React**: Custom Hooks Pattern, Compound Components, Islands Architecture, Base Wrapper Pattern, và Dual-Mode Sync Rules.

---

## 1. COMPONENT ARCHITECTURE PATTERNS
- **Custom Hooks Pattern**: Thay thế hoàn toàn HOCs để tái sử dụng logic state sạch sẽ, tránh wrapper hell.
- **Compound Components**: Xây dựng UI phức tạp linh hoạt (như Accordion, Dropdown) qua composition.
- **Base Wrapper Pattern (`AppModal`, `FormField`)**: 100% Modals bọc bởi `<AppModal>`, 100% Form Inputs bọc bởi `<FormField>`.

---

## 2. SYNCHRONIZED SIMPLE & ADVANCED MODES RULE
- **Quy tắc ĐỒNG BỘ 100%**: Khi chỉnh sửa hoặc bổ sung tính năng ở **Advanced Mode** (Lịch, Báo cáo, Xuất Excel, Đổi Theme), BẮT BUỘC kiểm tra màn hình tương ứng ở **Simple Mode** để cùng gọi chung 1 Service Helper / Custom Hook.
- **SWR Cache Cleansing Before Reload**: Mọi mutation hủy dữ liệu lớn (Reset All, Reset Partial, Restore JSON) bắt buộc gọi `clearAllCache()` trước `window.location.reload()`.

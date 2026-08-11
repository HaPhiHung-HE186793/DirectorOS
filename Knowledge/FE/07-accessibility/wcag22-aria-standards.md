# Accessibility (a11y) & WCAG 2.2 Standards

> **Tài liệu Accessibility**: First Rule of ARIA, Modal Focus Trap, Focus Not Obscured, Target Size, và Redundant Entry.

---

## 1. NGUYÊN TẮC TIẾP CẬN DỄ DÀNG (WCAG 2.2 AA)
- **First Rule of ARIA**: Ưu tiên sử dụng HTML5 Semantic chuẩn trước khi dùng thuộc tính ARIA.
- **Modal Focus Trap**: Mở Modal → Khóa Focus phím Tab bên trong; bấm `Escape` → Đóng Modal và trả Focus về nút gọi ban đầu.
- **Focus Not Obscured**: Phần tử đang focus không bị che khuất bởi sticky header/footer bằng `scroll-margin-top`.
- **Target Size**: Vùng tương tác cảm ứng tối thiểu $24 \times 24$ CSS pixels.
- **Redundant Entry**: Tự động điền lại thông tin người dùng đã nhập ở quy trình nhiều bước để giảm tải nhận thức.

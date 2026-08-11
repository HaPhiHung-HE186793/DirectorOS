# Design System, Visual Hierarchy & Aesthetic Rules

> **Tài liệu UX/UI Standard**: Grayscale First Workflow, Constrained Scales, Subtle Shadows, Harmonious Palette, và Color Coding Categories.

---

## 1. PHƯƠNG PHÁP THIẾT KẾ UI CHUYÊN NGHIỆP
- **Grayscale First Workflow**: Xây dựng bố cục và phân cấp thị giác bằng các sắc độ xám trước khi tô màu.
- **Visual Hierarchy**: Kết hợp Kích thước (Size), Độ đậm (Weight) và Màu sắc (Color) để điều hướng mắt.
- **Constrained Scales**: Sử dụng hệ thống tỷ lệ cố định (cấp số nhân 4px, 8px, 16px, 24px) cho khoảng cách padding/margin và font size.
- **Subtle Shadows**: Sử dụng bóng mờ nhỏ nhẹ cho các lớp chiều sâu (Elevation), không dùng bóng gắt.

---

## 2. DYNAMIC COLOR CODING FEATURE
- Mỗi danh mục Thu/Chi cho phép chọn màu custom (Color Picker).
- Hiển thị badge mỏng với `background-color` tương ứng trong lịch sử giao dịch.

---

## 3. ADAPTIVE FILTER COMPONENT PATTERN (HỆ THỐNG BỘ LỌC TỰ ĐỘNG THÍCH ỨNG)
- **Tự động chuyển đổi chế độ hiển thị (Hybrid Mode)**:
  - Khi danh mục/ví $\le 4$: Dùng Horizontal Scroll Chip Bar gọn nhẹ, hiệu ứng chuyển trang mượt mà.
  - Khi danh mục/ví $> 4$: Hiển thị các item được chọn gần đây + Nút `⚙️ Lọc (X/Y)` kích hoạt Modal chọn danh sách có tìm kiếm & checkbox chọn hàng loạt.
- **Micro-feedback & Count Badges**:
  - Luôn đếm tổng số lượng item (vd: `Tất cả (4)`) để người dùng có đầy đủ ngữ cảnh dữ liệu.
  - Hiệu ứng shadow viền xanh nhạt + active border `1.5px` rõ ràng khi chọn item.
- **Đóng gói Reusable Component (DRY Pattern)**:
  - Tách bộ lọc thành component dùng chung (`WalletFilterBar`), áp dụng đồng bộ giữa cả Simple Mode và Advanced Mode.


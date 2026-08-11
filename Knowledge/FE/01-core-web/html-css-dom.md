# Core Web: Semantic HTML, Critical Rendering Path & CSS Architecture

> **Tài liệu Senior FE**: Semantic HTML First, DOM Execution, Specificity Cascade Layers, và Subgrid Layout.

---

## 1. NỀN TẢNG BÌNH DUYỆT & SEMANTIC HTML FIRST
- **Semantic HTML**: Ưu tiên thẻ ngữ nghĩa HTML5 (`<main>`, `<section>`, `<nav>`, `<article>`) thay vì lạm dụng thẻ `<div>` hoặc ARIA không cần thiết.
- **Critical Rendering Path**: JavaScript và CSS có thể chặn hiển thị (Render-blocking). Tối ưu luồng thực thi Single-Threaded của trình duyệt bằng script `defer`/`async`.

---

## 2. CSS ARCHITECTURE & LAYOUT RULES
- **Cascade Layers (`@layer`)**: Quản lý độ ưu tiên CSS bằng `@layer base, layout, components, utilities` tránh xung đột specificity.
- **Subgrid Layout**: Sử dụng `grid-template-columns: subgrid` căn chỉnh các phần tử con lồng nhau duy trì hệ thống lưới nhất quán.
- **Glassmorphism & PWA Mobile Fix**: Phân lớp z-index rõ ràng, sử dụng `position: fixed; inset: 0; z-index: 1000; overflow-y: auto;` cho Mobile PWA Modals.

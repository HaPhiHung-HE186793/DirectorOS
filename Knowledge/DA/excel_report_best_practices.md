# Excel Report Design Best Practices — Executive & Senior Friendly

> **Tài liệu DA & FE**: Chuẩn hóa xuất báo cáo Excel (.xlsx) chuyên nghiệp từ ứng dụng tài chính dành cho C-Level và Người dùng không thạo công nghệ.

---

## 🎨 1. DESIGN SYSTEM & PALETTE MÀU BÁO CÁO EXCEL

### 1.1 Bảng màu Chuẩn Corporate Dark/Light
- **Header Fill**: Deep Navy Blue (`#1E293B` hoặc `#0F172A`)
- **Header Text**: Pure White (`#FFFFFF`), Bold, Font Size 11-12pt
- **Zebra Striping (Dòng chẵn/lẻ)**: Soft Slate (`#F8FAFC`) cho dòng lẻ để dễ đọc dữ liệu dài
- **Income Highlight**: Muted Emerald (`#DCFCE7`), Text Green (`#15803D`)
- **Expense Highlight**: Muted Rose (`#FFE4E6`), Text Red (`#BE123C`)

---

## 📊 2. THỂ HIỆN DỮ LIỆU & TỰ ĐỘNG CHUẨN HÓA

### 2.1 Auto Column Width & Alignment
- **Text (Tên danh mục, ghi chú)**: Align Left, padding tả hữu
- **Numbers (Số tiền VND)**: Align Right, Format `#,##0 "VND"`
- **Dates**: Align Center, Format `DD/MM/YYYY HH:mm`
- **Auto-fit Width**: Tính toán độ dài chuỗi dài nhất + 3-4 space padding

---

## 📈 3. THỐNG KÊ MẠNH & DỰ BÁO TRONG BÁO CÁO
- **Robust Statistics**: Sử dụng Trung vị (Median) và khoảng phân vị cho các tập dữ liệu chi tiêu có giá trị ngoại lai lớn.
- **Baselines**: Thiết lập đường mốc cơ sở (Naive/Seasonal Naive) trước khi đưa ra dự báo xu hướng chi tiêu.

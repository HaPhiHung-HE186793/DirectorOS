# Data Architecture & Dimensional Modeling (Kimball Methodology)

> **Tài liệu Data Analytics**: Phân biệt OLTP vs OLAP, Thiết kế Star Schema, Fact & Dimension Tables, Surrogate Keys và SCDs.

---

## 1. PHÂN BIỆT HỆ THỐNG OLTP VS. OLAP
- **OLTP (Online Transaction Processing)**: Hệ thống vận hành ứng dụng (PostgreSQL/Prisma), tối ưu cho tốc độ ghi/sửa các giao dịch đơn lẻ, chuẩn hóa 3NF để chống trùng lặp.
- **OLAP (Online Analytical Processing)**: Kho dữ liệu phân tích (Data Warehouse), tối ưu cho tốc độ đọc và truy vấn tổng hợp trên tập dữ liệu lớn.

---

## 2. NGUYÊN TẮC THIẾT KẾ MÔ HÌNH ĐA CHIỀU (DIMENSIONAL MODELING)

### 2.1 Cấu trúc Fact & Dimension Tables
- **Fact Table (`fact_transactions`)**: Bảng trung tâm chứa các chỉ số định lượng đo lường (`amount`, `quantity`) cùng các khóa ngoại kết nối tới các chiều.
- **Dimension Tables (`dim_wallets`, `dim_categories`, `dim_dates`)**: Chứa các thuộc tính ngữ cảnh mô tả (`wallet_name`, `category_type`, `day_of_week`).

### 2.2 Enterprise Data Warehouse Bus Architecture
- Sử dụng các chiều chuẩn hóa (**Conformed Dimensions**) và facts chuẩn hóa để tích hợp các Data Marts phân tán một cách nhất quán.

### 2.3 Surrogate Keys & Slowly Changing Dimensions (SCDs)
- **Surrogate Keys (Khóa thay thế)**: Luôn tạo khóa thay thế tự tăng / UUID cho bảng Dimension để tránh phụ thuộc vào Production Primary Keys.
- **Slowly Changing Dimensions (SCD Type 2)**: Theo dõi lịch sử thay đổi của dữ liệu bằng cách tạo bản ghi mới với khóa thay thế mới thay vì ghi đè.

---

## 3. STAR SCHEMA ỨNG DỤNG TRONG FINANCIAL DASHBOARD

```
   ┌──────────────┐         ┌────────────────────┐         ┌───────────────┐
   │ dim_wallets  │         │  fact_transactions │         │dim_categories │
   ├──────────────┤         ├────────────────────┤         ├───────────────┤
   │ wallet_key   │◄───────┐│ transaction_key    │┌───────►│ category_key  │
   │ wallet_name  │        ││ wallet_key         ││        │ category_name │
   │ wallet_type  │        ││ category_key       ││        │ category_type │
   └──────────────┘        ││ date_key           ││        │ color_code    │
                           ││ amount             ││        └───────────────┘
                           │└────────────────────┘│
                           │                      │
                           │   ┌──────────────┐   │
                           └───│  dim_dates   │───┘
                               ├──────────────┤
                               │ date_key     │
                               │ full_date    │
                               │ month_year   │
                               └──────────────┘
```

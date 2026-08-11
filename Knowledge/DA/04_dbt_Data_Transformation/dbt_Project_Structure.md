# dbt (Data Build Tool) Project Architecture & ELT Transformations

> **Tài liệu Data Engineering**: Kiến trúc dbt 4 lớp chuyển đổi dữ liệu hiện đại trên Data Warehouse.

---

## 1. PHƯƠNG PHÁP ELT (EXTRACT, LOAD, TRANSFORM)
- Tải dữ liệu thô vào kho trước (Load), sau đó sử dụng dbt để biến đổi trực tiếp trên Data Warehouse (Transform).

---

## 2. CẤU TRÚC DỰ ÁN DBT 4 LỚP CHUẨN

```
dbt_project/
├── models/
│   ├── staging/        # 1:1 với bảng nguồn, clean nhẹ, ép kiểu
│   │   ├── stg_transactions.sql
│   │   └── stg_wallets.sql
│   ├── intermediate/   # JOINs phức tạp, logic tính toán trung gian
│   │   └── int_monthly_aggregates.sql
│   └── marts/          # Bảng Fact & Dimension hoàn chỉnh phục vụ BI
│       ├── fct_transactions.sql
│       └── dim_wallets.sql
```

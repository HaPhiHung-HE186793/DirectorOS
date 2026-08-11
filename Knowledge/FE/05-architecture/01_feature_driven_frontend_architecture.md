# Frontend Feature-Driven Architecture & SOLID Component System

> **Mục tiêu**: Định hướng thiết kế cây thư mục Frontend và tổ chức Component theo mô hình Feature-Driven (Domain-Driven Frontend) cùng quy tắc SOLID.

---

## 1. CÂY THƯ MỤC CHUẨN FEATURE-DRIVEN FRONTEND

```
frontend/src/
├── assets/                     # Icons, images, fonts, global styles
├── components/                 # Atomic Cross-Feature UI System
│   ├── ui/                     # Shared Base UI (AppModal, FormField, Button, Input)
│   ├── layout/                 # MainLayout, Sidebar, Header
│   └── feedback/               # Toast, Spinner, Skeleton
├── features/                   # Domain-Driven Feature Modules (Co-location)
│   ├── debt/                   # Feature Quản lý nợ
│   │   ├── components/         # DebtManagerModal, DebtCard
│   │   ├── hooks/              # useDebt.ts
│   │   ├── services/           # debtApi.ts
│   │   └── types/              # debt.types.ts
│   ├── splitBill/              # Feature Chia tiền nhóm
│   └── transactions/           # Feature Giao dịch
├── context/                    # App-wide global contexts
├── hooks/                      # Shared hooks (useSWR, useUIMode)
├── pages/                      # Page Containers (Advanced & Simple)
├── services/                   # Core HTTP API clients, prefetcher
└── utils/                      # Helper functions, EventBus
```

---

## 2. QUY TẮC NGUYÊN TẮC CỐT LÕI (SOLID & DRY)

1. **Base Component Wrapper**: Mọi Modal mới PHẢI dùng `<AppModal>`, mọi input/label PHẢI dùng `<FormField>`.
2. **Co-location**: Code nào chỉ dùng cho 1 Feature thì nằm trong folder `features/<feature_name>/`.
3. **API Helper Encapsulation**: Không viết inline `fetch`/`axios` trong Component UI. Tất cả gọi qua Service Helper / Custom Hook.
4. **Synchronized Modes**: Khi sửa/thêm UI ở Advanced Mode, PHẢI kiểm tra Simple Mode để đảm bảo 100% đồng bộ qua chung 1 Service/Hook.

---

*Chi tiết tham khảo tài liệu tổng quan tại `Knowledge/architecture_and_design_patterns_guide.md`.*

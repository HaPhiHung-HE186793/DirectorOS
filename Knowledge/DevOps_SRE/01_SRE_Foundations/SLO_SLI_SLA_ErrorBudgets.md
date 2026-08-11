# Service Level Objectives (SLO), Indicators (SLI), SLA & Error Budget Policy

> **Tài liệu DevOps & SRE**: Định nghĩa toán học và quy trình vận hành dựa trên SLO, SLI, SLA và Error Budgets.

---

## 1. NGUYÊN TẮC NGĂN XẾP ĐỘ TIN CẬY (THE RELIABILITY STACK)

```
┌────────────────────────────────────────────────────────┐
│  SLI (Service Level Indicator)                         │
│  Thước đo thực tế (VD: 99.9% requests thành công)      │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│  SLO (Service Level Objective)                         │
│  Mục tiêu cam kết nội bộ (VD: Availability >= 99.9%)   │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│  SLA (Service Level Agreement)                         │
│  Cam kết pháp lý / đền bù hợp đồng với khách hàng      │
└────────────────────────────────────────────────────────┘
```

---

## 2. TOÁN HỌC ERROR BUDGET & VẬN HÀNH

- **Công thức Error Budget**: $E = 1 - SLO$
- **Chính sách Vận hành theo Error Budget**:
  - *Ngân sách dư dả*: Nhóm tự do deploy feature mới, chạy thử nghiệm A/B Testing.
  - *Ngân sách cạn kiệt*: Tự động đóng pipeline deploy tính năng mới; dồn 100% nguồn lực giải quyết độ tin cậy hạ tầng.

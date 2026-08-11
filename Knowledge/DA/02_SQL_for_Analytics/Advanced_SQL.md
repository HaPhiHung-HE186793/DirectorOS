# Advanced SQL for Analytics & Data Science

> **Tài liệu SQL Analytics**: Window Functions, Cohort Analysis, Regex Text Mining và Anomaly Detection.

---

## 1. PHÂN TÍCH DỮ LIỆU CHUYÊN SÂU BẰNG WINDOW FUNCTIONS

### 1.1 Tính Số dư Lũy kế (Running Balance)
```sql
SELECT 
  created_at,
  amount,
  SUM(amount) OVER (
    PARTITION BY wallet_id 
    ORDER BY created_at ASC 
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS running_balance
FROM transactions;
```

### 1.2 So sánh Tăng trưởng theo Tháng (Month-over-Month Growth)
```sql
WITH monthly_summary AS (
  SELECT 
    DATE_TRUNC('month', created_at) AS month_date,
    SUM(amount) AS total_expense
  FROM transactions
  WHERE type = 'EXPENSE'
  GROUP BY 1
)
SELECT 
  month_date,
  total_expense,
  LAG(total_expense, 1) OVER (ORDER BY month_date) AS prev_month_expense,
  ROUND(
    (total_expense - LAG(total_expense, 1) OVER (ORDER BY month_date)) 
    / NULLIF(LAG(total_expense, 1) OVER (ORDER BY month_date), 0) * 100, 2
  ) AS mom_growth_pct
FROM monthly_summary;
```

---

## 2. COHORT ANALYSIS & ANOMALY DETECTION

### 2.1 Cohort Analysis (Theo dõi Giữ chân Người dùng)
- Nhóm người dùng theo tháng đăng ký đầu tiên và theo dõi tỷ lệ quay lại ghi chép giao dịch ở các tháng tiếp theo ($M+1, M+2$).

### 2.2 Anomaly Detection (Phát hiện Giao dịch Bất thường)
- Sử dụng z-score thống kê trên SQL để gắn cờ các giao dịch có số tiền lệch quá $3\sigma$ so với trung bình chi tiêu hàng tháng.

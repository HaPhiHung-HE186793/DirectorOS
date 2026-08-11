# Incident Management & Blameless Post-Mortem Workflow

> **Tài liệu DevOps Operations**: Quy trình 4 bước xử lý sự cố hạ tầng và sản xuất.

---

## 1. QUY TRÌNH 4 BƯỚC ỨNG PHÓ SỰ CỐ PROD
1. **Detect (Phát hiện)**: Giám sát tự động phát hiện cảnh báo (Grafana / PagerDuty / Sentry).
2. **Respond & Mitigate (Phản ứng & Gợi giảm)**: Rollback deployment gần nhất hoặc kích hoạt Circuit Breaker / Failover DB node.
3. **Resolve (Khắc phục)**: Deploy bản sửa lỗi khẩn cấp (Hotfix).
4. **Post-Mortem (Phân tích)**: Phân tích nguyên nhân gốc rễ (5 Whys), ghi log vào `Bug_Log.md` và `Knowledge/`.

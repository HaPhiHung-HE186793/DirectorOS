# Exploratory Testing & Session-Based Test Management (SBTM)

> **Tài liệu QA Lead**: Kiểm thử khám phá, Session-Based Test Management (SBTM) và Financial App Heuristics.

---

## 1. PHƯƠNG PHÁP KIỂM THỬ KHÁM PHÁ (SBTM)
- **Session-Based Management**: Thực hiện các phiên kiểm thử time-boxed (45-90 phút) có Tuyên ngôn (Charter) mục tiêu rõ ràng.
- **4 Yếu tố Cốt lõi**: Thiết kế bài test → Thực thi bài test → Học hỏi từ phản ứng hệ thống → Điều hướng cuộc điều tra.
- **Financial App Edge-Cases**:
  - *Boundary Values*: Số tiền = 0, số âm, số vượt giới hạn BigInt.
  - *Timezone Shift*: Đổi múi giờ thiết bị sang UTC+0 / UTC-12.
  - *Concurrency*: Double click nút submit hóa đơn chia tiền / tất toán nợ.

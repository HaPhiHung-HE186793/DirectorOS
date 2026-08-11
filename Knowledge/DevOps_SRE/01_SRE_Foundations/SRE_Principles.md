# SRE Principles, Risk Acceptance & Incident Management (Google SRE Framework)

> **Tài liệu DevOps & SRE**: Nền tảng Site Reliability Engineering, Chấp nhận rủi ro, Quản lý Toil, và IMAG Incident Management.

---

## 1. NGUYÊN TẮC CỐT LÕI CỦA SRE (GOOGLE SRE)
- **SRE là gì**: SRE (Site Reliability Engineering) áp dụng các phương pháp kỹ thuật phần mềm (software engineering) để giải quyết các bài toán vận hành hệ thống (Operations).
- **Chấp nhận Rủi ro (Embracing Risk)**: Mục tiêu độ tin cậy 100% là phi thực tế và tốn kém. Dành một khoảng rủi ro (Error Budget) để phát triển tính năng mới.
- **Quản lý Toil (Toil Management)**:
  - *Toil*: Công việc vận hành lặp đi lặp lại, thủ công, thiếu giá trị kỹ thuật dài hạn.
  - *Quy tắc SRE*: Giới hạn Toil tối đa 50% thời gian. 50% thời gian còn lại dành cho lập trình dự án tự động hóa và nâng cao quy mô hệ thống.

---

## 2. NGUYÊN TẮC QUẢN LÝ SỰ CỐ KHÔNG ĐỔ LỖI (BLAMELESS POSTMORTEM)
- **Mô hình IMAG (Incident Management at Google)**: Dựa trên Hệ thống Chỉ huy Sự cố (ICS) tập trung vào 3C: **Coordinate** (Phối hợp), **Communicate** (Giao tiếp), **Control** (Kiểm soát).
- **Các Vai trò Trong Sự cố**:
  - *Incident Commander (IC)*: Người điều phối cao nhất.
  - *Communications Lead (CL)*: Cập nhật thông tin cho khách hàng / bên liên quan.
  - *Operations Lead (OL)*: Trực tiếp xử lý kỹ thuật và khắc phục sự cố.
- **Blameless Culture**: Giả định mọi cá nhân đều hành động với ý định tốt dựa trên thông tin họ có lúc đó. Tìm kiếm lỗ hổng hệ thống thay vì đổ lỗi cá nhân.

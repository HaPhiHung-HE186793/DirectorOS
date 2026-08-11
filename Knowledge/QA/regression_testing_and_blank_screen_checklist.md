# QA & Regression Testing Checklist: Anti-Blank Screen & Quality Assurance Rules

Tài liệu này lưu trữ danh sách các lỗi hay lặp lại (đặc biệt là **lỗi Trắng Màn Hình / Blank Screen**) và quy trình kiểm thử bắt buộc (Regression Checklist) mà AI phải tự kiểm tra trước khi bàn giao task cho người dùng.

---

## 🚫 1. Danh sách Nguyên nhân Gây Lỗi Trắng Màn Hình (Blank White Screen)

| STT | Nguyên nhân Root Cause | Cách Kiểm tra & Phòng Tránh |
|-----|------------------------|-----------------------------|
| **1** | **Biến chưa khai báo trong JSX (ReferenceError)** | Ví dụ: Xóa state `const [exportingCSV]` nhưng nút bấm JSX vẫn gọi `disabled={exportingCSV}`. **Bắt buộc chạy `npx tsc --noEmit`** để phát hiện 100% biến chưa khai báo. |
| **2** | **Unmount toàn bộ DOM khi đang `loading`** | `if (loading) return <div>Đang tải...</div>` khiến màn hình bị unmount hoàn toàn khi đổi tháng. Phải dùng `loading && !data` hoặc mờ nhẹ opacity. |
| **3** | **Truy cập thuộc tính `undefined`/`null`** | Ví dụ: `calendarData.days[key]` khi `calendarData` chưa fetch xong. Phải luôn có optional chaining `calendarData?.days`. |
| **4** | **Lệch API Helper giữa Simple & Advanced Mode** | Sửa nút bấm ở Advanced Mode nhưng quên đồng bộ helper dùng chung làm màn Simple Mode bị crash. |

---

## 📋 2. Quy trình Tự Kiểm Thử 4 Bước (4-Step Automated & Self Check)

Trước khi gửi câu trả lời hoàn thành task cho người dùng, AI **BẮT BUỘC** thực hiện 4 bước tự kiểm tra:

### Bước 1: Kiểm tra Compile TypeScript (Bắt buộc)
```bash
cd frontend && npx tsc --noEmit
cd ../backend && npx tsc --noEmit
```
*Đảm bảo 100% không còn bất kỳ lỗi TS nào (kể cả lỗi biến không tồn tại).*

### Bước 2: Kiểm tra Đồng bộ 2 Chế độ Giao diện (Simple & Advanced)
- Đã kiểm tra màn `/summary` ở Simple Mode chưa?
- Đã kiểm tra màn `/reports` và `/calendar` ở Advanced Mode chưa?
- Cả 2 màn hình có render đầy đủ, không bị trang trắng không?

### Bước 3: Kiểm tra Chức năng Đã Sửa / Tính năng Mới
- Nút bấm mới / Modal mới có hoạt động không?
- Có bị sót biến hay lỗi hàm cũ nào không?

### Bước 4: Cập nhật Bug Log & Knowledge Base (Phase 3)
- Ghi chép lịch sử bug vào `doc_project/specs/05_Bug_Log.md`.
- Nâng cấp file Knowledge tương ứng nếu phát hiện bài toán mới.

---

*Tạo ngày: 2026-07-29 | Phiên bản: 1.0 — QA Regression Checklist*

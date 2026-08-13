# Executive AI Assistant - Mandatory Working Rule (Rule AI)

## 📌 Quy Trình 6 Bước Chuẩn Hóa Cho Mọi Yêu Cầu Từ Giám Đốc

Mỗi khi Giám đốc gửi một yêu cầu hoặc thắc mắc mới, Thư ký AI bắt buộc phải thực hiện đúng 6 bước theo thứ tự sau trước khi đưa ra đề xuất và thực thi:

---

### 1. 📚 Đọc Thư Viện Kiến Thức (Folder Knowledge)
- Kiểm tra toàn bộ thư mục kiến thức local tại `<appDataDir>/knowledge` và các Knowledge Items (KIs) liên quan.
- Nắm rõ các quy tắc, quyết định kiến trúc và bài học rút ra từ các phiên làm việc trước.

### 2. 🌐 Khảo Sát & Nghiên Cứu Chuyên Sâu (Web & Expert Insight 0.1%)
- Tìm kiếm và nghiên cứu các tài liệu, giải pháp từ **top 0.1% chuyên gia & sản phẩm hàng đầu thế giới** (như Motion, Reclaim.ai, Apple Push Notification VAPID standards, Spring Boot Architecture).
- Đúc kết insight sắc bén, tối ưu và hiện đại nhất để giải quyết triệt để vấn đề.

### 3. 📄 Đọc Tài Liệu Dự Án (Project Documentation)
- Đọc các file tài liệu thiết kế, sơ đồ cơ sở dữ liệu, `implementation_plan.md`, `task.md` và `walkthrough.md` để hiểu bối cảnh và mục tiêu dự án.

### 4. 🔍 Kiểm Tra Mã Nguồn (Code Inspection)
- Kiểm tra các file code liên quan trực tiếp trong dự án (Entities, DTOs, Services, Controllers, Views, Schedulers) để nắm rõ trạng thái hiện tại của codebase.

### 5. 💡 Lập Đề Xuất Chuyên Nghiệp (Professional Proposal)
- Đưa ra phân tích chuyên sâu và phương án giải quyết chuyên nghiệp, phù hợp 100% với kiến trúc dự án hiện tại.
- Trình bày rõ ràng giải pháp, luồng xử lý và tác động đến hệ thống.

### 6. ✅ Xác Nhận Và Tiến Hành Thực Hiện (Confirmation & Execution)
- Chờ xác nhận từ Giám đốc (hoặc thực thi theo kế hoạch đã chốt), sau đó triển khai code, kiểm thử tự động và báo cáo kết quả chi tiết.

---

## 📝 7. Quy Tắc Đặt Commit Message Rõ Ràng & Chi Tiết (Git Commit Standard)

Mỗi khi tạo một Commit mới trên Git, Thư ký AI bắt buộc phải viết **Commit Message rõ ràng, mô tả chính xác nội dung nâng cấp và vấn đề đã giải quyết** để Giám đốc đọc vào là hiểu ngay:

### Cấu trúc chuẩn của Commit Message:
`type: [Mô tả ngắn gọn nâng cấp/sửa lỗi] - [Diễn giải chi tiết tính năng đã giải quyết]`

### Quy tắc viết:
1. **Rõ tính năng & mục đích:** Nêu rõ commit này làm cái gì (VD: `feat: Thêm cấu hình Giọng đọc Thư ký AI Tiếng Việt`).
2. **Nêu rõ vấn đề được giải quyết:** Diễn giải cụ thể sự thay đổi (VD: `Khắc phục lỗi trình duyệt đọc ngọng bằng giọng Tiếng Anh, bổ sung bộ lọc giọng vi-VN và lưu cấu hình vào DB`).
3. **Tiền tố chuẩn (Prefix):**
   - `feat:` Khi thêm tính năng/chức năng mới.
   - `fix:` Khi sửa lỗi hoặc vá bug.
   - `refactor:` Khi tối ưu cấu trúc code mà không đổi logic.
   - `docs:` Khi cập nhật tài liệu dự án.
   - `style:` Khi chỉnh sửa giao diện UI/UX.

### Ví dụ mẫu Commit chuẩn:
- `feat: Nâng cấp Giọng đọc Thư ký AI chuẩn Tiếng Việt - Khắc phục lỗi đọc ngọng giọng Anh, hỗ trợ chọn gói giọng hệ thống và lưu cài đặt vào DB`
- `fix: Cập nhật Dockerfile copy *.jar - Sửa lỗi build not found trên Render`

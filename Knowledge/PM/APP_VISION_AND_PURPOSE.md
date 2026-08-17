# 📌 DirectorOS — App Vision & Purpose Document

> **Tài liệu này là nguồn sự thật duy nhất (Single Source of Truth) cho mục đích và hướng đi của app.**
> Mọi session AI mới PHẢI đọc file này trước khi bắt đầu làm việc để tránh đi sai hướng.

---

## 🎯 Mục Đích Chính Của App

DirectorOS là một **ứng dụng lịch cá nhân thông minh** (Smart Personal Calendar) kết hợp:
- Lịch vạn niên (Âm lịch + Dương lịch)
- Quản lý ngày đặc biệt (sinh nhật, ngày lễ, kỷ niệm...)
- Nhắc nhở thông minh đa mục đích
- Lịch làm việc/kế hoạch hàng ngày
- Đồng bộ lịch email công việc
- AI Chatbot + Giọng nói để thêm kế hoạch

**Đối tượng người dùng:** Cá nhân (1 user) — không phải doanh nghiệp/team.

---

## 📋 6 Core Features (Tính Năng Cốt Lõi)

### 1. 📅 Lịch Vạn Niên + Ngày Đặc Biệt
- Giao diện lịch tháng/tuần/ngày — là trang chính của app
- Lưu ngày lễ quốc gia Việt Nam (Tết, 30/4, 2/9, Giỗ Tổ Hùng Vương...)
- Hỗ trợ Âm lịch (Tết Nguyên Đán, Rằm, Mùng 1...)
- Lưu ngày đặc biệt cá nhân: sinh nhật người thân, ngày kỷ niệm, ngày cá nhân
- Bấm vào ngày → xem tổng hợp mọi sự kiện/kế hoạch trong ngày đó

### 2. 🔔 Nhắc Nhở Thông Minh
- Nhắc nhở ngày đặc biệt: "Sinh nhật Mẹ còn 3 ngày nữa"
- Nhắc nhở tùy chỉnh: "Nhà xe Phương Trang mở bán vé Tết trước 30 ngày"
- Hỗ trợ quy tắc nhắc: nhắc trước X ngày, lặp lại hàng năm
- Nhắc qua nhiều kênh: Telegram, Email, Push Notification
- Liên kết ngày lễ trên lịch với hành động cụ thể (mua vé, chuẩn bị quà...)

### 3. 📋 Lịch Làm Việc / Kế Hoạch Hàng Ngày
- Mỗi ngày có danh sách kế hoạch (Plan) chi tiết
- Mỗi item có khung giờ, thời lượng, trạng thái hoàn thành
- Tự động gợi ý kế hoạch (Morning Auto-Schedule 07:00)
- Nhắc lập kế hoạch ngày mai (Night Planner 21:00)
- Tích hợp Pomodoro Timer cho phiên tập trung

### 4. 🤖 AI Chatbot + Giọng Nói
- Nhập kế hoạch bằng ngôn ngữ tự nhiên (text)
- Nhập kế hoạch bằng giọng nói (Speech-to-Text → parse → tạo sự kiện)
- AI tự phân loại: meeting, task, reminder, sự kiện cá nhân
- Text-to-Speech: AI đọc báo cáo ngày, nhắc nhở bằng giọng
- (Tương lai) Tích hợp LLM API cho chat thông minh hơn

### 5. 📧 Đồng Bộ Lịch Email Công Việc
- Kết nối nhiều tài khoản email (Gmail, Outlook, v.v.)
- Sync lịch qua iCal/ICS feed (RFC 5545)
- Tự động pull events: cuộc họp, deadline, lịch hẹn...
- Mỗi email có color tag riêng để phân biệt trên lịch
- Hiển thị events email trên cùng giao diện lịch vạn niên

### 6. 🔀 Lịch Tổng Hợp & Phát Hiện Xung Đột
- Hợp nhất tất cả nguồn lịch: cá nhân + email(s) + ngày lễ + kế hoạch
- Thuật toán phát hiện trùng giờ/trùng ngày giữa các nguồn
- Cảnh báo xung đột: "Lịch họp công ty 14:00 trùng với kế hoạch cá nhân"
- Gợi ý giải quyết: dời lịch, ưu tiên theo mức độ quan trọng

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Java 21, Spring Boot 3.x, Spring Data JPA, Spring Mail |
| Database | PostgreSQL (Neon.tech cloud) |
| Frontend | React (Vite), TailwindCSS-like utilities |
| Notifications | Telegram Bot API, SMTP Email (HTML), Web Push (VAPID) |
| Voice | Web Speech API (SpeechSynthesis + SpeechRecognition) |
| Calendar Sync | iCal/ICS Parser (RFC 5545), Google Calendar integration |
| Hosting | Render.com (Backend), Vercel (Frontend) |

---

## ⚠️ Những Điều KHÔNG Phải Mục Đích Của App

> Các AI và developer PHẢI tránh đưa app đi theo những hướng này:

1. ❌ **KHÔNG** phải app quản trị doanh nghiệp / CEO dashboard
2. ❌ **KHÔNG** cần Decision Load Index, Executive Delegation, Meeting Dossier
3. ❌ **KHÔNG** nên dùng tone "Giám Đốc / Thư Ký AI" quá cứng nhắc
4. ❌ **KHÔNG** phải project management tool (Jira, Trello...)
5. ❌ **KHÔNG** phải CRM hay finance app

---

## 📊 Trạng Thái Hiện Tại (Cập nhật: 2026-08-17 15:35)

| Feature | Backend | Frontend | Status |
|---|---|---|---|
| Lịch Vạn Niên + Ngày Đặc Biệt | ✅ SpecialDate entity + API + CalendarAggregator | ✅ CalendarView + DayDetailPanel + AddModal | 🟢 Hoàn thành Phase 1 |
| Nhắc Nhở Thông Minh | ⚡ Có Reminder entity (gắn Task) | ❌ Chưa có UI riêng | 🟡 Phase 3 — Cần mở rộng |
| Lịch Làm Việc Hàng Ngày | ✅ DailyPlan + PlanItem + Schedulers | ✅ TodayPlanView + NightPlanner | 🟢 Hoàn thành |
| AI Chatbot + Voice | ⚡ Parse command (regex) | ⚡ TTS có, STT chưa có | 🟡 Deferred |
| Đồng Bộ Lịch Email | ✅ ConnectedCalendar + iCal Parser | ✅ Settings UI sync + CalendarView tích hợp | 🟢 Hoàn thành |
| Lịch Tổng Hợp + Xung Đột | ✅ Conflict detection + CalendarAggregatorService | ✅ CalendarView hiển thị đa nguồn | 🟢 Hoàn thành |
| Tone Rebrand (Cá nhân) | ✅ | ✅ Navigation + Navbar + TodayPlan | 🟢 Hoàn thành Phase 2 |

---

## 📝 Ghi Chú Cho AI Sessions Mới

1. **Luôn đọc file này trước** khi bắt đầu code bất kỳ feature nào
2. **Calendar View là trang chính** — default tab khi mở app
3. **Giữ tone cá nhân tự nhiên** — KHÔNG dùng "Giám Đốc / Thư Ký AI"
4. **Tái sử dụng code hiện có** — backend infrastructure (notification, sync, plan) rất tốt
5. **Phase 3 tiếp theo**: Mở rộng Reminder System (gắn SpecialDate, ReminderRule)
6. **Deferred**: Pomodoro Timer, Analytics Dashboard, Speech-to-Text, LLM AI Chatbot
7. **Âm lịch**: Đã tích hợp `solarlunar` npm — số to dương + số nhỏ âm bên dưới

---

*Last updated: 2026-08-17 15:35 by Antigravity AI*


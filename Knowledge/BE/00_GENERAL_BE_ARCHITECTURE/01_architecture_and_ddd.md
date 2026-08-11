# Kiến trúc Backend, Domain-Driven Design (DDD) & Microservices

> **Tài liệu Senior BE**: Hướng dẫn toàn diện từ Lý thuyết Domain-Driven Design (DDD), Microservices đến Thực thi Kiến trúc Clean Layered Architecture trong các ứng dụng thực tế sản xuất.

---

## 1. PHÂN TÍCH VÀ THIẾT KẾ DOMAIN-DRIVEN DESIGN (DDD)

### 1.1 Subdomains (Tên miền phụ)
- **Core Subdomain (Tên miền cốt lõi)**: Mang lại lợi thế cạnh tranh cao nhất và chứa độ phức tạp nghiệp vụ lớn nhất (ví dụ: Thuật toán tính số dư lũy kế Running Balance, Tự động phân chia nợ FIFO, Xử lý giao dịch định kỳ).
- **Generic Subdomain (Tên miền chung)**: Các chức năng phổ biến không tạo sự khác biệt cạnh tranh (ví dụ: Đăng nhập/Đăng ký Auth, Gửi OTP qua Mailer, Rate Limiting).
- **Supporting Subdomain (Tên miền hỗ trợ)**: Các chức năng bổ trợ nghiệp vụ chính (ví dụ: Quản lý danh mục ví, Xuất báo cáo Excel/CSV).

### 1.2 Bounded Contexts & Ubiquitous Language
- **Bounded Context (Ngữ cảnh giới hạn)**: Xác định ranh giới rõ ràng của các domain model. Mỗi Bounded Context quản lý một tập các Entity và Value Objects độc lập.
- **Tích hợp giữa các Bounded Contexts**:
  - *Customer/Supplier*: Ngữ cảnh tiêu thụ phụ thuộc vào ngữ cảnh cung cấp.
  - *Anticorruption Layer (ACL)*: Đặt một tầng chuyển đổi (Translation Layer) để tránh làm ô nhiễm Domain Model khi giao tiếp với hệ thống bên ngoài hoặc legacy code.
  - *Separate Ways*: Các subdomains hoàn toàn độc lập không chia sẻ model.
- **Ubiquitous Language (Ngôn ngữ chung)**: Đội ngũ phát triển và Chuyên gia nghiệp vụ phải dùng chung một thuật ngữ thống nhất (như `Debt`, `GroupBill`, `GroupMember`, `RunningBalance`, `FifoSettle`), tránh dùng từ mơ hồ.

---

## 2. MICROSERVICES & NGUYÊN TẮC PHÂN RÃ HỆ THỐNG

### 2.1 Chiến lược Phân rã (Decomposition Strategies)
- **Decompose by Business Capability**: Phân rã theo năng lực nghiệp vụ (Ví dụ: Order Service, Payment Service, Notification Service).
- **Decompose by Subdomain**: Phân rã dựa trên ranh giới DDD Bounded Contexts.

### 2.2 Rủi ro của việc Lạm dụng DRY (Don't Repeat Yourself)
- Trong kiến trúc Microservices, việc cố gắng chia sẻ chung mã nguồn qua các thư viện dùng chung (shared libraries) dễ gây ra rủi ro **Tight Coupling** (phụ thuộc chặt chẽ).
- Thà chấp nhận lặp một chút code DTO giữa các service độc lập còn hơn phụ thuộc vào một Shared Library chung khiến mọi service bị vỡ khi nâng cấp.

### 2.3 Phong cách Kiến trúc (Architecture Styles Trade-offs)
- **Monolithic / Modular Monolith**: Phù hợp cho giai đoạn đầu, triển khai nhanh, dễ kiểm thử.
- **Layered Architecture**: Phân tách trách nhiệm theo các tầng kỹ thuật (Presentation, Domain, Data Access).
- **Event-Driven Architecture**: Tối ưu hóa tính mở rộng (Scalability) và giảm sự phụ thuộc đồng bộ (Temporal Coupling) thông qua Event Bus / Messaging Log (Kafka/RabbitMQ).

---

## 3. MÔ HÌNH THỰC THI: CLEAN LAYERED ARCHITECTURE (SENIOR IMPLEMENTATION)

```
[ HTTP REST / RPC Request ]
             │
             ▼
┌───────────────────────────┐
│     Controllers Layer     │  <-- Thin HTTP Adapters (Parse DTOs, Call Service, Format JSON)
└────────────┬──────────────┘
             │
             ▼
┌───────────────────────────┐
│       Services Layer      │  <-- Pure Business Logic, Orchestration & Pipelines
└────────────┬──────────────┘
             │
             ▼
┌───────────────────────────┐
│     Repositories Layer    │  <-- Encapsulated Data Access & Caching (Prisma, SQL, Redis)
└────────────┬──────────────┘
             │
             ▼
┌───────────────────────────┐
│      Database / ORM       │  <-- PostgreSQL, MongoDB, Prisma Client
└───────────────────────────┘
```

### 3.1 Nguyên tắc Phân Tầng Cốt lõi
1. **Controllers (Thin Layer)**: Không chứa `prisma.findMany()` hay câu lệnh `if/else` nghiệp vụ tài chính. Chỉ parse request, validate DTOs, gọi Service và trả JSON.
2. **Services (Rich Business Layer)**: Chứa các thuật toán xử lý chính (FIFO debt allocation, SMS parsing pipeline). Không chứa SQL raw.
3. **Repositories (Data Access & Cache)**: Nơi duy nhất thực hiện câu lệnh DB và bọc chiến lược Caching minh bạch (`getFromCacheOrDb`).

---

## 4. MASTER BACKEND DIRECTORY STRUCTURE

```
backend/src/
├── config/                     # Environment variables, database configs, logger setup
├── controllers/                # Thin HTTP adapters
├── services/                   # Business Logic Services (Pure domain logic)
├── repositories/               # Data Access Layer (Prisma / SQL queries + Caching)
├── patterns/                   # Reusable Enterprise Design Patterns (Pipeline, Chain)
├── pipelines/                  # Concrete Business Pipelines (smsCapture, debtSettle)
├── dtos/                       # Data Transfer Objects & Zod Validation Schemas
├── events/                     # Pub/Sub Event Bus & Event Handlers
├── middleware/                 # Auth, RateLimit, ErrorHandler
├── utils/                      # Helper pure functions
└── server.ts                   # Application Entry Point
```

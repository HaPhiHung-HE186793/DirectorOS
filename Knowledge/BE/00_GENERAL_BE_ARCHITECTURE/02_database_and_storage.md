# Cơ sở Dữ liệu & Lưu trữ (Databases, Storage Engines & Schema Design)

> **Tài liệu Senior BE**: Phân tích chuyên sâu về Mô hình dữ liệu (Relational vs Document vs Graph), Động cơ lưu trữ (B-Trees vs LSM-Trees), Định dạng cột, cùng Quy tắc thiết kế Schema & Migration trên Production.

---

## 1. MÔ HÌNH DỮ LIỆU (DATA MODELS & TRADE-OFFS)

### 1.1 Relational vs. Document Model
- **Document Model (MongoDB, CouchDB)**: Giải quyết sự bất đồng cấu trúc (Object-Relational Mismatch) và cung cấp tính linh hoạt của Schema (Schema-on-Read). Phù hợp cho dữ liệu có cấu trúc cây hoặc ít liên kết chéo.
- **Relational Model (PostgreSQL, MySQL)**: Thể hiện sự ưu việt vượt trội đối với các mối quan hệ `Many-to-One` và `Many-to-Many` thông qua các phép `JOIN` và cơ chế toàn vẹn ràng buộc (Referential Integrity).

### 1.2 Graph Models
- Thích hợp cho các tập dữ liệu có mối quan hệ mạng lưới phức tạp (mạng xã hội, gian lận tài chính).
- Sử dụng Property Graphs, Triple-Stores và các ngôn ngữ truy vấn chuyên dụng như Cypher, SPARQL, Datalog.

---

## 2. ĐỘNG CƠ LƯU TRỮ (STORAGE ENGINES)

### 2.1 B-Trees vs. LSM-Trees
- **B-Trees**: Tối ưu hóa cho truy vấn đọc (Read-heavy workloads). Cập nhật dữ liệu tại chỗ (In-place updates) trên các trang đĩa cố định (Pages).
- **LSM-Trees (Log-Structured Merge-Trees & SSTables)**: Tối ưu hóa cho tốc độ ghi cao (Write-heavy workloads). Chỉ thực hiện ghi nối cuối (Append-only) và tự động merge background.

### 2.2 Định dạng Cột (Column-Oriented Storage)
- Dùng cho các hệ thống phân tích tích hợp (Analytics / OLAP / Data Warehousing).
- Lưu trữ toàn bộ dữ liệu của một cột liên tiếp trên đĩa, giúp nén dữ liệu cực cao và tăng tốc độ đọc khi chỉ truy xuất một vài cột trên tập dữ liệu hàng triệu bản ghi.

### 2.3 Mã hóa & Sự tiến hóa của Schema (Schema Evolution)
- Định dạng dữ liệu cần hỗ trợ khả năng nâng cấp Schema theo thời gian (Forward/Backward Compatibility) thông qua Protocol Buffers, Thrift, hoặc Avro thay vì JSON/XML thô.

---

## 3. QUY TẮC THIẾT KẾ SCHEMA TÀI CHÍNH (POSTGRESQL & PRISMA)

### 3.1 Loại dữ liệu Tiền tệ (Currency Data Types)
- **TUYỆT ĐỐI KHÔNG** dùng `FLOAT` hoặc `DOUBLE` vì lỗi làm tròn điểm động (Floating Point Precision Bug).
- **LUÔN DÙNG**: `BIGINT` (đơn vị nhỏ nhất, ví dụ: Đồng) hoặc `DECIMAL(18, 4)`.
- Trong ứng dụng: `BigInt` đại diện cho VND trong Prisma schema (`amount BigInt`).

### 3.2 Constraints & Indexing Strategy
- **Unique Composite Keys**: Tạo Index unique `@@unique([userId, personName])` ngăn ngừa race condition trùng tên sổ nợ.
- **Cascade Rules**: `ON DELETE CASCADE` chỉ dùng cho các bảng con phụ thuộc sinh tử (`DebtTransaction` thuộc `Debt`).
- **Composite Index**: Index `@@index([userId, createdAt])` phục vụ truy vấn lịch sử giao dịch phân trang.

---

## 4. QUY TRÌNH MIGRATION AN TOÀN TRÊN PRODUCTION (NEON / CLOUD)

1. **Idempotent SQL Migrations**: Viết SQL migration với `IF NOT EXISTS` và `IF EXISTS`.
2. **Neon Advisory Lock Caution**:
   - PgBouncer Pooler không hỗ trợ Postgres Advisory Lock (`P1002 Timeout`).
   - Khắc phục: Chạy `SELECT pg_advisory_unlock_all();` trên Neon SQL Editor hoặc thực thi migration SQL thủ công với `prisma db execute`.

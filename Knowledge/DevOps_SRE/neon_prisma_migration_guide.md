# Neon + Prisma Migration — Production Deployment Guide

> **Dự án**: app-tai-chinh
> **Stack**: Prisma v7 + Neon PostgreSQL (pooler) + Render
> **Cập nhật**: 2026-08-05

---

## 1. Kiến trúc kết nối Neon

```
Render Server
    ↓
Neon Pooler (PgBouncer)     ← URL có "-pooler" trong hostname
    ↓
Neon PostgreSQL Server      ← Direct connection (không có "-pooler")
```

**Quan trọng**: Neon Pooler (PgBouncer) **KHÔNG hỗ trợ đầy đủ advisory locks**.

---

## 2. Quy trình Migration Production (Neon)

### Bước 1: Tạo migration SQL file

```bash
# Tạo file trong prisma/migrations/YYYYMMDDHHMMSS_name/migration.sql
# Dùng IF NOT EXISTS / IF EXISTS để idempotent
```

### Bước 2: Chạy migration trên Neon

```powershell
$env:DATABASE_URL = "postgresql://...@...-pooler...neon.tech/neondb?sslmode=require"
npx prisma db execute --file ./prisma/migrations/MIGRATION_NAME/migration.sql
```

### Bước 3: Đánh dấu migration đã applied

Tạo file `mark_migration.sql`:
```sql
INSERT INTO "_prisma_migrations" (id, checksum, migration_name, finished_at, applied_steps_count)
VALUES (gen_random_uuid(), 'manual_applied', 'MIGRATION_NAME_HERE', NOW(), 1)
ON CONFLICT DO NOTHING;
```

```powershell
npx prisma db execute --file ./prisma/mark_migration.sql
# Sau đó xóa file mark_migration.sql
```

### Bước 4: Push code → Render auto deploy

`prisma migrate deploy` sẽ thấy migration đã applied → skip → start server.

---

## 3. Troubleshooting: Advisory Lock Timeout (P1002)

### Triệu chứng
```
Error: P1002
Context: Timed out trying to acquire a postgres advisory lock
(SELECT pg_advisory_lock(72707369)). Timeout: 10000ms.
```

### Nguyên nhân
- Advisory lock bị "stuck" (treo) trên Neon server
- Xảy ra khi: `prisma migrate resolve`, `prisma migrate deploy`, hoặc bất kỳ Prisma command nào cần advisory lock bị timeout giữa chừng
- Neon pooler (PgBouncer) có thể không cleanup lock đúng cách khi connection drop

### Fix
1. Vào **Neon Dashboard** → **SQL Editor**
2. Chạy:
```sql
SELECT pg_advisory_unlock_all();
```
3. **Render Dashboard** → **Manual Deploy**

### Phòng tránh
- ❌ **KHÔNG dùng** `prisma migrate resolve` qua Neon pooler URL
- ❌ **KHÔNG dùng** `prisma migrate deploy` từ local qua pooler URL
- ✅ **Dùng** `prisma db execute --file` để chạy SQL trực tiếp (không cần advisory lock)
- ✅ Insert vào `_prisma_migrations` bằng SQL thay vì `migrate resolve`

---

## 4. Render Start Command

```
npx prisma migrate deploy && npm start
```

- `prisma migrate deploy`: Kiểm tra và chạy pending migrations
- Nếu tất cả migration đã applied → skip → start server bình thường
- Chỉ fail nếu advisory lock bị stuck → fix bằng `pg_advisory_unlock_all()`

---

## 5. Checklist khi thêm Migration mới

- [ ] Tạo migration SQL file (idempotent với IF NOT EXISTS)
- [ ] Test trên local DB trước
- [ ] Chạy `prisma db execute --file` trên Neon
- [ ] Insert record vào `_prisma_migrations` trên Neon
- [ ] Git push → kiểm tra Render deploy thành công
- [ ] Nếu fail P1002 → chạy `pg_advisory_unlock_all()` trên Neon SQL Editor

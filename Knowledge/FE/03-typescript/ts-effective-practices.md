# Effective TypeScript Practices: Structural Typing, Branded Types & Safety

> **Tài liệu Senior TS**: Type Erasure, Structural Typing (Duck Typing), Avoid `any`, Branded Types, và Exhaustiveness Checking.

---

## 1. TƯ DUY NỔI BẬT TRONG TYPESCRIPT

### 1.1 Compile-time Type Erasure
- TypeScript types bị xóa hoàn toàn ở runtime (Compile-time type erasure). Không dùng Type để check logic lúc app đang chạy mà dùng Type Guard / Zod.

### 1.2 Structural Typing (Duck Typing)
- TypeScript so sánh kiểu dựa trên hình dạng cấu trúc (Shape) chứ không theo tên khai báo (Nominal).

---

## 2. NGUYÊN TẮC AN TOÀN KIỂU (TYPE SAFETY RULES)
- **Tuyệt đối Tránh `any`**: Sử dụng `unknown` và narrowing qua type guards (`isString`, `instanceof`).
- **Branded Types**: Mô phỏng nominal typing cho ID loại trừ nhầm lẫn:
```typescript
type Brand<K, T> = K & { __brand: T }
export type UserId = Brand<string, 'UserId'>
export type WalletId = Brand<string, 'WalletId'>
```
- **Exhaustiveness Checking**: Dùng `never` trong `switch/case` đảm bảo xử lý hết mọi branch khi mở rộng Union Type.

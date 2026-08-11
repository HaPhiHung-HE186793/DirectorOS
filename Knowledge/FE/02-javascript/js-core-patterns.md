# JavaScript Core Patterns: Event Loop, Closures, Prototypes & Event Bus

> **Tài liệu Senior FE**: Event Loop Microtasks vs Macrotasks, Lexical Closures, Prototype Delegation, Module Pattern, và Observer Event Bus.

---

## 1. JAVASCRIPT CORE MECHANICS

### 1.1 Event Loop & Async Execution
- Microtasks Queue (`Promise.then`, `queueMicrotask`, `MutationObserver`) có độ ưu tiên cao hơn Macrotasks Queue (`setTimeout`, `setInterval`, `requestAnimationFrame`). Microtasks luôn được vét sạch trước khi chuyển sang Macrotask tiếp theo.

### 1.2 Lexical Closures & Prototype Delegation
- **Lexical Closure**: Duy trì quyền truy cập biến scope bên ngoài phục vụ đống gói dữ liệu private.
- **Prototype Delegation**: Tối ưu bộ nhớ bằng cách chia sẻ thuộc tính/hàm qua chuỗi prototype.

---

## 2. OBSERVER PATTERN & CUSTOM EVENT BUS
- Giảm sự phụ thuộc chặt chẽ giữa các components độc lập qua Event Bus tiêu chuẩn:
```typescript
export function notifyDataChanged(scope: string = 'all') {
  window.dispatchEvent(new CustomEvent('app:data-changed', { detail: { scope } }))
}
```

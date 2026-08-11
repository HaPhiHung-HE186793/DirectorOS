# Cache Architecture Analysis — Cogover Enterprise vs App Tài Chính

> **Mục đích**: So sánh chiến lược cache của project enterprise lớn (Cogover/Stringee) với app-tai-chinh, rút ra bài học và cải tiến.
> **Ngày phân tích**: 2026-08-05
> **Nguồn tham khảo**: `E:\Stringee\Cogover\omni-server`, `E:\Stringee\Cogover\object-server`

---

## 1. KIẾN TRÚC CACHE — COGOVER (Enterprise Java, ~50+ developers)

### 1.1 Tổng quan: Multi-Layer Cache Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Client (Browser)                  │
└────────────────────────┬────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────┐
│              Application Server (Node 1..N)         │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │  Layer 1: In-Process RAM Cache (CacheUtil)  │    │
│  │  • ConcurrentHashMap per entity type        │    │
│  │  • Striped locks cho thread safety          │    │
│  │  • TTL per entity (Account: 1h, Conv: 8h)  │    │
│  └────────────────────┬────────────────────────┘    │
│                       │ cache miss                  │
│  ┌────────────────────▼────────────────────────┐    │
│  │  Layer 2: Redis (Shared across all nodes)   │    │
│  │  • Redisson client (với Distributed Lock)   │    │
│  │  • Dùng cho: temp code verifier, job info   │    │
│  │  • TTL explicit (900s, 120s, etc.)          │    │
│  └────────────────────┬────────────────────────┘    │
│                       │ cache miss                  │
│  ┌────────────────────▼────────────────────────┐    │
│  │  Layer 3: Database (MySQL / MongoDB)        │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │  Invalidation: Kafka Pub/Sub cross-node     │    │
│  │  → DatabaseDataChangeListener               │    │
│  │  → CacheUtil.delete(table, recordId)        │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

### 1.2 Core Pattern: `CacheUtil.getFromCacheOrDb()`

```java
// Mọi repository đều dùng pattern này
Account account = (Account) CacheUtil.getFromCacheOrDb(
    Account.TABLE_NAME,    // namespace (tách biệt entity)
    id,                    // cache key
    () -> this.findOneById(DbConfigLoader.MYSQL_COMMON, id),  // DB loader
    CACHE_TIMEOUT_SECONDS, // TTL (Account: 3600s, Workspace: 20 ngày!)
    null,                  // tags (cho cascade invalidation)
    false                  // allowNull
);
```

**Đặc điểm**:
- **Namespace isolation**: Mỗi entity type có namespace riêng → không collision
- **TTL per entity**: Account=1h, Conversation=8h, Workspace=20 ngày (data ít thay đổi → TTL dài)
- **Lazy loading**: Chỉ load vào cache khi cần (không warmup tất cả)
- **Thread-safe**: Dùng `Striped<Lock>` (1024 stripes) tránh thundering herd

### 1.3 Cache Invalidation Pattern (Write-through + Pub/Sub)

```java
// Khi UPDATE data:
int c = this.update(DbConfigLoader.MYSQL_COMMON, sql, params);

if (c > 0) {
    // 1. Xóa cache LOCAL ngay lập tức (trong cùng JVM)
    CacheUtil.delete(Account.TABLE_NAME, accountId);
    
    // 2. Gửi Kafka event → các node KHÁC cũng xóa cache
    Producer.sendDbDataChange(
        DatabaseDataChange.Database.MYSQL,
        Account.TABLE_NAME,
        DatabaseDataChange.Type.UPDATE,
        data
    );
}
```

**Flow invalidation**:
```
Node 1: UPDATE account → delete LOCAL cache → publish Kafka event
Node 2: receive Kafka event → CacheUtil.delete(table, id)
Node 3: receive Kafka event → CacheUtil.delete(table, id)
→ Tất cả nodes đều có cache clean → next read sẽ fetch fresh từ DB
```

### 1.4 Điểm mạnh Cogover Cache

| Điểm | Chi tiết |
|------|----------|
| **Deterministic invalidation** | Cache bị xóa NGAY khi mutation xảy ra, không phụ thuộc TTL |
| **Multi-node consistency** | Kafka pub/sub đảm bảo tất cả nodes xóa cache cùng lúc |
| **No stale data** | User KHÔNG BAO GIỜ thấy data cũ sau mutation |
| **Namespace isolation** | Entity types không conflict nhau trong cache |
| **Concurrency safe** | Striped locks ngăn thundering herd problem |
| **Tag-based invalidation** | `CacheUtil.deleteByTag()` cho cascade invalidation |

---

## 2. KIẾN TRÚC CACHE — APP TÀI CHÍNH (React SPA, 1 developer)

### 2.1 Tổng quan: SWR + LocalStorage + Event Bus

```
┌─────────────────────────────────────────────────────┐
│                   Browser (Single tab)              │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │  Layer 1: In-Memory Map (module-level)      │    │
│  │  • const cache = new Map<string, CacheEntry>│    │
│  │  • Reset khi tab close / reload             │    │
│  └────────────────────┬────────────────────────┘    │
│                       │ cold start (F5/reload)      │
│  ┌────────────────────▼────────────────────────┐    │
│  │  Layer 2: LocalStorage Persistent Cache     │    │
│  │  • swr_persist_{key} entries                │    │
│  │  • Tối đa 300KB per entry                   │    │
│  │  • Giữ data qua page refresh                │    │
│  └────────────────────┬────────────────────────┘    │
│                       │ cache miss                  │
│  ┌────────────────────▼────────────────────────┐    │
│  │  Layer 3: API Server (fetch)                │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │  Invalidation: Custom Event Bus (single tab)│    │
│  │  → notifyDataChanged('transactions')        │    │
│  │  → subscribeDataChanged() in useSWR hook    │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │  Prefetch: warmupAppCache() on login        │    │
│  │  → prefetchTab(path) on hover               │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

### 2.2 Core Pattern: `useSWR(key, fetcher, options)`

```typescript
const { data, isLoading, refresh, invalidate } = useSWR(
    `dashboard-${month}-${year}`,    // cache key
    () => transactionAPI.getSummary(month, year), // fetcher
    { staleTime: 2 * 60 * 1000 }     // 2 phút fresh
)
```

**Flow**:
1. Mount → đọc RAM Map (0ms) → trả data ngay
2. Nếu RAM miss → đọc localStorage (`swr_persist_*`) → trả data ngay
3. Nếu data quá `staleTime` (2 phút) → background fetch → update silently
4. Nếu hoàn toàn miss → loading state → fetch → render

### 2.3 Cache Invalidation hiện tại

```typescript
// Mutation component (ví dụ: AddTransactionModal)
await transactionAPI.create(data)
notifyDataChanged('transactions')  // → Custom Event

// useSWR hooks nhận event:
useEffect(() => {
    return subscribeDataChanged(() => {
        cache.delete(key)
        removePersistentCache(key)
        setIsStale(true)
        doFetch(true) // background refetch
    })
}, [key, doFetch])
```

### 2.4 Điểm yếu đã phát hiện (bugs thực tế)

| Bug | Nguyên nhân | Fix đã áp dụng |
|-----|------------|----------------|
| **Xóa data vẫn thấy data cũ** | `window.location.reload()` không clear localStorage cache | Gọi `clearAllCache()` trước reload |
| **Event Bus chỉ trong 1 tab** | `CustomEvent` không broadcast qua tabs | Chưa fix (ít ảnh hưởng vì PWA single-tab) |
| **No scope filtering** | `subscribeDataChanged()` trong useSWR nhận ALL events, không lọc scope | Mọi SWR key đều refetch khi bất kỳ data change |

---

## 3. SO SÁNH CHI TIẾT

| Tiêu chí | Cogover (Enterprise) | App Tài Chính (SPA) |
|----------|---------------------|---------------------|
| **Cache storage** | In-Process RAM + Redis | In-Memory Map + localStorage |
| **TTL strategy** | Per-entity (1h → 20 ngày) | Global staleTime (2 phút) |
| **Invalidation** | Deterministic (delete on mutation) | Eventual (event bus + staleTime) |
| **Cross-node sync** | Kafka pub/sub | N/A (single process) |
| **Cross-tab sync** | N/A (server-side) | ❌ Không có |
| **Persistence** | Redis (shared, cluster-safe) | localStorage (browser-local) |
| **Namespace** | Per TABLE_NAME | Per cache key string |
| **Concurrency** | Striped locks (1024) | None (JS single-thread) |
| **Warmup** | Lazy (on first access) | Eager (warmupAppCache on login) |
| **Bulk invalidation** | `deleteByTag()` | `clearAllCache()` / `invalidateCacheByPrefix()` |

---

## 4. ĐÁNH GIÁ APP TÀI CHÍNH

### ✅ Điểm tốt (đã có)

1. **Stale-While-Revalidate pattern**: Hiện data cũ ngay + fetch mới ngầm → UX mượt
2. **LocalStorage persistence**: F5 không mất data, app "nhanh" khi reload
3. **Prefetch service**: Warm cache trước khi user chạm vào tab → 0ms latency
4. **Event Bus**: In-page mutation → auto-invalidate → refetch
5. **Safety timeout**: 12s guard → tránh infinite loading state
6. **Cleanup interval**: Tự xóa entries quá cacheTime (10 phút)

### ⚠️ Điểm cần cải tiến

1. **Thiếu scope filtering trong Event Bus → invalidation quá rộng**
   - Hiện tại: `notifyDataChanged('transactions')` → ALL useSWR hooks đều refetch
   - Nên: Chỉ refetch hooks có key match scope

2. **staleTime cứng 2 phút cho mọi data**
   - Categories, wallets: Ít thay đổi → nên 10-30 phút
   - Transactions: Thay đổi thường xuyên → 30s-1 phút

3. **Mutation không delete cache trực tiếp (lazy invalidation)**
   - Cogover: Mutation → DELETE cache key → Kafka broadcast
   - App: Mutation → event → SWR refetch ngầm (data cũ vẫn hiện 1-2 giây)
   - Nên: Mutation → `invalidateCache(key)` + `notifyDataChanged()` → hiệu quả hơn

4. **Không có cross-tab sync**
   - Nếu user mở 2 tab, thêm giao dịch ở tab 1, tab 2 không biết
   - Fix: Dùng `BroadcastChannel` API hoặc `localStorage` event listener

5. **LocalStorage overflow risk**
   - Giới hạn 300KB/entry nhưng tổng localStorage chỉ 5-10MB
   - Khi data lớn (nhiều tháng giao dịch) → localStorage đầy

---

## 5. BÀI HỌC TỪ COGOVER ÁP DỤNG CHO APP

### Bài học 1: Deterministic Invalidation > Eventual Invalidation

```
// ❌ Hiện tại (Eventual): Mutation → event → SWR refetch ngầm → update
// ✅ Nên (Deterministic): Mutation → DELETE cache key → SET new data → event

// Ví dụ: Khi thêm giao dịch mới
await transactionAPI.create(data)
invalidateCache(`dashboard-${month}-${year}`)  // Xóa cache cũ ngay
setSWRData(`dashboard-${month}-${year}`, newData)  // Optimistic update
notifyDataChanged('transactions')  // Thông báo các component khác
```

### Bài học 2: TTL Per-Entity (Không dùng chung)

```typescript
// ❌ Hiện tại: staleTime = 2 * 60 * 1000 cho tất cả
// ✅ Nên:
const STALE_TIMES = {
    wallets: 30 * 60 * 1000,      // 30 phút (hiếm thay đổi)
    categories: 30 * 60 * 1000,   // 30 phút
    transactions: 60 * 1000,      // 1 phút (thay đổi thường xuyên)
    debts: 5 * 60 * 1000,         // 5 phút
    reports: 5 * 60 * 1000,       // 5 phút
    subscriptions: 60 * 60 * 1000, // 1 giờ
}
```

### Bài học 3: Scope-Filtered Event Bus

```typescript
// ❌ Hiện tại: ALL hooks refetch khi bất kỳ event nào
// ✅ Nên: Chỉ hooks liên quan mới refetch

// Trong useSWR hook:
useEffect(() => {
    return subscribeDataChanged((scope) => {
        // Chỉ invalidate nếu key match scope
        if (scope === 'all' || key.includes(scope)) {
            cache.delete(key)
            removePersistentCache(key)
            doFetch(true)
        }
    })
}, [key, doFetch])
```

### Bài học 4: Mutation luôn đi kèm Cache Delete

```
// Cogover pattern (CỨNG):
// Mọi hàm UPDATE/DELETE trong Repository đều:
// 1. Execute SQL
// 2. if (success) → CacheUtil.delete(TABLE, id)
// 3. Producer.sendDbDataChange(...)

// App Tài Chính nên:
// Mọi API call mutation (create/update/delete) đều:
// 1. Await API response
// 2. invalidateCache(relatedKey)
// 3. notifyDataChanged(scope)
```

### Bài học 5: Dùng `clearAllCache()` cho Destructive Operations

```
// ĐÃ ÁP DỤNG (fix bug ngày 2026-08-05):
// Reset All / Reset Partial / Restore Backup → clearAllCache() + reload()
// Đây đúng theo tinh thần Cogover: mutation lớn → invalidate tất cả
```

---

## 6. ĐÃ HOÀN THÀNH NÂNG CẤP VÀ NÂNG CAO CACHE ARCHITECTURE

### P0 — Critical (Đã hoàn thành)
- [x] `clearAllCache()` trước destructive operations (`SettingsPage.tsx`)
- [x] Scope-filtered Event Bus → `shouldInvalidateKey(key, scope)` trong `useSWR.ts` (tránh refetch dư thừa)

### P1 — Important (Đã hoàn thành)
- [x] TTL per-entity standards (`STALE_TIMES`: wallets/categories → 30 phút, transactions → 1 phút)
- [x] `invalidateCache(key)` & `invalidateCacheByPrefix()` trong `useSWR.ts`

### P2 — Advanced Features (Đã hoàn thành)
- [x] Cross-tab sync tự động bằng `BroadcastChannel` API trong `eventBus.ts`
- [ ] Optimistic UI updates bằng `setSWRData()` cho các form đặc thù khi mở rộng
- [ ] localStorage quota monitoring → auto-cleanup khi gần đầy

---

*Tài liệu này được tạo: 2026-08-05 | Source: Cogover/omni-server, Cogover/object-server*

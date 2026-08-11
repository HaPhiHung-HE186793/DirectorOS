# Knowledge: QR Payment Integration (VietQR / EMVCo)

> **Cập nhật**: 2026-08-02 | **Phase**: 8 — QR Payment Feature
> Tài liệu này được tạo sau khi nghiên cứu và implement thành công tính năng QR Payment cho app tài chính cá nhân.

---

## 1. Bối cảnh Kỹ thuật VN

### Tại sao không thể auto-record mà không cần user confirm?

App cá nhân (không phải fintech có license) **không thể**:
- Trực tiếp đọc số dư tài khoản ngân hàng
- Nhận callback trực tiếp từ ngân hàng khi có giao dịch
- Thực hiện chuyển tiền thay người dùng

**Giải pháp cấp độ cá nhân:**
1. **Level 1 (Smart Confirm — Không cần đăng ký)**: Parse QR → pre-fill → user xác nhận 1 tap
2. **Level 2 (SePay/Casso webhook)**: Dịch vụ thứ 3 monitor tài khoản → gửi webhook khi có giao dịch

**Level 1 được khuyến nghị** vì:
- Không chia sẻ tài khoản ngân hàng với bên thứ 3
- Miễn phí hoàn toàn
- Chỉ tốn 1 tap xác nhận thêm so với Level 2
- Không cần server public URL cho webhook

---

## 2. Chuẩn EMVCo QR (VietQR)

### Định dạng TLV (Tag-Length-Value)

VietQR tuân chuẩn EMVCo — mỗi field là chuỗi `[2 digit tag][2 digit length][value]`:

```
000201          → Tag 00 (Payload Format): "01"
010211          → Tag 01 (Point of Initiation): "11" = static QR
...
5204xxxx        → Tag 52 (Merchant Category Code)
5303704         → Tag 53 (Transaction Currency): "704" = VND
54XXXX          → Tag 54 (Amount) — CHỈ có ở Dynamic QR
...
51XXXXXX        → Tag 51 (Merchant Account Info — VietQR core)
  0038xxx       → GUID dịch vụ
  01XXXXXX      → Bank BIN (6 số) — "970436" = Vietcombank
  02XXXXXX      → Số tài khoản
...
62XX            → Tag 62 (Additional Data)
  08XX          → Sub-tag 08 (Bill/Purpose of transaction)
```

### Parse Algorithm

```typescript
// Validate: phải bắt đầu "000201"
if (!qrString.startsWith('000201')) return invalid

// Parse TLV loop
pos = 0
while (pos < qrString.length - 4):
  tag = qrString[pos:pos+2]
  len = parseInt(qrString[pos+2:pos+4])
  value = qrString[pos+4:pos+4+len]
  tags[tag] = value
  pos += 4 + len

// Extract
amount = tags['54'] ? parseInt(tags['54']) : null   // null = QR tĩnh
content = tags['62']?.sub['08'] hoặc sub['05']
bankBin = tags['51']?.sub['01']?.replace(/\D/g,'').slice(-6)
accountNo = tags['51']?.sub['02']
```

---

## 3. VietQR Deep Link

### Cấu trúc URL

```
https://dl.vietqr.io/pay?app={appId}&ba={account}@{bin}&am={amount}&tn={content}
```

| Param | Mô tả | Ví dụ |
|-------|-------|-------|
| `app` | App ID ngân hàng (optional) | `vcb`, `mb`, `acb`, `bidv` |
| `ba` | Bank Account: `{accountNo}@{BIN}` | `0123456789@970436` |
| `am` | Số tiền (VND, nguyên) | `150000` |
| `tn` | Nội dung CK (URL-encoded) | `Cafe+ABC` |

### App ID phổ biến tại VN

| App ID | Ngân hàng | BIN |
|--------|-----------|-----|
| `vcb` | Vietcombank | 970436 |
| `mb` | MB Bank | 970422 |
| `tcb` | Techcombank | 970407 |
| `acb` | ACB | 970416 |
| `bidv` | BIDV | 970418 |
| `icb` | VietinBank | 970415 |
| `agb` | Agribank | 970405 |
| `tpb` | TPBank | 970423 |
| `vpb` | VPBank | 970432 |

### Lưu ý quan trọng

- Deep link **CHỈ hoạt động trên mobile** — desktop không mở được app ngân hàng
- Cần app ngân hàng đã cài trên điện thoại
- App ID có thể thay đổi — nên fetch từ VietQR API: `GET https://api.vietqr.io/v2/android-app-deeplinks` hoặc `/ios-app-deeplinks`
- `app` param là optional — không có thì hệ thống hiển thị menu chọn app

---

## 4. VietQR API Public

### Endpoint lấy danh sách ngân hàng

```
GET https://api.vietqr.io/v2/banks
```

Response:
```json
{
  "code": "00",
  "data": [
    {
      "id": 1,
      "name": "Ngân Hàng TMCP Ngoại Thương Việt Nam",
      "code": "VCB",
      "bin": "970436",
      "short_name": "Vietcombank",
      "logo": "https://api.vietqr.io/img/VCB.png",
      "transferSupported": 1,
      "lookupSupported": 1
    }
    // ...
  ]
}
```

**Khuyến nghị:** Cache phía backend 24h vì dữ liệu ít thay đổi.

### Logo ngân hàng

```
https://api.vietqr.io/img/{BANK_CODE}.png
```
Ví dụ: `https://api.vietqr.io/img/VCB.png`

---

## 5. html5-qrcode Library

### Setup cơ bản

```typescript
import { Html5Qrcode } from 'html5-qrcode'

const scanner = new Html5Qrcode('container-id')

await scanner.start(
  { facingMode: 'environment' },  // Camera sau
  { fps: 10, qrbox: { width: 260, height: 260 } },
  (decoded) => { /* QR detected */ },
  () => {}  // Frame không decode được (bỏ qua)
)

// Cleanup
const state = scanner.getState()
if (state === 2) await scanner.stop()  // State 2 = SCANNING
```

### Yêu cầu

- **HTTPS** bắt buộc trên production (localhost OK cho dev)
- Cần xử lý `camera permission denied` gracefully → fallback sang nhập thủ công
- Dynamic import để tránh SSR issues: `const { Html5Qrcode } = await import('html5-qrcode')`

---

## 6. Flow Nghiệp vụ Hoàn chỉnh

```
User mở QR Pay
    ↓
Camera quét QR (html5-qrcode) | Hoặc nhập thủ công
    ↓
POST /api/qrpay/parse-qr → Parse EMVCo → trả về bank/account/amount/content
    ↓
User xem thông tin (pre-filled), chọn ví + danh mục (AI gợi ý từ nội dung CK)
    ↓
POST /api/qrpay/create-pending → Lưu pending (30 phút TTL) → trả về deepLinkUrl
    ↓
window.open(deepLinkUrl) → Mở app ngân hàng → User FaceID/PIN → Chuyển tiền
    ↓
User quay lại app → Nhấn "✅ Đã Thanh Toán"
    ↓
PATCH /api/qrpay/confirm/:id → Atomic transaction:
  1. prisma.transaction.create({ type: 'EXPENSE', amount, wallet, category })
  2. prisma.wallet.update({ balance: { decrement: amount } })
  3. prisma.qRPendingTransaction.update({ status: 'CONFIRMED', confirmedAt: now })
    ↓
Dashboard refresh → Bản ghi xuất hiện ✅
```

---

## 7. DB Design Decisions

### Tại sao cần QRPendingTransaction?

Cần bridge giữa "user nhấn mở app ngân hàng" và "user quay lại xác nhận":
- Lưu toàn bộ data đã parse + ví/danh mục đã chọn
- TTL 30 phút (đủ cho cả flow thanh toán)
- Cleanup tự động khi GET /pending

### Tại sao amount là BigInt?

Nhất quán với toàn bộ codebase — tất cả tiền tệ VND đều là BigInt để tránh float precision issues. Khi trả về JSON phải `Number(amount)`.

### Atomic Confirm Pattern

```typescript
await prisma.$transaction([
  prisma.transaction.create({ ... }),
  prisma.wallet.update({ balance: { decrement: amount } }),
  prisma.qRPendingTransaction.update({ status: 'CONFIRMED' }),
])
```

Nếu bất kỳ bước nào fail → rollback tất cả. Đảm bảo tính nhất quán.

---

## 8. Bài Học Rút Ra

1. **EMVCo parse không cần thư viện** — tự implement TLV parser ~50 dòng là đủ, không phụ thuộc npm
2. **html5-qrcode cần cleanup cẩn thận** — check `scanner.getState() === 2` trước khi `stop()`, nếu không sẽ throw error
3. **Camera trên mobile browser** — cần HTTPS, nên luôn có fallback nhập thủ công
4. **Deep link chỉ hoạt động trên mobile** — trên desktop nên thay bằng hiển thị QR code để user quét bằng app ngân hàng
5. **Prisma enum name** — `QRPendingStatus` trong schema tạo ra `prisma.qRPendingTransaction` (camelCase của model name)
6. **ZodError API** — Zod v3+ dùng `err.issues` thay vì `err.errors`
7. **req.params** trong Express TypeScript — có type `string | string[]`, phải cast `req.params.id as string`

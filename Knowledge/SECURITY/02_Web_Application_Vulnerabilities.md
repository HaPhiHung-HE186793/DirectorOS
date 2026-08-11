# OWASP Top 10 Web Vulnerabilities & Defense Mechanics

> **Tài liệu Security Standard**: Allow-list Input Validation, SQL Injection, XSS, XXE, SSRF, và IDOR.

---

## 1. PHÒNG CHỐNG CÁC LỖ HỔNG LỚN (OWASP TOP 10)
- **Input Validation (Allow-list)**: Chấp nhận dữ liệu biết an toàn thay vì cố gắng lọc dữ liệu xấu.
- **SQL Injection**: Sử dụng Parameterized Queries (ORM/Prisma). Tuyệt đối không nối chuỗi SQL.
- **Cross-Site Scripting (XSS)**: Encode output HTML. Dùng `DOMPurify.sanitize()` khi render HTML động.
- **XXE & SSRF**: Vô hiệu hóa external entities khi parse XML; kiểm tra ranh giới URL với SSRF.
- **IDOR (Insecure Direct Object Reference)**: Kiểm tra quyền sở hữu record trên server:
```typescript
const bill = await prisma.groupBill.findFirst({
  where: { id: billId, userId: req.userId }
})
if (!bill) return res.status(404).json({ error: 'Không tìm thấy hóa đơn' })
```

# Unit Testing Principles (Vladimir Khorikov) & Mocking Rules

> **Tài liệu Unit Test Advanced**: 4 Trụ cột Unit Test tốt, Mocks vs Stubs, và Tránh Mocking Domain Models.

---

## 1. 4 TRỤ CỘT UNIT TEST CHUẨN (KHORIKOV)
1. **Protection against regressions**: Kiểm tra được nhiều mã nghiệp vụ quan trọng.
2. **Resistance to refactoring**: Bài test không bị vỡ vô lý khi refactor code bên trong mà kết quả trả về không đổi.
3. **Fast feedback**: Phản hồi tức thì trong vài giây.
4. **Maintainability**: Code test dễ đọc, dễ bảo trì.

---

## 2. MOCKS VS STUBS RULES
- **Mocks**: Kiểm tra tương tác đầu ra (Out-of-process dependencies như Mailer, SMS Service).
- **Stubs**: Giả lập dữ liệu đầu vào (In-process dependencies).
- Tuyệt đối KHÔNG mock Domain Models hoặc Value Objects.

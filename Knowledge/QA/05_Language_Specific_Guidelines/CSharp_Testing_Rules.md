# C# / .NET Testing Rules: xUnit, Moq & FluentAssertions

> **Tài liệu Testing Language-Specific**: Tiêu chuẩn xUnit, Moq, FluentAssertions, Positive & Negative Case Separation.

---

## 1. TIÊU CHUẨN KIỂM THỬ C#
- **Stack**: xUnit + Moq + FluentAssertions.
- **Tách biệt Positive vs Negative Cases**: Parameterized Tests (`[Theory]`, `[InlineData]`) phải tách biệt rõ ràng các test case thành công và thất bại ra các theories độc lập.

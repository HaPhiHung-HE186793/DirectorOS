# Clean Test Code Principles & AAA Pattern

> **Tài liệu Unit Test**: Pattern Arrange-Act-Assert (AAA), DAMP thay vì DRY trong Test, và Prefactoring.

---

## 1. NGUYÊN TẮC VIẾT MÃ TEST SẠCH
- **Mẫu AAA (Arrange - Act - Assert)**: Mỗi bài test chia rõ 3 phần. Chỉ có MỘT chu kỳ Act-Assert trong một test method.
- **DAMP > DRY trong Code Test**: DAMP (Descriptive and Meaningful Phrases) quan trọng hơn DRY. Ưu tiên tính dễ đọc ngữ cảnh hơn loại bỏ sự lặp lại.
- **Prefactoring**: Tái cấu trúc code hiện tại trước khi triển khai tính năng / test mới thành Pull Request riêng biệt.

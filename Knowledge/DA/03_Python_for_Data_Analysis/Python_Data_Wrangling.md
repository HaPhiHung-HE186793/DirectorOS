# Python Data Wrangling: Pandas & NumPy Engine

> **Tài liệu Data Science**: Biến đổi dữ liệu tài chính hiệu năng cao với Pandas Vectorization.

---

## 1. HỆ SINH THÁI NÒNG CỐT: NUMPY & PANDAS
- **Vectorized Computation**: Tránh sử dụng vòng lặp `for` thủ công. Pandas thực hiện tính toán mảng vector hóa bằng thư viện C/Fortran bên dưới.
- **Data Structures**: `DataFrame` (bảng 2 chiều có nhãn) và `Series` (mảng 1 chiều có nhãn).

---

## 2. QUY TRÌNH XỬ LÝ DỮ LIỆU TÀI CHÍNH (PANDAS WRANGLING)

```python
import pandas as pd
import numpy as np

# 1. Load & Deduplicate
df = pd.read_csv('transactions.csv')
df.drop_duplicates(subset=['raw_content', 'created_at'], inplace=True)

# 2. Handle Missing Values
df['category_name'].fillna('Chưa phân loại', inplace=True)

# 3. Time Series Resampling
df['created_at'] = pd.to_datetime(df['created_at'])
monthly_trend = df.resample('ME', on='created_at')['amount'].sum()
```

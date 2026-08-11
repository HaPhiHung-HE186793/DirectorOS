# Terraform Architecture, Remote State & Workspace Isolation

> **Tài liệu DevOps Terraform**: Quản lý State mã hóa từ xa, Cô lập môi trường và Reusable Modules.

---

## 1. QUẢN LÝ STATE TỪ XA (REMOTE BACKEND & LOCKING)
- Bắt buộc lưu trữ file `.tfstate` trên Remote Backend (như AWS S3 + DynamoDB Table Locking hoặc HashiCorp Terraform Cloud).
- Ngăn chặn xung đột khi nhiều kỹ sư cùng chạy `terraform apply`.

---

## 2. CẤU TRÚC THƯ MỤC CÔ LẬP MÔI TRƯỜNG

```
terraform/
├── global/             # Tài nguyên dùng chung (IAM, S3 Buckets)
├── environments/
│   ├── staging/        # Cô lập môi trường Staging (VPC, DB, K8s)
│   └── production/     # Cô lập môi trường Production
└── modules/            # Reusable Infrastructure Blueprints (vpc, rds, eks)
```

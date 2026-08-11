# Container Orchestration & Kubernetes (K8s) Architecture

> **Tài liệu Kubernetes Architecture**: Control Plane vs Worker Nodes, Core Objects (Pod, Deployment, Service, Namespace), và Zero-Downtime Deployments.

---

## 1. KIẾN TRÚC THÀNH PHẦN KUBERNETES
- **Control Plane**: Bộ não cụm K8s (API Server, etcd, Controller Manager, Scheduler).
- **Worker Nodes**: Chịu trách nhiệm chạy các container thực tế (Kubelet, Kube-proxy, Container Runtime).

---

## 2. CÁC ĐỐI TƯỢNG CỐT LÕI (K8S CORE OBJECTS)
- **Pod**: Đơn vị nhỏ nhất chứa một hoặc nhiều container chia sẻ IP và storage.
- **Deployment**: Quản lý bản sao (Replicas) Pods và hỗ trợ Zero-downtime Rolling Updates.
- **Service**: Định tuyến IP/DNS ổn định và Cân bằng tải (Load Balancing) tới các Pods.
- **Namespace**: Phân vùng ranh giới logic cô lập môi trường.

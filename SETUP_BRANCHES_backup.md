# 🚀 HƯỚNG DẪN SETUP BRANCHES CHO 3 NGƯỜI

## Bước 1: Clone repository (nếu chưa có)
```bash
git clone [url-repository]
cd fe-ecommerce-main
```

## Bước 2: Tạo branch cho từng người

### 👤 Person 1 - Authentication & User Management
```bash
git checkout -b feature/auth-user-management
git push -u origin feature/auth-user-management
```

### 👤 Person 2 - Product & Shopping
```bash
git checkout -b feature/product-shopping
git push -u origin feature/product-shopping
```

### 👤 Person 3 - Orders, Checkout & Admin
```bash
git checkout -b feature/orders-checkout-admin
git push -u origin feature/orders-checkout-admin
```

## Bước 3: Cài đặt dependencies (nếu chưa có)
```bash
npm install
```

## Bước 4: Chạy dev server
```bash
npm run dev
```

## Bước 5: Bắt đầu làm việc!

Mỗi người làm việc trên branch của mình và commit thường xuyên.

---

## 📋 QUY TRÌNH HÀNG NGÀY

### Khi bắt đầu làm việc:
```bash
# 1. Chuyển sang branch của bạn
git checkout feature/[tên-branch-của-bạn]

# 2. Pull code mới nhất từ main
git pull origin main

# 3. Bắt đầu code
```

### Khi commit:
```bash
# 1. Xem những gì đã thay đổi
git status

# 2. Add files
git add [files của bạn]

# 3. Commit
git commit -m "feat: [module] - [mô tả]"

# 4. Push lên remote
git push origin feature/[tên-branch-của-bạn]
```

### Khi có conflict:
```bash
# 1. Pull lại từ main
git pull origin main

# 2. Giải quyết conflict trong code editor

# 3. Add files đã sửa
git add .

# 4. Commit
git commit -m "fix: resolve conflicts"

# 5. Push lại
git push origin feature/[tên-branch-của-bạn]
```

---

## 🔀 MERGE VÀO MAIN

Khi hoàn thành phần của mình:
1. Tạo Pull Request trên GitHub/GitLab
2. Yêu cầu review từ các thành viên khác
3. Sau khi được approve, merge vào main
4. Xóa branch cũ (nếu muốn)

---

**Lưu ý:** Luôn làm việc trên branch riêng, không commit trực tiếp vào main!


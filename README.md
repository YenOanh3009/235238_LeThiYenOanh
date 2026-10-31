# Hệ Thống Quản Lý Thiết Bị Phòng Học Trên Nền Tảng Đám Mây

- **Họ và tên:** Lê Thị Yến Oanh
- **MSSV:** 235238
- **Học phần:** Điện toán đám mây

## 1. Mô tả đề tài
Hệ thống hỗ trợ quản lý danh sách thiết bị phòng học, theo dõi tình trạng sử dụng (`Đang sử dụng`, `Hư hỏng`, `Đang sửa chữa`, `Ngừng sử dụng`), tìm kiếm theo từ khóa và thực hiện các chức năng Thêm, Xem chi tiết, Cập nhật, Xóa (CRUD).

## 2. Công nghệ sử dụng
- **Frontend:** React, Fetch API, CSS3
- **Backend:** Node.js, Express, Mongoose
- **Cơ sở dữ liệu:** MongoDB Atlas (Database: `235238_LeThiYenOanh`, Collection: `devices`)
- **Đóng gói & Triển khai:** Git/GitHub, Docker, Docker Hub, Render

## 3. Cấu trúc dự án
- `backend/`: Mã nguồn RESTful API (Node.js + Express) và Dockerfile.
- `frontend/`: Mã nguồn giao diện (React) và Dockerfile.

## 4. Hướng dẫn cài đặt và chạy chương trình (Local)
- **Backend:** `cd backend` -> `npm install` -> Tạo `.env` -> `npm start` (cổng 5000)
- **Frontend:** `cd frontend` -> `npm install` -> Tạo `.env` -> `npm start` (cổng 3000)

## 5. Hướng dẫn chạy bằng Docker
*(Cập nhật ở Câu 5 và Câu 6)*

* Link_GitHub: https://github.com/YenOanh3009/235238_LeThiYenOanh
* Link_Docker_Backend: https://hub.docker.com/r/banhque/backend
* Link_Docker_Frontend: https://hub.docker.com/r/banhque/frontend
* Link_Render_App (Web): https://web-235238.onrender.com
* Link_Render_API: https://api-235238.onrender.com
* Link_Data_MongoDB: mongodb+srv://cluster0.hapoitl.mongodb.net/235238_LeThiYenOanh (Đã ẩn user/password bảo mật)
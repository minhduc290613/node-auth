# NodeAuth Portal

<p align="center">
  <img src="https://photos.fife.usercontent.google.com/pw/AP1GczOcS6HnH-XgWSq2zcKFOLBAyIyUpQDhZ7wRkzTkjaiosRtLqRnqQGwg=w2229-h1291-s-no-gm?authuser=0?auto=format&fit=crop&w=1200&q=80" alt="NodeAuth Banner" width="100%" style="border-radius: 10px; max-height: 320px; object-fit: cover;" />
</p>

<p align="center">
  <strong>Hệ thống xác thực người dùng hiện đại, bảo mật và module hoá dành cho Express.js</strong><br>
  Tích hợp <em>Supabase Auth (JWT + Cookie HttpOnly)</em>, giao diện đóng gói bằng <em>Vite</em> và <em>EJS Template Engine</em>.
</p>

> [!WARNING]
> This code can be buggy or laggy.

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-4.18-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/Supabase-Auth-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Vite-5.1-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/License-MIT-blue.style=for-the-badge" alt="License" />
</p>

---

## Ngôn ngữ / Languages
- [Tiếng Việt](#tiếng-việt)
- [English](#english)

---

## Cấu Trúc Dự Án (Project Structure)

```text
node-auth/
├── public/                     # Static files được Vite đóng gói
│   ├── css/bundle.css          # CSS compiled
│   └── js/bundle.js            # JS compiled
├── src/
│   ├── client/                 # Mã nguồn frontend (Client-side)
│   │   ├── css/style.css       # Custom styles & themes
│   │   └── js/                 # Client scripts (main.js, api.js, ui.js)
│   ├── config/
│   │   ├── site.js             # Cấu hình thương hiệu, theme, banner
│   │   └── supabase.js         # Khởi tạo Supabase client
│   ├── controllers/
│   │   └── authController.js   # Xử lý logic đăng nhập, đăng ký, đăng xuất
│   ├── middleware/
│   │   └── authMiddleware.js   # Kiểm tra và xác thực JWT token (requireAuth)
│   └── routes/
│       ├── authRoutes.js       # Các router API xác thực (/api/auth)
│       └── viewRoutes.js       # Các router render trang EJS (/, /dashboard)
├── views/                      # EJS Templates
│   ├── index.ejs               # Giao diện xác thực (Tabs đăng nhập/đăng ký)
│   ├── dashboard.ejs           # Giao diện sau khi đăng nhập thành công
│   └── error.ejs               # Trang thông báo lỗi
├── .env                        # Biến môi trường (PORT, SUPABASE keys)
├── package.json                # Dependencies & scripts
├── server.js                   # Điểm khởi chạy ứng dụng Express
└── vite.config.js              # Cấu hình bundler Vite
```

---

## Tiếng Việt

### Tính Năng Nổi Bật
- **Bảo mật cao:** Sử dụng mã hoá JWT lưu trữ trong Cookie với cờ `HttpOnly`, phòng chống tấn công XSS & đánh cắp token.
- **Supabase Backend:** Quản lý tài khoản người dùng tự động (bảng `auth.users`), không cần viết lệnh SQL hay dựng bảng database thủ công.
- **Tuỳ biến linh hoạt:** Quản lý toàn bộ thương hiệu (Logo, Tên web, Banner, Theme, Feature list) tập trung qua file `src/config/site.js` mà không phải can thiệp code HTML/CSS.
- **Kiến trúc MVC & Modular:** Dễ bảo trì, mở rộng và dễ dàng trích xuất để nhúng vào bất kỳ ứng dụng Express có sẵn nào.
- **Hiệu năng tối ưu:** Đóng gói CSS và JS phía client thông qua Vite.

---

### 1. Cấu Hình Supabase 

Bạn **không cần** tạo database hay bảng dữ liệu thủ công. Bảng người dùng (`auth.users`) được Supabase tự động quản lý.

#### Bước 1: Tạo dự án
1. Truy cập [Supabase Dashboard](https://supabase.com) và đăng nhập.
2. Nhấn **New Project**, điền thông tin (Tên dự án, Mật khẩu Database, chọn Region gần nhất như *Singapore*).

#### Bước 2: Lấy thông tin API
1. Chọn **Project Settings** (biểu tượng bánh răng góc dưới bên trái) -> **API**.
2. Sao chép 2 giá trị:
   - **Project URL** (tương ứng với biến `SUPABASE_URL`).
   - **Project API keys** -> dòng `anon` `public` (tương ứng với biến `SUPABASE_ANON_KEY`).

#### Bước 3: Cài đặt Authentication (Local Development)
> [!IMPORTANT]
> Hãy thực hiện bước này để có thể đăng ký và thử nghiệm đăng nhập ngay lập tức mà không bị chặn bởi bước xác thực email.

1. Vào **Authentication** -> **Providers** -> Chọn **Email**.
2. **Tắt (OFF)** tuỳ chọn *Confirm email*.
3. Vào **Authentication** -> **URL Configuration**:
   - **Site URL**: `http://localhost:3000` hoặc domain của bạn
   - **Redirect URLs**: Thêm `http://localhost:3000/reset-password` hoặc domain của bạn/reset-password

---

### 2. Cài Đặt & Khởi Chạy Dự Án

#### Bước 1: Di chuyển vào thư mục và cài đặt thư viện
```bash

npm install
```

#### Bước 2: Thiết lập biến môi trường (.env)
Tạo file `.env` với nội dung:
```env
PORT=3000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
```

#### Bước 3: Tuỳ chỉnh thương hiệu & Banner
Chỉnh sửa file `src/config/site.js` để tuỳ biến thông tin hiển thị trên giao diện:
```javascript
export const siteConfig = {
  title: "NodeAuth Portal - Hệ Thống Đăng Nhập",
  favicon: "https://supabase.com/favicon/favicon-32x32.png",
  background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
  banner: {
    badge: "Phiên bản 2.0",
    title: "Trải nghiệm Nền tảng Bảo mật & Siêu Tốc",
    subtitle: "Tích hợp Node.js, Express và Supabase Auth. Quản lý tài khoản an toàn.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    features: [
      "Xác thực Token mã hóa chuẩn JWT",
      "Bảo mật Cookie HttpOnly",
      "Tốc độ xử lý dữ liệu tức thì"
    ]
  }
};
```

#### Bước 4: Build Frontend & Khởi chạy máy chủ
```bash
# Đóng gói tài nguyên giao diện bằng Vite (tạo bundle trong public/)
npm run build

# Khởi chạy server ở chế độ phát triển (Auto-reload với nodemon)
npm run dev
```

Mở trình duyệt và truy cập: **[http://localhost:3000](http://localhost:3000)**hoặc domain của bạn

---

### 3. Tích Hợp Vào Dự Án Express Có Sẵn

Nếu bạn muốn ghép module xác thực này vào một dự án Express đang chạy:

1. **Sao chép các file/thư mục sau vào dự án của bạn:**
   - `src/config/supabase.js`
   - `src/controllers/authController.js`
   - `src/middleware/authMiddleware.js`
   - `src/routes/authRoutes.js`

2. **Cài đặt các gói phụ thuộc:**
   ```bash
   npm install @supabase/supabase-js cookie-parser dotenv
   ```

3. **Cấu hình Middleware & Routes trong `server.js` (hoặc `app.js`):**
   ```javascript
   import cookieParser from 'cookie-parser';
   import authRoutes from './src/routes/authRoutes.js';
   import { requireAuth } from './src/middleware/authMiddleware.js';

   // Kích hoạt đọc cookie
   app.use(cookieParser());

   // Mount các API routes xác thực (/login, /register, /forgot, /logout)
   app.use('/api/auth', authRoutes);

   // Bảo vệ các trang nội bộ bằng requireAuth middleware:
   app.get('/dashboard', requireAuth, (req, res) => {
     res.render('dashboard', { user: req.user });
   });
   ```

---

## English

### Key Features
- **High Security:** Uses JWT stored in `HttpOnly` cookies, preventing XSS and token-theft attacks.
- **Supabase Powered:** Fully managed authentication and user management (`auth.users`) without writing manual SQL schemas.
- **Centralized Config:** Easily rebrand Title, Favicon, Theme Background, and Banner features via `src/config/site.js` without touching HTML/CSS.
- **MVC & Modular:** Clean separation of concerns, easy to integrate into any existing Express.js project.
- **Optimized Assets:** Client styles and scripts are bundled via Vite.

---

### 1. Supabase Configuration (Takes 2 minutes)

You **do not** need to create user tables manually. The user database (`auth.users`) is automatically handled by Supabase.

#### Step 1: Create a Project
1. Go to [Supabase Dashboard](https://supabase.com) and sign in.
2. Click **New Project**, fill in the details (Project Name, Database Password, select Region).

#### Step 2: Get API Keys
1. Navigate to **Project Settings** (gear icon at bottom left) -> **API**.
2. Copy these 2 credentials:
   - **Project URL** (`SUPABASE_URL`).
   - **Project API keys** -> `anon` `public` key (`SUPABASE_ANON_KEY`).

#### Step 3: Auth Settings (Recommended for Local Dev)
> [!IMPORTANT]
> Disable email confirmation for local testing to test login/signup instantly.

1. Go to **Authentication** -> **Providers** -> Select **Email**.
2. Turn **OFF** the *Confirm email* option.
3. Go to **Authentication** -> **URL Configuration**:
   - **Site URL**: `http://localhost:3000` or `https://yourdomain.com`
   - **Redirect URLs**: Add `http://localhost:3000/reset-password` or `https://yourdomain.com/reset-password`

---

### 2. Setup & Installation

#### Step 1: Enter directory and install dependencies
```bash
npm install
```

#### Step 2: Configure Environment Variables
Create a `.env` :
```env
PORT=3000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
```

#### Step 3: Customize Branding & Content
Edit `src/config/site.js` to customize your application's appearance:
```javascript
export const siteConfig = {
  title: "Your Web Title",
  favicon: "/your-favicon.ico",
  background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
  banner: {
    badge: "New Version",
    title: "Welcome Heading",
    subtitle: "Brief description of your app",
    image: "https://your-banner-image-url.jpg",
    features: ["Feature 1", "Feature 2", "Feature 3"]
  }
};
```

#### Step 4: Build Assets & Start Server
```bash
# Bundle frontend assets via Vite
npm run build

# Start dev server with nodemon
npm run dev
```

Visit the application at: **[http://localhost:3000](http://localhost:3000)**

---

### 3. Integrate Into Your Existing Express App

1. **Copy the following files into your project:**
   - `src/config/supabase.js`
   - `src/controllers/authController.js`
   - `src/middleware/authMiddleware.js`
   - `src/routes/authRoutes.js`

2. **Install required packages:**
   ```bash
   npm install @supabase/supabase-js cookie-parser dotenv
   ```

3. **Mount Middleware & Routes in `server.js` or `app.js`:**
   ```javascript
   import cookieParser from 'cookie-parser';
   import authRoutes from './src/routes/authRoutes.js';
   import { requireAuth } from './src/middleware/authMiddleware.js';

   app.use(cookieParser());
   app.use('/api/auth', authRoutes);

   // Protect any route:
   app.get('/protected-dashboard', requireAuth, (req, res) => {
     res.render('dashboard', { user: req.user });
   });
   ```

---

## API Endpoints

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/` | Trang chủ / Giao diện Đăng nhập & Đăng ký | No |
| `GET` | `/dashboard` | Trang quản trị người dùng sau khi đăng nhập | Yes |
| `POST` | `/api/auth/login` | Xác thực người dùng & cấp cookie JWT | No |
| `POST` | `/api/auth/register` | Đăng ký tài khoản người dùng mới | No |
| `POST` | `/api/auth/forgot` | Gửi email liên kết khôi phục mật khẩu | No |
| `GET` | `/api/auth/logout` | Xoá session cookie & đăng xuất | No |

---


## License

This code licensed under the [MIT](LICENSE) license.

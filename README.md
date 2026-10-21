# NodeAuth Portal

<p align="center">
  <img src="https://lh3.googleusercontent.com/pw/AP1GczPZQM7yUvNsugbKO8YdfFYVB4NF9W6FnNiCvkRrkuMwCuWzy52xIeTysc_t90LFC6KFyRV4MQHFfahDRysKaAbv3SaNONMpzeONdOeTnCuUcW1g624skh_HWkd4xDw7LdUGZB_wEa-ltTu03FTrSZhV=w2223-h1302-s-no-gm" alt="NodeAuth Banner" width="100%" style="border-radius: 10px; max-height: 320px; object-fit: cover;" />
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
</p>

---


## Ngôn ngữ / Languages
- [Tiếng Việt](#tiếng-việt)
- [English](#english)

---

## Demo

- Render: https://node-auth-6p5s.onrender.com

## Cấu Trúc Dự Án (Project Structure)

```text
node-auth/
├── public/                     # Static files
│   ├── css/bundle.css          # CSS compiled
│   └── js/bundle.js            # JS compiled
├── api/
│   └── index.js                # Vercel function entry point
├── src/
│   ├── app.js                  # Shared Express application
│   ├── client/                 # Frontend source code (Client-side)
│   │   ├── css/style.css       # Custom styles & themes
│   │   └── js/                 # Client scripts (main.js, api.js, ui.js)
│   ├── config/
│   │   ├── site.js             # Brand configuration, theme, banner
│   │   ├── admin.js            # Admin email allowlist
│   │   └── supabase.js         # Initialize Supabase client
│   ├── controllers/
│   │   └── authController.js   # Handle login, register, logout logic
│   ├── middleware/
│   │   └── authMiddleware.js   # Check and verify JWT token (requireAuth)
│   └── routes/
│       ├── authRoutes.js       # Authentication API routes (/api/auth)
│   └── viewRoutes.js       # EJS routes for login, dashboard, and admin pages
├── views/                      # EJS Templates
│   ├── index.ejs               # Authentication Interface (Login/Register Tabs)
│   ├── dashboard.ejs           # Interface after successful login
│   ├── admin.ejs               # Admin-only page
│   ├── oauth-callback.ejs      # GitHub OAuth callback
│   ├── error.ejs               # Error notification page
│   └── reset-password.ejs      # Password reset page
├── .env                        # Environment variables (PORT, SUPABASE keys)
├── package.json                # Dependencies & scripts
├── server.js                   # Express application entry point
├── vercel.json                 # Vercel serverless routing
└── vite.config.js              # Vite bundler configuration
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
  favicon: "https://supabase.com/favicon/favicon-32x32.png", //Favicon Here
  
  background: "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=75') center/cover no-repeat",

  banner: {
    badge: " Phiên bản 2.0",
    title: "Trải nghiệm Nền tảng Bảo mật & Siêu Tốc",
    subtitle: "Tích hợp Node.js, Express và Supabase Auth. Quản lý tài khoản dễ dàng, an toàn và tối ưu hiệu năng.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    features: [
      "Xác thực Token mã hóa chuẩn JWT",
      "Bảo mật Cookie HttpOnly",
      "Tốc độ xử lý dữ liệu tức thì"
    ]
  },
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
- **GitHub OAuth:** Sign in with GitHub through Supabase Auth.
- **Admin access:** Protect `/admin` with a configurable email allowlist.

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

#### Step 4: Enable GitHub sign-in
1. In Supabase, go to **Authentication** -> **Providers** -> **GitHub** and enable the provider.
2. Create a GitHub OAuth App. Set its authorization callback URL to the callback URL shown in your Supabase GitHub provider settings (`https://<project-ref>.supabase.co/auth/v1/callback`).
3. Add the app's client ID and secret to the Supabase provider settings.
4. Add `http://localhost:3000/auth/callback` and your production `/auth/callback` URL to Supabase's allowed redirect URLs.

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
APP_URL=http://localhost:3000
ADMIN_EMAILS=admin@example.com
```

`APP_URL` is the public origin used for OAuth and password-reset redirects. `ADMIN_EMAILS` is a comma-separated allowlist; only these signed-in email addresses can access `/admin`. Configure both values in Vercel's project environment variables for production.

#### Step 3: Customize Branding & Content
Edit `src/config/site.js` to customize your application's appearance:
```javascript
// src/config/site.js
export const siteConfig = {
  title: "Your web title",
  favicon: "you link favicon", //Favicon Here
  
  background: "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=75') center/cover no-repeat",

  banner: {
    badge: " version 2.0",
    title: "Welcome Heading",
    subtitle: "Brief description of your app",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    features: [
      "jwt token",
      "Cookie HttpOnly",
      "data processing speed"
    ]
  },
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

### Deploy to Vercel

Import the repository into Vercel and add `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `APP_URL` (your deployed `https://` origin), and `ADMIN_EMAILS` in the project's environment variables. Deploy with the included `vercel.json`; the Express application runs as a Vercel function. Add `https://your-domain/auth/callback` and `https://your-domain/reset-password` to Supabase's allowed redirect URLs, then use the Supabase callback URL in your GitHub OAuth App.

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
| `GET` | `/` | Sign-in and registration page | No |
| `GET` | `/api/auth/github` | Start GitHub OAuth sign-in | No |
| `GET` | `/auth/callback` | Complete GitHub sign-in | No |
| `GET` | `/dashboard` | Signed-in user's dashboard | Yes |
| `GET` | `/admin` | Admin page (requires an allowlisted email) | Admin |
| `POST` | `/api/auth/login` | Authenticate with email and password | No |
| `POST` | `/api/auth/register` | Create an account | No |
| `POST` | `/api/auth/forgot` | Send a password-reset email | No |
| `POST` | `/api/auth/update-password` | Update the account password | No |
| `POST` | `/api/auth/oauth-session` | Verify OAuth token and create session cookie | No |
| `GET` | `/api/auth/logout` | Clear the session cookie | No |
| `GET` | `/reset-password` | Password-reset page | No |

---
## Donate me

[![Donate Me](https://img.shields.io/badge/Donate-Me-ff69b4?style=for-the-badge&logo=githubsponsors&logoColor=white)](https://donate.protechvn.io.vn)

## License

This code licensed under the [MIT](LICENSE) license.

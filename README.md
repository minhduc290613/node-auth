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
  <img src="https://img.shields.io/badge/OAuth-GitHub%20%7C%20Google-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub and Google OAuth" />
  <img src="https://img.shields.io/badge/Supabase-OAuth%202.1-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase OAuth 2.1" />
  <img src="https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Deploy on Vercel" />
</p>

An Express authentication application powered by Supabase Auth. It includes email/password accounts, GitHub and Google sign-in, an administrator page, and a consent screen for Supabase's OAuth 2.1 / OpenID Connect server.

## Languages

- [Tiếng Việt](#tiếng-việt)
- [English](#english)

---

## Tiếng Việt

### Tính năng

- Đăng ký, đăng nhập, đăng xuất và khôi phục mật khẩu qua Supabase Auth.
- Đăng nhập xã hội bằng GitHub và Google.
- Trang `/admin` được giới hạn theo danh sách email trong `ADMIN_EMAILS`.
- Quản trị viên bật/tắt riêng nút GitHub và Google trong ứng dụng. Cài đặt được lưu trong Supabase Postgres để hoạt động ổn định trên Vercel.
- Trang đồng ý OAuth tại `/oauth/consent`, dùng khi ứng dụng bên ngoài đăng nhập bằng NodeAuth qua Supabase OAuth Server.
- Giao diện tiếng Anh, template EJS và tài nguyên frontend được build bằng Vite.
- Có thể chạy Express độc lập hoặc deploy dạng Vercel Function.

> Công tắc OAuth trong Admin điều khiển việc cho phép đăng nhập bằng provider trong ứng dụng này. Nó không thay đổi cấu hình provider trong Supabase Dashboard. Provider và OAuth credentials vẫn phải được bật/cấu hình trong Supabase.

### Yêu cầu

- Node.js 18 trở lên và npm.
- Dự án Supabase.
- GitHub OAuth App và Google OAuth Client nếu dùng các provider tương ứng.

### Cài đặt local

```bash
npm install
Copy-Item .env.example .env
```

Điền giá trị thật vào `.env`:

```env
PORT=3000
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-server-only-service-role-key
APP_URL=http://localhost:3000
ADMIN_EMAILS=admin@example.com
```

- `SUPABASE_URL`, `SUPABASE_ANON_KEY`: URL dự án và public/anon key từ Supabase.
- `SUPABASE_SERVICE_ROLE_KEY`: chỉ dùng phía server để đọc/cập nhật bảng cấu hình OAuth. **Không đưa key này vào frontend, Git, hoặc biến môi trường có tiền tố `VITE_`.**
- `APP_URL`: origin công khai của ứng dụng, không có dấu `/` cuối.
- `ADMIN_EMAILS`: danh sách email admin, phân cách bằng dấu phẩy.

Chạy migration tạo bảng lưu trạng thái provider bằng Supabase SQL Editor:

```text
supabase/migrations/20261021000000_oauth_provider_settings.sql
```

Migration tạo bảng `oauth_provider_settings`, mặc định tắt cả GitHub và Google, bật RLS và chỉ cấp quyền truy cập bảng cho `service_role`. Không cần tạo bảng thủ công khác cho người dùng; Supabase Auth quản lý `auth.users`.

Build và chạy:

```bash
npm run build
npm run dev
```

Mở <http://localhost:3000>. Đăng nhập bằng email thuộc `ADMIN_EMAILS`, sau đó vào **Admin page** để bật provider. Cần cấu hình provider trong Supabase trước khi bật.

### Cấu hình GitHub và Google sign-in

1. Trong Supabase Dashboard, vào **Authentication → Providers**, bật GitHub và/hoặc Google.
2. Tạo GitHub OAuth App và/hoặc Google OAuth Client. Dùng đúng **Callback URL** được hiển thị trong cài đặt provider của Supabase (thường là `https://<project-ref>.supabase.co/auth/v1/callback`).
3. Điền Client ID và Client Secret tương ứng vào cài đặt provider trong Supabase. Không lưu OAuth client secret trong repository.
4. Vào **Authentication → URL Configuration**:
   - Đặt **Site URL** là `APP_URL`.
   - Thêm `APP_URL/auth/callback` và `APP_URL/reset-password` vào danh sách Redirect URLs.
5. Bật/tắt từng nút sign-in trong `/admin`. Khi tắt ở đây, ứng dụng sẽ ẩn nút và từ chối yêu cầu đăng nhập OAuth trực tiếp cho provider đó.

### Bật Supabase OAuth 2.1 / OIDC Server

OAuth Server là tính năng biến dự án Supabase thành Identity Provider cho **các ứng dụng bên ngoài**. Đây là tính năng khác với GitHub/Google sign-in: GitHub và Google là cách người dùng đăng nhập vào NodeAuth; OAuth Server cho phép người dùng NodeAuth cấp quyền cho ứng dụng bên thứ ba.

1. Đặt URL Configuration **Site URL** trong Supabase là `APP_URL`.
2. Trong Supabase Dashboard, mở **Authentication → OAuth Server** và bật OAuth 2.1 Server.
3. Đặt **Authorization Path** thành `/oauth/consent`. NodeAuth phục vụ trang đồng ý tại đường dẫn này; trang yêu cầu đăng nhập nếu người dùng chưa có session, hiển thị client/scopes, sau đó gửi quyết định approve/deny về Supabase Auth.
4. Trong mục OAuth Server của Supabase, đăng ký OAuth client ứng dụng bên ngoài. Khai báo chính xác redirect URI của client; lưu `client_id` và `client_secret` theo yêu cầu của client đó.
5. Cấu hình client bên ngoài dùng các endpoint của dự án Supabase:

| Endpoint | URL |
| --- | --- |
| Authorization | `https://<project-ref>.supabase.co/auth/v1/oauth/authorize` |
| Token | `https://<project-ref>.supabase.co/auth/v1/oauth/token` |
| JWKS | `https://<project-ref>.supabase.co/auth/v1/.well-known/jwks.json` |
| OAuth discovery | `https://<project-ref>.supabase.co/.well-known/oauth-authorization-server/auth/v1` |
| OpenID Connect discovery | `https://<project-ref>.supabase.co/auth/v1/.well-known/openid-configuration` |

Đọc hướng dẫn chính thức: [Supabase OAuth 2.1 Server](https://supabase.com/docs/guides/auth/oauth-server), [Getting Started](https://supabase.com/docs/guides/auth/oauth-server/getting-started), và [OAuth Flows](https://supabase.com/docs/guides/auth/oauth-server/oauth-flows). Nếu dùng scope `openid`, hãy cấu hình signing key bất đối xứng theo tài liệu Supabase.

### Deploy lên Vercel

1. Import repository vào Vercel.
2. Thêm các biến môi trường ở trên trong **Project Settings → Environment Variables**. Đặt `APP_URL` thành URL HTTPS chính thức của deployment và cập nhật `ADMIN_EMAILS`.
3. Chạy migration SQL trong dự án Supabase production.
4. Deploy. Cấu hình `vercel.json` định tuyến Express app vào Vercel Function.
5. Cập nhật Supabase **Site URL**, Redirect URLs và OAuth provider callbacks theo domain production. GitHub/Google callback vẫn là callback URL của Supabase provider như đã ghi trong Supabase Dashboard.

Không commit `.env`; chỉ dùng `.env.example` làm mẫu. Sau khi thay đổi biến môi trường trên Vercel, redeploy để áp dụng.

### Kết nối vào website hiện có

**Cách 1 — Dùng NodeAuth làm website đăng nhập riêng:** deploy NodeAuth tại một subdomain, ví dụ `auth.example.com`, sau đó liên kết đến trang đăng nhập:

```html
<a href="https://auth.example.com/">Sign in</a>
```

Đặt `APP_URL=https://auth.example.com` và cấu hình Supabase Site URL, Redirect URLs theo domain này. Người dùng sẽ đăng nhập và quay lại dashboard của NodeAuth. Cookie `HttpOnly` được giới hạn theo domain xác thực; website ở domain khác **không thể đọc cookie này**. Nếu website chính cần tạo session riêng sau đăng nhập, cần triển khai một luồng callback/token exchange phía server cho website đó; không đưa service-role key hoặc access token vào JavaScript/frontend.

**Cách 2 — Bảo vệ route trong cùng ứng dụng Express:** dùng chung middleware xác thực và cookie parser. Cài các dependency của NodeAuth trong ứng dụng, cấu hình cùng Supabase URL/key, rồi bảo vệ route của website:

```js
import cookieParser from 'cookie-parser';
import { requireAuth } from './src/middleware/authMiddleware.js';

app.use(cookieParser());

app.get('/account', requireAuth, (req, res) => {
  res.render('account', { user: req.user });
});
```

Trong cùng ứng dụng/origin, liên kết đăng nhập có thể trỏ đến `/`; sau khi đăng nhập thành công, người dùng vào dashboard NodeAuth. Để chuyển hướng tới trang riêng của website sau đăng nhập, cần bổ sung callback/return URL allowlist cho ứng dụng; không nhận URL chuyển hướng tùy ý từ query string vì có thể tạo open redirect.

### Cấu trúc dự án

```text
node-auth/
├── api/
│   └── index.js                               # Vercel Function entry
├── public/
│   ├── css/bundle.css                         # Vite-built stylesheet
│   ├── js/bundle.js                           # Vite-built client bundle
│   └── stylesheets/style.css                  # Legacy static stylesheet
├── src/
│   ├── app.js                                 # Shared Express app
│   ├── client/
│   │   ├── css/style.css                      # Frontend source styles
│   │   └── js/
│   │       ├── api.js                         # Frontend API form helper
│   │       ├── main.js                        # Frontend entry and handlers
│   │       └── ui.js                          # Form switching and alerts
│   ├── config/
│   │   ├── admin.js                           # Admin email allowlist
│   │   ├── oauthProviders.js                  # OAuth provider settings
│   │   ├── site.js                            # Branding and banner content
│   │   └── supabase.js                        # Supabase Auth client
│   ├── controllers/
│   │   ├── authController.js                  # Email and social auth flows
│   │   ├── oauthProviderController.js         # Admin provider switch API
│   │   └── oauthServerController.js           # OAuth Server consent flow
│   ├── middleware/
│   │   └── authMiddleware.js                  # Session and admin protection
│   └── routes/
│       ├── adminRoutes.js                     # Admin API routes
│       ├── authRoutes.js                      # Authentication API routes
│       └── viewRoutes.js                      # Page routes
├── supabase/
│   └── migrations/
│       └── 20261021000000_oauth_provider_settings.sql
├── views/
│   ├── admin.ejs                              # Admin provider settings
│   ├── dashboard.ejs                          # Signed-in user dashboard
│   ├── error.ejs                              # Error page
│   ├── index.ejs                              # Sign-in and registration
│   ├── oauth-callback.ejs                     # Social OAuth callback
│   ├── oauth-consent.ejs                      # Supabase OAuth Server consent
│   └── reset-password.ejs                     # Password reset page
├── .env.example                               # Environment variable template
├── server.js                                  # Local Express server
├── vercel.json                                # Vercel deployment config
└── vite.config.js                             # Frontend build config
```

```text
api/index.js                         Vercel Function entry
src/app.js                           Express app dùng chung
src/config/oauthProviders.js         Cấu hình provider OAuth lưu trong Supabase
src/controllers/oauthServerController.js  OAuth consent flow
src/routes/adminRoutes.js            API admin bật/tắt provider
src/routes/authRoutes.js             API authentication
src/routes/viewRoutes.js             Login, dashboard, admin, consent pages
supabase/migrations/                 SQL migrations
views/                               EJS templates
vercel.json                          Vercel routing/build configuration
```

### Endpoints

| Method | Path | Mô tả | Quyền |
| --- | --- | --- | --- |
| `GET` | `/` | Đăng nhập / đăng ký | Công khai |
| `GET` | `/api/auth/oauth/:provider` | Bắt đầu GitHub hoặc Google OAuth | Provider phải đang bật |
| `GET` | `/auth/callback` | Hoàn tất social sign-in | Công khai |
| `GET` | `/oauth/consent` | Supabase OAuth Server consent UI | Đăng nhập |
| `POST` | `/api/auth/oauth-server/consent` | Gửi approve/deny cho Supabase | Đăng nhập |
| `GET` | `/dashboard` | Trang người dùng | Đăng nhập |
| `GET` | `/admin` | Trang quản trị provider | Admin |
| `PATCH` | `/api/admin/oauth-providers/:provider` | Bật/tắt `github` hoặc `google` | Admin |
| `POST` | `/api/auth/login` | Email/password sign-in | Công khai |
| `POST` | `/api/auth/register` | Tạo tài khoản | Công khai |
| `POST` | `/api/auth/forgot` | Gửi email khôi phục mật khẩu | Công khai |
| `POST` | `/api/auth/update-password` | Cập nhật mật khẩu | Công khai |
| `GET` | `/api/auth/logout` | Xóa session cookies | Đăng nhập |

---

## English

### Features

- Supabase Auth email/password sign-up, sign-in, sign-out, and password recovery.
- Social sign-in with GitHub and Google.
- `/admin` is restricted to email addresses configured in `ADMIN_EMAILS`.
- Admins can independently enable/disable GitHub and Google sign-in buttons. Settings are persisted in Supabase Postgres for Vercel serverless deployments.
- `/oauth/consent` provides the authorization screen for third-party apps using Supabase OAuth 2.1 / OpenID Connect Server.
- English EJS UI and Vite-built frontend assets.
- Run as a standalone Express server or deploy as a Vercel Function.

> The Admin OAuth switches control whether this app displays and accepts sign-in through each provider. They do not change provider settings in the Supabase Dashboard. The provider and its OAuth credentials must also be configured in Supabase.

### Requirements

- Node.js 18+ and npm.
- A Supabase project.
- A GitHub OAuth App and/or Google OAuth Client for the providers you intend to use.

### Local setup

```bash
npm install
cp .env.example .env
```

Set the values in `.env`:

```env
PORT=3000
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-server-only-service-role-key
APP_URL=http://localhost:3000
ADMIN_EMAILS=admin@example.com
```

- `SUPABASE_URL` and `SUPABASE_ANON_KEY`: project URL and public/anon key.
- `SUPABASE_SERVICE_ROLE_KEY`: server-only access to the OAuth settings table. **Never expose it to the browser, commit it, or use a `VITE_` variable name.**
- `APP_URL`: public app origin, without a trailing slash.
- `ADMIN_EMAILS`: comma-separated admin email allowlist.

Run the SQL migration in the Supabase SQL Editor:

```text
supabase/migrations/20261021000000_oauth_provider_settings.sql
```

It creates `oauth_provider_settings`, defaults both providers to disabled, enables RLS, and grants table access only to `service_role`. Supabase Auth manages user records in `auth.users`; no separate user table is needed.

Build and run:

```bash
npm run build
npm run dev
```

Open <http://localhost:3000>. Sign in with an address in `ADMIN_EMAILS`, open **Admin page**, and enable the providers you have configured in Supabase.

### Configure GitHub and Google sign-in

1. In the Supabase Dashboard, open **Authentication → Providers** and enable GitHub and/or Google.
2. Create a GitHub OAuth App and/or Google OAuth Client. Set each app's callback URL to the exact callback shown in its Supabase provider settings (commonly `https://<project-ref>.supabase.co/auth/v1/callback`).
3. Add the corresponding Client ID and Client Secret to the Supabase provider settings. Do not commit OAuth client secrets.
4. In **Authentication → URL Configuration**:
   - Set **Site URL** to `APP_URL`.
   - Add `APP_URL/auth/callback` and `APP_URL/reset-password` to the Redirect URLs allowlist.
5. Use `/admin` to enable or disable each app sign-in button. Disabled providers are hidden and direct OAuth start requests are rejected.

### Enable the Supabase OAuth 2.1 / OIDC Server

OAuth Server turns your Supabase project into an identity provider for **external applications**. This is separate from GitHub/Google sign-in: GitHub and Google let users sign in to NodeAuth; OAuth Server lets NodeAuth users grant access to third-party apps.

1. Set the Supabase **Authentication → URL Configuration → Site URL** to `APP_URL`.
2. In the Supabase Dashboard, open **Authentication → OAuth Server** and enable the OAuth 2.1 Server.
3. Set the **Authorization Path** to `/oauth/consent`. NodeAuth serves the consent UI there; it requires a signed-in user, displays the OAuth client and requested scopes, and submits the user's approval or denial to Supabase Auth.
4. Register each external OAuth client in the Supabase OAuth Server settings. Register its exact redirect URI and provide the resulting `client_id` and `client_secret` to that client.
5. Configure external clients with the Supabase project endpoints:

| Endpoint | URL |
| --- | --- |
| Authorization | `https://<project-ref>.supabase.co/auth/v1/oauth/authorize` |
| Token | `https://<project-ref>.supabase.co/auth/v1/oauth/token` |
| JWKS | `https://<project-ref>.supabase.co/auth/v1/.well-known/jwks.json` |
| OAuth discovery | `https://<project-ref>.supabase.co/.well-known/oauth-authorization-server/auth/v1` |
| OpenID Connect discovery | `https://<project-ref>.supabase.co/auth/v1/.well-known/openid-configuration` |

See the official [Supabase OAuth 2.1 Server guide](https://supabase.com/docs/guides/auth/oauth-server), [Getting Started](https://supabase.com/docs/guides/auth/oauth-server/getting-started), and [OAuth Flows](https://supabase.com/docs/guides/auth/oauth-server/oauth-flows). If clients request the `openid` scope, configure an asymmetric signing key as described in Supabase's documentation.

### Deploy to Vercel

1. Import the repository into Vercel.
2. Add the environment variables above under **Project Settings → Environment Variables**. Set `APP_URL` to the deployed HTTPS origin and configure `ADMIN_EMAILS`.
3. Run the SQL migration against the production Supabase project.
4. Deploy. `vercel.json` routes requests to the Express Vercel Function.
5. Update Supabase **Site URL**, Redirect URLs, and production domains. GitHub/Google callback URLs remain the Supabase provider callback URLs shown in the Dashboard.

Do not commit `.env`; use `.env.example` as a template. Redeploy after changing Vercel environment variables.

### Connect NodeAuth to an existing website

**Option 1 — Use NodeAuth as a separate sign-in portal:** deploy it on a subdomain such as `auth.example.com` and link to its sign-in page:

```html
<a href="https://auth.example.com/">Sign in</a>
```

Set `APP_URL=https://auth.example.com` and configure the matching Supabase Site URL and Redirect URLs. Users sign in and return to the NodeAuth dashboard. The `HttpOnly` cookie is scoped to the authentication host, so a website on another domain **cannot read it**. If your main website needs its own session after sign-in, implement a server-side callback/token exchange for that website; never put the service-role key or access token in frontend JavaScript.

**Option 2 — Protect routes in the same Express application:** use the authentication middleware and cookie parser in your website. Install NodeAuth's dependencies and configure the same Supabase URL/key, then protect a route:

```js
import cookieParser from 'cookie-parser';
import { requireAuth } from './src/middleware/authMiddleware.js';

app.use(cookieParser());

app.get('/account', requireAuth, (req, res) => {
  res.render('account', { user: req.user });
});
```

Within the same app/origin, the sign-in link can point to `/`; successful sign-in takes the user to the NodeAuth dashboard. To return users to a separate page on your website after sign-in, implement a callback/return-URL allowlist; do not accept arbitrary redirect URLs from query parameters, as that can create an open redirect.

### Project structure

```text
node-auth/
├── api/
│   └── index.js                               # Vercel Function entry
├── public/
│   ├── css/bundle.css                         # Vite-built stylesheet
│   ├── js/bundle.js                           # Vite-built client bundle
│   └── stylesheets/style.css                  # Legacy static stylesheet
├── src/
│   ├── app.js                                 # Shared Express app
│   ├── client/
│   │   ├── css/style.css                      # Frontend source styles
│   │   └── js/
│   │       ├── api.js                         # Frontend API form helper
│   │       ├── main.js                        # Frontend entry and handlers
│   │       └── ui.js                          # Form switching and alerts
│   ├── config/
│   │   ├── admin.js                           # Admin email allowlist
│   │   ├── oauthProviders.js                  # OAuth provider settings
│   │   ├── site.js                            # Branding and banner content
│   │   └── supabase.js                        # Supabase Auth client
│   ├── controllers/
│   │   ├── authController.js                  # Email and social auth flows
│   │   ├── oauthProviderController.js         # Admin provider switch API
│   │   └── oauthServerController.js           # OAuth Server consent flow
│   ├── middleware/
│   │   └── authMiddleware.js                  # Session and admin protection
│   └── routes/
│       ├── adminRoutes.js                     # Admin API routes
│       ├── authRoutes.js                      # Authentication API routes
│       └── viewRoutes.js                      # Page routes
├── supabase/
│   └── migrations/
│       └── 20261021000000_oauth_provider_settings.sql
├── views/
│   ├── admin.ejs                              # Admin provider settings
│   ├── dashboard.ejs                          # Signed-in user dashboard
│   ├── error.ejs                              # Error page
│   ├── index.ejs                              # Sign-in and registration
│   ├── oauth-callback.ejs                     # Social OAuth callback
│   ├── oauth-consent.ejs                      # Supabase OAuth Server consent
│   └── reset-password.ejs                     # Password reset page
├── .env.example                               # Environment variable template
├── server.js                                  # Local Express server
├── vercel.json                                # Vercel deployment config
└── vite.config.js                             # Frontend build config
```

### Endpoints

| Method | Path | Description | Access |
| --- | --- | --- | --- |
| `GET` | `/` | Sign-in / registration page | Public |
| `GET` | `/api/auth/oauth/:provider` | Start GitHub or Google sign-in | Provider must be enabled |
| `GET` | `/auth/callback` | Complete social sign-in | Public |
| `GET` | `/oauth/consent` | Supabase OAuth Server consent UI | Signed in |
| `POST` | `/api/auth/oauth-server/consent` | Submit approve/deny to Supabase | Signed in |
| `GET` | `/dashboard` | User dashboard | Signed in |
| `GET` | `/admin` | Provider settings | Admin |
| `PATCH` | `/api/admin/oauth-providers/:provider` | Enable/disable `github` or `google` | Admin |
| `POST` | `/api/auth/login` | Email/password sign-in | Public |
| `POST` | `/api/auth/register` | Create an account | Public |
| `POST` | `/api/auth/forgot` | Send password reset email | Public |
| `POST` | `/api/auth/update-password` | Update account password | Public |
| `GET` | `/api/auth/logout` | Clear session cookies | Signed in |

## License

MIT. See [LICENSE](LICENSE).

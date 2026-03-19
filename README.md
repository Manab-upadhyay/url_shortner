# URL Shortener Backend

A robust, high-performance URL shortener backend built with Node.js, Express, and TypeScript. It features detailed analytics, user authentication, API key management for developers, and background processing for usage tracking.

## 🚀 Features

- **URL Shortening**: Create custom or random short codes for long URLs.
- **Detailed Analytics**: Track clicks, geographic data (IP-based), and referrers.
- **Authentication**: Secure access with JWT and Google OAuth2.0 integration.
- **Developer API**: Versioned API (`/api/v1`) with API key authentication for external integrations.
- **Dashboard**: Global and user-specific usage statistics.
- **Media Management**: Cloudinary integration for handling profile images or other media.
- **Email Notifications**: Integration with Resend and SMTP for OTPs and communications.
- **Rate Limiting & Security**: Protection against abuse with `express-rate-limit`, `helmet`, and CSRF protection.
- **Queue System**: Background processing of analytics and usage data using BullMQ and Redis.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express (v5)
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose)
- **Caching & Queues**: Redis, BullMQ
- **Authentication**: Passport.js, JWT
- **Security**: Helmet, CORS, CSRF, Rate Limiting
- **Validation**: Zod
- **Notifications**: Resend, Nodemailer
- **Media**: Cloudinary
- **Logging**: Morgan, Winston

## 📋 Prerequisites

- **Node.js** (v18+ recommended)
- **MongoDB** (Local or Atlas)
- **Redis** (Local or managed like Upstash/Render)

## ⚙️ Environment Variables

Create a `.env` file in the root directory and add the following (see `.env.example` for details):

```env
MONGO_DB_URL=
JWT_SECRET=
PORT=5000
SHORTCODE_LENGTH=6
SHORTCODE_VALUE_CHARS=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789
IP_API_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
EMAIL_USER=
EMAIL_PASS=
REDIS_URL=
RESEND_API_KEY=
FRONTEND_URL=
BREVO_API_KEY=
NODE_ENV=development
```

## 🚀 Getting Started

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd url_shortner_backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run in development mode**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Start production server**:
   ```bash
   npm start
   ```

6. **Run worker process**:
   ```bash
   npm run worker
   ```

## 🛣️ API Endpoints (Simplified)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/:shortCode` | Redirect to original URL |
| `GET` | `/api/health` | Health check for DB and Redis |
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login user |
| `POST` | `/api/links` | Create a new short URL |
| `GET` | `/api/analytics/:id` | Get analytics for a link |
| `POST` | `/api/api-keys` | Generate a developer API key |

## 📂 Project Structure

- `src/config`: Database cached and general configuration.
- `src/middleware`: Custom Express middleware (auth, error, rate limiting).
- `src/modules`: Feature-based modules (auth, link, analytics, etc.).
- `src/queue`: BullMQ worker and queue definitions.
- `src/utils`: Helper functions and loggers.
- `src/validator`: Zod schemas for request validation.

## 📄 License

This project is licensed under the ISC License.

---
Created with ❤️ by [Manab](https://github.com/Manab-upadhyay)

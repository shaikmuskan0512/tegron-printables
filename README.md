# ☀ Tegron Printables

*Learn • Play • Grow*

This is the full-stack website for Tegron Printables. Visitors can browse printables, filter them by category, search, and click through to Etsy. Members can send questions and product ideas, then track them in their own dashboard. The team manages everything from a separate admin studio.

| Layer | Stack |
|---|---|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS, React Router, Axios, Lucide React, Zod |
| Backend | Node.js, Express, TypeScript, Zod |
| Database | MongoDB with Mongoose |
| Auth | JWT (separate user and admin audiences), bcryptjs |
| Images | Cloudinary (only the URL and public id are stored in MongoDB) |

---

## 1. Folder structure

```
tegron-printables/
├── backend/
│   ├── src/
│   │   ├── config/         env validation, MongoDB connection
│   │   ├── controllers/    auth, user, product, category, submission, admin
│   │   ├── middleware/     authenticateUser / authenticateAdmin, validate, upload, rate limits, errors
│   │   ├── models/         User, AdminUser, Category, Product, Query, Idea
│   │   ├── routes/         /api/* routers
│   │   ├── scripts/        seed.ts
│   │   ├── services/       cloudinary.service.ts
│   │   ├── types/          Express request augmentation
│   │   ├── utils/          ApiError, jwt, serializers, slugs, pagination
│   │   ├── validators/     Zod schemas
│   │   ├── app.ts
│   │   └── server.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── public/             favicon, og-image, robots.txt, _redirects (Netlify)
│   ├── src/
│   │   ├── assets/         Tegron logo + sun/book mark
│   │   ├── components/
│   │   │   ├── admin/      ResponsiveTable, SubmissionsAdmin, admin UI bits
│   │   │   ├── brand/      Logo, Wordmark, doodle illustrations, category icons
│   │   │   ├── dashboard/  member panels, submission list
│   │   │   ├── home/       Navbar, Hero, categories, products, forms, Footer
│   │   │   └── ui/         Button, fields, Modal, ConfirmDialog, Pagination, skeletons…
│   │   ├── context/        AuthContext, AdminAuthContext, ToastContext
│   │   ├── hooks/          useProducts, useAdminList, useDebounce, useActiveSection
│   │   ├── layouts/        AuthLayout, AdminLayout
│   │   ├── pages/          Home, Login, Signup, Dashboard, NotFound, admin/*
│   │   ├── services/       axios clients + API modules
│   │   ├── types/
│   │   └── utils/          formatting, validation, safe redirects
│   ├── index.html          SEO + Open Graph tags
│   ├── tailwind.config.js  brand design tokens
│   ├── vercel.json         SPA rewrite (Vercel)
│   └── package.json
├── .gitignore
└── README.md
```

## 2. Installation

Requires **Node.js 18.18 or newer** (Node 20 or 22 recommended).

```bash
cd tegron-printables/backend  && npm install
cd ../frontend                && npm install
```

## 3. Environment variables

```bash
cp backend/.env.example  backend/.env
cp frontend/.env.example frontend/.env
```

**backend/.env**

| Variable | Required | Notes |
|---|---|---|
| `MONGO_URI` | yes | e.g. `mongodb://127.0.0.1:27017/tegron-printables` or your Atlas URI |
| `JWT_SECRET` | yes | At least 32 characters. Generate one with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `CLIENT_URL` | yes | Allowed frontend origin(s), comma-separated. Dev: `http://localhost:5173` |
| `PORT` | no | Default `5000` |
| `JWT_EXPIRES_IN` / `ADMIN_JWT_EXPIRES_IN` | no | Defaults `7d` / `12h` |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | for image uploads | Without these the site still works, but adding or replacing product images returns a friendly "not configured" error |
| `CLOUDINARY_FOLDER` | no | Default `tegron-printables/products` |
| `SEED_ADMIN_NAME`, `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD` | seed only | Development admin account (password at least 10 characters) |
| `SEED_ETSY_URL` | seed only | Link used for the sample products |

The server checks its configuration on startup and refuses to boot, with a clear message, if a required value is missing.

**frontend/.env**

| Variable | Notes |
|---|---|
| `VITE_API_URL` | `/api` in development (Vite proxies it to port 5000). In production, use the full API URL, e.g. `https://api.example.com/api` |
| `VITE_CURRENCY` | Currency for displayed prices (default `USD`) |
| `VITE_ETSY_URL`, `VITE_INSTAGRAM_URL`, `VITE_PINTEREST_URL`, `VITE_YOUTUBE_URL`, `VITE_CONTACT_EMAIL` | Only the links you fill in appear in the footer. The hero's "Visit Etsy" button uses `VITE_ETSY_URL`. |

> Only `VITE_*` values reach the browser. Never put secrets in `frontend/.env`.

## 4. MongoDB setup

Choose one:

- **Local:** install MongoDB Community Server (or run `docker run -d -p 27017:27017 --name tegron-mongo mongo:7`), then use `MONGO_URI=mongodb://127.0.0.1:27017/tegron-printables`.
- **Atlas (recommended for production):**
  1. Create a free cluster.
  2. Under **Database Access**, create a user.
  3. Under **Network Access**, allow your server's IP.
  4. Copy the connection string (`mongodb+srv://…/tegron-printables`) into `MONGO_URI`.

Indexes are declared on the models: unique emails, unique slugs, and compound indexes for product and submission listings. In development, Mongoose builds them automatically. In production, `autoIndex` is turned off, so create them once. The simplest way is to run the seed script, or `Model.syncIndexes()`, against the production database.

## 5. Cloudinary setup

1. Create a free account at cloudinary.com.
2. On the Dashboard, copy the **Cloud name**, **API Key** and **API Secret** into `backend/.env`.
3. That's it. Uploads go to the `CLOUDINARY_FOLDER` folder. The admin form accepts JPG, PNG and WebP images up to 5 MB, which are checked in both the browser and the server.

How uploads behave:
- **Upload:** the image is streamed from memory to Cloudinary, and only the returned `secure_url` and `public_id` are saved in MongoDB.
- **Replace:** the new image is uploaded first. The old one is deleted only after the product saves successfully.
- **Failure:** if saving the product fails, the new upload is removed so no orphaned images are left behind.
- **Delete:** deleting a product also removes its Cloudinary image.
- **Delivery:** the frontend requests `f_auto,q_auto` resized versions with a `srcset`, so browsers download an appropriately sized image.

## 6. Seed the database (development)

```bash
cd backend
npm run seed         # adds the 5 sample categories, 14 sample products, and the dev admin
npm run seed:reset   # wipes products and categories first, then seeds
```

The sample products have no images, so the site draws an illustrated placeholder for each. Upload real images, and replace the Etsy links with real listing URLs, from **Admin → Products**.

> ⚠ **Development credentials:** the admin account is created from `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`. The values in `.env.example` are placeholders. **Change them before deploying**, and never use them in production. The seed script refuses to run when `NODE_ENV=production` unless you pass `--force`.

## 7. Run the backend

```bash
cd backend
npm run dev      # http://localhost:5000  (tsx watch)
```

## 8. Run the frontend

```bash
cd frontend
npm run dev      # http://localhost:5173
```

Once both are running:

- **Public site:** http://localhost:5173
- **Member dashboard:** http://localhost:5173/dashboard (after signing up)
- **Admin studio:** http://localhost:5173/admin/login

## 9. Production builds

```bash
cd backend  && npm run build && npm start      # compiles to dist/, runs node dist/server.js
cd frontend && npm run build                   # type-checks, outputs static files to frontend/dist
npm run preview                                # optional local preview of the build
```

## 10. Deployment

**Database:** MongoDB Atlas.

**Backend** (Render, Railway, Fly.io, or any Node host):
1. Set the root directory to `backend`.
2. Build command: `npm install && npm run build`. Start command: `npm start`.
3. Set every variable from `backend/.env.example`, with `NODE_ENV=production` and `CLIENT_URL=https://your-frontend-domain` (comma-separate multiple domains).
4. The app enables `trust proxy` in production, so rate limiting sees real client IPs behind the host's proxy.
5. Health check endpoint: `GET /api/health`.

**Frontend** (Vercel, Netlify, or any static host):
1. Set the root directory to `frontend`.
2. Build command: `npm run build`. Output directory: `dist`.
3. Set `VITE_API_URL=https://your-api-domain/api` plus any social links.
4. SPA routing is preconfigured: `vercel.json` for Vercel, `public/_redirects` for Netlify. On other hosts, rewrite all paths to `/index.html`.

**After deploying:** run the seed once with real admin credentials (or create the admin in the database), then sign in at `/admin/login`.

---

## How it works

### Access model
| Who | Can |
|---|---|
| Visitor (no login) | Browse, search, filter and paginate products, open product details, click through to Etsy, read the forms |
| Member | Everything above, plus submit questions and ideas, see **only their own** submissions, and edit their name |
| Admin | A separate login and token: dashboard stats, users, products (with image upload), categories, queries, ideas |

When a visitor presses **Send question** or **Share my idea**, the site saves their draft, shows the "Almost there!" prompt, and sends them to login or signup. Afterwards they return to `/#ask` or `/#idea` with the draft restored.

### API
```
POST /api/auth/signup · POST /api/auth/login · GET /api/auth/me
GET  /api/users/me    · PATCH /api/users/me
GET  /api/products?search=&category=&page=&limit=   · GET /api/products/:idOrSlug
GET  /api/categories
POST /api/queries · GET /api/queries/my
POST /api/ideas   · GET /api/ideas/my

POST   /api/admin/auth/login · GET /api/admin/auth/me
GET    /api/admin/dashboard/stats
GET    /api/admin/users · GET /api/admin/users/:id · DELETE /api/admin/users/:id
POST   /api/admin/products (multipart) · PATCH /api/admin/products/:id (multipart) · DELETE /api/admin/products/:id
GET    /api/admin/categories · POST · PATCH /:id · DELETE /:id   (delete blocked while products use it)
GET    /api/admin/queries?status=&search=&page= · PATCH /:id/status · DELETE /:id
GET    /api/admin/ideas?status=&search=&page=   · PATCH /:id/status · DELETE /:id
```
Product listings return `{ products, currentPage, totalPages, totalProducts }`.

### Security
- **Passwords:** hashed with bcrypt (12 rounds). `passwordHash` is `select: false`, and every response goes through an explicit serializer, so hashes, Cloudinary ids and internal fields never leak.
- **Tokens:** JWTs are signed with HS256 and carry a fixed issuer and an **audience** (`user` or `admin`). A user token is rejected by admin routes, and an admin token is rejected by member routes.
- **Ownership:** it always comes from the verified token (`req.userId`). Submission schemas are `.strict()`, so sending a `user` field is rejected.
- **Validation:** Zod validates every body, query and params on the server, and the frontend uses the same rules.
- **Injection:** `express-mongo-sanitize` strips `$` and `.` operators. Search text is regex-escaped.
- **Headers and requests:** Helmet sets security headers, CORS only allows the origins in `CLIENT_URL`, and JSON bodies are capped at 100 kb.
- **Rate limits:** authentication allows 20 requests per 15 minutes, submissions 30 per hour, and the API overall 600 per 15 minutes.
- **Login responses:** login returns the same message whether the email or the password is wrong, with timing kept similar in both cases.
- **Errors:** unknown errors are logged on the server, and clients only receive "Something went wrong. Please try again."
- **Redirects:** login redirects only accept in-app paths.
- **Token storage:** tokens are kept in `localStorage`, under separate keys for members and admins. This is simple and works across domains. If you later host the API on the same site as the frontend, consider switching to httpOnly cookies.

### Design system
The design is drawn from the logo and banner. Colors are defined as tokens in `tailwind.config.js`:

| Token | Hex | Role |
|---|---|---|
| teal | `#4E9FAE` | primary |
| coral | `#F07F86` | action |
| sun | `#F8C84B` | highlight |
| leaf | `#7DAE6F` | supporting |
| lilac | `#A38BC7` | supporting |
| ink | `#1F2A44` | text |
| cream | `#FFFBF4` | paper |

- **Type:** Fredoka for headings and the multicolor "Tegron" wordmark, Nunito for body text, and Gochi Hand only for the small handwritten notes. All fonts are self-hosted through `@fontsource`.
- **Illustrations:** a hand-built SVG kit in `components/brand/Doodles.tsx` (smiling sun, open book, printable sheets, crayon cup, sprouts, stars, hearts, wavy section edges), used sparingly across every screen.
- **Product cards:** styled as paper sheets with washi tape and a dog-eared corner.
- **Accessibility:** reduced motion is respected, keyboard focus is visible, and modals trap focus.

# Backend

Node + Express + MongoDB API. Serves two APIs side by side:

- **`/api/v1`** — legacy. Powers the old Vite frontend in `/frontend`. Frozen: do not add
  features here. It will be deleted once the new frontend reaches parity.
- **`/api/v2`** — the new customer-facing API. All new work goes here.

## Running locally

```bash
cd backend
npm install
cp .env.example .env    # then fill in real values
npm run dev
```

**Ports.** The API defaults to **4000** and the Next.js app to **3100**. They must
not collide with each other or with anything else already listening — on this
machine port 3000 is taken by a local Postgres service, which is why neither app
uses it. If you change `PORT` in `backend/.env`, change `API_URL` in
`web/.env.local` to match: the web app reaches the API only through that value.

| Script | What it does |
| --- | --- |
| `npm run dev` | nodemon + `.env`, restarts on change |
| `npm run start:local` | plain node + `.env` |
| `npm start` | plain node, no `.env` — for Render, which injects env vars itself |

The server refuses to start if `MONGO_URI` or `JWT_SECRET_KEY` is missing, or if the
database is unreachable. That is deliberate: a broken config should fail at startup rather
than turn into confusing request failures later.

## Environment variables

Required:

| Variable | Notes |
| --- | --- |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET_KEY` | Long random string. `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |

Optional, with defaults:

| Variable | Default | Notes |
| --- | --- | --- |
| `PORT` | `3000` | |
| `NODE_ENV` | `development` | |
| `JWT_EXPIRES_IN` | `30d` | Any `jsonwebtoken` duration string |
| `ALLOWED_ORIGINS` | `http://localhost:5173,http://localhost:3000` | Comma-separated. Localhost defaults are always included. |
| `TAX_RATE` | `5` | Tax percentage applied to the discounted item total at checkout. |
| `DEMO_ORDER_ACCELERATION` | `true` | Walk orders confirmed → delivered inside a short window so progression can be watched. |
| `DEMO_ORDER_WINDOW_MINUTES` | `3` | How long that whole journey takes. |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | – | TEST-mode keys. Payments return 503 without them. |

Legacy v1 only (not needed for v2 development): `CLIENT_DOMAIN`, `CLOUD_NAME`, `API_KEY`,
`API_SECRET`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`.

See [`.env.example`](.env.example). See also [`../SECURITY-NOTES.md`](../SECURITY-NOTES.md) —
**credentials previously committed to this repository must be rotated.**

## Response envelope (v2 only)

Success:

```json
{ "ok": true, "data": { } }
```

Paginated:

```json
{ "ok": true, "data": [], "meta": { "page": 1, "limit": 20, "total": 42, "pages": 3 } }
```

Error:

```json
{ "ok": false, "error": { "code": "VALIDATION_FAILED", "message": "Please check the highlighted fields." } }
```

`error.message` is written for the user and can be displayed as-is. `error.code` is what
client code should branch on. Validation errors add `error.details` — a
`{ field: message }` map.

Errors never contain stack traces, Mongo internals, JWT internals, or provider errors.

v1 keeps its own inconsistent response shapes. Nothing in v2 changed them.

## Authentication (v2)

Express uses **`Authorization: Bearer <token>`**. It sets no cookie.

The browser is never expected to call Express directly. The Next.js app (built in a later
phase) owns the `app_session` httpOnly cookie, and forwards the JWT to Express
server-to-server. That is why `/auth/login` and `/auth/register` return the token in the
response body — the Next.js route handler needs to receive it and put it in the cookie.

JWT payload is exactly `{ sub: userId, role }`. Authenticated requests get
`req.user = { id, role }`, normalized once in `middlewares/v2/authenticate.js`. **v2 code
reads `req.user.id` and nothing else** — never `req.user._id`, `decoded.id` or `decoded.sub`.

### Endpoints

| Method | Path | Auth | Body |
| --- | --- | --- | --- |
| POST | `/api/v2/auth/register` | – | `{ name, email, password, phone? }` |
| POST | `/api/v2/auth/login` | – | `{ email, password }` |
| POST | `/api/v2/auth/logout` | – | – |
| GET | `/api/v2/auth/me` | Bearer | – |
| GET | `/api/v2/health` | – | – |

## Discovery endpoints

All public, all GET.

| Path | Notes |
| --- | --- |
| `/api/v2/home` | Whole discovery page in one request |
| `/api/v2/restaurants` | Listing. `page limit q cuisine veg rating maxDeliveryTime maxPrice offers freeDelivery sort` |
| `/api/v2/restaurants/:slug` | Detail + active offers |
| `/api/v2/restaurants/:slug/menu` | Menu pre-grouped into sections. `veg category q` |
| `/api/v2/search` | `q limit` → `{ restaurants, dishes, cuisines }` |
| `/api/v2/search/suggest` | `q` → flat typeahead list |
| `/api/v2/cuisines` | Cuisines with restaurant counts |
| `/api/v2/offers` | Active offers. `restaurantSlug` |

`sort`: `relevance` (default) · `popular` · `rating` · `deliveryTime` · `priceLow` · `priceHigh`.
Booleans accept `1`/`true`. `cuisine` is comma-separated. Filters combine with AND.

Restaurant cards are byte-identical across home, listing and search; dish cards likewise
across menu, home and search. The frontend normalizes nothing.

## Commerce endpoints

Authenticated (Bearer). Addresses are embedded on the user, so you can only ever
reach your own.

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/api/v2/addresses` | Default first, then newest |
| POST | `/api/v2/addresses` | First address becomes the default automatically |
| PATCH | `/api/v2/addresses/:id` | Partial update |
| DELETE | `/api/v2/addresses/:id` | Deleting the default promotes another |
| POST | `/api/v2/addresses/:id/default` | Exactly one default is always enforced |
| POST | `/api/v2/checkout/quote` | Authoritative pricing. Creates nothing. |

`POST /checkout/quote` takes `{ restaurantId, items: [{ menuItemId, quantity }], offerCode?, addressId? }`
and returns `{ restaurant, items, pricing, appliedOffer, offerError, availableOffers, address, warnings }`.

Pricing is recomputed from the database every time — item prices, availability,
the restaurant's delivery fee and free-delivery threshold, offer eligibility and
tax. **Nothing the client sends about money is read.** Amounts are whole rupees
(integers); tax applies to the discounted item total and is rounded once, so the
bill lines always sum exactly to the total.

Offers are percentage / flat / free-delivery, one at a time, never stacked.
`warnings` reports items that were dropped (sold out, no longer on the menu) so
the client can reconcile its cart.

## Payments and orders

| Method | Path | Notes |
| --- | --- | --- |
| POST | `/api/v2/payments/create` | Re-prices from the DB, writes a pending order, creates the Razorpay order |
| POST | `/api/v2/payments/verify` | Verifies the signature and confirms the order. Idempotent. |
| POST | `/api/v2/payments/failed` | Records a dismissal or failure. Order stays unpaid. |
| GET | `/api/v2/orders` | Your orders, split into `active` and `past` |
| GET | `/api/v2/orders/:orderNumber` | Detail. Same 404 for "not yours" as for "doesn't exist". |
| POST | `/api/v2/orders/:orderNumber/reorder` | Returns a cart payload; names unavailable items |
| GET/POST | `/api/v2/favourites` | List / toggle favourite restaurants |

**The client never decides what is paid.** `payments/create` accepts item ids,
quantities, an address id and an optional offer code — no amount field exists.
The total is rebuilt by the pricing service and that number is what Razorpay is
asked to charge.

**An order becomes paid in exactly one place:** `payments/verify`, after an
HMAC-SHA256 check of `order_id|payment_id` against the key secret, compared
timing-safely. A pending order is written *before* payment so a successful
charge always has a record to reconcile against, and a unique sparse index on
the Razorpay payment id makes duplicate confirmation impossible however many
times verification is retried.

Order numbers look like `MR-8K4P2Q` — 6 characters from an alphabet with O/0 and
I/1/L removed, so they survive being read aloud. Mongo ids are never exposed.

Order status is derived from `confirmedAt` plus elapsed time and persisted when
it changes, so there is no cron, queue or worker.

## Seed data

```bash
npm run seed
```

Kochi demo market: 13 restaurants, 171 menu items, 12 cuisines, 8 offers (7 active).
Deterministic — dish ratings derive from a hash of the name — and resettable: it clears the
four v2 collections first, so running twice yields identical data rather than duplicates.
It only touches v2 collections and never reads or writes legacy v1 data.

The seed stores **no image URLs** — `seed/images.js` returns null. Photography lives in
the web app (`web/public/images/food`) and is resolved by `web/lib/foodImages.js`, which
maps cuisine slug, restaurant slug and exact dish name to a master image. Dishes with no
honest photograph resolve to null and render text-first by design.

## Tests

```bash
npm test
```

Node's built-in runner against an in-memory MongoDB (`mongodb-memory-server`) and the real
Express app, so helmet, CORS, validation and the error handler are all exercised. No Atlas
connection needed.

## v2 collections

v2 uses separate collections (`v2restaurants`, `v2menuitems`, `v2cuisines`, `v2offers`) so
the legacy v1 app keeps working against its own data while v2 is authoritative for the new
product. Menu items are standalone documents referencing a restaurant — the legacy embedded
array is what made dish search, dish ratings and per-dish availability impossible.

Register and login both return:

```json
{ "ok": true, "data": {
    "user": { "id": "…", "name": "…", "email": "…", "phone": "…", "role": "user" },
    "token": "…"
} }
```

`logout` returns success without doing work — JWTs are stateless and the cookie belongs to
the Next.js layer. It exists so the BFF has one call to make, and so token revocation has
an obvious home if we ever need it.

Validation rules: name 2–60 chars; email valid and lowercased; password at least 8
characters; phone optional, accepts an optional `+` prefix and 7–15 digits.

Rate limits: 20 requests / 15 min per IP on register and login; 120 requests / min across
the rest of `/api/v2`.

## Layout

```
config/        env.js (all process.env access), db.js, cloudinary.js (v1)
controllers/   v1 controllers at the top level, v2/ below
routes/        index.js → v1/ and v2/
middlewares/   v1 middlewares at the top level, v2/ below
validators/v2/ zod schemas
services/      tokenService.js
models/        shared by v1 and v2
utils/         apiError.js, apiResponse.js, asyncHandler.js, generateToken.js (v1)
```

v2 controllers are wrapped in `asyncHandler`, throw `ApiError`, and return through
`sendSuccess`. No per-controller try/catch.

## Notes on the shared User model

`models/userModel.js` is shared by v1 and v2 and was deliberately left unchanged:

- The bcrypt hash is stored in the field named **`password`**. Renaming it to
  `passwordHash` would mean migrating every existing document and rewriting v1 login for no
  functional gain.
- `name` is optional at the schema level because v1 registration allows accounts without
  one. **v2 requires it** — enforced in `validators/v2/authValidators.js`, so every account
  created through v2 has a real name.
- The `role` enum still includes `delivery` so v1 code keeps working. v2 only uses `user`
  and `admin`.
- Password hashes are never returned by any v2 endpoint.

Addresses and favourites are not on the model yet; they arrive in their own phases.

# Running MORO locally

Two processes. Start the API first.

## 1. API (Express)

```bash
cd backend
npm install
npm run dev
```

Listens on **http://localhost:4000** (`PORT` in `backend/.env`).

It needs a reachable MongoDB in `MONGO_URI` and will **exit immediately** with a
clear message if it cannot connect — that is deliberate, so a bad config fails at
startup instead of turning into confusing errors on every request.

## 2. Web (Next.js)

```bash
cd web
npm install
npm run dev
```

Serves **http://localhost:3100** and reaches the API through `API_URL` in
`web/.env.local`. That value is server-side only and never reaches the browser.

## Ports

| What | Port | Why |
| --- | --- | --- |
| API | 4000 | |
| Web | 3100 | |
| ~~3000~~ | — | Occupied by a local Postgres service on this machine; avoid it. |

If you change the API port, change `API_URL` in `web/.env.local` to match. A
mismatch here breaks every authenticated action — sign in, addresses, checkout —
because the browser only ever talks to Next.js, which talks to the API.

## Session cookie

Sign-in stores an httpOnly `app_session` cookie on the Next.js origin.

`COOKIE_SECURE` must stay `false` for local `http://` development. Setting it
true off HTTPS makes the browser silently discard the cookie: sign-in appears to
work, then every authenticated request comes back 401. Set it to `true` only
where the app is served over HTTPS.

## Checking things are wired up

```bash
curl http://localhost:4000/api/v2/health
```

Expect `{"ok":true,"data":{"status":"ok"}}`. If that fails, the web app cannot
work either — fix the API first.

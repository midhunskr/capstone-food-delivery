# Security Notes

## Credentials in Git history must be rotated

`backend/.env` and `frontend/.env` were committed to this repository and remain in Git
history. They have now been removed from tracking, but **history was not rewritten**, so
every value they ever contained must be treated as compromised.

Rotate all of the following before any production deployment:

| Credential | Where to rotate |
| --- | --- |
| `MONGO_URI` (database user password) | MongoDB Atlas → Database Access → edit user → new password |
| `JWT_SECRET_KEY` | Generate a new one (see below). Rotating this signs out every existing session, which is the intended effect. |
| `CLOUD_NAME` / `API_KEY` / `API_SECRET` | Cloudinary → Settings → Access Keys → generate new key, disable the old one |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Razorpay Dashboard → Account & Settings → API Keys → regenerate |
| `VITE_RAZORPAY_KEY_ID` (legacy frontend) | Update to the new Razorpay key id |

Generate a new JWT secret with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Do not paste any real value into this file, into `.env.example`, into a commit message,
or into a terminal session that gets shared.

## Additional hardening

- MongoDB Atlas: restrict the IP allowlist to the Render egress addresses rather than
  `0.0.0.0/0`, and confirm the database user has only the permissions it needs.
- Cloudinary: after generating a new key pair, explicitly disable the old one — generating
  a replacement does not revoke the previous key.
- Razorpay: keep test-mode and live-mode keys in separate environments. The webhook secret
  (needed in a later phase) is a separate value from the API key secret.

## History rewriting (deliberately not done)

Purging the secrets from Git history would need `git filter-repo` or BFG plus a force-push,
which rewrites every commit hash. That was judged out of scope for this phase. Rotation
makes the leaked values worthless, which is the outcome that actually matters. If this
repository is ever made public, do the rotation first and consider the history rewrite as
a follow-up.

## Ongoing rules

- Never commit `.env` files. Root, `backend/` and `frontend/` `.gitignore` files now cover
  `.env` and `.env.*` while allowing `.env.example`.
- Never log tokens, passwords, password hashes, or full request bodies containing personal
  data. A `console.log(token)` in the v1 auth middleware and a request-body log in the v1
  payment controller were removed during Phase 0.
- `.env.example` files carry variable **names and placeholders only**.

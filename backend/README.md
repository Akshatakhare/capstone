# Insurance Backend (MEAN - Node/Express/Mongo)

## Setup
1. Copy `.env.example` to `.env` and fill values (MONGO_URI, JWT_SECRET).
2. Install:
   npm install

3. Run dev server:
   npm run dev

API base: http://localhost:5000/api/v1

Use Postman to test endpoints:
- POST /api/v1/auth/register
- POST /api/v1/auth/login
- GET /api/v1/policies
- POST /api/v1/user/policies/:id/purchase
- POST /api/v1/claims
- POST /api/v1/payments
- GET /api/v1/admin/summary (future enhancements)

  # Automated Chest Disease Detection System

  A full-stack application for AI-powered chest X-ray analysis (Pneumonia and Tuberculosis detection). Built with **React (Vite) + Tailwind CSS** on the frontend and **Node.js + Express + MongoDB** on the backend. ML inference is **placeholder only** (dummy responses); replace with your Python ML API when ready.

  ---

  ## Tech Stack

  | Layer    | Technologies |
  |----------|--------------|
  | Frontend | React (Vite), Tailwind CSS, React Router, Axios |
  | Backend  | Node.js, Express.js, MongoDB (Mongoose), JWT, bcrypt, Multer, dotenv, CORS |
  | ML       | Placeholder in `backend/utils/pythonService.js` (no Python models) |

  ---

  ## Project Structure

  ```
  majorp/
  ├── backend/
  │   ├── config/db.js           # MongoDB connection
  │   ├── controllers/           # authController, predictionController
  │   ├── routes/                # authRoutes, predictionRoutes
  │   ├── models/                # User, Prediction
  │   ├── middleware/            # authMiddleware, uploadMiddleware (Multer)
  │   ├── utils/pythonService.js # PLACEHOLDER ML inference (dummy)
  │   ├── uploads/               # Uploaded X-ray images
  │   ├── .env                   # PORT, MONGO_URI, JWT_SECRET, FRONTEND_URL
  │   └── server.js
  ├── frontend/
  │   ├── src/
  │   │   ├── api/axios.js       # Axios instance + auth header
  │   │   ├── context/AuthContext.jsx
  │   │   ├── components/ProtectedRoute.jsx
  │   │   ├── pages/             # Landing, Login, Signup, Dashboard, Upload, Result
  │   │   ├── App.jsx
  │   │   └── main.jsx
  │   ├── index.html
  │   └── vite.config.js         # Proxy /api and /uploads to backend
  └── README.md
  ```

  ---

  ## Flow

  1. **Landing** → Hero, Features, How it Works, About, CTA (Login / Sign Up). Smooth scroll, responsive.
  2. **Auth** → Signup/Login with JWT; token stored in `localStorage`. Protected routes require login.
  3. **Dashboard** → Two cards: Pneumonia Detection and Tuberculosis Detection. Each links to the upload page for that disease.
  4. **Upload** → User selects disease (from URL), uploads chest X-ray (preview), clicks “Upload & Analyze”. Frontend sends `image` + `diseaseType` to `POST /api/predictions`. Backend stores file with Multer, calls `pythonService.runInference()` (placeholder), saves prediction to MongoDB, returns prediction id.
  5. **Result** → Frontend fetches `GET /api/predictions/:id`, shows disease name, result (Positive/Negative), confidence, image, report summary, recommendations, and dummy “Nearby Hospitals”. Download report (placeholder: .txt).

  ---

  ## Setup & Run

  ### 1. Backend

  - Install [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/try/download/community) (or use MongoDB Atlas and set `MONGO_URI` in `.env`).

  ```bash
  cd backend
  npm install
  ```

  - Copy `.env` and set (or keep placeholders for local dev):

    - `PORT=5000`
    - `MONGO_URI=mongodb+srv://rajchoudhary0311:mnbvcxz@cluster0.8mouzib.mongodb.net/
    - `JWT_SECRET=hello123
    - `FRONTEND_URL=http://localhost:5174`

  ```bash
  npm run dev
  # or: node server.js
  ```

  Server runs at `http://localhost:5000`. Health: `GET http://localhost:5000/api/health`.

  ### 2. Frontend

  ```bash
  cd frontend
  npm install
  npm run dev
  ```

  App runs at `http://localhost:5173`. Vite proxies `/api` and `/uploads` to `http://localhost:5000`.

  ### 3. ML (Placeholder)

  - **Do not implement Python models** in this repo.
  - Dummy logic is in `backend/utils/pythonService.js`: `runInference(diseaseType, imagePath)` returns a random `{ result: 'Positive'|'Negative', confidence: 0.72–0.97 }` after a short delay.
  - Replace this with a real Python API or subprocess call when your ML service is ready.

  ---

  ## API Summary

  | Method | Endpoint               | Auth   | Description                |
  |--------|------------------------|--------|----------------------------|
  | POST   | /api/auth/signup       | No     | Register (name, email, pwd)|
  | POST   | /api/auth/login        | No     | Login (email, pwd) → token |
  | GET    | /api/auth/me           | Yes    | Current user               |
  | POST   | /api/predictions       | Yes    | Upload image + diseaseType |
  | GET    | /api/predictions       | Yes    | List current user’s results|
  | GET    | /api/predictions/:id   | Yes    | Single prediction          |

  ---

  ## Environment Variables

  **Backend (`.env`):**

  - `PORT` – Server port (default 5000)
  - `MONGO_URI` – MongoDB connection string
  - `JWT_SECRET` – Secret for JWT signing
  - `FRONTEND_URL` – Allowed CORS origin (e.g. http://localhost:5173)

  **Frontend (optional):**

  - `VITE_API_URL` – Backend base URL (default `http://localhost:5000`). Leave unset when using Vite proxy.

  ---

  ## Rules Followed

  - Frontend: React (Vite) + Tailwind only; no other UI framework.
  - Backend: Structured with config, models, controllers, routes, middleware, utils.
  - Auth: JWT, bcrypt, protected routes; token in `localStorage`.
  - ML: Placeholder only in `utils/pythonService.js`; no Python models in repo.
  - No hardcoded secrets; use `.env` with placeholder values.

  ---

  ## Replacing the ML Placeholder

  1. Implement your Python service (e.g. Flask/FastAPI) that accepts an image and returns `{ result, confidence }`.
  2. In `backend/utils/pythonService.js`, replace `runInference()` body with an HTTP call to that service (or a subprocess call), keeping the same return shape: `{ result: 'Positive'|'Negative', confidence: number }`.

  Your frontend and backend flow remain unchanged; only the inference implementation is swapped.

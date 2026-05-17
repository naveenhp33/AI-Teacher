# ✦ AI Studio — MERN Stack AI App

A full-stack AI web application with chat and image generation, built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- 💬 **AI Chat** — Conversational AI powered by Google Gemini 1.5 Flash
- 🎨 **Image Generation** — Text-to-image via Hugging Face (Stable Diffusion XL)
- 🖼️ **Image Gallery** — Browse, download, and delete generated images
- 📱 **Responsive Design** — Works on mobile, tablet, and desktop
- 🌙 **Dark Theme** — Professional dark UI with smooth animations

---

## Tech Stack

| Layer     | Technology                    |
|-----------|-------------------------------|
| Frontend  | React 18, React Router, Axios |
| Backend   | Node.js, Express.js           |
| Database  | MongoDB Atlas (Mongoose)      |
| AI Chat   | Google Gemini API             |
| AI Images | Hugging Face Inference API    |
| Styling   | Vanilla CSS (no frameworks)   |

---

## Project Structure

```
mern-ai-app/
├── frontend/                  # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx     # App wrapper with sidebar
│   │   │   ├── Sidebar.jsx    # Navigation + chat history
│   │   │   ├── Message.jsx    # Chat message bubble
│   │   │   └── Spinner.jsx    # Loading spinner
│   │   ├── pages/
│   │   │   ├── ChatPage.jsx   # Chat interface
│   │   │   ├── ImageGenPage.jsx # Image generation
│   │   │   └── GalleryPage.jsx  # Image gallery
│   │   ├── services/
│   │   │   └── api.js         # Axios API calls
│   │   ├── styles/            # CSS files
│   │   ├── App.jsx            # Router setup
│   │   └── main.jsx           # Entry point
│   ├── index.html
│   └── vite.config.js
│
└── backend/                   # Express backend
    ├── config/
    │   └── db.js              # MongoDB connection
    ├── controllers/
    │   ├── chatController.js  # Chat logic
    │   └── imageController.js # Image logic
    ├── models/
    │   ├── Chat.js            # Chat schema
    │   └── Image.js           # Image schema
    ├── routes/
    │   ├── chatRoutes.js      # /api/chat routes
    │   └── imageRoutes.js     # /api/images routes
    ├── services/
    │   ├── geminiService.js   # Gemini AI integration
    │   └── imageService.js    # HuggingFace integration
    └── server.js              # Express entry point
```

---

## Quick Start (Local Development)

### Step 1: Get API Keys

1. **MongoDB Atlas** — [mongodb.com/atlas](https://www.mongodb.com/atlas)
   - Create a free cluster
   - Get your connection string

2. **Google Gemini** — [aistudio.google.com](https://aistudio.google.com/)
   - Click "Get API Key"
   - Copy the key

3. **Hugging Face** — [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
   - Create a free account
   - Generate a Read token

### Step 2: Clone and Install

```bash
# Clone the repo
git clone https://github.com/yourusername/mern-ai-app.git
cd mern-ai-app

# Install all dependencies at once
npm run install-all
```

Or install manually:
```bash
# Root
npm install

# Backend
cd backend && npm install

# Frontend
cd frontend && npm install
```

### Step 3: Configure Environment Variables

**Backend** — Create `backend/.env`:
```env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/mern-ai-app
GEMINI_API_KEY=AIza...
HUGGINGFACE_API_TOKEN=hf_...
PORT=5000
CLIENT_URL=http://localhost:5173
```

**Frontend** — Create `frontend/.env` (optional for dev):
```env
VITE_API_URL=http://localhost:5000
```

### Step 4: Run the App

```bash
# Option A: Run both servers simultaneously (from root)
npm run dev

# Option B: Run separately
# Terminal 1 - Backend:
cd backend && npm run dev

# Terminal 2 - Frontend:
cd frontend && npm run dev
```

Visit: **http://localhost:5173**

---

## API Endpoints

| Method | Endpoint              | Description                    |
|--------|-----------------------|--------------------------------|
| POST   | /api/chat             | Send chat message to Gemini    |
| GET    | /api/chat/history     | Get all chat sessions          |
| GET    | /api/chat/:id         | Get specific chat session      |
| POST   | /api/generate-image   | Generate image from prompt     |
| GET    | /api/images           | Get gallery images (paginated) |
| DELETE | /api/images/:id       | Delete an image                |

---

## Deployment

### Backend → Render.com (Free Tier)

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repo
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Add Environment Variables in Render dashboard:
   - `MONGODB_URI`
   - `GEMINI_API_KEY`
   - `HUGGINGFACE_API_TOKEN`
   - `CLIENT_URL` = your Vercel URL (set after frontend deploy)
6. Deploy!

### Frontend → Vercel (Free Tier)

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repo
3. Configure:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variable:
   - `VITE_API_URL` = your Render backend URL (e.g. `https://mern-ai-server.onrender.com`)
5. Deploy!

> **Important**: After deploying both, update `CLIENT_URL` in Render with your Vercel URL to fix CORS.

---

## Environment Variables Reference

### Server (`backend/.env`)

| Variable              | Required | Description                        |
|-----------------------|----------|------------------------------------|
| `MONGODB_URI`         | ✅ Yes   | MongoDB Atlas connection string     |
| `GEMINI_API_KEY`      | ✅ Yes   | Google AI Studio API key            |
| `HUGGINGFACE_API_TOKEN` | Optional | HF token for real image generation |
| `PORT`                | No       | Server port (default: 5000)         |
| `CLIENT_URL`          | ✅ Yes   | Frontend URL for CORS               |

### Client (`frontend/.env`)

| Variable      | Description                        |
|---------------|------------------------------------|
| `VITE_API_URL` | Backend URL (empty in dev = proxy) |

---

## Notes

- **Image Generation**: Without a Hugging Face token, a gradient placeholder is shown. Add the `HUGGINGFACE_API_TOKEN` for real AI images.
- **HF Model Loading**: The free tier may show "model loading" errors for ~30 seconds on first use — just retry.
- **Render Free Tier**: The backend may sleep after 15 minutes of inactivity and take ~30 seconds to wake up.

---

## License

MIT — Free to use and modify

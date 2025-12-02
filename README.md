## Image Uploader – React Frontend + Node/Express + Cloudinary Backend

**Image Uploader** is a full‑stack project for uploading images from a modern React UI to a Node/Express API, which stores files in **Cloudinary** and metadata in **MongoDB**.  
The frontend provides a smooth drag‑and‑drop / paste experience, while the backend exposes a clean REST API that returns your own server URLs instead of raw Cloudinary links.

---

### ✨ Features

- **Modern React UI (Vite + Tailwind)** with drag‑and‑drop, paste, and file‑picker support
- **Instant client‑side preview** before upload
- **Robust backend (Express)** with MVC structure (`controllers`, `routes`, `models`, `middleware`, `utils`)
- **Cloudinary integration** for reliable image hosting
- **MongoDB (Mongoose)** for storing file metadata
- **Custom short URLs** served from your Node server (not direct Cloudinary links)
- **CORS enabled** so the frontend can talk to the backend
- **Request logging with Morgan** for easier debugging

---

### 🧱 Tech Stack

- **Frontend**
  - React (Vite)
  - Tailwind CSS
  - Fetch API

- **Backend**
  - Node.js / Express
  - MongoDB + Mongoose
  - Cloudinary SDK
  - Multer + `multer-storage-cloudinary`
  - Dotenv, CORS, Morgan, Axios

---

### 📁 Project Structure (High‑Level)

```text
Image-uploader/
├── src/                  # React app source (UI for uploading images)
│   ├── Home.jsx          # Main image uploader component
│   ├── App.jsx
│   └── ...
├── Backend/              # Node/Express + Cloudinary + MongoDB server
│   ├── index.js          # Server entry
│   ├── config/           # DB + Cloudinary config
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Multer upload logic
│   ├── models/           # Mongoose models
│   ├── routes/           # Express routes
│   └── utils/            # Cloudinary helpers
├── package.json          # Frontend package.json
├── Backend/package.json  # Backend package.json
└── .gitignore
```

> The backend has its own more detailed documentation in `Backend/readme.md`.

---

### ✅ Prerequisites

- **Node.js**: v18+ recommended
- **npm** (comes with Node)
- **MongoDB**:
  - Local instance **or**
  - MongoDB Atlas connection string
- **Cloudinary account** (for image hosting)

---

### ⚙️ Environment Variables

#### Backend (`Backend/.env`)

Create a file named `.env` inside the `Backend` folder:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/image-uploader
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Frontend (`.env` in project root)

The React app uses `VITE_BACKEND_URL` to know where to send uploads (see `src/Home.jsx`):

```env
VITE_BACKEND_URL=http://localhost:5000/api/upload
```

> Change the host/port in production to match your deployed backend.

---

### 🛠️ Installation & Setup (Step‑by‑Step)

#### 1. Clone the repository

```bash
git clone <your-repo-url>
cd Image-uploader
```

#### 2. Install frontend dependencies (root)

```bash
npm install
```

#### 3. Install backend dependencies

```bash
cd Backend
npm install
cd ..
```

#### 4. Configure environment variables

- Create `Backend/.env` with your **MongoDB** and **Cloudinary** credentials (see above).
- Create `.env` in the project root with `VITE_BACKEND_URL`.

---

### 🚀 Running the Project

#### Start the backend server

```bash
cd Backend
node index.js
# or if you use nodemon (installed globally)
# nodemon index.js
```

The backend will run on `http://localhost:5000` (or the `PORT` you set).

#### Start the frontend (React + Vite)

From the project root:

```bash
cd Image-uploader   # only if you are not already here
npm run dev
```

Vite will show a local URL (typically `http://localhost:5173`).  
Open it in your browser and make sure `VITE_BACKEND_URL` points to your backend.

---

### 💡 How to Use the App (Frontend)

1. Open the frontend in your browser.
2. **Choose an image** by:
   - Dragging & dropping into the upload area, **or**
   - Clicking the area and selecting a file, **or**
   - Pasting an image (Ctrl+V), including:
     - Clipboard images (screenshots)
     - Image URLs
     - Image data URLs
3. You will see a **preview** of the image.
4. Click **Submit** to upload.
5. On success, you’ll see:
   - A **success message**
   - A **URL** to your uploaded image returned from the backend.

---

### 🌐 Backend API Overview

> The full backend documentation, including example responses and advanced usage, is available in `Backend/readme.md`.  
> Below is the most important endpoint used by the frontend.

- **Upload image**

  ```http
  POST /api/upload
  Content-Type: multipart/form-data

  Body:
  - file: [Image File]
  ```

  **Response (simplified):**

  ```json
  {
    "success": true,
    "message": "Upload successful",
    "data": {
      "url": "http://localhost:5000/api/files/abc123",
      "fileName": "example.jpg",
      "fileId": "64f5a2b3c1d2e3f4a5b6c7d8",
      "size": 245760
    }
  }
  ```

You can explore more endpoints and details in `Backend/readme.md`.

---

### 🔐 Production Notes (High‑Level)

- Restrict **CORS** in the backend to your real frontend domain.
- Keep `.env` files **out of version control** (they are already ignored via `.gitignore`).
- Use environment‑specific values for:
  - `MONGO_URI`
  - Cloudinary credentials
  - `VITE_BACKEND_URL`
- Consider adding:
  - Authentication/authorization around upload and management routes.
  - File type/size validation on both client and server.

---

### 📄 License / Contribution

- You can use and modify this project for your own learning or production needs.
- Feel free to open issues or PRs if you extend this in your own repo.

**Happy Coding!**

# Gesture-Controlled Collaborative Whiteboard 🖐️🎨

A **touch-free, accessible collaborative whiteboard** that enables users to **draw, erase, and interact using hand gestures and voice commands** through a standard webcam.  
Designed to make digital collaboration and remote education more inclusive, especially for users with motor impairments.

---

## 🚀 Features

✅ **Gesture-controlled drawing & erasing** using webcam (MediaPipe Hands)  
✅ **Touch-free interaction** – no stylus / touchscreen needed  
✅ **Real-time multi-user collaboration** with Socket.io  
✅ **Secure Login & Signup** using Supabase Authentication  
✅ **Voice Commands Support** using Web Speech API  
✅ **Room-based whiteboard sessions** (create/join rooms)  
✅ Lightweight UI with Tailwind CSS

---

## 🧠 Gesture Controls

| Gesture | Action |
|--------|--------|
| ☝ Index Finger Up | Draw |
| ✌ Index + Middle Finger | Erase |
| ✋ All Fingers Up | Clear Board |
| ✊ Fist / No gesture | Stop Drawing |

---

## 🎙️ Voice Commands

- **"clear"** → Clears the board  
- **"erase"** → Switch to eraser  
- **"draw"** → Switch back to draw  
- **"save"** → Save board as image (optional)

---

## 🛠️ Tech Stack

| Layer | Technology |
|------|------------|
| Frontend | React.js + Canvas API + Tailwind CSS |
| AI / Gesture Recognition | MediaPipe Hands + OpenCV (Web-based detection) |
| Backend | Node.js + Express.js |
| Realtime Sync | Socket.io |
| Database | Supabase (PostgreSQL) |
| Authentication | Supabase Auth |
| Voice Layer | Web Speech API |
| Deployment | Vercel (Frontend) + Render (Backend) |

---

## 📂 Folder Structure

gesture-whiteboard/
│
├── frontend/ # React + Tailwind frontend
└── backend/ # Express + Socket.io backend

yaml
Copy code

---

## ✅ Setup & Run Locally

### 1️⃣ Clone repository
```bash
git clone https://github.com/AnoopRA25/gesture-whiteboard.git
cd gesture-whiteboard
2️⃣ Backend Setup
bash
Copy code
cd backend
npm install
node server.js
Backend will run on:
📍 http://localhost:5000

3️⃣ Frontend Setup
bash
Copy code
cd ../frontend
npm install
npm run dev
Frontend will run on:
📍 http://localhost:5173

🔑 Supabase Configuration
Go to Supabase → Project Settings → Data API

Copy:

Project URL

Publishable key

Paste them in:

📌 frontend/src/supabaseClient.js

js
Copy code
const supabaseUrl = "YOUR_PROJECT_URL";
const supabaseAnonKey = "YOUR_PUBLISHABLE_KEY";
🌍 Deployment
Frontend (Vercel)
Import GitHub repo

Select /frontend folder

Deploy

Backend (Render)
Create new Web Service

Select /backend folder

Set Start Command:

bash
Copy code
node server.js
📌 Future Enhancements
🚀 Add gesture-based tool selection (color/brush)
🚀 Whiteboard session saving in Supabase DB
🚀 Undo/Redo support
🚀 User cursor presence in collaborative mode
🚀 AI model for advanced gesture recognition

👤 Author
AnoopRA25
GitHub: https://github.com/AnoopRA25

📜 License
This project is for educational purposes.

yaml
Copy code

---

If you want, I can also create:
✅ a **cool GitHub README banner** (image)  
✅ **screenshots section** template  
✅ project demo GIF section

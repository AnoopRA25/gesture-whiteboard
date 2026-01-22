# Gesture-Controlled Collaborative Whiteboard 🖐️🎨

A **touch-free collaborative whiteboard** that allows users to **draw, erase, undo/redo, change colors, and interact using hand gestures + voice commands** through a standard webcam.

Designed for **inclusive digital collaboration and remote education**, especially helping users who struggle with physical devices like mouse/stylus/touchscreen.

---

## 🚀 Features

✅ Gesture-controlled drawing & erasing using webcam (MediaPipe Hands)  
✅ Multi-user real-time collaboration using Socket.io  
✅ Room-based sessions (create/join rooms)  
✅ Secure Login/Signup using Supabase Auth  
✅ Tool Controls: color palette, brush size, eraser size  
✅ Undo / Redo support  
✅ Dark Mode whiteboard  
✅ Voice Commands using Web Speech API  
✅ Save whiteboard as image (PNG)  

---

## 🧠 Gesture Controls

| Gesture | Action |
|--------|--------|
| ☝ Index Finger Up | Draw |
| ✌ Index + Middle Finger Up | Erase |
| ✋ All Fingers Up | Clear Board |
| ✊ Fist / No Gesture | Stop Drawing |

---

## 🎙️ Voice Commands

| Command | Action |
|--------|--------|
| "clear" | Clears the board |
| "undo" | Undo last action |
| "redo" | Redo last undone action |
| "save" | Save board as image |
| "eraser" | Switch to eraser |
| "draw" | Switch to drawing mode |
| "red / blue / green / black" | Change brush color |

---

## 🛠️ Tech Stack

| Layer | Technology |
|------|------------|
| Frontend | React.js + Canvas API + Tailwind CSS |
| Gesture AI | MediaPipe Hands + Webcam input |
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
├── frontend/
│ ├── src/
│ │ ├── pages/
│ │ ├── components/
│ │ └── ...
│ └── package.json
│
└── backend/
├── server.js
└── package.json

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
Backend runs at:
📍 http://localhost:5000

3️⃣ Frontend Setup
bash
Copy code
cd ../frontend
npm install
npm run dev
Frontend runs at:
📍 http://localhost:5173

🔑 Supabase Configuration
Step 1: Get Supabase keys
Supabase Dashboard → Project Settings → Data API
Copy:

Project URL

Publishable key

Step 2: Paste in
📌 frontend/src/supabaseClient.js

js
Copy code
const supabaseUrl = "YOUR_PROJECT_URL";
const supabaseAnonKey = "YOUR_PUBLISHABLE_KEY";
🧪 How to Use
Login/Signup

Create a room

Allow Camera Permission

Use gestures to draw / erase

Use toolbar to change colors, brush sizes

Use Undo / Redo buttons

Speak voice commands if needed

Save board as image

🌟 Future Enhancements
🚀 Live cursors + usernames
🚀 Board history + autosave to Supabase DB
🚀 Text tool, shapes tool
🚀 Export as PDF
🚀 Gesture-based tool selection
🚀 Presenter/Student mode

👤 Author
AnoopRA25
GitHub: https://github.com/AnoopRA25

📜 License
Educational project for learning and demonstration purposes.

yaml
Copy code

---

✅ After updating README, push it to GitHub:

```powershell
git add README.md
git commit -m "Updated README with new features"
git push

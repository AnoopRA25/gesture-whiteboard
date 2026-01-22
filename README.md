# Gesture-Controlled Collaborative Whiteboard 🖐️🎨

A **touch-free collaborative whiteboard** that allows users to **draw, erase, undo/redo, change colors, and interact using hand gestures + voice commands** through a standard webcam.

This project is designed to make **remote collaboration and online education more inclusive**, especially for users who face difficulty using physical input devices (mouse/stylus/touchscreen).

---

## 🚀 Features

✅ Gesture-controlled drawing & erasing using webcam (MediaPipe Hands)  
✅ Multi-user real-time collaboration using Socket.io  
✅ Room-based whiteboard sessions (create/join rooms)  
✅ Secure Login/Signup using Supabase Authentication  
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
├── backend/
│ ├── server.js
│ └── package.json
│
└── start.bat

yaml
Copy code

---

## ✅ Setup & Run Locally

### 1️⃣ Clone repository
```bash
git clone https://github.com/AnoopRA25/gesture-whiteboard.git
cd gesture-whiteboard
2️⃣ Install Backend Dependencies
bash
Copy code
cd backend
npm install
3️⃣ Install Frontend Dependencies
bash
Copy code
cd ../frontend
npm install
▶️ Run Project with One Click (start.bat)
A start.bat script is included to run both frontend and backend automatically.

✅ Steps:
Go to the root folder:

makefile
Copy code
D:\gesture-whiteboard
Double click:

pgsql
Copy code
start.bat
✅ It will automatically:

Start Backend server → http://localhost:5000

Start Frontend server → http://localhost:5173

Open the app in browser

🔄 Run Manually (Optional)
Backend:
bash
Copy code
cd backend
node server.js
Frontend:
bash
Copy code
cd frontend
npm run dev
🔑 Supabase Configuration
Step 1: Get Supabase Keys
Supabase Dashboard → Project Settings → Data API
Copy:

Project URL

Publishable key

Step 2: Paste Keys in Project
Edit:

📌 frontend/src/supabaseClient.js

js
Copy code
const supabaseUrl = "YOUR_PROJECT_URL";
const supabaseAnonKey = "YOUR_PUBLISHABLE_KEY";
🧪 How to Use
Signup / Login

Create a room

Allow webcam permission

Use gestures to draw/erase

Use toolbar for colors and brush sizes

Use Undo / Redo

Use voice commands if needed

Save whiteboard as image

🌟 Future Enhancements
🚀 Live cursors + usernames
🚀 Board history + autosave to Supabase DB
🚀 Text tool and shapes tool
🚀 Export as PDF
🚀 Gesture-based tool selection (palette, tools)
🚀 Presenter/Student mode

👤 Author
AnoopRA25
GitHub: https://github.com/AnoopRA25

📜 License
This project is made for educational and demonstration purposes.


# Mini Team Chat – Real-Time Chat Application

Mini Team Chat is a full-stack real-time messaging application built using the **MERN stack**.  
It allows users to create an account, login securely, and chat instantly with other users.  
The app uses **JWT authentication**, **bcrypt for password hashing**, and **Socket.IO** for real-time communication.

This project is fully deployable on **Render** (backend) and **Render / Vercel / Netlify** (frontend).

---

## Features

### Authentication
- User Registration  
- Login with JWT  
- Password hashing using bcrypt  
- Secure protected routes  
- Environment-based configuration  

### Chat System
- Real-time messaging using Socket.IO  
- One-to-one chat  
- Auto-scroll + message timestamps  
- Sender/Receiver message UI  

### Frontend (React)
- Clean UI  
- Responsive chat interface  
- Context API for auth  
- Loading states + error handling  

### Backend (Node + Express)
- REST API for authentication & messaging  
- MongoDB database with Mongoose  
- Token-based authentication  
- CORS & security middleware  

### Deployment Ready
- Backend deployed on Render  
- Frontend deployed on Render 
- Proper API base URL config  
- Proper CLIENT_URL for CORS  

---

## Tech Stack

### **Frontend**
- React  
- Vite  
- Context API  
- Axios  
- Socket.IO Client  
- CSS Modules

### **Backend**
- Node.js  
- Express  
- MongoDB + Mongoose  
- bcrypt  
- JWT  
- Socket.IO  
- dotenv  

---
## Folder Structure
mini-team-chat/
├─ backend/
│  ├─ package.json
│  ├─ .env.example
│  ├─ index.js
│  ├─ socket.js
│  ├─ config/
│  │  └─ db.js
│  ├─ models/
│  │  ├─ User.js
│  │  ├─ Channel.js
│  │  └─ Message.js
│  ├─ routes/
│  │  ├─ auth.js
│  │  ├─ channels.js
│  │  └─ messages.js
│  └─ middleware/
│     └─ auth.js
└─ frontend/
   ├─ package.json
   ├─ index.html
   └─ src/
      ├─ main.jsx
      ├─ App.jsx
      ├─ api.js
      ├─ socket.js
      ├─ pages/
      │  ├─ Login.jsx
      │  ├─ Signup.jsx
      │  ├─ Channels.jsx
      │  └─ ChannelView.jsx
      └─ styles.css
## 🛠️ Setup & Run Instructions

Follow these steps to run the project locally.

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/mini-team-chat.git
cd mini-team-chat
Backend Setup-
cd backend
npm install
.env-
PORT=4000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173

npm run dev

Frontend Setup-
cd frontend
npm install
.env-
VITE_API_URL=http://localhost:4000/api
VITE_SOCKET_URL=http://localhost:4000

npm run dev

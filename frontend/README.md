# 🎨 Task Manager Frontend

React dashboard for the Task Management API (Project 1).

## 🚀 Quick Start

### Step 1: Start the Backend
Make sure your Task Management API is running:
```bash
cd task-management-api
venv\Scripts\activate
uvicorn app.main:app --reload
```

### Step 2: Start the Frontend
```bash
cd task-manager-frontend
npm install
npm run dev
```

### Step 3: Open Browser
Go to: **http://localhost:3000**

## 📸 Features

| Feature | Description |
|---------|-------------|
| 🔐 Login/Register | JWT authentication with your FastAPI backend |
| 📋 Dashboard | View teams and tasks in a clean UI |
| ➕ Create Tasks | Form to add new tasks with priority |
| 🏷️ Status Badges | Color-coded priority and status labels |
| 📱 Responsive | Works on desktop and mobile |

## 🏗️ Tech Stack

- **React 18** - UI library
- **Vite** - Build tool (fast dev server)
- **No external CSS framework** - Pure inline styles (no dependencies)

## 📁 Project Structure

```
task-manager-frontend/
├── src/
│   ├── components/
│   │   ├── Login.jsx      # Auth screen
│   │   └── Dashboard.jsx  # Main app screen
│   ├── App.jsx            # Router & state
│   └── main.jsx           # Entry point
├── index.html
├── package.json
└── vite.config.js
```

## 🔗 API Integration

The frontend connects to your FastAPI backend at `http://127.0.0.1:8000`:
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login (OAuth2 form)
- `GET /teams/` - Fetch teams
- `GET /tasks/` - Fetch tasks
- `POST /tasks/` - Create task

## 🚀 Build for Production

```bash
npm run build
```

This creates a `dist/` folder with static files you can deploy to Vercel, Netlify, or any static host.

## 💡 What This Proves

- **API Integration**: You can connect a frontend to a real backend
- **JWT Handling**: Storing and sending tokens in headers
- **State Management**: React hooks for data fetching
- **Form Handling**: Creating resources via API
- **Error Handling**: Network errors, auth errors

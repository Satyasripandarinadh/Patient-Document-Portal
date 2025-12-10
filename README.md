# Patient-Document-Portal
# 🏥 Patient Document Portal

A modern, full-stack web application for managing and uploading patient documents securely. Built with **React**, **Vite**, **Express.js**, and **SQLite3**.

---

## 📋 Project Overview

The **Patient Document Portal** enables users to:
- ✅ Upload multiple PDF documents simultaneously
- 📂 View all uploaded documents with metadata (filename, size, upload date)
- ⬇️ Download documents on demand
- 🗑️ Delete unwanted documents
- 🔄 Real-time file selection feedback (files stored in memory before upload)
- 🚨 Graceful error handling when backend is unavailable

---

## 🏗️ Architecture

### Frontend
- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **HTTP Client**: Axios (for API requests)
- **Styling**: Inline CSS (easily customizable)

### Backend
- **Framework**: Express.js 5.2.1
- **File Upload**: Multer 2.0.2
- **Database**: SQLite3 5.1.7
- **CORS**: Enabled for cross-origin requests
- **Port**: 5000 (configurable via `PORT` env variable)

---

## 📦 Project Structure

```
Patient-portal/
├── backend/
│   ├── server.js           # Express server with upload/list/delete endpoints
│   ├── package.json        # Backend dependencies
│   ├── uploads/            # Uploaded PDF files stored here
│   └── documents.db        # SQLite database (auto-created)
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx         # Main React component
│   │   ├── App.css         # Component styling
│   │   ├── main.jsx        # React entry point
│   │   └── index.css       # Global styles
│   ├── package.json        # Frontend dependencies
│   ├── vite.config.js      # Vite configuration
│   └── index.html          # HTML template
│
└── README.md               # This file
```

---

## 🛠️ Dependencies

### Backend (`backend/package.json`)
```json
{
  "dependencies": {
    "express": "^5.2.1",        // Web framework
    "multer": "^2.0.2",         // File upload middleware
    "sqlite3": "^5.1.7",        // Database
    "cors": "^2.8.5"            // Cross-Origin Resource Sharing
  }
}
```

### Frontend (`frontend/package.json`)
```json
{
  "dependencies": {
    "react": "^19.2.0",         // UI library
    "react-dom": "^19.2.0"      // React DOM renderer
  },
  "devDependencies": {
    "vite": "^7.2.4",           // Build tool
    "@vitejs/plugin-react": "^5.1.1",
    "eslint": "^9.39.1",        // Code linter
    ...
  }
}
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** v16+ ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)

### 1️⃣ Install Dependencies

#### Backend
```powershell
cd backend
npm install
```

#### Frontend
```powershell
cd frontend
npm install
```

---

### 2️⃣ Start the Backend

From the `backend/` directory:

```powershell
npm start
```

**Expected output:**
```
Server listening on http://localhost:5000
```

The backend will:
- Create a `documents.db` SQLite database
- Create an `uploads/` folder for storing PDFs
- Listen on `http://localhost:5000`

---

### 3️⃣ Start the Frontend (Development Mode)

From the `frontend/` directory (in a new terminal):

```powershell
npm run dev
```

**Expected output:**
```
  VITE v7.2.4  ready in 123 ms

  ➜  Local:   http://localhost:5173/
```

Open your browser to **http://localhost:5173/**

---

## 📖 API Endpoints

### Upload Documents
**POST** `/documents/upload`
- Accepts: Multiple PDF files
- Body: FormData with `file` fields
- Response: `{ message, documents: [...] }`

### List Documents
**GET** `/documents/upload`
- Response: Array of document objects
  ```json
  [
    {
      "id": 1,
      "filename": "patient_report.pdf",
      "filesize": 245632,
      "created_at": "2025-12-10T10:30:00.000Z"
    }
  ]
  ```

### Download Document
**GET** `/documents/:id`
- Response: File download (binary PDF)

### Delete Document
**DELETE** `/documents/:id`
- Response: `{ message: "Document deleted" }`

---

## 🎯 Features

### ✨ Real-Time File Selection
- Select single or multiple PDF files
- Files are stored in **browser memory** (RAM) immediately
- Visual list shows selected files with name, type, and size
- Selected files persist until upload succeeds or browser is closed

### 🔔 Backend Status Indicator
- Displays red notice if backend is unreachable
- Message: *"Backend not reachable at http://localhost:5000 — files will remain selected locally until the server is started."*
- Automatically checks backend on app load

### 📁 Document Management
- View all uploaded documents with metadata
- Download any document with one click
- Delete documents with confirmation alert

### 🛡️ Error Handling
- Network errors display user-friendly alerts
- Backend failures don't clear selected files
- Console logs all errors for debugging

---

## 🧪 Testing the Application

### Test Scenario 1: Upload PDFs
1. Open http://localhost:5173/
2. Click **"Choose File"** button
3. Select 1–3 PDF files from your computer
4. Verify files appear under **"Selected Files (in memory)"**
5. Click **"Upload"** button
6. Files should appear under **"Uploaded Documents"** section

### Test Scenario 2: Backend Unavailable
1. Stop the backend (`Ctrl+C` in backend terminal)
2. Try uploading a file
3. Red notice should appear: **"Backend not reachable..."**
4. Selected files remain in memory
5. Start backend again; files can now upload

### Test Scenario 3: Download & Delete
1. Click **"Download"** link next to any document
2. PDF downloads to your Downloads folder
3. Click **"Delete"** button to remove document from system

---

## 🔧 Configuration

### Change Backend Port
In `backend/server.js`, set the `PORT` environment variable:

```powershell
$env:PORT=8000; npm start
```

Or edit the default port in `server.js`:
```javascript
const port = process.env.PORT || 5000; // Change 5000 to desired port
```

### Change Frontend Dev Server Port
In `frontend/vite.config.js`:
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000  // Change from default 5173
  }
});
```

---

## 📚 Build for Production

### Frontend Build
```powershell
cd frontend
npm run build
```

Creates optimized files in `frontend/dist/`

### Backend Production
```powershell
cd backend
npm start
```

For production deployment, use a process manager like **PM2**:
```powershell
npm install -g pm2
pm2 start backend/server.js --name "patient-portal"
```

---

## 🐛 Troubleshooting

### ❌ "Backend not reachable" Error
**Solution**: Ensure backend is running on port 5000
```powershell
cd backend
npm start
```

### ❌ Port 5000 Already in Use
**Solution**: Kill process or use different port
```powershell
# Find process using port 5000
Get-NetTCPConnection -LocalPort 5000

# Use different port
$env:PORT=5001; npm start
```

### ❌ Database Lock Error
**Solution**: Delete `backend/documents.db` and restart
```powershell
cd backend
Remove-Item documents.db
npm start
```

### ❌ File Upload Fails with 500 Error
**Solution**: Check backend console logs and ensure `uploads/` folder exists
```powershell
cd backend
mkdir -Force uploads
npm start
```

---

## 📝 Available Scripts

### Frontend
| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Vite dev server (localhost:5173) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint checks |

### Backend
| Command | Purpose |
|---------|---------|
| `npm start` | Start Express server (localhost:5000) |

---

## 🤝 Contributing

1. Create a new branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m "Add feature"`
3. Push to branch: `git push origin feature/your-feature`
4. Open a Pull Request

---

## 📄 License

This project is open source and available under the **ISC License**.

---

## 📞 Support & Questions

For issues or questions:
1. Check the **Troubleshooting** section above
2. Review backend console logs (`npm start` output)
3. Check browser console (F12 → Console tab)
4. Verify both frontend and backend are running on correct ports

---

## 🎉 Happy Uploading!

Enjoy managing patient documents securely with the **Patient Document Portal**! 🏥

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Ensure uploads folder exists
const UPLOAD_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Initialize SQLite database
const DB_PATH = path.join(__dirname, 'documents.db');
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Failed to open database', err);
  } else {
    db.run(
      `CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT,
        filepath TEXT,
        filesize INTEGER,
        created_at TEXT
      )`
    );
  }
});

// Upload endpoint supporting multiple files
app.post('/documents/upload', upload.array('file'), (req, res) => {
  const files = req.files || (req.file ? [req.file] : []);
  if (!files || files.length === 0) {
    return res.status(400).send('No file uploaded.');
  }

  const inserted = [];
  let remaining = files.length;

  files.forEach((file) => {
    db.run(
      'INSERT INTO documents (filename, filepath, filesize, created_at) VALUES (?, ?, ?, ?)',
      [file.originalname, file.path, file.size, new Date().toISOString()],
      function (err) {
        if (err) {
          console.error('DB insert error', err);
        } else {
          inserted.push({
            id: this.lastID,
            filename: file.originalname,
            filesize: file.size,
            created_at: new Date().toISOString(),
          });
        }

        remaining -= 1;
        if (remaining === 0) {
          res.json({ message: 'File(s) uploaded successfully', documents: inserted });
        }
      }
    );
  });
});

// List uploaded documents
app.get('/documents/upload', (req, res) => {
  db.all('SELECT id, filename, filesize, created_at FROM documents ORDER BY id DESC', (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.json(rows);
  });
});

// Download a document by id
app.get('/documents/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT filepath, filename FROM documents WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).send(err.message);
    if (!row) return res.status(404).send('Document not found');
    res.sendFile(path.resolve(row.filepath));
  });
});

// Delete a document by id
app.delete('/documents/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT filepath FROM documents WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).send(err.message);
    if (!row) return res.status(404).send('Document not found');

    fs.unlink(row.filepath, (unlinkErr) => {
      if (unlinkErr) console.error('Failed to delete file from disk', unlinkErr);
      db.run('DELETE FROM documents WHERE id = ?', [id], function (delErr) {
        if (delErr) return res.status(500).send(delErr.message);
        res.json({ message: 'Document deleted' });
      });
    });
  });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

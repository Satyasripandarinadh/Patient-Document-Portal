import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [files, setFiles] = useState([]);
  const [docs, setDocs] = useState([]);
  const [backendAvailable, setBackendAvailable] = useState(true);

  const loadDocs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/documents/upload");
      setDocs(res.data);
      setBackendAvailable(true);
    } catch (err) {
      console.error("Cannot connect to backend", err);
      setBackendAvailable(false);
    }
  };

  useEffect(() => {
    loadDocs();
  }, []);

  const uploadFile = async () => {
    if (!files || files.length === 0) {
      alert("Please select at least one PDF");
      return;
    }

    const formData = new FormData();
    files.forEach((f) => formData.append("file", f));

    try {
      await axios.post("http://localhost:5000/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setFiles([]); // clear selected files after successful upload
      loadDocs();
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed: see console for details. If the backend is not running, files remain selected locally.");
      setBackendAvailable(false);
    }
  };

  const deleteFile = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/documents/${id}`);
      loadDocs();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Patient Document Portal</h1>

      <input
        type="file"
        accept="application/pdf"
        multiple
        onChange={(e) => setFiles(Array.from(e.target.files))}
      />
      <button onClick={uploadFile} style={{ marginLeft: "10px" }}>Upload</button>

      {!backendAvailable && (
        <p style={{ color: "#b33" }}>
          Backend not reachable at http://localhost:5000 — files will remain selected locally until the server is started.
        </p>
      )}

      {files.length > 0 && (
        <div style={{ marginTop: "12px" }}>
          <h3>Selected Files (in memory)</h3>
          {files.map((f, i) => (
            <div key={i} style={{ marginBottom: "6px" }}>
              <strong>{f.name}</strong> — {f.type || "unknown"}, {f.size} bytes
            </div>
          ))}
        </div>
      )}

      <h2>Uploaded Documents</h2>
      {docs.length === 0 && <p>No documents uploaded.</p>}

      {docs.map((doc) => (
        <div key={doc.id} style={{ marginBottom: "10px" }}>
          <p>{doc.filename} ({doc.filesize} bytes)</p>

          <a href={`http://localhost:5000/documents/${doc.id}`} target="_blank" rel="noreferrer">
            Download
          </a>

          <button onClick={() => deleteFile(doc.id)} style={{ marginLeft: "10px" }}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;

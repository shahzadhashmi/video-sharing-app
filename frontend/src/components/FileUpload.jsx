import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadedPath, setUploadedPath] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert('Please select a file first.');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadedPath(res.data.filePath);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading file.');
    }
  };

  return (
    <div>
      <h2>Upload a File</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>

      {uploadedPath && (
        <div>
          <p>File uploaded to:</p>
          <a href={`http://localhost:5000${uploadedPath}`} target="_blank" rel="noopener noreferrer">
            {uploadedPath}
          </a>
        </div>
      )}
    </div>
  );
};

export default FileUpload;

'use client'
// pages/index.js
import React, {useState} from 'react';

import FileUploader from './components/FileUploader';

const Home = () => {
  const [fileData, setFileData] = useState(null);

  const handleFileUploaded = (response) => {
    // The response is the file data from the server, which is the Word document
    try {
      // It's important to create a new blob object with the response data
      const blob = new Blob([response], {
        type:
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'file.docx');  // or any other extension
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error downloading the file:', error);
    }
  };

  return (
    <div>
      <h1>Markdown to Word Converter</h1>
      <FileUploader onFileUploaded={handleFileUploaded} />
      {fileData && (
        <div>
          <h2>File converted successfully!</h2>
          {/* Display your file data here */}
        </div>
      )}
    </div>
  );
};

export default Home;

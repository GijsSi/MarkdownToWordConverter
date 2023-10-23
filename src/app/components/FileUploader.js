// components/FileUploader.js
import React, {useCallback, useState} from 'react';

const FileUploader = ({onFileUploaded}) => {
  const [progress, setProgress] = useState(0);  // Progress indicator

  const onDragOver = (event) => {
    event.preventDefault();
  };

  const onDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer.files;

    if (files.length) {
      uploadFile(files[0]);  // We're just handling the first file here
    }
  };

  const uploadFile = (file) => {
    console.log('uploadFile called with file:', file);

    const formData = new FormData();
    formData.append('file', file);
    if (typeof onFileUploaded !== 'function') {
      console.error('onFileUploaded prop is not a function');
      return;
    }

    // Request setup
    const xhr = new XMLHttpRequest();

    console.log('xhr:', xhr);

    xhr.onload = () => {
      setProgress(0);  // Reset the progress bar when done
      if (xhr.status >= 200 && xhr.status < 300) {
        onFileUploaded(
            xhr.response);  // Pass the response to the parent component
      } else {
        console.error(`Error: ${xhr.status} - ${xhr.statusText}`);
      }
    };

    // Update progress
    xhr.upload.onprogress = (event) => {
      const percent = (event.loaded / event.total) * 100;
      setProgress(percent);
    };

    console.log('xhr.upload:', xhr.upload);

    // File upload finished
    xhr.onload = () => {
      setProgress(0);  // Reset the progress bar when done

      if (xhr.status >= 200 && xhr.status < 300) {
        onFileUploaded(
            xhr.response);  // Pass the response to the parent component
      }
    };

    xhr.open('POST', '/api/convert', true);
    xhr.send(formData);
    console.log('formData:', formData);
  };

  return (
    <div
        onDragOver={onDragOver}
        onDrop={onDrop}
        style={{
    border: '2px dashed gray', padding: '20px', textAlign: 'center'}}
    >
        <p>Drag & drop your Markdown file here</p>
        {progress > 0 && (
            <div style={{ marginTop: '20px' }}>
                <progress value={progress} max="100" />
                <p>{Math.round(progress)}%</p>
            </div>
        )
} < /div>
  );
};

export default FileUploader;

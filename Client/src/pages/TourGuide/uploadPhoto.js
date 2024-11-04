import React, { useState } from 'react';
//import './styles/tourGuideUploadPhoto.css'

import axios from 'axios';

const ImageUploader = ({ tourGuideId }) => {
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file); // Convert the file to base64 string
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!image) {
      setError('Please select an image to upload.');
      return;
    }
  
    const formData = new FormData();
    const fileInput = document.querySelector('input[type="file"]');
  
    if (fileInput.files.length === 0) {
      setError('No file selected.');
      return;
    }
  
    formData.append('profilePicture', fileInput.files[0]);
  
    try {
      const response = await axios.put(`http://localhost:8000/tourGuide/uploadPicture/${tourGuideId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log('Image uploaded:', response.data);
      setImage(null);
      setError('');
    } catch (error) {
      console.error('Error uploading image:', error);
      setError(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="uploader">
      <form className="form" onSubmit={handleSubmit}>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleImageChange} 
          className="fileInput" 
        />
        <button type="submit" className="submitButton">Upload</button>
      </form>
      {error && <p className="errorMessage">{error}</p>}
      {image && <img src={image} alt="Uploaded Preview" className="imagePreview" />}
    </div>
  );
};

export default ImageUploader;
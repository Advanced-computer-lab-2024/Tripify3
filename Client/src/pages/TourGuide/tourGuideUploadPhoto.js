import React, { useState } from 'react';

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

    // Create a FormData object to send the image
    const formData = new FormData();
    const fileInput = document.querySelector('input[type="file"]');
    formData.append('profilePicture', fileInput.files[0]); // Append the image file

    try {
        const response = await fetch(`localhost:8000/tourGuide/uploadPicture/${tourGuideId}`, {
            method: 'PUT',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const result = await response.json();
      console.log('Image uploaded:', result);
      setImage(null); // Clear the preview after successful upload
      setError(''); // Clear any previous errors
    } catch (error) {
      setError(error.message);
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button type="submit">Upload</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {image && <img src={image} alt="Uploaded Preview" style={{ width: '200px', height: 'auto' }} />}
    </div>
  );
};

export default ImageUploader;

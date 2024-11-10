import React, { useState } from "react";
import { getUserId } from "../../utils/authUtils.js";
import axios from "axios";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa"; // For icons
import { useNavigate } from "react-router-dom";

const ComplaintForm = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(true);
  const userId = getUserId();  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/complaint/create", {
        touristId: userId,
        title,
        body,
        date,
      });
      console.log("Complaint submitted:", response.data);
      setPopupMessage("Complaint filed successfully!");
      setIsSuccess(true);
      setShowPopup(true);
    } catch (error) {
      console.error("Error submitting complaint:", error);
      setPopupMessage("There was an issue submitting your complaint.");
      setIsSuccess(false);
      setShowPopup(true);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    if (isSuccess) {      
      navigate("/tourist/homepage");
    }
  };

  return (
    <div className="complaint-form-container">
      <div className="form-card">
        <h2 className="form-title">File a Complaint</h2>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label className="form-label">Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="form-input"
              placeholder="Enter complaint title"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description:</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              className="form-input form-textarea"
              placeholder="Describe your complaint"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="form-input"
            />
          </div>
          <button type="submit" className="form-submit-button">
            Submit
          </button>
        </form>
        <p className="form-footer">
          Your feedback helps us improve our services. Thank you!
        </p>
      </div>

      {showPopup && (
        <div className="popup-container">
          <div className="popup-content">
            {isSuccess ? (
              <FaCheckCircle className="popup-icon success-icon" />
            ) : (
              <FaExclamationCircle className="popup-icon error-icon" />
            )}
            <p className="popup-message">{popupMessage}</p>
            <button onClick={closePopup} className="popup-close-button">
              Close
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .complaint-form-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 20px;
          background-color: #f7f7f7;
        }

        .form-card {
          background-color: #ffffff;
          border-radius: 10px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          padding: 20px;
          width: 100%;
          max-width: 500px;
          margin-top: -100px;
        }

        .form-title {
          text-align: center;
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 20px;
          color: #333;
        }

        .form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-label {
          font-weight: 600;
          color: #555;
          margin-bottom: 5px;
        }

        .form-input {
          padding: 12px;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-size: 16px;
          transition: border-color 0.3s;
        }

        .form-input:focus {
          outline: none;
          border-color: #4caf50;
        }

        .form-textarea {
          resize: vertical;
          height: 180px;
        }

        .form-submit-button {
          padding: 12px;
          background-color: #4caf50;
          color: white;
          font-weight: bold;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s, transform 0.2s;
        }

        .form-submit-button:hover {
          background-color: #45a049;
          transform: translateY(-2px);
        }

        .form-footer {
          text-align: center;
          color: #777;
          font-size: 14px;
          margin-top: 15px;
        }

        .popup-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .popup-content {
          background: white;
          padding: 30px;
          border-radius: 10px;
          text-align: center;
          width: 90%;
          max-width: 400px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }

        .popup-icon {
          font-size: 50px;
          margin-bottom: 15px;
        }

        .success-icon {
          color: #4caf50;
        }

        .error-icon {
          color: #f44336;
        }

        .popup-message {
          font-size: 18px;
          color: #333;
          margin-bottom: 20px;
        }

        .popup-close-button {
          background-color: #4caf50;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default ComplaintForm;

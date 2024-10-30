import React, { useState } from "react";
import { getUserId } from "../../utils/authUtils.js";
import axios from "axios";

const ComplaintForm = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const userId = getUserId();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/complaints/create", {
        touristId: userId,
        title,
        body,
        date,
      });
      console.log("Complaint submitted:", response.data);
      alert("Complaint filed successfully!");
    } catch (error) {
      console.error("Error submitting complaint:", error);
      alert("There was an issue submitting your complaint.");
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

      <style jsx>{`
        .complaint-form-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          padding: 20px;
          background-color: #f7f7f7; /* Neutral background color */
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
          gap: 15px; /* Space between form elements */
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
          padding: 12px; /* Increased padding */
          border: 1px solid #ccc;
          border-radius: 5px;
          font-size: 16px;
          transition: border-color 0.3s;
        }

        .form-input:focus {
          outline: none;
          border-color: #4caf50; /* Highlight color */
        }

        .form-textarea {
          resize: vertical; /* Allow vertical resizing */
          height: 180px; /* Increased height for better visibility */
        }

        .form-submit-button {
          padding: 12px;
          background-color: #4caf50; /* Green color */
          color: white;
          font-weight: bold;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s, transform 0.2s;
        }

        .form-submit-button:hover {
          background-color: #45a049; /* Darker green on hover */
          transform: translateY(-2px); /* Slight lift on hover */
        }

        .form-footer {
          text-align: center;
          color: #777;
          font-size: 14px;
          margin-top: 15px;
        }
      `}</style>
    </div>
  );
};

export default ComplaintForm;

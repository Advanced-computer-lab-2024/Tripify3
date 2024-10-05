import React, { useState, useEffect } from "react";
import axios from "axios";

const ViewTags = () => {
  const [tags, setTags] = useState([]); // Store fetched tags
  const [responseMessage, setResponseMessage] = useState(""); // Response message for errors

  // Fetch tags when the component is loaded
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/access/admin/viewTags"
        );
        setTags(response.data); // Set the fetched tags in the state
        setResponseMessage("");
      } catch (error) {
        setResponseMessage("Error fetching tags.");
      }
    };

    fetchTags();
  }, []);

  return (
    <div>
      <h2>View Tags</h2>

      {/* Display tags */}
      {tags.length > 0 ? (
        <ul>
          {tags.map((tag) => (
            <li key={tag._id}>{tag.name}</li>
          ))}
        </ul>
      ) : (
        <p>{responseMessage}</p>
      )}
    </div>
  );
};

export default ViewTags;

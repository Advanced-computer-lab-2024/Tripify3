import React, { useState } from "react";
import { fetchLoginDetails } from "../services/apis.js";
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(email);
    // Validate email and password before making API call
    if (email === "" || password === "") {
      setError("Email and Password are required");
      return; // Don't proceed with API call if validation fails
    }

    // Clear any previous errors and set loading to true
    setError("");

    const body = {
      username: email,
      password: password,
    };
    try {
      // Await the API call to fetch login details
      const response = await fetchLoginDetails("/access/tourist/login", body);
      console.log(response.user.name);
      

      // If the API returns successfully, display user information
      console.log(response);

      // Reset form fields on successful login
      setEmail("");
      setPassword("");
    } catch (error) {
      // Handle errors and set an error message for display
      console.error("Error during login:", error);
      setError("Invalid email or password, please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={styles.inputGroup}>
          <label>Email:</label>
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} required style={styles.input} />
        </div>
        <div style={styles.inputGroup}>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={styles.input} />
        </div>
        <button type="submit" style={styles.button}>
          Login
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    width: "300px",
    margin: "0 auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    boxShadow: "2px 2px 12px rgba(0,0,0,0.1)",
  },
  inputGroup: {
    marginBottom: "15px",
  },
  input: {
    width: "100%",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginBottom: "10px",
  },
};

export default LoginPage;

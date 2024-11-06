import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getUserId } from '../../utils/authUtils'; // Ensure this import is correct

const TermsAndAgreements = () => {
    const navigate = useNavigate();
    const userId = getUserId();
    const [userName, setUserName] = useState(''); // State to hold the user's name
    const [userDetails, setUserDetails] = useState(null); // State to hold the full user object

    useEffect(() => {
        const fetchUserName = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/user/get/${userId}`);
                setUserName(response.data.user.name); // Set the user's name
                setUserDetails(response.data.user); // Store the full user object if needed
            } catch (error) {
                console.error("Error fetching user name:", error);
            }
        };

        fetchUserName();
    }, [userId]); // Only run this effect once when userId changes

    const handleAccept = async () => {
        try {
            await axios.put(`http://localhost:8000/user/accept-terms/${userId}`);
            // Navigate based on user type
            if (userDetails && userDetails.type) {
                switch (userDetails.type) {
                    case "Tourism Governor":
                        navigate("/tourism-governor/profile");
                        break;
                    case "Tourist":
                        navigate("/tourist/homepage");
                        break;
                    case "Seller":
                        navigate("/seller/seller");
                        break;
                    case "Admin":
                        navigate("/admin/users");
                        break;
                    case "Tour Guide":
                        navigate("/tour-guide/profile");
                        break;
                    case "Advertiser":
                        navigate("/advertiser/advertiser");
                        break;
                    default:
                        console.error("Unknown user type:", userDetails.type);
                }
            } else {
                console.error("User type is not defined");
            }
        } catch (error) {
            console.error("Error accepting terms:", error);
            alert("There was an error accepting the terms. Please try again.");
        }
    };

    return (
        <div className="terms-container">
            <style>
                {`
                .terms-container {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    max-width: 600px;
                    margin: auto;
                    text-align: center;
                }
                h1 {
                    margin-top: 50px;
                    font-size: 2rem;
                    margin-bottom: 20px;
                }
                h2 {
                    font-size: 1.5rem;
                    margin-bottom: 10px;
                }
                p {
                    margin: 10px 0;
                }
                button {
                    padding: 10px 20px;
                    font-size: 1rem;
                    cursor: pointer;
                    background-color: #007BFF;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    transition: background-color 0.3s ease;
                }
                button:hover {
                    background-color: #0056b3;
                }
                `}
            </style>
            <h1>Welcome to Tripify, {userName}!</h1>
            <h2>Terms and Agreements</h2>
            <p>Please read the following terms and agreements carefully before using our services:</p>
            <p>1. You must be at least 18 years old to use our platform.</p>
            <p>2. All user-generated content must adhere to community guidelines.</p>
            <p>3. We reserve the right to modify or terminate the service at any time.</p>
            <button onClick={handleAccept}>Accept</button>
        </div>
    );
};

export default TermsAndAgreements;

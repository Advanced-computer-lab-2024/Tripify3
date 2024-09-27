import axios from "axios";

export const fetchLoginDetails = async (url, body) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}${url}`, // Concatenating the base URL with the endpoint
      body // Sending the request body directly
    );

    console.log("respone is", response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

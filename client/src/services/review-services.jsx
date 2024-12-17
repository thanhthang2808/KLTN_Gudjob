import axios from "axios";
const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const handleLeaveAReview = async (revieweeId, rating, comment) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/review/leave-a-review`,
      { revieweeId, rating, comment },
      { withCredentials: true }
    );
    console.log(response.data.message);
    return response.data.success; // Assuming success is returned as a flag
  } catch (error) {
    // If an error occurs, log the error message
    console.error(
      "Error in handleLeaveAReview:",
      error.response?.data?.message || error.message
    );
    return false; // Return false to indicate failure
  }
};

export default handleLeaveAReview;

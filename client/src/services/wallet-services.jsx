import axios from "axios";
const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const handleLockBalance = async (amount) => {
  try {
    const response = await axios.put(
      `${API_URL}/api/wallet/lock-wallet-balance`,
      { amount },
      { withCredentials: true }
    );
    console.log(response.data.message);
    return response.data.success;  // Assuming success is returned as a flag
  } catch (error) {
    // If an error occurs, log the error message
    console.error("Error in handleLockBalance:", error.response?.data?.message || error.message);
    return false; // Return false to indicate failure
  }
}

export default handleLockBalance;

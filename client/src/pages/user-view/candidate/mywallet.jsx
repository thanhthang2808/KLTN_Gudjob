import { useState, useEffect } from "react";
import axios from "axios";
import { Wallet, ArrowUpCircle } from "lucide-react"; // Import icons
import momologo from "@/assets/MoMo_Logo.png";
import momo_modal from "@/assets/momo-shield.png";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

function MyWallet() {
  const [user, setUser] = useState({});
  const [amount, setAmount] = useState(); // State for deposit amount
  const [showDeposit, setShowDeposit] = useState(false); // State for showing deposit input
  const [showModal, setShowModal] = useState(false); // State for showing the payment modal
  const [errorMessage, setErrorMessage] = useState(""); // State for error message

  const getInfo = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/user/user-info`, {
        withCredentials: true,
      });
      setUser(response.data.user);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const formatAmount = (amount) => {
    if (!amount) return "0 VNĐ"; // Handle case for empty or undefined amount
    return parseInt(amount).toLocaleString("vi-VN") + " VNĐ"; // Formats the number
  };

  useEffect(() => {
    getInfo();
  }, []);

  const handleDeposit = async () => {
    // Validate the amount
    if (amount < 1000 || amount > 50000000) {
      setErrorMessage("Số tiền không hợp lệ! Vui lòng nhập từ 1.000 đến 50.000.000 VNĐ trên mỗi lần nạp tiền.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/payment`,
        { amount },
        { withCredentials: true }
      );

      setShowModal(true);
      setErrorMessage(""); // Clear error message if valid

      if (response.data && response.data.payUrl) {
        await axios.put(
          `${API_URL}/api/wallet/update-wallet-balance`,
          { amount },
          { withCredentials: true }
        );

        setTimeout(() => {
          window.location.href = response.data.payUrl;
        }, 1000);
      } else {
        console.error("No payment URL returned");
      }

      getInfo();
      setAmount();
      setShowDeposit(false);
    } catch (error) {
      console.error("Error depositing money:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-center mb-4">
          <Wallet className="inline-block mr-2 text-blue-600" />
          Số dư:{" "}
          <span className="text-green-600">
            {formatAmount(user?.walletBalance)}
          </span>
        </h1>

        <button
          onClick={() => setShowDeposit(!showDeposit)}
          className="flex items-center bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <ArrowUpCircle className="inline-block mr-2" /> Nạp tiền
        </button>

        {showDeposit && (
          <div className="mt-6 w-full max-w-xs">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Nhập số tiền"
              className="border border-gray-300 rounded-md px-4 py-2 mb-4 w-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errorMessage && (
              <p className="text-red-600 text-sm mb-2">{errorMessage}</p>
            )}
            <button
              onClick={handleDeposit}
              className="flex items-center justify-between bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition focus:outline-none focus:ring-2 focus:ring-green-300 w-full"
            >
              <span className="flex-1 text-center">Thanh toán ngay</span>
              <img src={momologo} alt="Logo" className="w-9 h-auto ml-2" />
            </button>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-75 z-50 pt-20">
            <div className="bg-white p-10 rounded-lg text-center max-w-lg mx-auto shadow-lg">
              <img
                src={momo_modal}
                alt="MoMo"
                className="w-32 h-auto mx-auto mb-4"
              />
              <h2 className="text-2xl font-semibold text-blue-700 mb-4">
                Đang chuyển hướng tới trang thanh toán...
              </h2>
              <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyWallet;

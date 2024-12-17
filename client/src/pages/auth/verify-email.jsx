import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

const VerifyEmail = () => {
    const [message, setMessage] = useState("Verifying...");
    const location = useLocation();

    useEffect(() => {
        const verifyEmail = async () => {
            const params = new URLSearchParams(location.search);
            const token = params.get("token");

            if (!token) {
                setMessage("Invalid verification link");
                return;
            }

            try {
                const response = await axios.get(`${API_URL}/api/auth/verify-email?token=${token}`);
                setMessage(response.data.message || "Email verified successfully");
            } catch (error) {
                setMessage(error.response?.data?.message || "Verification failed");
            }
        };

        verifyEmail();
    }, [location]);

    return (
        <div className="flex min-h-screen w-screen items-center justify-center bg-gray-100">
            <div className="bg-white shadow-lg rounded-lg p-6 md:p-10 w-11/12 md:w-2/3 lg:w-1/2 text-center">
                <h1 className="text-2xl md:text-4xl font-bold text-gray-800">
                    {message.includes("Verifying") ? "Verifying Your Email" : message}
                </h1>
                {message.includes("Verifying") ? (
                    <p className="mt-4 text-gray-500">
                        Please wait while we verify your email address...
                    </p>
                ) : message.includes("successfully") ? (
                    <p className="mt-4 text-green-500">
                        Thank you for verifying your email. You can now use all features!
                    </p>
                ) : (
                    <p className="mt-4 text-red-500">
                        Something went wrong. Please try again later or contact support.
                    </p>
                )}
                <div className="mt-6">
                    <a
                        href="/"
                        className="inline-block bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
                    >
                        Go to Homepage
                    </a>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Card } from "react-bootstrap";

import { API_ENDPOINT } from "./Api";

function ForgotPass({ length = 6 }) {
    const [otp, setOtp] = useState(Array(length).fill("")); // State for OTP digits
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const email = location.state?.email;

    // Handle OTP input change
    const handleChange = (e, index) => {
        const { value } = e.target;

        if (/^\d*$/.test(value)) { // Allow only digits
            const newOtp = [...otp];
            newOtp[index] = value.slice(-1); // Keep only the last digit
            setOtp(newOtp);

            // Move focus to the next input
            const nextInput = e.target.nextSibling;
            if (nextInput && value) {
                nextInput.focus();
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const otpValue = otp.join(""); // Join OTP digits into a single string
        if (otpValue.length !== length) {
            alert("Please complete the OTP.");
            return;
        }

        try {
            const email = location.state?.email;
            if (!email) {
                throw new Error("Email not provided.");
            }

            const response = await axios.post(`${API_ENDPOINT}/otp/verify`, {
                email,
                otp: otpValue,
            });

            await Swal.fire({
                title: "OTP verified!",
                icon: "success",
            });

            sessionStorage.removeItem("token");
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred.");
        }
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh", // Full viewport height
                width: "100%", // Full viewport width
                padding: "20px",
                boxSizing: "border-box", // Avoid overflow due to padding
            }}
        >
            <Card style={{ width: "100%", maxWidth: "500px", height: "100%",maxHeight:"500px", display: "flex", flexDirection: "column" }}>
                <Card.Body style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <form
                        onSubmit={handleSubmit}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "16px",
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <p>A One Time Password Code was sent to your email:</p>
                        <p>{email}</p>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "center", width: "100%" }}>
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength="1"
                                    value={digit}
                                    onChange={(e) => handleChange(e, index)}
                                    style={{
                                        width: "40px",
                                        height: "60px",
                                        textAlign: "center",
                                        fontSize: "18px",
                                        border: "1px solid #ccc",
                                        borderRadius: "4px",
                                        flex: 1,
                                    }}
                                />
                            ))}
                        </div>
                        <button
                            type="submit"
                            style={{
                                padding: "12px 24px",
                                fontSize: "16px",
                                backgroundColor: "#007bff",
                                color: "#fff",
                                border: "none",
                                borderRadius: "4px",
                                width: "100%",
                                maxWidth: "200px",
                            }}
                        >
                            Verify
                        </button>
                    </form>
                    {error && <p style={{ color: "red", marginTop: "16px" }}>{error}</p>}
                </Card.Body>
            </Card>
        </div>
    );
}

export default ForgotPass;

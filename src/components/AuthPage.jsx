import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Murugan from "../assets/murugan.png"; // Import your image here

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [emailOrPhoneForOTP, setEmailOrPhoneForOTP] = useState("");
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsSignUp((prev) => !prev);
    setShowOTP(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    const payload = {
      ...data,
      action: isSignUp ? "signup" : "login",
    };

    try {
      const { data: response } = await axios.post(
        "https://nmsmatrimony.in/api/signup.php",
        payload
      );

      alert(response.message);

      if (response.status === "success") {
        if (isSignUp) {
          setEmailOrPhoneForOTP(data.email_or_phone); // Save for OTP verification
          setShowOTP(true);
        } else {
          localStorage.setItem("authToken", response.token);
          navigate("/dashboard");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: response } = await axios.post(
        "https://college.vividleo.com/SignupVerify_otp.php",
        {
          email_or_phone: emailOrPhoneForOTP,
          otp,
        }
      );

      alert(response.message);

      if (response.status === "success") {
        alert("OTP Verified! You can now log in.");
        setShowOTP(false);
        setIsSignUp(false); // Switch to login
      }
    } catch (err) {
      console.error(err);
      alert("OTP verification failed!");
    } finally {
      setLoading(false);
    }
  };

  const formFields = [
    ...(isSignUp ? [{ label: "Name", type: "text", name: "name", placeholder: "Your name" }] : []),
    {
      label: "Email or Phone",
      type: "text",
      name: "email_or_phone",
      placeholder: "you@example.com or 9876543210",
    },
    { label: "Password", type: "password", name: "password", placeholder: "Enter your password" },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">
      {/* Shared Image Section (top in mobile, left in desktop) */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-pink-100 p-6 md:p-8">
        <img
          src={Murugan}
          alt="NMS Admin"
          className="w-32 md:w-2/3 mb-2 md:mb-6 rounded-xl shadow-md"
        />
        <h1 className="text-xl md:text-4xl font-extrabold text-pink-600 tracking-wide text-center">
          Welcome to NMS Admin Panel
        </h1>
      </div>


      {/* Right Side - Auth Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-2xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800">
            {showOTP ? "Verify OTP" : isSignUp ? "Sign Up" : "Login"}
          </h2>

          {!showOTP ? (
            <form className="space-y-4" onSubmit={handleSubmit}>
              {formFields.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                  <input
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    className="w-full p-3 mt-1 border rounded-lg focus:ring-2 focus:ring-pink-400"
                    required
                  />
                </div>
              ))}

              <button
                type="submit"
                className="w-full py-3 mt-4 text-white bg-pink-500 rounded-lg hover:bg-pink-600 focus:ring-2 focus:ring-pink-400"
                disabled={loading}
              >
                {loading ? "Processing..." : isSignUp ? "Create Account" : "Login"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOTPSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP sent to your email or phone"
                  className="w-full p-3 mt-1 border rounded-lg focus:ring-2 focus:ring-pink-400"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 text-white bg-green-500 rounded-lg hover:bg-green-600 focus:ring-2 focus:ring-green-400"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          )}

          {!showOTP && (
            <p className="text-sm text-center text-gray-600">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
              <button onClick={toggleForm} className="ml-1 text-pink-500 hover:underline">
                {isSignUp ? "Login" : "Sign Up"}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );


};

export default AuthPage;

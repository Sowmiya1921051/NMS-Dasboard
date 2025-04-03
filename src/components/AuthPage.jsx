import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const toggleForm = () => setIsSignUp((prev) => !prev);

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
        "https://college.vividleo.com/signup.php",
        payload
      );

      alert(response.message);

      if (response.status === "success") {
        if (isSignUp) {
          setIsSignUp(false); // Switch to login after successful signup
        } else {
          localStorage.setItem("authToken", response.token); // Save token
          navigate("/dashboard"); // Redirect to dashboard
        }
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const formFields = [
    ...(isSignUp ? [{ label: "Name", type: "text", name: "name", placeholder: "Your name" }] : []),
    { label: "Email", type: "email", name: "email", placeholder: "you@example.com" },
    { label: "Password", type: "password", name: "password", placeholder: "Enter your password" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          {isSignUp ? "Sign Up" : "Login"}
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {formFields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700">{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                className="w-full p-3 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full py-3 mt-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
            disabled={loading}
          >
            {loading ? "Processing..." : isSignUp ? "Create Account" : "Login"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}
          <button onClick={toggleForm} className="ml-1 text-blue-500 hover:underline">
            {isSignUp ? "Login" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;

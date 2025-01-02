import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showEmailPopup, setShowEmailPopup] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await axios.post("http://localhost:5000/login", formData);
            if (response.status === 200) {
                localStorage.setItem("token", response.data.token);
                navigate("/");
            }
        } catch (error) {
            setError(error.response?.data?.message || "Invalid email or password.");
        }
    };

    const handleForgotPassword = async () => {
        setShowEmailPopup(true);
    };

    const handleResetSubmit = async () => {
        try {
            const response = await axios.post("http://localhost:5000/reset-password", { email: resetEmail });
            if (response.status === 200) {
                alert("Password reset email sent. Please check your inbox!");
                setShowEmailPopup(false);
                setResetEmail("");
            }
        } catch (error) {
            alert("Error sending reset email. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4" style={{ backgroundColor: '#C5C5C5' }}>
            <div className="max-w-md w-full space-y-8 p-10 rounded-2xl shadow-xl" style={{ backgroundColor: 'white' }}>
                <h2 className="text-3xl font-bold text-center" style={{ color: '#4D6A6D' }}>
                    Welcome Back
                </h2>
                
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300"
                            style={{ 
                                borderColor: '#829191',
                                focusRing: '#4D6A6D'
                            }}
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300"
                            style={{ 
                                borderColor: '#829191',
                                focusRing: '#4D6A6D'
                            }}
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <button
                        type="submit"
                        className="w-full py-3 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                        style={{ 
                            backgroundColor: '#4D6A6D',
                            color: 'white'
                        }}
                    >
                        Sign In
                    </button>

                    <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="w-full text-sm font-medium transition-colors duration-300"
                        style={{ color: '#4C5B61' }}
                    >
                        Forgot Password?
                    </button>
                </form>
            </div>

            {showEmailPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full">
                        <h3 className="text-2xl font-bold mb-4" style={{ color: '#4D6A6D' }}>
                            Reset Password
                        </h3>
                        <p className="mb-6" style={{ color: '#4C5B61' }}>
                            Enter your email address to receive a password reset link.
                        </p>
                        <input
                            type="email"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full px-4 py-3 rounded-xl border mb-6 focus:outline-none focus:ring-2 transition-all duration-300"
                            style={{ 
                                borderColor: '#829191',
                                focusRing: '#4D6A6D'
                            }}
                        />
                        <div className="flex gap-4">
                            <button
                                onClick={handleResetSubmit}
                                className="flex-1 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg"
                                style={{ 
                                    backgroundColor: '#4D6A6D',
                                    color: 'white'
                                }}
                            >
                                Send Reset Link
                            </button>
                            <button
                                onClick={() => setShowEmailPopup(false)}
                                className="flex-1 py-3 rounded-xl font-medium border transition-all duration-300"
                                style={{ 
                                    borderColor: '#829191',
                                    color: '#4C5B61'
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";

function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await axios.post('https://taskly-backend-3c7f.onrender.com/api/v1/signup', { name, email, password });

            toast.success('Registration successful! Redirecting to login...', {
                position: 'top-right',
                autoClose: 1500,
            });

            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-[#F7EBEC]">
            <ToastContainer />
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-[#E1E1E1] animate-fade-in">
                <h2 className="text-3xl font-extrabold text-[#59656F] mb-6 text-center">
                    Create Account
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label htmlFor="name" className="block text-[#59656F] font-semibold mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59656F] focus:outline-none"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-[#59656F] font-semibold mb-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59656F] focus:outline-none"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-[#59656F] font-semibold mb-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg pr-12 focus:ring-2 focus:ring-[#59656F] focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-3 flex items-center text-sm text-[#59656F] hover:text-black"
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 rounded-lg font-semibold text-white shadow-md transition-transform transform hover:scale-[1.02] ${
                            isLoading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-[#59656F] hover:bg-[#4b545c]'
                        }`}
                    >
                        {isLoading ? 'Registering...' : 'Sign Up'}
                    </button>

                    <p className="text-center text-sm text-[#59656F] mt-4">
                        Already have an account?{" "}
                        <Link to="/login" className="text-[#59656F] hover:underline font-medium">
                            Login here
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Signup;

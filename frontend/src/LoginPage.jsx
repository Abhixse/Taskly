import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:8000/api/v1/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem('token', data.data.accessToken);
        toast.success('Login successful! Redirecting...', {
          position: 'top-right',
          autoClose: 1500,
        });

        setTimeout(() => {
          navigate('/todos');
        }, 2000);
      } else {
        toast.error(data.message || 'Login failed', {
          position: 'top-right',
        });
      }
    } catch (error) {
      toast.error('An error occurred during login', {
        position: 'top-right',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-[#F7EBEC]">
      <ToastContainer />
      <div className="bg-white shadow-lg border border-[#e0e0e0] p-8 rounded-xl w-full max-w-md animate-fade-in transition-all">
        <h2 className="text-3xl font-extrabold text-[#59656F] mb-6 text-center">Welcome Back</h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[#59656F] font-semibold mb-1">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59656F] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[#59656F] font-semibold mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59656F] focus:outline-none pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-2 px-2 flex items-center text-sm text-gray-600 hover:text-[#59656F]"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg font-semibold text-white shadow-md transition-transform transform hover:scale-[1.02] ${
              isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#59656F] hover:bg-[#49525b]'
            }`}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          <p className="text-center text-sm text-[#59656F] mt-4">
            Don’t have an account?{' '}
            <Link to="/signup" className="text-[#59656F] underline hover:text-black font-medium">
              Sign up here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function TodoCreatePage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }

    try {
      await axios.post(
        'https://taskly-backend-3c7f.onrender.com/api/v1/todo/create',
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      toast.success('Todo created successfully!');
      navigate('/todos');
    } catch (error) {
 
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        toast.error(error.response?.data?.message || 'Failed to create todo');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7EBEC] flex justify-center items-center px-4 py-12">
      <div className="bg-white shadow-md border border-[#e0e0e0] p-8 rounded-xl w-full max-w-lg animate-fade-in">
        <h2 className="text-2xl font-bold text-[#59656F] mb-6 text-center">Create a New Todo</h2>

        <form onSubmit={handleCreate} className="space-y-5">
          <div>
            <label htmlFor="title" className="block font-semibold text-[#59656F] mb-1">
              Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter todo title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59656F] focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="description" className="block font-semibold text-[#59656F] mb-1">
              Description
            </label>
            <textarea
              id="description"
              rows="4"
              placeholder="Enter todo description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59656F] focus:outline-none"
            />
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="submit"
              disabled={isLoading || !title.trim() || !description.trim()}
              className={`flex-1 py-2 text-white font-semibold rounded-lg shadow-md transition ${
                isLoading || !title.trim() || !description.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#59656F] hover:bg-[#49525b]'
              }`}
            >
              {isLoading ? 'Creating...' : 'Create Todo'}
            </button>

            <Link
              to="/todos"
              className="flex-1 text-center py-2 border border-[#59656F] rounded-lg font-medium text-[#59656F] hover:bg-[#F7EBEC] transition"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TodoCreatePage;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function TodoEditPage() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          toast.error('Please login first');
          navigate('/login');
          return;
        }

        const { data } = await axios.get(`https://taskly-backend-3c7f.onrender.com/api/v1/todo/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        if (data.data) {
          setTitle(data.data.title || '');
          setDescription(data.data.description || '');
        } else {
          setTitle(data.title || '');
          setDescription(data.description || '');
        }
      } catch (err) {

        if (err.response?.status === 401) {
          toast.error('Session expired. Please login again.');
          localStorage.removeItem('token');
          navigate('/login');
        } else if (err.response?.status === 404) {
          toast.error('Todo not found');
          navigate('/todos');
        } else {
          toast.error('Failed to load todo');
          navigate('/todos');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTodo();
  }, [id, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login first');
        navigate('/login');
        return;
      }

      await axios.put(
        `https://taskly-backend-3c7f.onrender.com/api/v1/todo/${id}`,
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      toast.success('Todo updated successfully!');
      navigate('/todos');
    } catch (err) {

      if (err.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        toast.error(
          err.response?.data?.message ||
          err.response?.data?.errors?.[0] ||
          err.response?.data?.error ||
          'Update failed. Please try again.'
        );
      }
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) return <div className="text-center mt-10 text-[#59656F]">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#F7EBEC] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-md border border-gray-200 animate-fade-in">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#59656F]">Edit Todo</h2>

        <form onSubmit={handleUpdate} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold mb-1 text-[#59656F]">Title</label>
            <input
              type="text"
              placeholder="Update title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59656F] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 text-[#59656F]">Description</label>
            <textarea
              placeholder="Update description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59656F] focus:outline-none"
              required
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={isUpdating || !title.trim() || !description.trim()}
              className={`flex-1 py-2 rounded-lg text-white font-semibold shadow-md transition-colors ${
                isUpdating || !title.trim() || !description.trim()
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#59656F] hover:bg-[#49525b]'
              }`}
            >
              {isUpdating ? 'Updating...' : 'Update Todo'}
            </button>

            <Link
              to="/todos"
              className="flex-1 py-2 text-center border border-[#59656F] text-[#59656F] rounded-lg hover:bg-[#F7EBEC] transition"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TodoEditPage;

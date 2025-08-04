import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function TodoListPage() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTodos = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login first');
      return navigate('/login');
    }

    try {
      const { data } = await axios.get('https://taskly-backend-3c7f.onrender.com/api/v1/todo', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (data?.statusCode === 200 && Array.isArray(data.message)) {
        // Sort by nearest `lastDate`
        const sortedTodos = [...data.message].sort((a, b) => new Date(a.lastDate) - new Date(b.lastDate));
        setTodos(sortedTodos);
      } else {
        toast.error('Unexpected response format');
        setTodos([]);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        toast.error('Failed to load todos');
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login first');
      return navigate('/login');
    }

    try {
      await axios.delete(`https://taskly-backend-3c7f.onrender.com/api/v1/todo/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      toast.success('Todo deleted successfully');
      setTodos(prev => prev.filter(todo => todo._id !== id));
    } catch (err) {
    
      if (err.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        toast.error('Failed to delete todo');
      }
    }
  };

  const toggleTodoCompletion = async (id, currentStatus) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login first');
      return navigate('/login');
    }

    try {
      const currentTodo = todos.find(todo => todo._id === id);

      await axios.put(
        `https://taskly-backend-3c7f.onrender.com/api/v1/todo/${id}`,
        {
          title: currentTodo.title,
          description: currentTodo.description,
          completed: !currentStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      setTodos(prev =>
        prev.map(todo =>
          todo._id === id ? { ...todo, completed: !currentStatus } : todo
        )
      );

      toast.success(!currentStatus ? 'Todo marked as completed!' : 'Todo marked as pending!');
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        toast.error('Failed to update todo status');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="min-h-screen bg-[#F7EBEC] py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8 border border-[#E4E4E4] animate-fade-in transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#59656F]">Your Todos</h1>
          <div className="flex space-x-3">
            <Link
              to="/todos/create"
              className="bg-[#59656F] text-white px-4 py-2 rounded-md hover:bg-[#475158] transition"
            >
              + New Todo
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-[#59656F]">Loading your tasks...</div>
        ) : todos.length === 0 ? (
          <div className="text-center text-gray-500">You have no todos yet. 🎯</div>
        ) : (
          <ul className="space-y-4">
            {todos.map(todo => (
              <li
                key={todo._id}
                className={`flex justify-between items-start border rounded-lg p-4 shadow-sm transition hover:shadow-md ${
                  todo.completed ? 'bg-green-50 border-green-200' : 'bg-[#fff] border-gray-200'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-1">
                    <h3
                      className={`text-lg font-semibold ${
                        todo.completed ? 'text-green-700 line-through' : 'text-[#59656F]'
                      }`}
                    >
                      {todo.title}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        todo.completed
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {todo.completed ? '✅ Completed' : '⏳ Pending'}
                    </span>
                  </div>
                  <p
                    className={`text-sm ${
                      todo.completed ? 'text-green-600 line-through' : 'text-gray-700'
                    }`}
                  >
                    {todo.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Created by: {todo.user?.name} ({todo.user?.email})
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Due: {new Date(todo.lastDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex flex-col space-y-2 ml-4 text-sm">
                  <button
                    onClick={() => toggleTodoCompletion(todo._id, todo.completed)}
                    className={`px-3 py-1 rounded-md font-medium transition ${
                      todo.completed
                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {todo.completed ? 'Mark Pending' : 'Mark Done'}
                  </button>
                  <Link
                    to={`/todos/edit/${todo._id}`}
                    className="text-[#59656F] hover:underline text-center"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteTodo(todo._id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default TodoListPage;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Signup from './SignupPage.jsx';
import Login from './LoginPage.jsx';
import TodoListPage from './ToastListPage.jsx';
import TodoCreatePage from './TodoCreatePage.jsx';
import TodoEditPage from './TodoEditPage.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />


        <Route path="/todos" element={<TodoListPage />} />
        <Route path="/todos/create" element={<TodoCreatePage />} />
        <Route path="/todos/edit/:id" element={<TodoEditPage />} />
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  );
}

export default App;

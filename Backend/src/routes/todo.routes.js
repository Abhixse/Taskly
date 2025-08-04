import express from 'express';
import { getTodos, createTodo, updateTodo, deleteTodo, singleTodo } from '../controllers/todo.controllers.js';
import auth from '../middleware/auth.middleware.js';

const todoRoute = express.Router();

// Specific routes should come before parameterized routes
todoRoute.route('/').get(auth, getTodos);
todoRoute.route('/create').post(auth, createTodo);
todoRoute.route('/:id').get(auth, singleTodo);
todoRoute.route('/:id').put(auth, updateTodo);
todoRoute.route('/:id').delete(auth, deleteTodo);

export default todoRoute;
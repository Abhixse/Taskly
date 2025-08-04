import { Todo } from "../models/Todo.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";




const getTodos = asyncHandler(async (req, res) => {
    try {
        const todos = await Todo.find({ user: req.user._id }).populate('user', 'name email');
        res.status(200).json(new ApiResponse(200, 'Todos fetched successfully', todos));
    } catch (error) {
        res.status(500).json(new ApiError(500, 'Internal Server Error'));
    }
});

const createTodo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).json({
            statusCode: 400,
            errors: ["Title and description are required"],
        });
    }

    const newTodo = await Todo.create({
        title,
        description,
        user: req.user._id,
        lastDate: new Date(),
    });

    res.status(201).json(
        new ApiResponse(201, "Todo created successfully", newTodo)
    );
});

const updateTodo = asyncHandler(async (req, res) => {
  

    const { id } = req.params;
    const { title, description, completed } = req.body;


    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            statusCode: 400,
            errors: ["Invalid Todo ID"],
        });
    }
    // Check if the todo exists
    const todo = await Todo.findOne({ _id: id, user: req.user._id });
    if (!todo) {
        return res.status(404).json({
            statusCode: 404,
            errors: ["Todo not found or not authorized"],
        });
    }

    // Validate input
    if (!title || !description) {
        return res.status(400).json({
            statusCode: 400,
            errors: ["Title and description are required"],
        });
    }


    // Prepare update data
    const updateData = {
        title,
        description,
        updatedAt: new Date(),
    };

    // Only include completed if it's provided in the request
    if (completed !== undefined) {
        updateData.completed = completed;
    }

    // Update todo (only if it belongs to the user)
    const updatedTodo = await Todo.findOneAndUpdate(
        { _id: id, user: req.user._id },
        updateData,
        {
            new: true,
            runValidators: true,
        }
    );

    if (!updatedTodo) {
        return res.status(404).json({
            statusCode: 404,
            errors: ["Todo not found or not authorized"],
        });
    }

    // Return updated fields
    res.status(200).json({
        title: updatedTodo.title,
        description: updatedTodo.description,
        completed: updatedTodo.completed,
        message: "Todo updated successfully"
    });
});

const deleteTodo = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const deletedTodo = await Todo.findOneAndDelete({ _id: id, user: req.user._id });

    if (!deletedTodo) {
        return res.status(404).json({
            statusCode: 404,
            errors: ["Todo not found or not authorized"],
        });
    }

    res.status(200).json(new ApiResponse(200, 'Todo deleted successfully'));
});



const singleTodo = asyncHandler(async (req, res) => {
    const { id } = req.params;
    // Assuming you have a Todo model to fetch the todo item
    const todo = await Todo.findOne({ _id: id, user: req.user._id });
    if (!todo) {
        throw new ApiError(404, "Todo not found");
    }
    res.status(200).json(new ApiResponse(200, 'Todo fetched successfully', todo));
});


export { getTodos, createTodo, updateTodo, deleteTodo, singleTodo };
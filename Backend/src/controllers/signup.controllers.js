import { User } from "../models/User.models.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const signup = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw new ApiError(400, "Name, email, and password are required");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(400, "User already exists");
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    const { password: _, refreshToken: __, ...userData } = newUser.toObject();

    res.status(201).json(
        new ApiResponse(201, true, "User created successfully", userData)
    );
});

export default signup;

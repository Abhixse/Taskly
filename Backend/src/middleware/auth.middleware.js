import jwt from "jsonwebtoken";
import { User } from "../models/User.models.js";
import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const auth = asyncHandler(async (req, _, next) => {
  

    let token = req.cookies?.accessToken;

    if (!token && req.header("Authorization")) {
        token = req.header("Authorization").replace("Bearer", "").trim();
    }


    if (!token) {
        throw new ApiError(401, "Unauthorized request. Token missing.");
    }

    let decodedToken;
    try {
        decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
        console.error("JWT error:", err);
        throw new ApiError(401, "Invalid or expired access token.");
    }

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

    if (!user) {
        throw new ApiError(401, "User not found or token invalid.");
    }

    req.user = user;
    next();
});


export default auth;
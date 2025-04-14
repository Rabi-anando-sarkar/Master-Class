import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from 'jsonwebtoken'

export const authentication = asyncHandler(async (req,_,next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if(!token) {
            throw new ApiError(
                401,
                "Unauthroised request"
            )
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id)

        if(!user) {
            throw new ApiError(
                401,
                "Invalid access token"
            )
        }

        req.user = user
        next()
    } catch (error) {
        throw new ApiError(
            401,
            error?.message || "Inavlid access token"
        )
    }
})
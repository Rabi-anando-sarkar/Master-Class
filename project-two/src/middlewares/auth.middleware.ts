import { NextFunction } from "express";
import { User } from "../models/user.models";
import { AuthenticatedRequest } from "../types/express/index";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/AsyncHandler";
import jwt from 'jsonwebtoken'
import { HttpStatusCode, ErrorType } from '../types/enums'


interface AccessTokenPayload {
    _id: string;
    email: string;
    username: string;
}

export const authentication = asyncHandler(async (req: AuthenticatedRequest,_: Response,next: NextFunction) => {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if(!token) {
            throw new ApiError(
                HttpStatusCode.UNAUTHORIZED,
                "No Token Received",
                ErrorType.AUTHENTICATION_ERROR
            )
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as AccessTokenPayload

        const user = await User.findById(decodedToken?._id)

        if(!user) {
            throw new ApiError(
                HttpStatusCode.UNAUTHORIZED,
                "Invalid Acces token",
                ErrorType.AUTHENTICATION_ERROR
            )
        }

        req.user = user
        next()
})
import { asyncHandler } from "../utils/AsyncHandler"
import { ApiResponse } from "../utils/ApiResponse"
import { ApiError } from "../utils/ApiError"
import { User } from "../models/user.models"
import { Types } from "mongoose"
import { HttpStatusCode, ErrorType } from '../types/enums'
import { Request, Response } from "express"
import { IUser } from "../types/user.types"
import { AuthenticatedRequest } from "../types/express"

const generateAccessAndRefreshToken = async(userId: Types.ObjectId): Promise<TokenResponse> => {
    try {
        const user = await User.findById(userId)

        if(!user) {
            throw new ApiError(
                HttpStatusCode.NOT_FOUND,
                "User not Found",
                ErrorType.NOT_FOUND
            )
        }

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({
            validateBeforeSave: false
        })

        return {
            accessToken,
            refreshToken
        }

    } catch (error) {
        throw new ApiError(
            HttpStatusCode.INTERNAL_SERVER_ERROR,
            "Error Creating Tokens",
            ErrorType.INTERNAL_SERVER_ERROR
        )
    }
}

const registerUser = asyncHandler(async (req: Request<{},{}, IRegister>,res: Response): Promise<Response> => {
    const {
        username,
        email,
        password
    } = req.body 

    if(
        [username,email,password].some((field) => (field?.trim() === ''))
    ) {
        throw new ApiError(
            HttpStatusCode.BAD_REQUEST,
            "All fields are required",
            ErrorType.VALIDATION_ERROR
        )
    }

    const existedUser = await User.findOne({
        $or: [{username},{email}]
    })

    if(existedUser) {
        throw new ApiError(
            HttpStatusCode.BAD_REQUEST,
            "Already exists with this username or password",
            ErrorType.VALIDATION_ERROR
        )
    }

    const user: IUser = await User.create({
        username : username.toLowerCase(),
        email,
        password
    })

    if(!user) {
        throw new ApiError(
            HttpStatusCode.INTERNAL_SERVER_ERROR,
            "User not created",
            ErrorType.DATABASE_ERROR
        )
    }

    const creadtedUser = await User.findById(user._id).select("-password")

    if(!creadtedUser) {
        throw new ApiError(
            HttpStatusCode.INTERNAL_SERVER_ERROR,
            "Created user not available",
            ErrorType.NOT_FOUND
        )
    }

    return res
            .status(201)
            .json(new ApiResponse(
                201,
                creadtedUser,
                "User Registered"
            ))
})

const signInUser = asyncHandler(async (req: Request<{}, {}, ISignIn>,res: Response): Promise<Response> => {
    const {
        username,
        email,
        password
    } = req.body

    if(
        [username,email,password].some((field) => (field?.trim() === ''))
    ) {
        throw new ApiError(
            HttpStatusCode.BAD_REQUEST,
            "All fields are required",
            ErrorType.VALIDATION_ERROR
        )
    }

    const user = await User.findOne({
        $or: [{username},{email}]
    }).select("+password")

    if(!user) {
        throw new ApiError(
            HttpStatusCode.NOT_FOUND,
            "All fields are required",
            ErrorType.NOT_FOUND
        )
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid) {
        throw new ApiError(
            HttpStatusCode.BAD_REQUEST,
            "All fields are required",
            ErrorType.VALIDATION_ERROR
        )
    }

    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id)

    const options = {
        httpOnly: true,
        secure: true
    }

    return res  
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        user: loggedInUser, accessToken, refreshToken
                    },
                    "User Signed in succesfully"
                )
            )
})

const signOutUser = asyncHandler(async (req:AuthenticatedRequest,res: Response): Promise<Response> => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )
    
    const options = {
        httpOnly: true,
        secure:true
    }

    return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(
                new ApiResponse(
                    200,
                    {},
                    "User signed out"
                )
            )
})

export {
    registerUser,
    signInUser,
    signOutUser
}
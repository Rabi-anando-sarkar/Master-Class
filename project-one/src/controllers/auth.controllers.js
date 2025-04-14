import { asyncHandler } from "../utils/AsyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.models.js"

const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId)
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
            500,
            'SOMETHING WENT WRONG GENERATING ACCESS AND REFRESH TOKEN'
        )
    }
}

const registerUser = asyncHandler(async (req,res) => {
    const {
        username,
        email,
        password
    } = req.body

    if(
        [username,email,password].some((field) => (field?.trim() === ''))
    ) {
        throw new ApiError(
            400,
            'All feilds are required'
        )
    }

    const existedUser = await User.findOne({
        $or: [{username},{email}]
    })

    if(existedUser) {
        throw new ApiError(
            400,
            'User with this email or username already exists'
        )
    }

    const user = await User.create({
        username : username.toLowerCase(),
        email,
        password
    })

    if(!user) {
        throw new ApiError(
            500,
            "User not created"
        )
    }

    const creadtedUser = await User.findById(user._id)

    if(!creadtedUser) {
        throw new ApiError(
            500,
            "created user not available"
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

const signInUser = asyncHandler(async (req,res) => {
    const {
        username,
        email,
        password
    } = req.body

    if(
        [username,email,password].some((field) => (field?.trim() === ''))
    ) {
        throw new ApiError(
            400,
            'All feilds are required'
        )
    }

    const user = await User.findOne({
        $or: [{username},{email}]
    }).select("+password")

    if(!user) {
        throw new ApiError(
            404,
            "User does not exist"
        )
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid) {
        throw new ApiError(
            401,
            'Password is not valid'
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
                    "User Signed in succesfuly"
                )
            )
})

const signOutUser = asyncHandler(async (req,res) => {
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
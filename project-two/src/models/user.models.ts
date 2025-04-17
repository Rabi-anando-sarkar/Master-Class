import mongoose from "mongoose";
import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { IUser, IUserMethods, UserModelType } from "../types/user.types";

const userSchema = new mongoose.Schema<IUser, UserModelType, IUserMethods>({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: [true,"Password is Required"],
        select: false
    },
    refreshToken: {
        type: String,
        select: false,
    }
    }, {
        timestamps: true
    }
)

userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
    
    const secret = process.env.ACCESS_TOKEN_SECRET!
    const expiry = process.env.ACCESS_TOKEN_EXPIRY!

    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
        },
        secret,
        {
            expiresIn: expiry as SignOptions["expiresIn"]
        }
    )
}

userSchema.methods.generateRefreshToken = function() {
    
    const secret = process.env.REFRESH_TOKEN_SECRET!
    const expiry = process.env.REFRESH_TOKEN_EXPIRY!
    
    return jwt.sign(
        {
            _id: this._id,
        },
        secret,
        {
            expiresIn: expiry as SignOptions["expiresIn"]
        }
    )
}

export const User = mongoose.model<IUser, UserModelType>("User", userSchema)
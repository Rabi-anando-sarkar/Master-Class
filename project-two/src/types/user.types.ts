import { Model, Types } from "mongoose";

interface IUser {
    _id?: Types.ObjectId;
    username: string;
    email: string;
    password: string;
    refreshToken?: string;
}

interface IUserMethods {
    isPasswordCorrect(password: string): Promise<boolean>;
    generateAccessToken(): string;
    generateRefreshToken(): string;
}

type UserModelType = Model<IUser, {}, IUserMethods>

export {
    IUser,
    IUserMethods,
    UserModelType
}
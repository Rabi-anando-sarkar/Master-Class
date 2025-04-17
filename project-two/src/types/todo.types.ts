import mongoose, { Types } from "mongoose";
import { Status } from "./enums";

export interface ITodo {
    _id?: Types.ObjectId;
    title: string;
    description: string;
    status?: Status;
    userId: mongoose.Types.ObjectId;
}
import mongoose, { Model } from "mongoose";
import { ITodo } from "../types/todo.types";

const todoSchema = new mongoose.Schema<ITodo>({
    title: {
        type: String,
        required: [true, "Task is required"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true,
    },
    status: {
        type: String,
        enum: ["pending", "in-progress", "completed"],
        default: "pending",
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    }
    }, {
        timestamps: true
    }
)

export const Todo: Model<ITodo> = mongoose.model("Todo",todoSchema)
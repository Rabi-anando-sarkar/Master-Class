import { asyncHandler } from "../utils/AsyncHandler"
import { ApiResponse } from "../utils/ApiResponse"
import { ApiError, ErrorType, HttpStatusCode } from "../utils/ApiError"
import { Todo } from "../models/todo.models"
import { Response } from "express"
import { ITodo } from "src/types/todo.types"
import { AuthenticatedRequest } from "src/types/express/index"

const createTodo = asyncHandler( async(req: AuthenticatedRequest<ICreate>,res: Response) : Promise<Response> => {
    const {
        title,
        description,
        status
    } = req.body

    if(
        [title,description].some((field) => (field?.trim() === ''))
    ) {
        throw new ApiError(
            HttpStatusCode.BAD_REQUEST,
            "All fields are required",
            ErrorType.VALIDATION_ERROR
        )
    }

    const allowedStatuses = ["pending", "in-progress", "completed"];
    
    if(status && !allowedStatuses.includes(status.trim().toLowerCase())) {
        throw new ApiError(
            HttpStatusCode.BAD_REQUEST,
            "Invalid Status",
            ErrorType.VALIDATION_ERROR
        )
    } 

    if (!req.user) {
        throw new ApiError(
            HttpStatusCode.UNAUTHORIZED,
            "User not authenticated"
        );
    }

    const todoCreated: ITodo = await Todo.create({
        title : title.trim(),
        description : description.trim(),
        userId: req.user._id,
        ...(status && { status: status.trim() })
    })

    if(!todoCreated) {
        throw new ApiError(
            HttpStatusCode.INTERNAL_SERVER_ERROR,
            "Invalid Status",
            ErrorType.INTERNAL_SERVER_ERROR
        )
    }

    return res
        .status(201)
        .json(
            new ApiResponse (
                201,
                todoCreated,
                "Todo Created Successfully"
            )
        )
})

const readTodo = asyncHandler( async(req: AuthenticatedRequest<{},{},IRead>,res:Response): Promise<Response> => {

    const { status, page="1", limit="10" } = req.query

    const query: { status?: string } = {}

    if(status) {
        query.status = status.trim().toLowerCase()
    }
    
    const todos = await Todo.find(query)
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))

    const totalCount =  await Todo.countDocuments(query)

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    todos,
                    totalCount,
                    currentPage: Number(page),
                    totalPages: Math.ceil(totalCount/Number(limit)) 
                },
                todos.length === 0 ? "No Todos Found" : "Todos Fetched"
            )
        )
})

const updateTodo = asyncHandler( async(req: AuthenticatedRequest<IUpdate, {id: string}>,res: Response): Promise<Response> => {
    const { status } = req.body

    if(!status || !['pending','in-progress','completed'].includes(status)) {
        throw new ApiError(
            HttpStatusCode.BAD_REQUEST,
            "Correct input required",
            ErrorType.VALIDATION_ERROR
        )
    }

    const updatingTodo = await Todo.findByIdAndUpdate(
        req.params.id,
        {status},
        {new: true}
    )

    if(!updatingTodo) {
        throw new ApiError(
            HttpStatusCode.BAD_REQUEST,
            "Error updating todo",
            ErrorType.INTERNAL_SERVER_ERROR
        )
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    updatedTodo: updatingTodo
                },
                "Todo Updated"
            )
        )
})

const deleteTodo = asyncHandler( async(req: AuthenticatedRequest<{}, {id: string}>,res: Response): Promise<Response> => {
    const deletingTodo = await Todo.findByIdAndDelete(req.params.id)

    if(!deletingTodo) {
        throw new ApiError(
            400,
            "Error Deleting Todo"
        )
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                null,
                'Todo Deleted Succesfully'
            )
        )
})

export {
    createTodo,
    readTodo,
    updateTodo,
    deleteTodo
}
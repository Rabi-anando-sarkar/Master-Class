import { asyncHandler } from "../utils/AsyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiError } from "../utils/ApiError.js"
import { Todo } from "../models/todo.models.js"

const createTodo = asyncHandler( async(req,res) => {
    const {
        title,
        description,
        status
    } = req.body

    if(
        [title,description].some((field) => (field?.trim() === ''))
    ) {
        throw new ApiError(
            400,
            'All fields are required'
        )
    }

    const allowedStatuses = ["pending", "in-progress", "completed"];
    
    if(status && !allowedStatuses.includes(status.trim().toLowerCase())) {
        throw new ApiError(
            400,
            "Invalid status. Choose pending, in-progress, or completed."
        )
    } 

    const todoCreated = await Todo.create({
        title : title.trim(),
        description : description.trim(),
        ...(status && { status: status.trim() })
    })

    if(!todoCreated) {
        throw new ApiError(
            400,
            "Error creating the todo"
        )
    }

    return res
        .status(201)
        .json(
            new ApiResponse (
                201,
                "Todo Created Successfully"
            )
        )
})

const readTodo = asyncHandler( async(req,res) => {

    const { status, page=1, limit=10 } = req.query

    const query = {}

    if(status) {
        query.status = status.trim().toLowerCase()
    }

    const todos = await Todo.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
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
                    totalPages: Math.ceil(totalCount/limit) 
                },
                todos.length === 0 ? "No Todos Found" : "Todos Fetched"
            )
        )
})

const updateTodo = asyncHandler( async(req,res) => {
    const { status } = req.body

    if(!['pending','in-progress','completed'].includes(status)) {
        throw new ApiError(
            400,
            "Invalid status"
        )
    }

    const updatingTodo = await Todo.findByIdAndUpdate(
        req.params.id,
        {status},
        {new: true}
    )

    if(!updatingTodo) {
        throw new ApiError(
            400,
            "Error Updating the todo"
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

const deleteTodo = asyncHandler( async(req,res) => {
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
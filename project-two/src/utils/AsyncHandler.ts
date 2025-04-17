import { NextFunction, Request, Response } from "express"

export const asyncHandler = (requestHandlerFunction: Function) => async (req: Request,res: Response,next: NextFunction) => {
    try {
        await requestHandlerFunction(req,res,next)
    } catch (error: any) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "internal server error"
        })
    }
}
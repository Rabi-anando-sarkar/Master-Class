import { Router } from "express"
import { createTodo, deleteTodo, readTodo, updateTodo } from "../controllers/todo.controllers"
import { authentication } from '../middlewares/auth.middleware'

export const todoRouter = Router()

todoRouter.route('/todos').post(authentication,createTodo)
todoRouter.route('/todos').get(authentication,readTodo)
todoRouter.route('/todos/:id').put(authentication,updateTodo)
todoRouter.route('/todos/:id').delete(authentication,deleteTodo)
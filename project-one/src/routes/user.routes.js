import { Router } from 'express'
import { registerUser, signInUser, signOutUser } from '../controllers/auth.controllers.js'
import { authentication } from '../middlewares/auth.middleware.js'

export const userRouter = Router()

userRouter.route("/register").post(registerUser)
userRouter.route("/signIn").post(signInUser)
userRouter.route("/signOut").post(authentication,signOutUser)
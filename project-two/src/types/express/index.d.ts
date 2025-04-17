import { HydratedDocument } from "mongoose";
import { IUser } from "../user.types";
import { Request } from "express";

export interface AuthenticatedRequest<B ={}, P={}, Q={}> extends Request<P,{}, B,Q> {
    user: HydratedDocument<IUser>
}
import express from 'express';
import { addUser, deleteUser, editUser, getAllUsers, getSingleUser } from '../controllers/user.controller.js';


const userRouter = express.Router()

userRouter.get('/', getAllUsers)
userRouter.get('/:id',getSingleUser)
userRouter.post('/', addUser)
userRouter.put ('/:id', editUser)
userRouter.delete ('/:id', deleteUser)


export default userRouter
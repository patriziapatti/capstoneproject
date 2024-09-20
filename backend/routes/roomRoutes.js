import express from 'express';
import { addRoom, deleteRoom, editRoom, getAllRooms, getSingleRoom } from '../controllers/room.controller.js';



const roomRouter = express.Router()

roomRouter.get('/', getAllRooms)
roomRouter.get('/:id',getSingleRoom)
roomRouter.post('/', addRoom)
roomRouter.put ('/:id', editRoom)
roomRouter.delete ('/:id', deleteRoom)


export default roomRouter
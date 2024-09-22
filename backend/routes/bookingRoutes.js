import express from 'express';
import { addBooking, deleteBooking, editBooking, getAllBookings, getSingleBooking, getTodaysArrivals } from '../controllers/booking.controller.js';


const bookingRouter = express.Router()

bookingRouter.get('/todayarr', getTodaysArrivals)
bookingRouter.get('/', getAllBookings)
bookingRouter.get('/:id',getSingleBooking)
bookingRouter.post('/', addBooking)
bookingRouter.put ('/:id', editBooking)
bookingRouter.delete ('/:id', deleteBooking)



export default bookingRouter
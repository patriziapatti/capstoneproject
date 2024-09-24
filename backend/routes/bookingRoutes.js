import express from 'express';
import { addBooking, deleteBooking, editBooking, getAllBookings, getBookingsForPlanning, getSingleBooking, getTodaysArrivals, getTodaysDeparture, getTodaysInHouse } from '../controllers/booking.controller.js';


const bookingRouter = express.Router()

bookingRouter.get('/todayarr', getTodaysArrivals)
bookingRouter.get('/todaydep', getTodaysDeparture)
bookingRouter.get('/inhouse', getTodaysInHouse)
bookingRouter.get('/booking-planning', getBookingsForPlanning)
bookingRouter.get('/', getAllBookings)
bookingRouter.get('/:id',getSingleBooking)
bookingRouter.post('/', addBooking)
bookingRouter.put ('/:id', editBooking)
bookingRouter.delete ('/:id', deleteBooking)



export default bookingRouter
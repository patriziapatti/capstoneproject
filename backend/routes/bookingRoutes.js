import express from 'express';
import { addBooking, deleteBooking, editBooking, getAllBookings, getBookingsForPlanning, getOldBookings, getSingleBooking, getTodaysArrivals, getTodaysDeparture, getTodaysInHouse, updatedBookingStatus } from '../controllers/booking.controller.js';


const bookingRouter = express.Router()

bookingRouter.get('/todayarr', getTodaysArrivals)
bookingRouter.get('/todaydep', getTodaysDeparture)
bookingRouter.get('/inhouse', getTodaysInHouse)
bookingRouter.get('/booking-planning', getBookingsForPlanning)
bookingRouter.get('/oldbookings', getOldBookings)
bookingRouter.get('/', getAllBookings)
bookingRouter.get('/:id',getSingleBooking)
bookingRouter.post('/', addBooking)
bookingRouter.put ('/:id', editBooking)
bookingRouter.delete ('/:id', deleteBooking)
bookingRouter.patch ('/:id/status', updatedBookingStatus)




export default bookingRouter
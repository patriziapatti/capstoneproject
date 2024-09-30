import express from 'express';
import { addCustomer, deleteCustomer, editCustomer, getAllCustomer, getSingleCustomer, searchCustomer } from '../controllers/customer.controller.js';


const customerRouter = express.Router()

customerRouter.get('/search',searchCustomer)
customerRouter.get('/', getAllCustomer)
customerRouter.get('/:id',getSingleCustomer)
customerRouter.post('/', addCustomer)
customerRouter.put ('/:id', editCustomer)
customerRouter.delete ('/:id', deleteCustomer)


export default customerRouter
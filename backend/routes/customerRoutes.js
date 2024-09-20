import express from 'express';
import { addCustomer, deleteCustomer, editCustomer, getAllCustomer, getSingleCustomer } from '../controllers/customer.controller.js';


const customerRouter = express.Router()

customerRouter.get('/', getAllCustomer)
customerRouter.get('/:id',getSingleCustomer)
customerRouter.post('/', addCustomer)
customerRouter.put ('/:id', editCustomer)
customerRouter.delete ('/:id', deleteCustomer)


export default customerRouter
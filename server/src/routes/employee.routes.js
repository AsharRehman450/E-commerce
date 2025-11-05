import express from 'express';
import { createEmployee, deleteEmployee, getEmployee, getEmployeeByID, getEmployeeSchedules, updateEmployee } from '../controllers/emplyee.controller.js';



const employeeRoutes = express.Router();

//employee routes
employeeRoutes.post('/employee', createEmployee);
employeeRoutes.get('/employees', getEmployee);
employeeRoutes.put('/employee/:id', updateEmployee);
employeeRoutes.delete('/employee/:id', deleteEmployee);
employeeRoutes.get('/employee/:id', getEmployeeByID );
employeeRoutes.get('/employee/schedules/:id', getEmployeeSchedules)


//attendance routes


export default employeeRoutes;
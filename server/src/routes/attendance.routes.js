import { getAttendance, markAttendance } from "../controllers/attendance.controller.js";
import express from 'express'

const attendanceRoutes = express.Router();

attendanceRoutes.post('/attendance/:id', markAttendance);
attendanceRoutes.get('/attendance/:id', getAttendance);

export default attendanceRoutes;
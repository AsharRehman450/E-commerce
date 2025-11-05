

import express from 'express';
import { createSchedule, deleteSchedule, getAllSchedules, getScheduleById, updateSchedule, updateStatus } from '../controllers/schedule.controller.js';

const scheduleRouter = express.Router();

scheduleRouter.post('/schedule', createSchedule);
scheduleRouter.get('/schedules', getAllSchedules);
scheduleRouter.get('/schedule/:id', getScheduleById);
scheduleRouter.put('/schedule/:id', updateSchedule);
scheduleRouter.delete('/schedule/:id', deleteSchedule);
scheduleRouter.put('/schedule-status/:id', updateStatus);


export default scheduleRouter;
import { Employee } from "../models/employee.model.js";
import { Schedule } from "../models/schedule.js"


// export const createSchedule = async (req, res)=> {
//     try {

//         const schedule = new Schedule(req.body)
//         await schedule.save()

//         return res.status(201).json({
//             message: "Schedule created successfully",
//             schedule
//         })

//     } catch (error) {
//         return res.status(500).json({
//             message: "An error occurred while creating a schedule",
//             details: error.message
//         })
//     }
// }


export const createSchedule = async (req, res) => {
    try {

        const schedule = new Schedule(req.body);


        await schedule.save();

        const employee = await Employee.findById(req.body.employee);

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found",
            });
        }

        employee.schedules.push(schedule._id);
        await employee.save();

        return res.status(201).json({
            message: "Schedule created successfully",
            schedule
        });
    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while creating a schedule",
            details: error.message
        });
    }
};


export const getAllSchedules = async (re1, res) => {
    try {

        const schedules = await Schedule.find().populate('employee')
        return res.status(200).json({
            message: "Schedules fetched successfully",
            schedules
        })

    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while fetching schedules",
            details: error.message
        })
    }
}

export const getScheduleById = async (req, res) => {
    try {

        const { id } = req.params;

        const schedule = await Schedule.findById(id).populate('employee');

        return res.status(200).json({
            message: "Schedule fetched successfully",
            schedule
        })

    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while fetching schedule",
            details: error.message
        })
    }
}

export const updateSchedule = async (req, res) => {
    try {

        const { id } = req.params;
        const schedule = await Schedule.findByIdAndUpdate(id, req.body, {
            new: true
        })

        return res.status(200).json({
            message: "Schedule updated successfully",
            schedule
        })

    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while updating schedule",
            details: error.message
        })
    }
}

export const deleteSchedule = async (req, res) => {
    try {

        const { id } = req.params;
        const schedule = await Schedule.findByIdAndDelete(id);
        return res.status(200).json({
            message: "Schedule deleted successfully",
        })

    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while deleting schedule",
            details: error.message
        })
    }
}

export const updateStatus = async (req, res) => {
    try {

        const { id } = req.params;
        const { status } = req.body;
        const schedule = await Schedule.findByIdAndUpdate(id, { status }, {
            new: true
        })

        if (!schedule) {
            {
                return res.status(404).json({
                    message: "Schedule not found"
                })
            }
        }

        return res.status(200).json({
            message: "Status updated successfully",
            schedule
        })

    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while updating status",
            details: error.message
        })
    }
}
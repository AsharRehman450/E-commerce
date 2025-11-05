import { Employee } from "../models/employee.model.js";
import { User } from "../models/user.model.js";


//employee controller

export const createEmployee = async (req, res) => {
    try {

        const employee = new Employee(req.body);
        await employee.save();
        return res.status(201).json({
            message: "Employee created successfully",
            employee
        })

    } catch (error) {
        return res.status(500).json({
            message: 'An error occurred while creating Employee',
            details: error.message
        })
    }
}

export const getEmployee = async (req, res) => {
    try {

        const employee = await Employee.find().populate('schedules').exec();
        return res.status(200).json({
            message: "Employee fetched successfully",
            employee
        })

    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while fetching Employee",
            details: error.message
        })
    }
}

export const getEmployeeByID = async (req, res) => {
    try {

        const { id } = req.params;
        const employee = await Employee.findById(id).populate('schedules').exec();

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            })
        }

        return res.status(200).json({
            message: "Employee fetched successfully",
            employee
        })

    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while fetching Employee",
            details: error.message
        })
    }
}

export const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        const employee = await Employee.findByIdAndUpdate(id, req.body, {
            new: true
        })

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            })
        }

        return res.status(200).json({
            employee
        })

    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while updating Employee",
            details: error.message
        })
    }
}

export const deleteEmployee = async (req, res) => {
    try {

        const { id } = req.params;
        const employee = await Employee.findByIdAndDelete(id);

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            })
        }

        const user = await User.findOneAndDelete({ email: employee.email });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        return res.status(200).json({
            message: "Employee deleted successfully"
        })

    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while deleting Employee",
            details: error.message
        })
    }
}

export const getEmployeeSchedules = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findById(id).populate("schedules")
        return res.status(200).json({
            message: 'Employee schedules fetched successfully',
            schedules: employee.schedules
        })

    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while fetching employee schedules",
            details: error.message
        })
    }
}

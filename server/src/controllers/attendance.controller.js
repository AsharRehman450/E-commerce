//attendance controller

import { Employee } from "../models/employee.model.js";

export const markAttendance = async (req, res) => {
    try {
        const { id } = req.params; // Employee ID
        const { date, status, notes } = req.body; // Attendance details

        // Validate required fields
        if (!date || !status) {
            return res.status(400).json({
                message: "Date and status are required fields",
            });
        }

        // Find employee by ID
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({
                message: "Employee not found",
            });
        }

        // Check if attendance already exists for the date
        const existingAttendance = employee.attendance.find(
            (attendance) =>
                new Date(attendance.date).toISOString() === new Date(date).toISOString()
        );

        if (existingAttendance) {
            // Update existing attendance
            existingAttendance.status = status;
            existingAttendance.notes = notes || existingAttendance.notes;
        } else {
            // Add new attendance
            employee.attendance.push({
                date,
                status,
                notes,
            });
        }

        // Save changes
        await employee.save();

        return res.status(200).json({
            message: "Attendance marked successfully",
            employee,
        });
    } catch (error) {
        console.error("Error marking attendance:", error.message);
        return res.status(500).json({
            message: "An error occurred while marking attendance",
            details: error.message,
        });
    }
};



export const getAttendance = async (req, res) => {
    try {

        const { id } = req.params;

        const employee = await Employee.findById(id);

        if (!employee) {
            return res.status(404).json({
                message: "Employee not found"
            })
        }

        return res.status(200).json({
            message: "Attendance fetched successfully",
            attendance: employee.attendance
        })


    } catch (error) {
        return res.status(500).json({
            message: "An error occurred while fetching attendance",
            details: error.message
        })
    }
}
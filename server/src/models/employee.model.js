import mongoose from "mongoose";
import { User } from "./user.model.js";
import bcrypt from "bcryptjs";
import { getEnv } from "../utils/env.js";
import nodemailer from "nodemailer";

const attendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Present", "Absent"],
    required: true,
  },
  notes: {
    type: String,
    trim: true,
  },
});

const employeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["admin", "employee"],
    default: "employee",
  },
  jobTitle:{
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
  hireDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  attendance: [attendanceSchema],
  createAt: {
    type: Date,
    default: Date.now,
  },
  updateAt: {
    type: Date,
    default: Date.now,
  },
  employeeId: {
    type: String,
    unique: true,
  },
  schedules: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Schedule',
  }],
  
});
// employeeSchema.pre("save", function (next) {
//   this.updatedAt = Date.now();
//   next();
// });

employeeSchema.pre("save", function (next) {
  if (!this.employeeId) {
    this.employeeId = `EMP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
  this.updateAt = Date.now();
  next();
});


employeeSchema.post("save", async function (doc, next) {
  try {
    const existingUser = await User.findOne({ email: doc.email });
    if (!existingUser) {
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const defaultPassword = `${doc.firstName.toLowerCase()}${randomNum}@`;
      const hashedPassword = bcrypt.hashSync(
        defaultPassword,
        bcrypt.genSaltSync(10)
      );

      const newUser = new User({
        name: `${doc.firstName} ${doc.lastName}`,
        email: doc.email,
        password: hashedPassword,
        role: doc.role,
        status: doc.status,
        employeeRef: doc._id,
      });

      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: getEnv("Email_User"),
          pass: getEnv("Email_Pass"),
        },
      });

      const mailOptions = {
        from: getEnv("Email_User"),
        to: doc.email,
        subject: "Account Created",
        text: `Your account has been created. Your default password is ${defaultPassword}`,
      };

      await transporter.sendMail(mailOptions);

      await newUser.save();
    }
  } catch (error) {
    console.error("Error creating user for employee:", error);
  }
  next();
});

export const Employee = mongoose.model("Employee", employeeSchema);

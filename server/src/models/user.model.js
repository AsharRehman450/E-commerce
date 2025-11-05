import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      select: false,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "employee"],
      default: "user",
    },
    // employeeId: {
    //   type: String, // Add this field to store the linked Employee ID
    //   unique: true,
    //   sparse: true, // Allows null or undefined for non-employee users
    // },
    employeeRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee", // References the Employee model
      sparse: true,
    },
    status: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.encryptPassword = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

userSchema.methods.validPassword = function (reqPassword, UserPassword) {
  return bcrypt.compareSync(reqPassword, UserPassword);
};

export const User = mongoose.model("User", userSchema);

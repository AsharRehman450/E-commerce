import express from "express";
import {
  login,
  signup,
  refreshTokenHandler,
} from "../controllers/auth.controller.js";

const authRoutes = express.Router();

//Create Users
authRoutes.post("/user/create", signup);

// //Login User
authRoutes.post("/user/login", login);

// //refresh token
authRoutes.post("/refresh", refreshTokenHandler);

export default authRoutes;

import jwt from "jsonwebtoken";
import { getEnv } from "../utils/env.js";

const getAuthUserId = async (req) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, getEnv("JWT_SECRET"));
  const authId = decoded.userId;

  if (!authId) {
    return null;
  } else {
    return authId;
  }
};

export default getAuthUserId;

import jwt from "jsonwebtoken"
import { getEnv } from "../utils/env.js";

function verifyRefresh(email, token) {

  try {

    const decoded = jwt.verify(token, getEnv('JWT_SECRET'));

    return decoded.email === email;

  } catch (error) {
    return false;
  }

}

export default verifyRefresh;
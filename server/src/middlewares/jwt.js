import jwt from "jsonwebtoken"
import { getEnv } from "../utils/env.js";

let checkToken = (req, res, next) => {
  let token = req.headers["authorization"];

  if (token) {
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
    }
    jwt.verify(token, getEnv('JWT_SECRET'), (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: "Token is not valid",
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(401).json({
      message: "Auth token is not supplied",
    });
  }
};

export const checkResetToken = (req, res ,next) => {
  try {
    let token = req.headers["authorization"];

  if (token) {
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
    }
    jwt.verify(token, getEnv('JWT_SECRET'), (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: "Token is not valid",
        });
      } else {
        const email = req.body.email;
        if (email !== decoded.email) {
          return res.status(401).json({
            message: "Token is not valid",
          });
        }
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(401).json({
      message: "Auth token is not supplied",
    });
  }
  } catch (error) {
    console.log("🚀 ~ file: jwt.js:32 ~ checkResetToken ~ error:", error)
    return res.status(500).json({
      message: "Something went wrong in verifying token",
    });
  }
}

export default checkToken

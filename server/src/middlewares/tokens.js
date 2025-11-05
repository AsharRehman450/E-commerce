import jwt from "jsonwebtoken";
import { getEnv } from "../utils/env.js";

export const createAccessToken = (user) => {
  return jwt.sign(
    {
      email: user.email,
      userId: user._id,
    },
    getEnv("JWT_SECRET"),
    {
      expiresIn: "12h",
    }
  );
};

export const createAccessTokenForReset = (user) => {
  return jwt.sign(
    {
      email: user.email,
    },
    getEnv("JWT_SECRET"),
    {
      expiresIn: "30min",
    }
  );
};

export const createRefreshToken = (user) => {
  return jwt.sign(
    {
      email: user.email,
      userId: user._id,
    },
    getEnv("JWT_SECRET"),
    {
      expiresIn: "24h",
    }
  );
};

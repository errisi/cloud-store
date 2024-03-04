import jwt from "jsonwebtoken";
import "dotenv/config";
import { Users } from "../models/user.model";

function sign(user: Partial<Users>) {
  const token = jwt.sign(user, process.env.JWT_KEY!, {
    expiresIn: "200s",
  });

  return token;
}

function verify(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_KEY!);
  } catch {
    return null;
  }
}

function signRefresh(user: Partial<Users>) {
  const token = jwt.sign(user, process.env.JWT_REFRESH_KEY!);

  return token;
}

function verifyRefresh(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_KEY!);
  } catch {
    return null;
  }
}

export const jwtService = {
  sign,
  verify,
  signRefresh,
  verifyRefresh,
};

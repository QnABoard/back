import jwt from "jsonwebtoken";

export const getTokenData = async (authHeader) => {
  const token = authHeader.split(" ")[1]; // Bearer <token>
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded;
};

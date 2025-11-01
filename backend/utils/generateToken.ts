import jwt from "jsonwebtoken";

interface TokenPayload {
  userId: string;
  email: string;
}

export const generateToken = (userId: string, email: string): string => {
  const payload: TokenPayload = {
    userId,
    email,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "7d", // Token expires in 7 days
  });

  return token;
};

export const verifyToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as TokenPayload;
    return decoded;
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};
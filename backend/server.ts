console.log(" server.ts started executing...");

import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";  

console.log(" All modules imported successfully...");

dotenv.config();
console.log(" Environment variables loaded...");
console.log("MONGO_URI:", process.env.MONGO_URI ? " Loaded" : " Missing");

const app = express();
const PORT = process.env.PORT || 5000;


const allowedOrigins: string[] = [
  'http://localhost:3000',
  'my-app-rose-six.vercel.app', 
  process.env.FRONTEND_URL
].filter((origin): origin is string => Boolean(origin));

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(bodyParser.json());

console.log(" Middleware initialized...");

// === Routes ===
app.use("/api/auth", authRoutes);  

console.log(" Auth routes connected...");

// === MongoDB Connection ===
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log(" MongoDB connected successfully"))
  .catch((err) => {
    console.error(" MongoDB connection error:", err);
  });

// === Test Route ===
app.get("/", (req: Request, res: Response) => {
  res.send(" Backend API is running successfully!");
});

// === Start Server ===
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});

export default app;
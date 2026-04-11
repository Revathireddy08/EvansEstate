import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

console.log("ENV TEST:", process.env.MONGO_URI);
console.log("JWT SECRET:", process.env.JWT_SECRET);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB Successfully!");
  } catch (error) {
    console.log(error);
  }
};

connectDB();

const __dirname = path.resolve();
const app = express();





app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);


app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error!";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
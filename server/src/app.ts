import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import flightRoutes from "./routes/flightRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import ticketRoutes from "./routes/ticketRoutes";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", flightRoutes);
app.use("/api", bookingRoutes);
app.use("/api", ticketRoutes);

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Mongo error:", err));

export default app;
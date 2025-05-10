// routes/flightRoutes.ts
import express from "express";
import { getFlightDetails, getFlights, recordBookingAttempt } from "../controllers/flightController";

const router = express.Router();
router.get("/flights", getFlights);
router.get("/flightDetails/:flightId", getFlightDetails);
router.post("/flights/booking-attempt", recordBookingAttempt);

export default router;
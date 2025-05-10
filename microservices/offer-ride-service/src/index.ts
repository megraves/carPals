import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const PORT = 4002;

app.use(cors());
app.use(bodyParser.json());

const offeredRides: any[] = [];

// POST endpoint to offer a ride
app.post("/offer-ride", (req: Request, res: Response) => {
  const { userId, startLocation, endLocation, departureTime, daysOfWeek, seatsAvailable, vehicleType } = req.body;
  if (!userId || !startLocation || !endLocation || !departureTime || !daysOfWeek || !seatsAvailable || !vehicleType) {
    return res.status(400).json({ error: "Missing required fields." });
  }
  const ride = {
    id: offeredRides.length + 1,
    userId,
    startLocation,
    endLocation,
    departureTime,
    daysOfWeek,
    seatsAvailable,
    vehicleType,
    createdAt: new Date().toISOString(),
  };
  offeredRides.push(ride);
  res.status(201).json({ message: "Ride offered successfully!", ride });
});

app.listen(PORT, () => {
  console.log(`Offer Ride Service listening on port ${PORT}`);
});

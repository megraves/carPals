import express, { Request, Response } from "express";
import { pino } from "pino";
import fetch from "node-fetch";

import cors from "cors";


const PORT = 3002;
const REGISTRY_URL = "http://registry:3000";
const log = pino({ transport: { target: "pino-pretty" } });
const app = express();

app.use(cors());
app.use(express.json());

interface Coordinate {
  lat: number;
  lon: number;
}

interface Route {
  id: string;
  type: string;
  startLocation: string;
  endLocation: string;
  pickupTime: string;
  daysOfWeek: string[];
  createdAt: string;
  startCoord?: Coordinate;
  endCoord?: Coordinate;
}

// Geocode an address using OpenStreetMap
async function geocode(address: string): Promise<Coordinate | undefined> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    address
  )}&format=json&limit=1`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "carPals/1.0 (lashea@umass.edu)",
        "Referer": "http://localhost"
      }
      
    });
    const data = await res.json() as any[];
    if (data.length === 0) return undefined;
    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
    };
  } catch (err) {
    log.warn(`Geocoding failed for ${address}: ${(err as Error).message}`);
    return undefined;
  }
}

//  Haversine distance in km
function haversineDistance(coord1: Coordinate, coord2: Coordinate): number {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371;

  const dLat = toRad(coord2.lat - coord1.lat);
  const dLon = toRad(coord2.lon - coord1.lon);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(coord1.lat)) *
      Math.cos(toRad(coord2.lat)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Proximity scoring with geographic coords
function computeProximityScore(userRoute: Route, candidate: Route): number {
  if (
    !userRoute.startCoord ||
    !userRoute.endCoord ||
    !candidate.startCoord ||
    !candidate.endCoord
  ) {
    return Infinity;
  }

  const startDist = haversineDistance(userRoute.startCoord, candidate.startCoord);
  const endDist = haversineDistance(userRoute.endCoord, candidate.endCoord);
  return startDist + endDist;
}

// Register with registry
async function registerWithRetry(name: string, url: string, maxRetries = 5) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch(`${REGISTRY_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, url }),
      });
      if (res.ok) {
        log.info("Registered with registry");
        return;
      }
    } catch (err) {
      log.warn(`Failed to register: ${(err as Error).message}`);
      await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
    }
  }
  log.error("Could not register. Exiting.");
  process.exit(1);
}

// POST /match-routes
app.post("/match-routes", async (req: Request, res: Response) => {
  const userRoute: Route = req.body;
  log.info("🔍 Received match request:", userRoute);

  try {
    const dbRes = await fetch("http://database:3000");
    const dbData = await dbRes.json() as any;
    log.info("🧾 Raw DB data:");
    log.info(JSON.stringify(dbData, null, 2));


    const allRoutes: Route[] = (dbData.routes || [])
    .filter((route: any) => route.type === "offering");
  

    log.info(`Found ${allRoutes.length} offering routes`);

    userRoute.startCoord = await geocode(userRoute.startLocation);
    userRoute.endCoord = await geocode(userRoute.endLocation);

    for (const route of allRoutes) {
      route.startCoord = await geocode(route.startLocation);
      route.endCoord = await geocode(route.endLocation);
    }

    const scored = allRoutes
    .map((route) => {
      const score = computeProximityScore(userRoute, route);
      log.info(`📏 Route ${route.id} → proximity score: ${score}`);
      log.info(`    user start: ${userRoute.startLocation}`);
      log.info(`    route start: ${route.startLocation}`);
      log.info(`    user end:   ${userRoute.endLocation}`);
      log.info(`    route end:  ${route.endLocation}`);
      return { ...route, proximityScore: score };
    })
    .filter((r) => r.proximityScore !== Infinity)
    .sort((a, b) => a.proximityScore - b.proximityScore);
  

    log.info(`Returning top ${scored.length} matches`);
    res.json(scored.slice(0, 10));
  } catch (error) {
    log.error("Matching failed:", (error as Error).message);
    console.error(error);
    
    res.status(500).json({ error: "Failed to fetch and match routes" });
  }
});

app.listen(PORT, () => {
  log.info(`Matching service running on port ${PORT}`);
  registerWithRetry("matching-service", `http://matching-service:${PORT}`);
});

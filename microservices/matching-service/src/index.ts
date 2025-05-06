import express, { Request, Response } from "express";
import { pino } from "pino";
import fetch from "node-fetch";

const PORT = 3002;
const REGISTRY_URL = "http://registry:3000";

const log = pino({ transport: { target: "pino-pretty" } });
const app = express();
app.use(express.json());

interface Route {
  id: string;
  type: string;
  startLocation: string;
  endLocation: string;
  pickupTime: string;
  daysOfWeek: string[];
  createdAt: string;
}

function calculateDistance(locA: string, locB: string): number {
  return Math.abs(locA.length - locB.length); 
}

function computeProximityScore(userRoute: Route, candidate: Route): number {
  const startDistance = calculateDistance(userRoute.startLocation, candidate.startLocation);
  const endDistance = calculateDistance(userRoute.endLocation, candidate.endLocation);
  return startDistance + endDistance;
}

// Register with the registry
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

  try {
    const dbRes = await fetch("http://database:3000");
    const dbData = (await dbRes.json()) as { routes: Route[] }[];


    const allRoutes: Route[] = dbData
      .flatMap((user: any) => user.routes)
      .filter((route: any) => route.type === "offering");

    const scored = allRoutes
      .map(route => ({
        ...route,
        proximityScore: computeProximityScore(userRoute, route),
      }))
      .sort((a, b) => a.proximityScore - b.proximityScore);

    res.json(scored.slice(0, 10)); // return top 10 matches
  } catch (error) {
    log.error("Failed to fetch and match routes");
    res.status(500).json({ error: "Failed to fetch and match routes" });
  }
});

app.listen(PORT, () => {
  log.info(`Matching service running on port ${PORT}`);
  registerWithRetry("matching-service", `http://matching-service:${PORT}`);
});
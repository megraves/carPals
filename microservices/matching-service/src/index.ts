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
}

function levenshtein(a: string, b: string): number {
  const matrix: number[][] = Array.from({ length: b.length + 1 }, (_, i) =>
    Array.from({ length: a.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      matrix[i][j] = b[i - 1] === a[j - 1]
        ? matrix[i - 1][j - 1]
        : 1 + Math.min(
            matrix[i - 1][j],     // deletion
            matrix[i][j - 1],     // insertion
            matrix[i - 1][j - 1]  // substitution
          );
    }
  }

  return matrix[b.length][a.length];
}

// Proximity scoring
function computeProximityScore(userRoute: Route, candidate: Route): number {
  const startScore = levenshtein(userRoute.startLocation, candidate.startLocation);
  const endScore = levenshtein(userRoute.endLocation, candidate.endLocation);
  return startScore + endScore;
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
  log.info("Received match request:", userRoute);

  try {
    const dbRes = await fetch("http://database:3000");
    const dbData = await dbRes.json() as any;
    log.info("Raw DB data:");
    log.info(JSON.stringify(dbData, null, 2));


    const allRoutes: Route[] = (dbData.routes || [])
    .filter((route: any) => route.type === "offering");
    
    log.info(`Found ${allRoutes.length} offering routes`);

    const scored = allRoutes
      .map((route) => {
        const score = computeProximityScore(userRoute, route);
        return { ...route, proximityScore: score };
      })
      .filter((r) => r.proximityScore !== Infinity)
      .sort((a, b) => a.proximityScore - b.proximityScore);

    log.info(`Returning top ${scored.length} matches`);

    const results = scored.slice(0, 10).map((route) => {
      const user = dbData.users.find((u: any) =>
        u.routes?.some((r: any) => r.id === route.id)
      );

      const [firstName, ...rest] = (user?.name || "Unknown").split(" ");
      const lastName = rest.join(" ");

      return {
        id: route.id,
        firstName,
        lastName,
        pickUpLocation: route.startLocation,
        dropOffLocation: route.endLocation,
        pickUpTime: route.pickupTime,
        daysNeeded: route.daysOfWeek,
        distance: route.proximityScore,
      };
    });

    res.json(results);

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

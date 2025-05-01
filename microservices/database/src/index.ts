import express from "express";
import { pino } from "pino";
import { Request, Response } from "express";

const PORT = 3000;
const REGISTRY_URL = "http://registry:3000";

// Set up pino to log to the console
const log = pino({
    transport: {
      targets: [
        { target: 'pino-pretty', level: 'info' }
      ]
    }
});

const app = express();
app.use(express.json());

// Register service with registry
async function registerWithRetry(name: string, url: string, maxRetries = 5) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const res = await fetch(`${REGISTRY_URL}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, url }),
        });
        if (!res.ok) throw new Error(`Status ${res.status}`);
        log.info("Registered with registry");
        return;
      } catch (err) {
        log.warn(
          `Failed to register (attempt ${i + 1}): ${(err as Error).message}`,
        );
        await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
      }
    }
    log.error("Could not register with registry. Exiting.");
    process.exit(1);
}

// Check if service exists
async function lookupService(name: string): Promise<string | null> {
    try {
      const res = await fetch(`${REGISTRY_URL}/lookup?name=${name}`);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const { url } = await res.json();
      return url;
    } catch (err) {
      log.error(`Lookup failed for ${name}: ${(err as Error).message}`);
      return null;
    }
}

// Add POST route
app.post("/", async (req: Request, res: Response) => {

    // Log communication with api-gateway
    log.info({ source: 'gateway', body: req.body }, 'Received request from api-gateway');

    //TODO: set up database and post to it
});

app.get("/", async (req: Request, res: Response) => {

  // Log communication with api-gateway
  log.info({ source: 'gateway', body: req.body }, 'Received request from api-gateway');

  //TODO: set up database and get info in it
});

// Listen on PORT
app.listen(PORT, () => {
    log.info(`Database listening on port ${PORT}`);
    registerWithRetry("database", `http://database:${PORT}`);
});
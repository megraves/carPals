import express, { Request, Response } from "express";
import { pino } from "pino";
import cors from "cors";

const PORT = 3000;
const REGISTRY_URL = "http://registry:3000";

// for logging to console
const log = pino({ transport: { target: "pino-pretty" } });

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "OPTIONS"],
}));
app.use(express.json());

// Retry logic for registering with the registry
async function registerWithRetry(name: string, url: string, maxRetries = 5) {
  log.info("Registering . . .");
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

async function lookupService(name: string): Promise<string | null> {
  log.info(`lookupService called with name: ${name}`);
  try {
    log.info(`Trying to get url`);
    const res = await fetch(`${REGISTRY_URL}/lookup?name=${name}`);
    log.info(`Registry responded with status: ${res.status}`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const { url } = await res.json();
    return url;
  } catch (err) {
    log.error(`Lookup failed for ${name}: ${(err as Error).message}`);
    return null;
  }
}

// Proxy handler for forwarding requests
async function handlePostProxy(
  serviceName: string,
  req: express.Request,
  res: express.Response,
) {
  log.info(`handleProxy called for service: ${serviceName}`);
  const url = await lookupService(serviceName);
  if (!url) return res.status(502).send(`Could not resolve ${serviceName}`);
  try {
    log.info(`Trying to fetch with ${url}`);
    const response = await fetch(`${url}${req.originalUrl}`, {

      method: req.method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });
    const result = await response.json();
    res.status(response.status).json(result);
  } catch (err) {
    log.error(`Error forwarding to ${serviceName}: ${(err as Error).message}`);
    res.status(500).send(`Error communicating with ${serviceName}`);
  }
}

// Proxy handler for forwarding requests
async function handleGetProxy(
  serviceName: string,
  req: express.Request,
  res: express.Response,
) {
  log.info(`handleProxy called for service: ${serviceName}`);
  const url = await lookupService(serviceName);
  if (!url) return res.status(502).send(`Could not resolve ${serviceName}`);
  try {
    log.info(`Trying to fetch with ${url}`);
    const response = await fetch(url);
    const result = await response.json();
    res.status(response.status).json(result);
  } catch (err) {
    log.error(`Error forwarding to ${serviceName}: ${(err as Error).message}`);
    res.status(500).send(`Error communicating with ${serviceName}`);
  }
}

// Routes
app.post("/react", (req: Request, res: Response) => {
  log.info(`Gateway forwarding request to react`);
  handlePostProxy("react", req, res);
});

app.post("/database", (req: Request, res: Response) => {
  log.info(`Gateway forwarding post request to database`);
  handlePostProxy("database", req, res);
});

app.get("/database", (req: Request, res: Response) => {
  log.info(`Gateway forwarding get request to database`);
  handleGetProxy("database", req, res);});

app.post("/users/:userId/routes", (req, res) => handleGetProxy("database", req, res));

app.post("/signup", async (req, res) => {
  const url = await lookupService("database");
  if (!url) return res.status(502).send("Could not resolve database");

  try {
    const response = await fetch(`${url}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Signup forwarding failed:", error);
    res.status(500).json({ error: "Failed to forward to database" });
  }
});
app.post("/login", async (req, res) => {
  const url = await lookupService("database");
  if (!url) return res.status(502).send("Could not resolve database");

  try {
    const response = await fetch(`${url}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Login forwarding failed:", error);
    res.status(500).json({ error: "Failed to forward to database" });
  }
});

app.options("*", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.sendStatus(200);
});

app.listen(PORT, () => {
  log.info(`API Gateway listening on port ${PORT}`);
  registerWithRetry("api-gateway", `http://api-gateway:${PORT}`);
});
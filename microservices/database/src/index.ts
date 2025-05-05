import express from "express";
import fs from 'fs';
import path from 'path';
import { pino } from "pino";
import { Request, Response } from "express";

const PORT = 3000;
const REGISTRY_URL = "http://registry:3000";
const DATA_FILE = path.join("src", "data.json");

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

// Add POST route
app.post("/", async (req: Request, res: Response) => {

  // Log communication with api-gateway
  log.info({ source: 'gateway', body: req.body }, 'Received request from api-gateway');

  const data = req.body;
  let existingData: unknown[] = [];

  if (fs.existsSync(DATA_FILE)) {
    try {
      const raw = fs.readFileSync(DATA_FILE, 'utf8');
      existingData = JSON.parse(raw) || [];
      if (!Array.isArray(existingData)) {
        existingData = [existingData];
      }
    } catch (err) {
      log.info('Error reading file:', err);
      res.status(502).json({error: "failed to read file", msg: err})
    }
  }
  else {
    log.info("Data file path does not exist");
    res.status(501).json({error: "File path error"});
  }

  existingData.push(data);

  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(existingData, null, 2));
    res.status(200).json({ message: 'Data received and stored.' });
  } catch (err) {
    console.error('Error writing file:', err);
    res.status(500).json({ error: 'Failed to write data.', msg: err });
  }
});

app.get("/", async (req: Request, res: Response) => {

  // Log communication with api-gateway
  log.info({ source: 'gateway', body: req.body }, 'Received request from api-gateway');
  res.status(500).json({error: 'this is the get request'})

  //TODO: set up database and get info in it
});

// Listen on PORT
app.listen(PORT, () => {
    log.info(`Database listening on port ${PORT}`);
    registerWithRetry("database", `http://database:${PORT}`);
});
import express from "express";
import fs from 'fs';
//import path from 'path';
import { pino } from "pino";
import { Request, Response } from "express";
import { v4 as uuidv4} from "uuid";

const PORT = 3000;
const REGISTRY_URL = "http://registry:3000";
const DATA_FILE = "./data.json";

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

// Load and save functions
function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    return { users: [] };
  }

  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(raw);
}

function saveData(data: any) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

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
      console.error('Error reading file:', err);
    }
  }

  existingData.push(data);

  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(existingData, null, 2));
    res.status(200).json({ message: 'Data received and stored.' });
  } catch (err) {
    console.error('Error writing file:', err);
    res.status(500).json({ error: 'Failed to write data.' });
  }
});

// User signup
app.post("/signup", async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const data = loadData();

  if (data.users.some((u: any) => u.email === email)) {
    return res.status(400).json({ error: 'Email already exists' });
  }

  const newUser = {
    id: uuidv4(),
    name,
    email,
    password,
    createdAt: new Date().toISOString(),
    routes: []
  };

  data.users.push(newUser);
  saveData(data);

  res.status(201).json({ message: 'User created', userId: newUser.id });
});

// Add route for a user
app.post("/users/:userId/routes", (req: Request, res: Response) => {
  const { userId } = req.params;
  const { type, startLocation, endLocation, pickupTime, daysOfWeek } = req.body;

  const data = loadData();
  const user = data.users.find((u: any) => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const newRoute = {
    id: uuidv4(),
    type,
    startLocation,
    endLocation,
    pickupTime,
    daysOfWeek,
    createdAt: new Date().toISOString()
  };

  user.routes.push(newRoute);
  saveData(data);

  res.status(201).json({ message: 'Route added', routeId: newRoute.id });
});

app.get("/", async (req: Request, res: Response) => {

  // Log communication with api-gateway
  log.info({ source: 'gateway', body: req.body }, 'Received request from api-gateway');

  //TODO: set up database and get info in it
  const data = loadData();
  res.status(200).json(data);
});

// Listen on PORT
app.listen(PORT, "0.0.0.0", () => {
    log.info(`Database listening on port ${PORT}`);
    registerWithRetry("database", `http://database:${PORT}`);
});
import express from "express";
import "dotenv/config";
import fs from "fs"; //file system
import path from "path";

import User from "./models/user.model.js";
import { connectDB } from "./lib/db.js";
import job from "./lib/cron.js";

import clerkWebhook from "./webhooks/clerk.webhook.js"

import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

const app = express();
const PORT = process.env.PORT;
const FRONTEND_URL = process.env.FRONTEND_URL;

const publicDir = path.join(process.cwd(), "public"); //join the current working directory and find the public folder

// it's important that you don't parse the webhook event data, it should be in the raw format
app.use("api/webhooks/clerk",express.raw({ type:"application/json"}),clerkWebhook);

app.use(express.json());
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(clerkMiddleware);

app.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
});

//FOR DEPLOYMENT
// if the public directory exists, serve the static files
// this is for the production build
if (fs.existsSync(publicDir)) {   //Does the public folder exists? (only true in produciton).
  app.use(express.static(publicDir)); //this is our react application converted into static assets. serves the built React files
  app.get("/{*any}", (req, res, next) => {   //any other URL ->send back to index.html
    res.sendFile(path.join(publicDir, "index.html"), (err) => next(err));
  });
}
app.listen(PORT, () => {
  connectDB();
  console.log("Server is running on PORT:", PORT);

  if(process.env.NODE_ENV === "production")
    {
      job.start();
    };
});

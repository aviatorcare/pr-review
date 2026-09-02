import express from "express";
import { demoAuth } from "./auth";

export const app = express();

app.use(express.json());
app.use(demoAuth);

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

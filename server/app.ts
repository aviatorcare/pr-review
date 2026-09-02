import express from "express";
import { demoAuth } from "./auth";
import { conditionReviewsRouter } from "./condition-reviews";

export const app = express();

app.use(express.json());
app.use(demoAuth);
app.use("/api/condition-reviews", conditionReviewsRouter);

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

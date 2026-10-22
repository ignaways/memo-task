import express from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes.js";
import { env } from "./config/env.js";
import { apiLimiter } from "./middlewares/rateLimiters.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";

export const createApp = () => {
  const app = express();

  app.disable("x-powered-by");
  app.set("trust proxy", 1);

  app.use(helmet());
  app.use(
    cors({
      origin: env.CLIENT_ORIGIN,
      methods: ["GET", "POST", "PATCH", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
      maxAge: 86400,
    })
  );
  app.use(express.json({ limit: "100kb" }));

  app.get("/", (req, res) => res.json({ name: "memo-board-api", docs: "/api/health" }));
  app.use("/api", apiLimiter, routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

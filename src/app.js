import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import { env } from "./config/env.js";
import { errorHandler } from "./common/middlewares/errorHandler.js";
import { notFound } from "./common/middlewares/notFound.js";
import { swaggerSpec, swaggerUi } from "./docs/swagger.js";
import { registerRoutes } from "./routes/index.js";

const app = express();

app.use(helmet());
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
  }),
);

app.get("/", (_req, res) => {
  res
    .status(200)
    .json({ success: true, message: "Developer Portfolio Server is running" });
});

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
registerRoutes(app);

app.use(notFound);
app.use(errorHandler);

export default app;

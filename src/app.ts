import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error-handler";
import routes from "./routes/index.";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./docs/swagger.json";

const app = express();

app.use(helmet());
app.use(
  cors({ origin: process.env.FRONTEND_CORS?.split(","), credentials: true }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.send("Backend is running 🚀");
});

//Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//Routes
app.use("/api", routes);

app.get("/health", (_req, _res) => _res.json({ status: "ok" }));

app.use(errorHandler);

export default app;

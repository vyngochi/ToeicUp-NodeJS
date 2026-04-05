import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error-handler";
import routes from "./routes/index.";
import swaggerUi from "swagger-ui-express";
import { SwaggerDocument } from "./docs";

const app = express();

app.set("trust proxy", 1);
app.use(helmet());
const allowedOrigins = process.env.FRONTEND_CORS?.split(",") || [];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (_req, res) => {
  res.send("Backend is running 🚀");
});

//Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(SwaggerDocument));

//Routes
app.use("/api", routes);

app.get("/health", (_req, _res) => _res.json({ status: "ok" }));

app.use(errorHandler);

export default app;

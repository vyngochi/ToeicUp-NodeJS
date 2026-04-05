import { JsonObject } from "@prisma/client/runtime/client";
import AuthSwagger from "./auth.swagger.json";
import UserSwagger from "./user.swagger.json";

// Gộp tất cả thành 1 Object duy nhất
export const SwaggerDocument: JsonObject = {
  openapi: "3.0.0", // Nên dùng 3.0.0 thống nhất
  info: {
    title: "Toeic Up",
    version: "1.0.0",
    description: "API hệ thống học từ vựng và luyện thi TOEIC Reading",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local Server",
    },
    {
      url: "https://toeicup.onrender.com",
      description: "Production",
    },
  ],
  paths: {
    ...AuthSwagger.paths,
    ...UserSwagger.paths,
  },
  // Gộp các schemas (nếu có)
  components: {
    schemas: {
      ...AuthSwagger.components?.schemas,
      ...UserSwagger.components?.schemas,
    },
    responses: {
      ...AuthSwagger.components.responses,
      ...UserSwagger.components?.responses,
    },
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

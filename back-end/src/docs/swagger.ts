// src/docs/swagger.ts
import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Minha API",
      version: "1.0.0",
    },
    servers: [{ url: "http://localhost:3000" }],
  },
  apis: ["./src/routes/*.ts", "./src/docs/*.ts"],
};
const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;

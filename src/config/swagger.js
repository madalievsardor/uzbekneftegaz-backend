const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const BASE_URL =
  process.env.RENDER_EXTERNAL_URL || "http://localhost:8000"; // Render uchun avtomatik aniqlaydi

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "UzbekNeftegaz API",
      version: "1.0.0",
      description:
        "📘 UzbekNeftegaz loyihasi uchun backend API hujjatlari (Auth, Banner va boshqalar)",
    },
    servers: [
      {
        url: `${BASE_URL}/api`,
        description: process.env.RENDER_EXTERNAL_URL
          ? "Render (production) server"
          : "Local server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "🔐 JWT token kiriting (Bearer token formatida)",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = { swaggerUi, swaggerSpec };

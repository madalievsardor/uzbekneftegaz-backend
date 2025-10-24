const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const SERVER_URL =
  process.env.RENDER_EXTERNAL_URL || `http://localhost:${process.env.PORT || 8000}/api`;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Uzbekneftegaz API",
      version: "1.0.0",
      description: "Foydalanuvchi autentifikatsiyasi va banner boshqaruvi uchun API hujjati",
    },
    servers: [
      {
        url: SERVER_URL,
        description: "Auto-configured server (local yoki production)",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "JWT tokenni shu joyga kiriting (Bearer ...)",
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

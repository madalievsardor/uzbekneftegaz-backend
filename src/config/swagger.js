const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const LOCAL_URL = `http://localhost:${process.env.PORT || 8000}/api`;
const PROD_URL = `${process.env.RAILWAY_URL || "https://uzbekneftegaz-backend-production.up.railway.app"}/api`;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Uzbekneftegaz API",
      version: "1.0.0",
      description: "Auth va Banner API hujjati (Express + Swagger)",
    },
    servers: [
      {
        url: LOCAL_URL,
        description: "💻 Local server (localhost)",
      },
      {
        url: PROD_URL,
        description: "☁️ Railway production server",
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

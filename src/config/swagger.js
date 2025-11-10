const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const LOCAL_URL = `http://localhost:${process.env.PORT || 8000}/api`;

// 🔹 Production serverlar: Render va Railway
const PROD_URLS = [
  process.env.RENDER_EXTERNAL_URL ? `${process.env.RENDER_EXTERNAL_URL}/api` : null,
  "https://uzbekneftegaz-backend-production.up.railway.app/api"
].filter(Boolean); // null bo‘lganlarini olib tashlaymiz

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Uzbekneftegaz API",
      version: "1.0.0",
      description: "Auth, Banner va Leadership API hujjati (Express + Swagger)",
    },
    servers: [
      {
        url: LOCAL_URL,
        description: "💻 Local server (localhost)",
      },
      ...PROD_URLS.map(url => ({
        url,
        description: "🌐 Production server"
      }))
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
  apis: ["./src/routes/*.js"], // swagger doc fayllaringiz
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = { swaggerUi, swaggerSpec };

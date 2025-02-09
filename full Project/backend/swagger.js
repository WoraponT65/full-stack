const swaggerJSDoc = require("swagger-jsdoc");

const swaggerUI = require('swagger-ui-express');

const sweggerOptions = {
    definition: {
        openapi:"3.0.0",
        info: {
            title: "MiniStore API",
            version: "1.0.0",
            description: 'Learn how to use the MiniStore API',

        },
    Servers: [
       {url: "http://localhost:8800",
        description:"My API through HTTP"

    },
    {url: "http://localhost:8443",
        description:"My API through HTTPs"

    },
]
    },
    apis: ["./routes/*.js"],
};
const swaggerSpec = swaggerJSDoc(sweggerOptions);
module.exports = {swaggerSpec, swaggerUI};


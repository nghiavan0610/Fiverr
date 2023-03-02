const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');

function swagger(app) {
    const openapiDocument = yaml.load('./src/swagger/openapi.yaml');
    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(openapiDocument));
}

module.exports = swagger;

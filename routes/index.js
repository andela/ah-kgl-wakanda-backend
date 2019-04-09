const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./api/swagger/swagger.json');


// convert the json doc into a styled UI and serve it
router.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
router.use('/api', require('./api'));

module.exports = router;

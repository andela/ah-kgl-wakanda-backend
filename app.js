import express from 'express';
import bodyParser from 'body-parser';
import routes from './server/routes';

import './server/config/passport';

// Create global app object
const app = express();

<<<<<<< HEAD
=======
app.use(passport.initialize());


>>>>>>> [feature #165020120] adding the middleware checkToken for authorization
// Normal express config defaults
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(routes);

// finally, let's start our server...
const server = app.listen(process.env.PORT || 3000, () => { });

export default server;

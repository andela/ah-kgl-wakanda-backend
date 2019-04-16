import express from 'express';
// import passport from 'passport';
import bodyParser from 'body-parser';
import routes from './server/routes';

// import './server/config/passport';


// Create global app object
const app = express();

// app.use(passport.initialize());

// Normal express config defaults
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(routes);

// finally, let's start our server...
const server = app.listen(process.env.PORT || 3000, () => { });

export default server;

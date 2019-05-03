import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import session from 'express-session';
import routes from './server/routes';

import './server/config/passport';

// Create global app object
const app = express();

// Normal express config defaults
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: process.env.SECRET
}));

app.use(routes);

// finally, let's start our server...
const server = app.listen(process.env.PORT || 3000, () => { });

export default server;

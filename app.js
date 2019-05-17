import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import session from 'express-session';
import routes from './server/routes';
import { LOCAL_PORT } from './server/config/constant';

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

app.use('*', (req, res) => {
  res.status(400).json({ status: 400, message: 'Bad request' });
});

// finally, let's start our server...
const server = app.listen(process.env.PORT || LOCAL_PORT, () => { });

export default server;

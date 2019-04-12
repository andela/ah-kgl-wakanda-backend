import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import FacebookTokenStrategy from 'passport-facebook-token';
import dotenv from 'dotenv';
import { User } from '../models';

dotenv.config();

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;
passport.use(
  new JwtStrategy(opts, (async (jwtPayload, done) => {
    console.log(jwtPayload);
    try {
      const user = await User.findOne({ where: { id: jwtPayload.id } });
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }))
);

passport.use('facebook-token',
  new FacebookTokenStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      done(null, profile);
    }
  ));

export default passport;

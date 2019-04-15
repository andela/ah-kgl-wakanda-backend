import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { User } from '../models';

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

export default passport;

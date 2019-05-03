import passport from 'passport';
import FacebookTokenStrategy from 'passport-facebook-token';
import GoogleTokenStrategy from 'passport-google-plus-token';
import TwitterStrategy from 'passport-twitter';
import dotenv from 'dotenv';

dotenv.config();

passport.use(
  'facebook-token',
  new FacebookTokenStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
    },
    async (accessToken, refreshToken, profile, done) => {
      done(null, profile);
    }
  )
);

passport.use(
  'google-token',
  new GoogleTokenStrategy(
    {
      clientID: process.env.GOOGLE_APP_ID,
      clientSecret: process.env.GOOGLE_APP_SECRET,
      profileFields: ['email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      done(null, profile);
    }
  )
);

passport.use('twitter', new TwitterStrategy({
  consumerKey: process.env.TWITTER_APP_ID,
  consumerSecret: process.env.TWITTER_APP_SECRET,
  callbackURL: 'http://localhost:3000/api/auth/twitter/callback'
},
async (token, tokenSecret, profile, done) => {
  done(null, profile);
}));

export default passport;

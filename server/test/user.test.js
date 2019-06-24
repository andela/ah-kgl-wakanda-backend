import chai from 'chai';
import chaiHttp from 'chai-http';
import jwt from 'jsonwebtoken';
import Database from './config';
import dummyUsers from './config/users';
import app from '../../app';

const { expect } = chai;
chai.use(chaiHttp);

let userToken;

const expiredToken = jwt.sign(
  { id: 2, username: 'karl', email: 'karlmusingo@gmail.com' },
  process.env.SECRET,
  { expiresIn: '0.1s' }
);

describe('User ', () => {
  before(async () => {
    try {
      await Database.testDbConnection();
    } catch (error) {
      return {
        type: 'connection',
        error,
      };
    }
  });

  after(async () => {
    try {
      await Database.truncateUser();
    } catch (error) {
      return {
        type: 'truncate',
        error,
      };
    }
  });


  describe('when signing up a new user', () => {
    it('should not create a new user when username is missing', (done) => {
      chai.request(app)
        .post('/api/auth/signup')
        .send(dummyUsers.withoutUsername)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res).to.be.an('object');
          done();
        });
    });

    it('should not create a new user when email is missing', (done) => {
      chai.request(app)
        .post('/api/auth/signup')
        .send(dummyUsers.withoutEmail)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('email is required');
          expect(res).to.be.an('object');
          done();
        });
    });

    it('should not create a new user when email have bad email format', (done) => {
      chai.request(app)
        .post('/api/auth/signup')
        .send(dummyUsers.wrongEmailFormat)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('email must be a valid email');
          expect(res).to.be.an('object');
          done();
        });
    });

    it('should not create a new user when password doesnt fill requirement', (done) => {
      chai.request(app)
        .post('/api/auth/signup')
        .send(dummyUsers.wrongPasswordFormat)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('Your password must have at least 6 digits and contain 1 Uppercase, 1 Lowercase, 1 number');
          expect(res).to.be.an('object');
          done();
        });
    });

    it('should be able to signup', (done) => {
      chai.request(app)
        .post('/api/auth/signup')
        .send(dummyUsers.correct)
        .end((err, res) => {
          userToken = `Bearer ${res.body.user.token}`;
          expect(res.status).to.equal(200);
          expect(res).to.be.an('object');
          expect(res.body).to.have.property('user');
          done();
        });
    });
  });

  describe('Email verification', () => {
    it('should not verify the account when the token has expired', (done) => {
      chai.request(app)
        .get(`/api/auth/verification/${expiredToken}`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Your verification email has expired, try to login to receive a new one');
          done();
        });
    });
    it('should verify the account', (done) => {
      chai.request(app)
        .get(`/api/auth/verification/${userToken.split(' ')[1]}`)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Your account has been verified successfully');
          done();
        });
    });
    it('should verify the account twice', (done) => {
      chai.request(app)
        .get(`/api/auth/verification/${userToken.split(' ')[1]}`)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equal('Your account has already been verified');
          done();
        });
    });
  });

  describe('when logging a new user', () => {
    it('should not log in the user if credential are wrong', (done) => {
      chai.request(app)
        .post('/api/auth/login')
        .send(dummyUsers.wrongLogInfo)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res).to.be.an('object');
          expect(res.body.message).to.equal('The credentials you provided are incorrect');
          done();
        });
    });
    it('should be able to login', (done) => {
      chai.request(app)
        .post('/api/auth/login')
        .send(dummyUsers.correctLogInfo)
        .end((err, res) => {
          userToken = `Bearer ${res.body.user.token}`;
          expect(res.status).to.equal(200);
          expect(res).to.be.an('object');
          expect(res.body).to.have.property('user');
          done();
        });
    });
    // View own Profile or Display user info
    it('Should display user information', (done) => {
      chai.request(app)
        .get(`/api/users/${dummyUsers.correct.username}`)
        .set('Authorization', userToken)
        .end((error, res) => {
          expect(res.body.status).to.be.equal(200);
          expect(res.body).to.have.property('profile');
          expect(res.body.profile).to.have.property('username');
          expect(res.body.profile).to.have.property('firstname');
          expect(res.body.profile).to.have.property('lastname');
          expect(res.body.profile).to.have.property('email');
          expect(res.body.profile).to.have.property('bio');
          expect(res.body.profile).to.have.property('image');
          expect(res.body.profile).to.have.property('follows');
          expect(res.body.profile).to.have.property('followings');
          expect(res.body.profile).to.have.property('articles');
          expect(res.body.profile.email).equals('hadad_test@andela.com');
          expect(res.body.profile.bio).equals(null);
          expect(res.body.profile.image).equals(null);
          done();
        });
    });
  });

  // Following a user

  describe('User', () => {
    describe('Following', () => {
      // Follow without token

      it('should follow a user', (done) => {
        chai.request(app)
          .post('/api/profiles/mutombo/follow')
          .set('Content-Type', 'application/json')
          .end((err, res) => {
            expect(res.status).to.equal(401);
            expect(res.body.message).to.equal('Authorization is missing');
            done();
          });
      });

      // Following the right user

      it('should successfully allow to follow a user', (done) => {
        chai.request(app)
          .post('/api/profiles/mutombo/follow')
          .set('Content-Type', 'application/json')
          .set('Authorization', userToken)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal('Successfully followed user mutombo');
            expect(res.body).to.have.property('profile');
            done();
          });
      });

      // Should not follow the user for the second time

      it('Should not follow the user', (done) => {
        chai.request(app)
          .post('/api/profiles/mutombo/follow')
          .set('Content-Type', 'application/json')
          .set('Authorization', userToken)
          .end((err, res) => {
            expect(res.status).to.equal(400);
            expect(res.body.message).to.equal('You\'re alredy a follower of this user');
            done();
          });
      });

      // Test of unfound user

      it('Should not find the user to follow', (done) => {
        chai.request(app)
          .post('/api/profiles/mutombo1/follow')
          .set('Content-Type', 'application/json')
          .set('Authorization', userToken)
          .end((err, res) => {
            expect(res.status).to.equal(404);
            expect(res.body.message).to.equal('We don\'t find who you want to follow');
            done();
          });
      });

      // Unfollow a followed user

      it('should successfully allow to unfollow a user', (done) => {
        chai.request(app)
          .delete('/api/profiles/mutombo/follow')
          .set('Content-Type', 'application/json')
          .set('Authorization', userToken)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.message).to.equal('Successfully unfollowed user mutombo');
            expect(res.body).to.have.property('profile');
            done();
          });
      });

      // Unfollow an unexisting following

      it('Should not unfollow the user', (done) => {
        chai.request(app)
          .delete('/api/profiles/mutombo/follow')
          .set('Content-Type', 'application/json')
          .set('Authorization', userToken)
          .end((err, res) => {
            expect(res.status).to.equal(404);
            expect(res.body.message).to.equal('You\'re not a follower of this user');
            done();
          });
      });

      // User view of follows

      it('Should allow the user to view followers and followees', (done) => {
        chai.request(app)
          .get('/api/profiles/follow')
          .set('Content-Type', 'application/json')
          .set('Authorization', userToken)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.have.property('followees').be.an('array');
            expect(res.body).to.have.property('followers').be.an('array');
            done();
          });
      });
    });
  });
  describe('Profile Update', () => {
    it('should be able to signup', (done) => {
      chai.request(app)
        .post('/api/auth/signup')
        .send(dummyUsers.correct1)
        .end((err, res) => {
          userToken = `Bearer ${res.body.user.token}`;
          expect(res.status).to.equal(200);
          expect(res).to.be.an('object');
          expect(res.body).to.have.property('user');
          done();
        });
    });
    // Profile updating test
    const user = {
      email: 'gisele.iradukunda@andela.com',
      bio: 'I am not afraid',
      image: 'https://image.jpg'
    };
    it('Should update user information', (done) => {
      chai.request(app)
        .put(`/api/user/${dummyUsers.correct.username}`)
        .set('Authorization', userToken)
        .send(user)
        .end((error, res) => {
          expect(res.body.status).to.be.equal(200);
          expect(res.body).to.have.property('user');
          expect(res.body.user).to.have.property('email');
          expect(res.body.user).to.have.property('bio');
          expect(res.body.user).to.have.property('image');
          expect(res.body.user.image).equals('https://image.jpg');
          done();
        });
    });
  });
});

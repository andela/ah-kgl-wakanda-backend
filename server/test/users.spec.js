import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';
import dummyUsers from './config/users';
import Database from './config';

// Chai configuration
const { expect } = chai;
chai.use(chaiHttp);

let loginToken;

describe('Enable the user to Sign out ', () => {
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

  it('Should sign the user out', (done) => {
    chai.request(app)
      .post('/api/auth/signup')
      .send(dummyUsers.correctLogout)
      .end((err, resp) => {
        loginToken = `Bearer ${resp.body.user.token}`;
        chai.request(app)
          .delete('/api/users/signout')
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${resp.body.user.token}`)
          .end((error, res) => {
            if (error) {
              done(error);
            }
            expect(res.body.status).to.be.equal(200);
            expect(res.body).to.have.property('message');
            expect(res.body.message).equals('Successfully signs out.');
            done();
          });
      });
  });
  it('Should not sign the user out when they are already logged out', (done) => {
    chai.request(app)
      .delete('/api/users/signout')
      .set('Authorization', loginToken)
      .end((error, res) => {
        expect(res.status).to.be.equal(403);
        expect(res.body).to.have.property('message');
        expect(res.body.message).equals('You need to first log in');
        done();
      });
  });
  it('Should not sign the user out when the token is invalid', (done) => {
    chai.request(app)
      .delete('/api/users/signout')
      .set('Authorization', 'Bearer token')
      .end((error, res) => {
        expect(res.status).to.be.equal(400);
        expect(res.body).to.have.property('message');
        expect(res.body.message).equals('jwt malformed');
        done();
      });
  });
  it('Should not sign the user out when the token is absent', (done) => {
    chai.request(app)
      .delete('/api/users/signout')
      .end((error, res) => {
        expect(res.status).to.be.equal(401);
        expect(res.body).to.have.property('message');
        expect(res.body.message).equals('Authorization is missing');
        done();
      });
  });
});

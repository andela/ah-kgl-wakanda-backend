import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';
import dummyUsers from './config/users';

// Chai configuration
const { expect } = chai;
chai.use(chaiHttp);

let loginToken;

describe('Notifications', () => {
  // subscription
  it('should unsubscribe the user to email notification', (done) => {
    chai.request(app)
      .post('/api/auth/signup')
      .send(dummyUsers.correctNotificationArticle)
      .end((err, resp) => {
        loginToken = `Bearer ${resp.body.user.token}`;
        chai.request(app)
          .put('/api/notifications/subscribe')
          .set('Content-Type', 'application/json')
          .set('Authorization', loginToken)
          .end((error, res) => {
            expect(res.body.status).to.be.equal(200);
            expect(res.body).to.have.property('user');
            expect(res.body.user.allowEmailNotification).equals(false);
            done();
          });
      });
  });

  it('should subscribe user', (done) => {
    chai.request(app)
      .put('/api/notifications/subscribe')
      .set('Content-Type', 'application/json')
      .set('Authorization', loginToken)
      .end((error, res) => {
        if (error) {
          done(error);
        }
        expect(res.body.status).to.be.equal(200);
        expect(res.body).to.have.property('user');
        expect(res.body.user.allowEmailNotification).equals(true);
        done();
      });
  });
});

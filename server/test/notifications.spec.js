import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';
import dummyUsers from './config/users';

// Chai configuration
const { expect } = chai;
chai.use(chaiHttp);

let loginToken;

describe('Notifications', () => {
  describe('Subsribe to email notification', () => {
    it('should unsubscribe the user to email notification', (done) => {
      chai.request(app)
        .post('/api/auth/login')
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
  describe('Getting notification', () => {
    it('should get all notifications', (done) => {
      chai.request(app)
        .get('/api/notifications')
        .set('Content-Type', 'application/json')
        .set('Authorization', loginToken)
        .end((error, res) => {
          if (error) {
            done(error);
          }
          expect(res.body.status).to.be.equal(200);
          expect(res.body).to.have.property('notifications');
          expect(res.body).to.have.property('notificationsCount');
          expect(res.body.notifications).to.be.an('array');
          done();
        });
    });
  });
  describe('Read notifications', () => {
    it('should read all notifications', (done) => {
      chai.request(app)
        .put('/api/notifications')
        .set('Content-Type', 'application/json')
        .set('Authorization', loginToken)
        .end((error, res) => {
          if (error) {
            done(error);
          }
          expect(res.body.status).to.be.equal(200);
          expect(res.body).to.have.property('notifications');
          expect(res.body).to.have.property('notificationsCount');
          expect(res.body.notifications).to.be.an('array');
          done();
        });
    });
    it('should read one notification', (done) => {
      chai.request(app)
        .put('/api/notifications/3')
        .set('Content-Type', 'application/json')
        .set('Authorization', loginToken)
        .end((error, res) => {
          if (error) {
            done(error);
          }
          // console.log(res.body);

          expect(res.body.status).to.be.equal(404);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.be.eql('This notification is either read or does not exist');
          done();
        });
    });
  });
});

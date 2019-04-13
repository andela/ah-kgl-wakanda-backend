import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import Password from '../controllers/password';
import app from '../../app';

// Chai configuration
const { expect } = chai;
chai.use(chaiHttp);

const email = 'sigmacool@gmail.com';

describe('Password reset', () => {
  beforeEach(async () => {
    await sinon.stub(Password, 'sendEmail').returns({ sent: true });
  });

  afterEach(() => {
    sinon.restore();
  });

  it('Should successfully send the password reset link email', (done) => {
    chai
      .request(app)
      .post('/api/users/reset_password')
      .send({ email })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        done();
      });
  });

  it('Should return user not found', (done) => {
    chai
      .request(app)
      .post('/api/users/reset_password')
      .send({ email: 'fake@gmail.com' })
      .end((err, res) => {
        expect(res.status).to.be.equal(404);
        done();
      });
  });

  it('Should validate an empty email', (done) => {
    chai
      .request(app)
      .post('/api/users/reset_password')
      .send({})
      .end((err, res) => {
        expect(res.status).to.be.equal(400);
        done();
      });
  });

  it('Should validate unformated email', (done) => {
    chai
      .request(app)
      .post('/api/users/reset_password')
      .send({ email: 'badFormat' })
      .end((err, res) => {
        expect(res.status).to.be.equal(400);
        done();
      });
  });
});

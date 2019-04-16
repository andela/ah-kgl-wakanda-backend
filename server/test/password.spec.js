import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import Password from '../controllers/password';
import app from '../../app';

// Chai configuration
const { expect } = chai;
chai.use(chaiHttp);

const email = 'sigmacool@gmail.com';
let tokenResetPassword;
const authScheme = 'Bearer';

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
        tokenResetPassword = `${authScheme} ${res.body.data.token}`;
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

describe('Update the password', () => {
  before((done) => {
    chai
      .request(app)
      .put('/api/users/password')
      .set('Authorization', tokenResetPassword)
      .send({ password: '1234567890old' })
      .end(() => {
        done();
      });
  });

  it('Should successfully update user password', (done) => {
    chai
      .request(app)
      .put('/api/users/password')
      .set('Authorization', tokenResetPassword)
      .send({ password: '1234567890update' })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        done();
      });
  });

  it('Should fail when new password match with the old', (done) => {
    chai
      .request(app)
      .put('/api/users/password')
      .set('Authorization', tokenResetPassword)
      .send({ password: '1234567890update' })
      .end((err, res) => {
        expect(res.status).to.be.equal(400);
        done();
      });
  });

  it('Should fail on invalid token', (done) => {
    chai
      .request(app)
      .put('/api/users/password')
      .set('Authorization', 'Bearer invalid-token')
      .send({ password: '1234567890update' })
      .end((err, res) => {
        expect(res.status).to.be.equal(400);
        done();
      });
  });

  it('Should fail on empty authorization header', (done) => {
    chai
      .request(app)
      .put('/api/users/password')
      .send({ password: '1234567890update' })
      .end((err, res) => {
        expect(res.status).to.be.equal(401);
        done();
      });
  });

  it('Should fail on empty token', (done) => {
    chai
      .request(app)
      .put('/api/users/password')
      .set('Authorization', 'Bearer ')
      .send({ password: '1234567890update' })
      .end((err, res) => {
        expect(res.status).to.be.equal(400);
        done();
      });
  });

  it('Should validate empty password', (done) => {
    chai
      .request(app)
      .put('/api/users/password')
      .set('Authorization', tokenResetPassword)
      .send({})
      .end((err, res) => {
        expect(res.status).to.be.equal(400);
        done();
      });
  });

  it('Should validate minimum password length', (done) => {
    chai
      .request(app)
      .put('/api/users/password')
      .set('Authorization', tokenResetPassword)
      .send({ password: '123' })
      .end((err, res) => {
        expect(res.status).to.be.equal(400);
        done();
      });
  });

  it('Should validate alphanumeric password', (done) => {
    chai
      .request(app)
      .put('/api/users/password')
      .set('Authorization', tokenResetPassword)
      .send({ password: '!@#$%' })
      .end((err, res) => {
        expect(res.status).to.be.equal(400);
        done();
      });
  });
});

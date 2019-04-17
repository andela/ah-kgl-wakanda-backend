import chai from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import Password from '../controllers/password';
import app from '../../app';
import mailer from '../helpers/mailer';

// Chai configuration
const { expect } = chai;
chai.use(chaiHttp);

const email = 'sigmacool@gmail.com';
let tokenResetPassword;
const authScheme = 'Bearer';

describe('mailer helper', () => {
  it('Should test mailer function', () => {
		expect(mailer).to.be.a('function');
		expect(mailer).to.be.a('function');
		
  });
});

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
        expect(res.body).to.have.property('data');
        expect(res.body).to.have.property('message');
        expect(res.body.data).to.have.property('email');
        expect(res.body.data).to.have.property('token');
        expect(res.body.data.email).equals(email);
        expect(res.body.message).equals('Reset Password email successfully delivered');
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
        expect(res.body).to.have.property('message');
        expect(res.body.message).equals('No user found with this email address');
        done();
      });
  });

  it('Should validate an empty body', (done) => {
    chai
      .request(app)
      .post('/api/users/reset_password')
      .send({})
      .end((err, res) => {
        expect(res.status).to.be.equal(400);
        expect(res.body).to.have.property('message');
        expect(res.body.message).equals('email is required');
        done();
      });
  });

  it('Should validate an empty email', (done) => {
    chai
      .request(app)
      .post('/api/users/reset_password')
      .send({
        email: ''
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(400);
        expect(res.body).to.have.property('message');
        expect(res.body.message).equals('email is not allowed to be empty');
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
        expect(res.body).to.have.property('message');
        expect(res.body.message).equals('email must be a valid email');
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
        expect(res.body).to.have.property('message');
        expect(res.body.message).equals('Password updated successfully');
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
        expect(res.body).to.have.property('message');
        expect(res.body.message).equals('New password must be different from the current');
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
        expect(res.body).to.have.property('message');
        expect(res.body.message).equals('The link appears to be invalid or already expired');
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
        expect(res.body).to.have.property('message');
        expect(res.body.message).equals('Not authorized to update password');
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
        expect(res.body).to.have.property('message');
        expect(res.body.message).equals('The password reset token is required');
        done();
      });
  });

  it('Should validate empty body', (done) => {
    chai
      .request(app)
      .put('/api/users/password')
      .set('Authorization', tokenResetPassword)
      .send({})
      .end((err, res) => {
        expect(res.status).to.be.equal(400);
        expect(res.body).to.have.property('message');
        expect(res.body.message).equals('password is required');
        done();
      });
  });

  it('Should validate empty password', (done) => {
    chai
      .request(app)
      .put('/api/users/password')
      .set('Authorization', tokenResetPassword)
      .send({
        password: ''
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(400);
        expect(res.body).to.have.property('message');
        expect(res.body.message).equals('password is not allowed to be empty');
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
        expect(res.body).to.have.property('message');
        expect(res.body.message).equals('password length must be at least 8 characters long');
        done();
      });
  });

  it('Should validate alphanumeric password', (done) => {
    chai
      .request(app)
      .put('/api/users/password')
      .set('Authorization', tokenResetPassword)
      .send({ password: '!@#$%moreandmore' })
      .end((err, res) => {
        expect(res.status).to.be.equal(400);
        expect(res.body).to.have.property('message');
        expect(res.body.message).equals('password must only contain alphanumeric characters');
        done();
      });
  });
});

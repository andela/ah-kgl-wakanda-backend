import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';

// Chai configuration
const { expect } = chai;
chai.use(chaiHttp);

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjEsImVtYWlsIjoia2FybEBnbWFpbC5jb20iLCJ1c2VybmFtZSI6ImthcmwiLCJpYXQiOjE1NTUzNTUzMjd9.h1fBD-ImlxwJhkYMxQeWNEONs1SvWB4lLTfobpW84PY';

describe('Enable the user to Sign out ', () => {
  it('Should sign the user out', (done) => {
    chai.request(app)
      .delete('/api/users/signout')
      .set('Authorization', `Bearer ${token}`)
      .end((error, res) => {
        expect(res.body.status).to.be.equal(200);
        expect(res.body).to.have.property('message');
        expect(res.body.message).equals('Successfully signs out.');
        done();
      });
  });
  it('Should not sign the user out when the token is invalid or does not exist', (done) => {
    chai.request(app)
      .delete('/api/users/signout')
      .set('Authorization', 'Bearer token')
      .end((error, res) => {
        expect(res.status).to.be.equal(401);
        expect(res).to.have.property('text');
        expect(res.text).equals('Unauthorized');
        done();
      });
  });
});

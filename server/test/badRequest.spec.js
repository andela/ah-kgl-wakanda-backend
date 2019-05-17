import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';

// Chai configuration
const { expect } = chai;
chai.use(chaiHttp);

describe('Bad request attempt', () => {
  it('Should return a bad request message', (done) => {
    chai
      .request(app)
      .post('/api/articles/bad/request')
      .end((err, res) => {
        expect(res.status).to.be.equal(400);
        expect(res.body.message).to.be.equals('Bad request');
        done();
      });
  });
});

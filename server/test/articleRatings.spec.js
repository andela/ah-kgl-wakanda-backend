import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';

// Chai configuration
const { expect } = chai;
chai.use(chaiHttp);

const slug = 'how-to-train-your-dragon';
// let tokenResetPassword;

describe('Fetch Ratings', () => {
  it('Should give an error message', (done) => {
    chai
      .request(app)
      .get(`/api/articles/${slug}+1/ratings`)
      .end((err, res) => {
        expect(res.status).to.be.equal(404);
        expect(res.body).to.have.property('message');
        done();
      });
  });

  it('Should fetch article rate per user who rated', (done) => {
    chai
      .request(app)
      .get(`/api/articles/${slug}/ratings`)
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.ratings).to.be.an('array');
        done();
      });
  });
});

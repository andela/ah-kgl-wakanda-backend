import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';
import { Rating } from '../models';

// Chai configuration
const { expect } = chai;
chai.use(chaiHttp);

const slug = 'how-to-train-your-dragon';
// let tokenResetPassword;

after(() => {
  Rating.destroy({ truncate: true });
});

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

  it('Should fetch article ratings with offset and limit queries', (done) => {
    chai
      .request(app)
      .get(`/api/articles/${slug}/ratings?offset=1&limit=2`)
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.body.ratings).to.be.an('array');
        expect(res.body.ratings.length).to.be.equals(2);
        done();
      });
  });
});

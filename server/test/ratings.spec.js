import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';
import { Rating } from '../models';

// Chai configuration
const { expect } = chai;
chai.use(chaiHttp);

const userId = 1;
const rate = 2;
const slug = 'how-to-train-your-dragon-177804958';
before(() => {
  Rating.destroy({ truncate: true });
});
describe('User Rate articles', () => {
  it('Should successfully create new rate on article', (done) => {
    chai
      .request(app)
      .post(`/api/articles/rate/${slug}`)
      .send({
        userId,
        rate,
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(201);
        done();
      });
  });

  it('Should successfully edit rate on article', (done) => {
    chai
      .request(app)
      .post(`/api/articles/rate/${slug}`)
      .send({
        userId,
        rate,
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        done();
      });
  });

  it('Should respond article not found', (done) => {
    chai
      .request(app)
      .post('/api/articles/rate/111-invalid-slug')
      .send({
        userId,
        rate,
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(404);
        done();
      });
  });

  it('Should validate invalid userId', (done) => {
    chai
      .request(app)
      .post(`/api/articles/rate/${slug}`)
      .send({
        userId: 'string',
        rate,
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(400);
        done();
      });
  });

  it('Should validate invalid rate', (done) => {
    chai
      .request(app)
      .post(`/api/articles/rate/${slug}`)
      .send({
        userId,
        rate: 'string',
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(400);
        done();
      });
  });

  it('Should validate empty body', (done) => {
    chai
      .request(app)
      .post(`/api/articles/rate/${slug}`)
      .end((err, res) => {
        expect(res.status).to.be.equal(400);
        done();
      });
  });

  it('Should validate min and max rate value', (done) => {
    chai
      .request(app)
      .post(`/api/articles/rate/${slug}`)
      .send({
        userId,
        rate: 10,
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(400);
        done();
      });
  });
  it('Should validate the slug', (done) => {
    chai
      .request(app)
      .post(`/api/articles/rate/${null}`)
      .send({
        userId,
        rate: 10,
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(400);
        done();
      });
  });
});

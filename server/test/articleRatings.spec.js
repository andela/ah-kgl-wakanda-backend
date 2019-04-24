import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';
import { Rating } from '../models';

// Chai configuration
const { expect } = chai;
chai.use(chaiHttp);

const slug = 'how-to-train-your-dragon';

const article = {
  title: 'How to train your dragon',
  description: 'Ever wonder how?',
  body: 'It takes a Jacobian',
  Tags: ['dragons', 'training']
};

const rate = async () => {
  try {
    const resp = await chai.request(app)
      .post('/api/articles')
      .set('Authorization', 'Bearer <token>')
      .send({ article });

    const { id } = resp.body.data.article;

    await Rating.create({
      articleId: id,
      rate: 3,
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    await Rating.create({
      articleId: id,
      rate: 4,
      userId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return resp.body.data.article;
  } catch (e) {
    return new Error(e.message);
  }
};

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

  it('Should fetch article ratings with offset and limit queries', async () => {
    try {
      const result = await rate();

      const res = await chai
        .request(app)
        .get(`/api/articles/${result.slug}/ratings?offset=0&limit=2`);

      expect(res.status).to.be.equal(200);
      expect(res.body.ratings).to.be.an('array');
      expect(res.body.ratings.length).to.be.equals(2);
    } catch (e) {
      return new Error(e.message);
    }
  });

  it('Should fail to fetch ratings', (done) => {
    chai
      .request(app)
      .get(`/api/articles/${slug}/ratings?offset=0&limit=o`)
      .end((err, res) => {
        expect(res.status).to.be.equal(400);
        expect(res.body.message).to.be.equals('limit must be a number');
        done();
      });
  });
});

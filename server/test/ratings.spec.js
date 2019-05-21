import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';
import { Rating } from '../models';

// Chai configuration
const { expect } = chai;
chai.use(chaiHttp);

const userId = 1;
const rate = 2;
const slug = 'how-to-dougie-177804958';

const article = {
  title: 'How to train your dragon',
  description: 'Ever wonder how?',
  body: 'It takes a Jacobian',
  Tags: ['dragons', 'training']
};

const rater = async () => {
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

before(() => {
  Rating.destroy({ truncate: true });
});


const user = {
  email: 'vera.iradu@andela.com',
  password: 'Hadad12@'
};

let userToken;
describe('logging a new user', () => {
  it('should be able to login', (done) => {
    chai.request(app)
      .post('/api/auth/login')
      .send(user)
      .end((err, res) => {
        userToken = `Bearer ${res.body.user.token}`;
        expect(res.status).to.equal(200);
        expect(res).to.be.an('object');
        expect(res.body).to.have.property('user');
        done();
      });
  });
});


describe('User Rate articles', () => {
  it('Should successfully create new rate on article', (done) => {
    chai
      .request(app)
      .post(`/api/articles/rate/${slug}`)
      .set('Authorization', userToken)
      .send({
        userId,
        rate,
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(201);
        expect(res.status).to.be.a('number');
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('data');
        expect(res.body).to.have.property('message');

        expect(res.body.data).to.have.property('id');
        expect(res.body.data).to.have.property('articleId');
        expect(res.body.data).to.have.property('rate');
        expect(res.body.data.rate).equals(rate);
        expect(res.body.data).to.have.property('createdAt');
        expect(res.body.data).to.have.property('updatedAt');

        expect(res.body.message).to.be.a('string');
        expect(res.body.message).equals('The article was successfully rated');
        done();
      });
  });

  it('Should successfully edit rate on article', (done) => {
    chai
      .request(app)
      .post(`/api/articles/rate/${slug}`)
      .set('Authorization', userToken)
      .send({
        userId,
        rate,
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(200);
        expect(res.status).to.be.a('number');
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('data');
        expect(res.body).to.have.property('message');

        expect(res.body.data).to.have.property('id');
        expect(res.body.data).to.have.property('articleId');
        expect(res.body.data).to.have.property('rate');
        expect(res.body.data.rate).equals(rate);
        expect(res.body.data).to.have.property('createdAt');
        expect(res.body.data).to.have.property('updatedAt');

        expect(res.body.message).to.be.a('string');
        expect(res.body.message).equals('The article rating was successfully edited');
        done();
      });
  });

  it('Should respond article not found', (done) => {
    chai
      .request(app)
      .post('/api/articles/rate/111-invalid-slug')
      .set('Authorization', userToken)
      .send({
        userId,
        rate,
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(404);
        expect(res.status).to.be.a('number');
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).equals('Article was not found');
        done();
      });
  });

  it('Should validate invalid userId', (done) => {
    chai
      .request(app)
      .post(`/api/articles/rate/${slug}`)
      .set('Authorization', userToken)
      .send({
        userId: 'string',
        rate,
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(400);
        expect(res.status).to.be.a('number');
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).equals('userId must be a number');
        done();
      });
  });

  it('Should validate empty userId', (done) => {
    chai
      .request(app)
      .post(`/api/articles/rate/${slug}`)
      .set('Authorization', userToken)
      .send({
        rate,
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(400);
        expect(res.status).to.be.a('number');
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).equals('userId is required');
        done();
      });
  });

  it('Should validate invalid rate', (done) => {
    chai
      .request(app)
      .post(`/api/articles/rate/${slug}`)
      .set('Authorization', userToken)
      .send({
        userId,
        rate: 'string',
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(400);
        expect(res.status).to.be.a('number');
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).equals('rate must be a number');
        done();
      });
  });

  it('Should validate empty rate', (done) => {
    chai
      .request(app)
      .post(`/api/articles/rate/${slug}`)
      .set('Authorization', userToken)
      .send({
        userId,
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(400);
        expect(res.status).to.be.a('number');
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).equals('rate is required');
        done();
      });
  });

  it('Should validate empty body', (done) => {
    chai
      .request(app)
      .post(`/api/articles/rate/${slug}`)
      .set('Authorization', userToken)
      .end((err, res) => {
        expect(res.status).to.be.equal(400);
        expect(res.status).to.be.a('number');
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).equals('rate is required');
        done();
      });
  });

  it('Should validate max rate value', (done) => {
    chai
      .request(app)
      .post(`/api/articles/rate/${slug}`)
      .set('Authorization', userToken)
      .send({
        userId,
        rate: 10,
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(400);
        expect(res.status).to.be.a('number');
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).equals('rate must be less than or equal to 5');
        done();
      });
  });

  it('Should validate min rate value', (done) => {
    chai
      .request(app)
      .post(`/api/articles/rate/${slug}`)
      .set('Authorization', userToken)
      .send({
        userId,
        rate: 0,
      })
      .end((err, res) => {
        expect(res.status).to.be.equal(400);
        expect(res.status).to.be.a('number');
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('message');
        expect(res.body.message).equals('rate must be larger than or equal to 1');
        done();
      });
  });

  it('Should fetch article ratings with offset and limit queries', async () => {
    try {
      const result = await rater();

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

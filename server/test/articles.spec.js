import chai from 'chai';
import chaiHttp from 'chai-http';
import { Article } from '../models';
import app from '../../app';

// Chai configuration
const { expect } = chai;
chai.use(chaiHttp);

const article = {
  title: 'How to train your dragon',
  description: 'Ever wonder how?',
  body: 'It takes a Jacobian',
  Tags: ['dragons', 'training']
};

const badArticle = {
  title: 'How to train your dragon',
  description: 'Ever wonder how?',
  body: 'It takes a Jacobian',
  images: ['image.jpg'],
  Tags: ['dragons', 'training']
};

const user = [{
  username: 'vera',
  email: 'vera.iradu@andela.com',
  password: 'Hadad12@'
},
{
  email: 'vera.iradu@andela.com',
  password: 'Hadad12@'
}];

let userToken;
const slug = ['how-to-train-your-dragon', 'how-to-train-your-cat'];

after(() => {
  Article.destroy({ truncate: true });
  // Users.destroy({ truncate: true });
});

describe('Signing up a new user', () => {
  it('should be able to signup', (done) => {
    chai.request(app)
      .post('/api/auth/signup')
      .send(user[0])
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res).to.be.an('object');
        expect(res.body).to.have.property('user');
        done();
      });
  });
});

describe('logging a new user', () => {
  it('should be able to login', (done) => {
    chai.request(app)
      .post('/api/auth/login')
      .send(user[1])
      .end((err, res) => {
        userToken = `Bearer ${res.body.user.token}`;
        expect(res.status).to.equal(200);
        expect(res).to.be.an('object');
        expect(res.body).to.have.property('user');
        done();
      });
  });
});

describe('Article endpoints', () => {
  describe('The endpoint to create an article', () => {
    it('Should create an article', (done) => {
      chai.request(app)
        .post('/api/articles')
        .set('Authorization', 'Bearer <token>')
        .send({ article })
        .end((error, res) => {
          expect(res.body.status).to.be.equal(201);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('article');
          expect(res.body.data.article).to.have.property('title');
          expect(res.body.data.article.title).equals('How to train your dragon');
          done();
        });
    });

    it('Should return a sequelize validation error', (done) => {
      chai.request(app)
        .post('/api/articles')
        .set('Authorization', 'Bearer <token>')
        .send({ article: badArticle })
        .end((error, res) => {
          expect(res.body.status).to.be.equal(400);
          expect(res.body.message).to.equals('Validation error: Validation is on images failed');
          done();
        });
    });

    it('Should return a validation error', (done) => {
      chai.request(app)
        .post('/api/articles')
        .set('Authorization', 'Bearer <token>')
        .send({ bad: 'request' })
        .end((error, res) => {
          expect(res.body.status).to.be.equal(400);
          expect(res.body.message).equals('bad is not allowed');
          done();
        });
    });
  });

  describe('The endpoint to get articles', () => {
    it('Should get articles', (done) => {
      chai.request(app)
        .get('/api/articles')
        .set('Authorization', 'Bearer <token>')
        .send({ article })
        .end((error, res) => {
          expect(res.body.status).to.be.equal(200);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('articles');
          expect(res.body.data.articles).to.be.an('array');
          done();
        });
    });

    it('Should return offset must be a number', (done) => {
      chai.request(app)
        .get('/api/articles?offset=')
        .set('Authorization', 'Bearer <token>')
        .send({ article })
        .end((error, res) => {
          expect(res.status).to.be.equal(400);
          expect(res.status).to.be.a('number');
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.be.a('string');
          expect(res.body.message).equals('offset must be a number');
          done();
        });
    });

    it('Should return offset must be an integer', (done) => {
      chai.request(app)
        .get('/api/articles?offset=1.2')
        .set('Authorization', 'Bearer <token>')
        .send({ article })
        .end((error, res) => {
          expect(res.status).to.be.equal(400);
          expect(res.status).to.be.a('number');
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.be.a('string');
          expect(res.body.message).equals('offset must be an integer');
          done();
        });
    });

    it('Should validate offset minimum', (done) => {
      chai.request(app)
        .get('/api/articles?offset=-1')
        .set('Authorization', 'Bearer <token>')
        .send({ article })
        .end((error, res) => {
          expect(res.status).to.be.equal(400);
          expect(res.status).to.be.a('number');
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.be.a('string');
          expect(res.body.message).equals('offset must be larger than or equal to 0');
          done();
        });
    });

    it('Should return limit must be a number', (done) => {
      chai.request(app)
        .get('/api/articles?limit=')
        .set('Authorization', 'Bearer <token>')
        .send({ article })
        .end((error, res) => {
          expect(res.status).to.be.equal(400);
          expect(res.status).to.be.a('number');
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.be.a('string');
          expect(res.body.message).equals('limit must be a number');
          done();
        });
    });

    it('Should return limit must be an integer', (done) => {
      chai.request(app)
        .get('/api/articles?limit=1.2')
        .set('Authorization', 'Bearer <token>')
        .send({ article })
        .end((error, res) => {
          expect(res.status).to.be.equal(400);
          expect(res.status).to.be.a('number');
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.be.a('string');
          expect(res.body.message).equals('limit must be an integer');
          done();
        });
    });

    it('Should validate limit minimum', (done) => {
      chai.request(app)
        .get('/api/articles?limit=0')
        .set('Authorization', 'Bearer <token>')
        .send({ article })
        .end((error, res) => {
          expect(res.status).to.be.equal(400);
          expect(res.status).to.be.a('number');
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.be.a('string');
          expect(res.body.message).equals('limit must be larger than or equal to 1');
          done();
        });
    });

    it('Should validate limit maximum', (done) => {
      chai.request(app)
        .get('/api/articles?limit=40')
        .set('Authorization', 'Bearer <token>')
        .send({ article })
        .end((error, res) => {
          expect(res.status).to.be.equal(400);
          expect(res.status).to.be.a('number');
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.be.a('string');
          expect(res.body.message).equals('limit must be less than or equal to 20');
          done();
        });
    });

    it('Should display one article only', (done) => {
      chai.request(app)
        .get('/api/articles?limit=1')
        .set('Authorization', 'Bearer <token>')
        .send({ article })
        .end((error, res) => {
          expect(res.body.status).to.be.equal(200);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('articles');
          expect(res.body.data.articles).to.be.an('array');
          expect(res.body.data.articles).lengthOf(1);
          done();
        });
    });
  });

  describe('The endpoint to get a single article', () => {
    it('Should get a single article ', (done) => {
      chai.request(app)
        .get(`/api/articles/${slug[1]}`)
        .set('Authorization', 'Bearer <token>')
        .send({ article })
        .end((error, res) => {
          expect(res.body.status).to.be.equal(200);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('article');
          expect(res.body.data.article).to.be.an('object');
          done();
        });
    });

    it('Should fail to get an article that does not exist ', (done) => {
      chai.request(app)
        .get('/api/articles/wrong_slug')
        .set('Authorization', 'Bearer <token>')
        .send({ article })
        .end((error, res) => {
          expect(res.body.status).to.be.equal(404);
          expect(res.body.message).to.be.equals('Article not found');
          done();
        });
    });

    it('Should return article not found', (done) => {
      chai.request(app)
        .get('/api/articles/slug-doesnt-exist')
        .set('Authorization', 'Bearer <token>')
        .send({ article })
        .end((error, res) => {
          expect(res.body.status).to.be.equal(404);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.be.an('string');
          expect(res.body.message).to.be.equals('Article not found');
          done();
        });
    });
  });

  describe('The endpoint to update an article', () => {
    it('Should update an article ', (done) => {
      chai.request(app)
        .put(`/api/articles/${slug[0]}`)
        .set('Authorization', 'Bearer <token>')
        .send({ article: { title: 'new title' } })
        .end((error, res) => {
          expect(res.body.status).to.be.equal(200);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('article');
          expect(res.body.data.article).to.be.an('object');
          expect(res.body.data.article.title).equals('new title');
          done();
        });
    });

    it('Should fail to update an article ', (done) => {
      chai.request(app)
        .put('/api/articles/wrong-slug')
        .set('Authorization', 'Bearer <token>')
        .send({ article: { title: 'My article', description: 'new description' } })
        .end((error, res) => {
          expect(res.body.status).to.be.equal(404);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equals('Article not found');
          done();
        });
    });
  });

  // Bookmarking an article
  describe('Bookmarking', () => {
    // Bookmarking without token

    it('Should not bookmark the article', (done) => {
      chai.request(app)
        .post(`/api/articles/${slug[0]}/bookmark`)
        .send({})
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.message).to.equal('Authorization is missing');
          done();
        });
    });

    // Bookmarking the right article

    it('Should successfully bookmark an article', (done) => {
      chai.request(app)
        .post(`/api/articles/${slug[1]}/bookmark`)
        .set('Content-Type', 'application/json')
        .set('Authorization', userToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('Successfully bookmarked the article');
          expect(res.body).to.have.property('article');
          expect(res.body.article).to.have.property('slug');
          done();
        });
    });
    // User view of bookmarks

    it('Should allow the user to view all the article bookmarked', (done) => {
      chai.request(app)
        .get('/api/articles/bookmark')
        .set('Content-Type', 'application/json')
        .set('Authorization', userToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('articles').be.an('array');
          done();
        });
    });

    // Should not bookmark the article for the second time

    it('Should not bookmark the article for the second time', (done) => {
      chai.request(app)
        .post(`/api/articles/${slug[1]}/bookmark`)
        .set('Content-Type', 'application/json')
        .set('Authorization', userToken)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.message).to.equal('The article is already bookmarked');
          done();
        });
    });

    // Test of unfound bookmark

    it('Should not find the article to bookmark', (done) => {
      chai.request(app)
        .post('/api/articles/non-existing-article/bookmark')
        .set('Content-Type', 'application/json')
        .set('Authorization', userToken)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('Article is not found.');
          done();
        });
    });

    // Unbookmark the bookmarked article

    it('Should successfully unbookmark the article', (done) => {
      chai.request(app)
        .delete(`/api/articles/${slug[1]}/bookmark`)
        .set('Content-Type', 'application/json')
        .set('Authorization', userToken)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.message).to.equal('Successfully unbookmarked the article');
          expect(res.body).to.have.property('article');
          done();
        });
    });

    // Unbookmark the unbookmarked article

    it('Should not unbookmark the unbookmarked article', (done) => {
      chai.request(app)
        .delete(`/api/articles/${slug[1]}/bookmark`)
        .set('Content-Type', 'application/json')
        .set('Authorization', userToken)
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.message).to.equal('This article is not bookmarked');
          done();
        });
    });
    describe('The endpoint to delete an article', () => {
      it('Should delete an article ', (done) => {
        chai.request(app)
          .delete(`/api/articles/${slug[1]}`)
          .set('Authorization', 'Bearer <token>')
          .end((error, res) => {
            expect(res.body.status).to.be.equal(200);
            expect(res.body.message).to.equals('Article successfully deleted');
            done();
          });
      });

      it('Should fail to delete an article ', (done) => {
        chai.request(app)
          .delete('/api/articles/wrong-slug')
          .set('Authorization', 'Bearer <token>')
          .end((error, res) => {
            expect(res.body.status).to.be.equal(404);
            expect(res.body.message).to.equals('Article not found');
            done();
          });
      });
    });
  });
});

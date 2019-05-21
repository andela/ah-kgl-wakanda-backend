import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';
import dummyUsers from './config/users';

// Chai configuration
const { expect } = chai;
chai.use(chaiHttp);

const article = {
  title: 'How to train your dragon',
  description: 'Ever wonder how?',
  body: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
  Tags: ['dragons', 'training']
};

let loginToken;
let highlightId;
describe('Create article for highlight', () => {
  it('Should create an article', (done) => {
    chai.request(app)
      .post('/api/auth/signup')
      .send(dummyUsers.correctCreateHighligh)
      .end((err, resp) => {
        loginToken = `Bearer ${resp.body.user.token}`;
        chai.request(app)
          .post('/api/articles')
          .set('Authorization', `Bearer ${resp.body.user.token}`)
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
  });
});

describe('Highlight', () => {
  describe('Post a comment on highlighted text', () => {
    it('should post a comment on highlighted text', (done) => {
      chai.request(app)
        .post('/api/articles/how-to-dougie-177804958/highlights?start=3&end=10')
        .set('Content-Type', 'application/json')
        .set('Authorization', loginToken)
        .send({ comment: 'this is a comment' })
        .end((error, res) => {
          highlightId = res.body.highlight.id;
          expect(res.body.status).to.be.equal(201);
          expect(res.body).to.have.property('highlight');
          expect(res.body.highlight.start).to.be.equal(3);
          expect(res.body.highlight.end).to.be.equal(10);
          done();
        });
    });
    it('should post a comment on highlighted text when the end index is greater than the length of the body', (done) => {
      chai.request(app)
        .post('/api/articles/how-to-dougie-177804958/highlights?start=3&end=10000')
        .set('Content-Type', 'application/json')
        .set('Authorization', loginToken)
        .send({ comment: 'this is a comment' })
        .end((error, res) => {
          expect(res.body.status).to.be.equal(400);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.be.equal('Please, provide a valid end endex');
          done();
        });
    });
    it('should not post a comment on highlighted text when the article slug is not found', (done) => {
      chai.request(app)
        .post('/api/articles/how-to-dougie-17048/highlights?start=3&end=10000')
        .set('Content-Type', 'application/json')
        .set('Authorization', loginToken)
        .send({ comment: 'this is a comment' })
        .end((error, res) => {
          expect(res.body.status).to.be.equal(404);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.be.equal('Article is not found.');
          done();
        });
    });
  });
  describe('Get all highlights on an article', () => {
    it('should get all highlights on an article', (done) => {
      chai.request(app)
        .get('/api/articles/how-to-dougie-177804958/highlights')
        .set('Content-Type', 'application/json')
        .set('Authorization', loginToken)
        .end((error, res) => {
          expect(res.body.status).to.be.equal(200);
          expect(res.body).to.have.property('highlights');
          expect(res.body.highlights).to.be.an('array');
          expect(res.body.highlights[0]).to.have.property('Comment');
          done();
        });
    });
    it('should not post a comment on highlighted text when the article slug is not found', (done) => {
      chai.request(app)
        .get('/api/articles/how-to-dougie-17048/highlights')
        .set('Content-Type', 'application/json')
        .set('Authorization', loginToken)
        .end((error, res) => {
          expect(res.body.status).to.be.equal(404);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.be.equal('Article is not found.');
          done();
        });
    });
  });
  describe('Get one highlight on an article', () => {
    it('should get the highlight on an article', (done) => {
      chai.request(app)
        .get(`/api/articles/how-to-dougie-177804958/highlights/${highlightId}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', loginToken)
        .end((error, res) => {
          expect(res.body.status).to.be.equal(200);
          expect(res.body).to.have.property('highlight');
          expect(res.body.highlight.id).to.be.equal(highlightId);
          expect(res.body.highlight).to.have.property('Comment');
          done();
        });
    });
    it('should not get the highlight when its id is not found', (done) => {
      chai.request(app)
        .get(`/api/articles/how-to-dougie-177804958/highlights/${highlightId + 20}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', loginToken)
        .end((error, res) => {
          expect(res.body.status).to.be.equal(404);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.be.equal('Highlight not found');
          done();
        });
    });
    it('should not get the highlight when the article slug is not found', (done) => {
      chai.request(app)
        .get(`/api/articles/how-to-dougie-17048/highlights/${highlightId}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', loginToken)
        .end((error, res) => {
          expect(res.body.status).to.be.equal(404);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.be.equal('Article is not found.');
          done();
        });
    });
  });
  describe('Update one highlight on an article', () => {
    it('should update the highlight on an article', (done) => {
      chai.request(app)
        .put(`/api/articles/how-to-dougie-177804958/highlights/${highlightId}?start=2&end=15`)
        .set('Content-Type', 'application/json')
        .set('Authorization', loginToken)
        .send({ comment: 'this is the comment updated' })
        .end((error, res) => {
          expect(res.body.status).to.be.equal(200);
          expect(res.body).to.have.property('highlight');
          expect(res.body.highlight.id).to.be.equal(highlightId);
          expect(res.body.highlight).to.have.property('text');
          expect(res.body.highlight.start).to.be.equal(2);
          expect(res.body.highlight.end).to.be.equal(15);
          done();
        });
    });
    it('should not update the highlight when its id is not found', (done) => {
      chai.request(app)
        .put(`/api/articles/how-to-dougie-177804958/highlights/${highlightId + 20}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', loginToken)
        .end((error, res) => {
          expect(res.body.status).to.be.equal(404);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.be.equal('Highlight not found');
          done();
        });
    });
    it('should not update the highlight when the article slug is not found', (done) => {
      chai.request(app)
        .put(`/api/articles/how-to-dougie4958/highlights/${highlightId}?start=2&end=15`)
        .set('Content-Type', 'application/json')
        .set('Authorization', loginToken)
        .end((error, res) => {
          expect(res.body.status).to.be.equal(404);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.be.equal('Article is not found.');
          done();
        });
    });
    it('should not update a comment on highlighted text when the end index is greater than the length of the body', (done) => {
      chai.request(app)
        .put(`/api/articles/how-to-dougie-177804958/highlights/${highlightId}?start=2&end=10000`)
        .set('Content-Type', 'application/json')
        .set('Authorization', loginToken)
        .send({ comment: 'this is a comment' })
        .end((error, res) => {
          expect(res.body.status).to.be.equal(400);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.be.equal('Please, provide a valid end index');
          done();
        });
    });
  });
  describe('Delete one highlight on an article', () => {
    it('should not delete the highlight when its id is not found', (done) => {
      chai.request(app)
        .delete(`/api/articles/how-to-dougie-177804958/highlights/${highlightId + 20}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', loginToken)
        .end((error, res) => {
          expect(res.body.status).to.be.equal(404);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.be.equal('Highlight not found');
          done();
        });
    });
    it('should not delete the highlight when the article slug is not found', (done) => {
      chai.request(app)
        .delete(`/api/articles/how-to-dodugie-177804958/highlights/${highlightId}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', loginToken)
        .end((error, res) => {
          expect(res.body.status).to.be.equal(404);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.be.equal('Article is not found.');
          done();
        });
    });
    it('should update the highlight on an article', (done) => {
      chai.request(app)
        .delete(`/api/articles/how-to-dougie-177804958/highlights/${highlightId}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', loginToken)
        .end((error, res) => {
          expect(res.body.status).to.be.equal(200);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.be.equal('Highlight deleted successfully');
          done();
        });
    });
  });
});

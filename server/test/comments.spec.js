import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';
import dummyUsers from './config/users';
import Database from './config';

// Chai configuration
const { expect } = chai;
chai.use(chaiHttp);

let loginToken;
let commentId;

const comment = {
  body: 'Good job',
};
const commentWithoutBody = {
  body: '',
};

describe('Comments endpoints ', () => {
  after(async () => {
    await Database.truncateUser();
    await Database.truncateComment();
  });
  describe('The endpoint to post a comment', () => {
    it('Should post a comment', (done) => {
      chai.request(app)
        .post('/api/auth/signup')
        .send(dummyUsers.correct)
        .end((err, resp) => {
          loginToken = `Bearer ${resp.body.user.token}`;
          chai.request(app)
            .post('/api/articles/how-to-dougie-177804958/comments')
            .set('Content-Type', 'application/json')
            .set('Authorization', `Bearer ${resp.body.user.token}`)
            .send({ comment })
            .end((error, res) => {
              commentId = res.body.data.comment.id;
              expect(res.body.status).to.be.equal(201);
              expect(res.body).to.have.property('data');
              expect(res.body.data.comment.body).equals('Good job');
              done();
            });
        });
    });
    it('Should not post a comment with an empty body', (done) => {
      chai.request(app)
        .post('/api/articles/how-to-dougie-177804958/comments')
        .set('Content-Type', 'application/json')
        .set('Authorization', loginToken)
        .send({ comment: commentWithoutBody })
        .end((error, res) => {
          expect(res.body.status).to.be.equal(400);
          expect(res.body).to.have.property('message');
          expect(res.body.message).equals('body is not allowed to be empty');
          done();
        });
    });
    it('Should not post a comment when the the slug is not found', (done) => {
      chai.request(app)
        .post('/api/articles/how-to-dougie-177804958a/comments')
        .set('Content-Type', 'application/json')
        .set('Authorization', loginToken)
        .send({ comment })
        .end((error, res) => {
          expect(res.body.status).to.be.equal(404);
          expect(res.body).to.have.property('message');
          expect(res.body.message).equals('Article is not found.');
          done();
        });
    });
    it('Should not post a comment without body', (done) => {
      chai.request(app)
        .post('/api/articles/how-to-dougie-177804958/comments')
        .set('Content-Type', 'application/json')
        .set('Authorization', loginToken)
        .end((error, res) => {
          expect(res.body.status).to.be.equal(500);
          expect(res.body).to.have.property('message');
          expect(res.body.message).equals("Cannot read property 'body' of undefined");
          done();
        });
    });
    it('Should not post a comment without Authorization', (done) => {
      chai.request(app)
        .post('/api/articles/how-to-dougie-177804958/comments')
        .set('Content-Type', 'application/json')
        .send({ comment })
        .end((error, res) => {
          expect(res.body.status).to.be.equal(401);
          expect(res.body).to.have.property('message');
          expect(res.body.message).equals('Authorization is missing');
          done();
        });
    });
  });

  describe('Endpoint to get all comments for an article', () => {
    it('should get all comment for one article', (done) => {
      chai.request(app)
        .get('/api/articles/how-to-dougie-177804958/comments')
        .set('Content-Type', 'application/json')
        .end((error, res) => {
          expect(res.body.status).to.be.equal(200);
          expect(res.body).to.have.property('data');
          expect(res.body.data.comments).to.be.an('array');
          expect(res.body.data.comments.length).to.be.equal(1);
          done();
        });
    });
  });
  describe('Endpoint to delete a comment', () => {
    it('should delete a comment', (done) => {
      chai.request(app)
        .delete(`/api/articles/how-to-dougie-177804958/comments/${commentId}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', loginToken)
        .end((error, res) => {
          expect(res.body.status).to.be.equal(200);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.be.equal('Comment successfully deleted');
          done();
        });
    });
    it('should not delete a comment when its id does not exist', (done) => {
      chai.request(app)
        .delete(`/api/articles/how-to-dougie-177804958/comments/${commentId + 1}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', loginToken)
        .end((error, res) => {
          expect(res.body.status).to.be.equal(404);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.be.equal('Comment not found');
          done();
        });
    });
  });
});

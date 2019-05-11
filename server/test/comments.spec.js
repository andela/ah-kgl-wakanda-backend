import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';
import dummyUsers from './config/users';

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
  describe('The endpoint to post a comment', () => {
    it('Should post a comment', (done) => {
      chai.request(app)
        .post('/api/auth/signup')
        .send(dummyUsers.correctUserForComment)
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
          expect(res.body.data.commentsCount).to.be.equal(1);
          done();
        });
    });
    it('should not get all comment when the slug does not exist', (done) => {
      chai.request(app)
        .get('/api/articles/how-to-dougie-1774958/comments')
        .set('Content-Type', 'application/json')
        .end((error, res) => {
          expect(res.body.status).to.be.equal(404);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.be.equal('Article is not found.');
          done();
        });
    });
  });
  describe('Enpoint to like a comment', () => {
    it('should like the comment', (done) => {
      chai.request(app)
        .post(`/api/articles/how-to-dougie-177804958/comments/${commentId}/favorite`)
        .set('Content-Type', 'application/json')
        .set('Authorization', loginToken)
        .end((error, res) => {
          expect(res.body.status).to.be.equal(200);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('comment');
          expect(res.body.data.comment).to.have.property('body');
          expect(res.body.data.comment.body).equals('Good job');
          expect(res.body.data.comment).to.have.property('userId');
          expect(res.body.data.comment).to.have.property('articleId');
          expect(res.body.data.comment).to.have.property('favorited');
          expect(res.body.data.comment.favorited).equals(true);
          done();
        });
    });
    it('should unLike the comment', (done) => {
      chai.request(app)
        .delete(`/api/articles/how-to-dougie-177804958/comments/${commentId}/favorite`)
        .set('Content-Type', 'application/json')
        .set('Authorization', loginToken)
        .end((error, res) => {
          expect(res.body.status).to.be.equal(200);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.have.property('comment');
          expect(res.body.data.comment).to.have.property('body');
          expect(res.body.data.comment.body).equals('Good job');
          expect(res.body.data.comment).to.have.property('userId');
          expect(res.body.data.comment).to.have.property('articleId');
          expect(res.body.data.comment).to.have.property('favorited');
          expect(res.body.data.comment.favorited).equals(false);
          done();
        });
    });
  });
  describe('Enpoint to update a comment', () => {
    it('should update the comment', (done) => {
      chai.request(app)
        .put(`/api/articles/how-to-dougie-177804958/comments/${commentId}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', loginToken)
        .send({ comment })
        .end((error, res) => {
          expect(res.body.status).to.be.equal(200);
          expect(res.body).to.have.property('data');
          expect(res.body.data.comment.body).equals('Good job');
          done();
        });
    });
    it('should not update a comment when its id does not exist', (done) => {
      chai.request(app)
        .put(`/api/articles/how-to-dougie-177804958/comments/${commentId + 1}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', loginToken)
        .send({ comment })
        .end((error, res) => {
          expect(res.body.status).to.be.equal(404);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.be.equal('Comment not found');
          done();
        });
    });
    it('should not update a comment when the slug does not exist', (done) => {
      chai.request(app)
        .put(`/api/articles/how-to-dougie-1778958/comments/${commentId}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', loginToken)
        .send({ comment })
        .end((error, res) => {
          expect(res.body.status).to.be.equal(404);
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.be.equal('Article is not found.');
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
    it('should not delete a comment when the slug is not found', (done) => {
      chai.request(app)
        .delete(`/api/articles/how-to-dougie-1804958/comments/${commentId}`)
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
});

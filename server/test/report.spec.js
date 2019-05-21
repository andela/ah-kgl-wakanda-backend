import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';
import dummyUsers from './config/users';
import { User } from '../models';

// Chai configuration
const { expect } = chai;
chai.use(chaiHttp);

let loginToken;
let adminToken;
let reportId;

const report = {
  type: 'Plagiarism',
  message: 'This article has been wrote by another authorThis article has been wrote by another authorThis article has been wrote by another authorThis article has been wrote by another authorThis article has been wrote by another authorThis article has been wrote by another authorThis article has been wrote by another author'
};

describe('Report endpoints', () => {
  describe('signin the admin', () => {
    it('should login the admin', (done) => {
      chai.request(app)
        .post('/api/auth/login')
        .send({
          email: 'karlmusingo@gmail.com',
          password: 'My_password12',
        })
        .end(async (err, res) => {
          adminToken = `Bearer ${res.body.user.token}`;
          done();
        });
    });
  });
  describe('The endpoint to post a report', () => {
    it('Should post a report', (done) => {
      chai.request(app)
        .post('/api/auth/signup')
        .send(dummyUsers.correctUserForReport)
        .end((err, resp) => {
          loginToken = `Bearer ${resp.body.user.token}`;
          chai.request(app)
            .post('/api/articles/how-to-dougie-177804958/report')
            .set('Content-Type', 'application/json')
            .set('Authorization', loginToken)
            .send(report)
            .end((error, res) => {
              reportId = res.body.data.id;
              expect(res.body.status).to.be.equal(201);
              expect(res.body).to.have.property('data');
              expect(res.body.data.type).equals('Plagiarism');
              done();
            });
        });
    });
    it('Should not post the same report twice from the same reporter and to the same article', (done) => {
      chai.request(app)
        .post('/api/articles/how-to-dougie-177804958/report')
        .set('Content-Type', 'application/json')
        .set('Authorization', loginToken)
        .send(report)
        .end((error, res) => {
          expect(res.body.status).to.be.equal(400);
          expect(res.body).to.have.property('data');
          expect(res.body.data.type).equals('Plagiarism');
          done();
        });
    });
    it('Should not post a report on article which does not exist', (done) => {
      chai.request(app)
        .post('/api/articles/how-to-dougi-1704958/report')
        .set('Content-Type', 'application/json')
        .set('Authorization', loginToken)
        .send(report)
        .end((error, res) => {
          expect(res.body.status).to.be.equal(404);
          expect(res.body).to.have.property('message');
          expect(res.body.message).equals('Article is not found.');
          done();
        });
    });
  });
  describe('The endpoint to get all reported articles', () => {
    it('Should get all reported articles', (done) => {
      chai.request(app)
        .get('/api/articles/report')
        .set('Content-Type', 'application/json')
        .set('Authorization', adminToken)
        .end((error, res) => {
          expect(res.body.status).to.be.equal(200);
          expect(res.body).to.have.property('articles');
          expect(res.body.articles.length).equals(1);
          done();
        });
    });
  });
  describe('The endpoint to get one reported article', () => {
    it('Should get the reported article', (done) => {
      chai.request(app)
        .get('/api/articles/how-to-dougie-177804958/report')
        .set('Content-Type', 'application/json')
        .set('Authorization', adminToken)
        .end((error, res) => {
          expect(res.body.status).to.be.equal(200);
          expect(res.body).to.have.property('article');
          expect(res.body.article).to.have.property('Reports');
          expect(res.body.article.slug).equals('how-to-dougie-177804958');
          done();
        });
    });
    it('Should not get the article when it is not reported', (done) => {
      chai.request(app)
        .get('/api/articles/how-to-train-your-dragon-177804958/report')
        .set('Content-Type', 'application/json')
        .set('Authorization', adminToken)
        .end((error, res) => {
          expect(res.body.status).to.be.equal(404);
          expect(res.body).to.have.property('message');
          expect(res.body.message).equals('No report for this article');
          done();
        });
    });
    it('Should not get the article when it does not exist', (done) => {
      chai.request(app)
        .get('/api/articles/how-to-train-your-drn-177804958/report')
        .set('Content-Type', 'application/json')
        .set('Authorization', adminToken)
        .end((error, res) => {
          expect(res.body.status).to.be.equal(404);
          expect(res.body).to.have.property('message');
          expect(res.body.message).equals('Article is not found.');
          done();
        });
    });
  });
  describe('The endpoint to get one report of an article', () => {
    it('Should get one report for an article', (done) => {
      chai.request(app)
        .get(`/api/articles/how-to-dougie-177804958/report/${reportId}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', adminToken)
        .end((error, res) => {
          expect(res.body.status).to.be.equal(200);
          expect(res.body).to.have.property('report');
          expect(res.body.report).to.have.property('Article');
          expect(res.body.report.id).equals(reportId);
          done();
        });
    });
    it('Should not get a report which does not exist', (done) => {
      chai.request(app)
        .get(`/api/articles/how-to-dougie-177804958/report/${reportId + 1}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', adminToken)
        .end((error, res) => {
          expect(res.body.status).to.be.equal(404);
          expect(res.body).to.have.property('message');
          expect(res.body.message).equals('Report not found');
          done();
        });
    });
    it('Should not get a report of an article which does not exist', (done) => {
      chai.request(app)
        .get(`/api/articles/how-to-dougie77804958/report/${reportId + 1}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', adminToken)
        .end((error, res) => {
          expect(res.body.status).to.be.equal(404);
          expect(res.body).to.have.property('message');
          expect(res.body.message).equals('Article is not found.');
          done();
        });
    });
  });
  describe('The endpoint to delete one report of an article', () => {
    it('Should delete the report for an article', (done) => {
      chai.request(app)
        .delete(`/api/articles/how-to-dougie-177804958/report/${reportId}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', loginToken)
        .end((error, res) => {
          console.log(res.body);

          expect(res.body.status).to.be.equal(200);
          expect(res.body).to.have.property('message');
          expect(res.body.message).equals('Report successfully deleted');
          done();
        });
    });
    it('Should not delete a report which does not exist', (done) => {
      chai.request(app)
        .delete(`/api/articles/how-to-dougie-177804958/report/${reportId + 1}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', loginToken)
        .end((error, res) => {
          expect(res.body.status).to.be.equal(404);
          expect(res.body).to.have.property('message');
          expect(res.body.message).equals('Report not found');
          done();
        });
    });
    it('Should not delete a report of an article which does not exist', (done) => {
      chai.request(app)
        .delete(`/api/articles/how-to-doie-177804958/report/${reportId + 1}`)
        .set('Content-Type', 'application/json')
        .set('Authorization', loginToken)
        .end((error, res) => {
          expect(res.body.status).to.be.equal(404);
          expect(res.body).to.have.property('message');
          expect(res.body.message).equals('Article is not found.');
          done();
        });
    });
  });
  describe('The endpoint to delete a reported article', () => {
    it('Should not delete an article which is not reported', (done) => {
      chai.request(app)
        .delete('/api/articles/how-to-dougie-177804958/report')
        .set('Content-Type', 'application/json')
        .set('Authorization', adminToken)
        .end((error, res) => {
          expect(res.body.status).to.be.equal(404);
          expect(res.body).to.have.property('message');
          expect(res.body.message).equals('The article is not reported');
          done();
        });
    });
    it('Should delete the reported article', (done) => {
      chai.request(app)
        .post('/api/articles/how-to-dougie-177804958/report')
        .set('Content-Type', 'application/json')
        .set('Authorization', loginToken)
        .send(report)
        .end(() => {
          chai.request(app)
            .delete('/api/articles/how-to-dougie-177804958/report')
            .set('Content-Type', 'application/json')
            .set('Authorization', adminToken)
            .end((error, res) => {
              expect(res.body.status).to.be.equal(200);
              expect(res.body).to.have.property('message');
              expect(res.body.message).equals('Article successfully deleted');
              done();
            });
        });
    });
    it('Should not delete an article which does not exist', (done) => {
      chai.request(app)
        .delete('/api/articles/how-to-dougie54-177804958/report')
        .set('Content-Type', 'application/json')
        .set('Authorization', adminToken)
        .end((error, res) => {
          expect(res.body.status).to.be.equal(404);
          expect(res.body).to.have.property('message');
          expect(res.body.message).equals('Article is not found.');
          done();
        });
    });
  });
});

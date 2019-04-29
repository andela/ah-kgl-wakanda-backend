// import chai from 'chai';
// import chaiHttp from 'chai-http';
// import dummyUsers from './config/users';
// import app from '../../app';

// const { expect } = chai;
// chai.use(chaiHttp);

// describe('User', () => {
//   let userToken;
//   before((done) => {
//     chai.request(app)
//       .post('/api/auth/signin')
//       .send(dummyUsers.withoutUsername)
//       .end((err, res) => {
//         userToken = `Bearer ${res.body.user.token}`;
//         done();
//       });
//   });

//   describe('follow a user', () => {
//     it('should successfully allow to follow a user', (done) => {
//       chai.request(app)
//         .post('/profiles/mutombo/follow')
//         .set('Content-Type', 'application/json')
//         .set('Authorization', userToken)
//         .send('mutombo')
//         .end((err, res) => {
//           expect(res.status).to.equal(201);
//           expect(res.body.message).to.equal('Dusmel successfully followed Mutombo');
//           done();
//         });
//     });
//     //     it('should not succeed when article wasnt found', (done) => {
//     //       chai.request(app)
//     //         .post('/api/articles/how-to-train-your-177804958/favorite')
//     //         .set('Content-Type', 'application/json')
//     //         .set('Authorization', userToken)
//     //         .send(dummyUsers.correctLikeArticle)
//     //         .end((err, res) => {
//     //           expect(res.status).to.equal(404);
//     //           expect(res.body.message).to.equal('Article not found');
//     //           done();
//     //         });
//     //     });
//     //     it('should succeed', (done) => {
//     //       chai.request(app)
//     //         .post('/api/articles/how-to-train-your-dragon-177804958/favorite')
//     //         .set('Content-Type', 'application/json')
//     //         .set('Authorization', userToken)
//     //         .send(dummyUsers.correctLikeArticle)
//     //         .end((err, res) => {
//     //           expect(res.status).to.equal(200);
//     //           expect(res.body).to.have.property('data');
//     //           expect(res.body.data).to.have.property('article');
//     //           expect(res.body.data.article.favorited).to.equal(true);
//     //           done();
//     //         });
//     //     });
//     //   });

//     //   describe('to unlike an article', () => {
//     //     it('should not succeed when not logged in', (done) => {
//     //       chai.request(app)
//     //         .delete('/api/articles/how-to-train-your-dragon-177804958/favorite')
//     //         .set('Content-Type', 'application/json')
//     //         .send(dummyUsers.correctLikeArticle)
//     //         .end((err, res) => {
//     //           expect(res.status).to.equal(401);
//     //           expect(res.body.message).to.equal('Authorization is missing');
//     //           done();
//     //         });
//     //     });
//     //     it('should not succeed when article wasnt found', (done) => {
//     //       chai.request(app)
//     //         .delete('/api/articles/how-to-train-your-177804958/favorite')
//     //         .set('Content-Type', 'application/json')
//     //         .set('Authorization', userToken)
//     //         .send(dummyUsers.correctLikeArticle)
//     //         .end((err, res) => {
//     //           expect(res.status).to.equal(404);
//     //           expect(res.body.message).to.equal('Article not found');
//     //           done();
//     //         });
//     //     });
//     //     it('should succeed', (done) => {
//     //       chai.request(app)
//     //         .delete('/api/articles/how-to-train-your-dragon-177804958/favorite')
//     //         .set('Content-Type', 'application/json')
//     //         .set('Authorization', userToken)
//     //         .send(dummyUsers.correctLikeArticle)
//     //         .end((err, res) => {
//     //           expect(res.status).to.equal(200);
//     //           expect(res.body).to.have.property('data');
//     //           expect(res.body.data).to.have.property('article');
//     //           done();
//     //         });
//     //     });
//   });
// });

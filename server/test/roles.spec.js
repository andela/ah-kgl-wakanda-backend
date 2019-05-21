import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';
import { defaultRoles } from '../config/constant';
import { Role } from '../models';

// Chai configuration
const { expect } = chai;
chai.use(chaiHttp);

const userRole = {
  name: defaultRoles.USER,
  description: 'This is a simple user'
};

describe('Roles endpoints', async () => {
  // find User role ID
  const role = await Role.findOne({
    attribute: ['id'],
    where: { name: userRole.name }
  });
  const roleId = role.id;
  describe('Get all roles', () => {
    it('should successfully get all roles', (done) => {
      chai
        .request(app)
        .get('/api/roles')
        .end((err, res) => {
          expect(res.status).equals(200);
          expect(res.status).to.be.a('number');
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.be.an('array');
          done();
        });
    });
  });

  describe('Get a specific role', () => {
    it('should successfully get a specific role', (done) => {
      chai
        .request(app)
        .get(`/api/roles/${roleId}`)
        .end((err, res) => {
          expect(res.status).equals(200);
          expect(res.status).to.be.a('number');
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('data');
          done();
        });
    });

    it('should validat the role Id', (done) => {
      chai
        .request(app)
        .get('/api/roles/wrong-id')
        .end((err, res) => {
          expect(res.status).equals(400);
          expect(res.status).to.be.a('number');
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equals('id must be a number');
          done();
        });
    });

    it('should respond role not found', (done) => {
      chai
        .request(app)
        .get('/api/roles/23232')
        .end((err, res) => {
          expect(res.status).equals(404);
          expect(res.status).to.be.a('number');
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equals('The role was not found');
          done();
        });
    });

    it('should fail to retrieve the role', (done) => {
      chai
        .request(app)
        .get('/api/roles/2323239839283')
        .end((err, res) => {
          expect(res.status).equals(500);
          expect(res.status).to.be.a('number');
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equals('Fail to retrieve the role');
          done();
        });
    });
  });

  describe('Update role', () => {
    it('should successfully update user role', (done) => {
      chai
        .request(app)
        .put(`/api/roles/${roleId}`)
        .send({
          name: userRole.name,
          description: 'just to update'
        })
        .end((err, res) => {
          expect(res.status).equals(200);
          expect(res.status).to.be.a('number');
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('data');
          expect(res.body).to.have.property('message');

          expect(res.body.data).to.have.property('id');
          expect(res.body.data).to.have.property('name');
          expect(res.body.data).to.have.property('description');
          expect(res.body.data).to.have.property('createdAt');
          expect(res.body.data).to.have.property('updatedAt');

          expect(res.body.message).to.be.a('string');
          expect(res.body.message).equals('The role was successfully updated');
          done();
        });
    });

    it('should respond The role was not found', (done) => {
      chai
        .request(app)
        .put('/api/roles/46272')
        .send(userRole)
        .end((err, res) => {
          expect(res.status).equals(404);
          expect(res.status).to.be.a('number');
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');

          expect(res.body.message).to.be.a('string');
          expect(res.body.message).equals('The role was not found');
          done();
        });
    });

    it('Should validate Role name', (done) => {
      chai
        .request(app)
        .put(`/api/roles/${roleId}`)
        .send({
          name: 12,
          description: userRole.description,
        })
        .end((err, res) => {
          expect(res.status).to.be.equal(400);
          expect(res.status).to.be.a('number');
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).equals('name must be a string');
          done();
        });
    });

    it('Should fail to update the role', (done) => {
      chai
        .request(app)
        .put(`/api/roles/${roleId}`)
        .end((err, res) => {
          expect(res.status).to.be.equal(500);
          expect(res.status).to.be.a('number');
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).equals('Fail to update the role');
          done();
        });
    });
  });
});

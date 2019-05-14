import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';
import { defaultRoles } from '../config/constant';

// Chai configuration
const { expect } = chai;
chai.use(chaiHttp);

const adminRole = {
  name: defaultRoles.ADMIN,
  description: 'admin can control our platform'
};

let roleId;

describe('Roles endpoints', () => {
  describe('Create role', () => {
    it('should successfully create admin role', (done) => {
      chai
        .request(app)
        .post('/api/roles')
        .send(adminRole)
        .end((err, res) => {
          expect(res.status).equals(201);
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
          expect(res.body.message).equals('The role was successfully created');
          roleId = res.body.data.id;
          done();
        });
    });

    it('should respond The role already exist', (done) => {
      chai
        .request(app)
        .post('/api/roles')
        .send(adminRole)
        .end((err, res) => {
          expect(res.status).equals(409);
          expect(res.status).to.be.a('number');
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');

          expect(res.body.message).to.be.a('string');
          expect(res.body.message).equals('The role already exist');
          done();
        });
    });

    it('Should validate empty name', (done) => {
      chai
        .request(app)
        .post('/api/roles')
        .send({
          description: adminRole.description
        })
        .end((err, res) => {
          expect(res.status).to.be.equal(400);
          expect(res.status).to.be.a('number');
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).equals('name is required');
          done();
        });
    });

    it('Should validate empty description', (done) => {
      chai
        .request(app)
        .post('/api/roles')
        .send({
          name: adminRole.name
        })
        .end((err, res) => {
          expect(res.status).to.be.equal(400);
          expect(res.status).to.be.a('number');
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).equals('description is required');
          done();
        });
    });
  });

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
    it('should successfully update admin role', (done) => {
      chai
        .request(app)
        .put(`/api/roles/${roleId}`)
        .send({
          name: adminRole.name,
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
        .send(adminRole)
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
          description: adminRole.description,
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

  describe('Delete role', () => {
    it('should successfully delete admin role', (done) => {
      chai
        .request(app)
        .delete(`/api/roles/${roleId}`)
        .end((err, res) => {
          expect(res.status).equals(200);
          expect(res.status).to.be.a('number');
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.be.a('string');
          expect(res.body.message).equals('The role was successfully deleted');
          done();
        });
    });

    it('should respond The role was not found', (done) => {
      chai
        .request(app)
        .delete('/api/roles/46272')
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

    it('should fail to delete', (done) => {
      chai
        .request(app)
        .delete('/api/roles/4627290909080')
        .end((err, res) => {
          expect(res.status).equals(500);
          expect(res.status).to.be.a('number');
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');

          expect(res.body.message).to.be.a('string');
          expect(res.body.message).equals('Fail to delete the role');
          done();
        });
    });
  });
});

import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../app';

// Chai configuration
const { expect } = chai;
chai.use(chaiHttp);

const testPermission = {
  resource: 'test',
  canCreate: true,
  canRead: true,
  canUpdate: true,
  canDelete: true,
};

let role;
let roleId;
let permissionId;

describe('Permissions endpoints', () => {
  describe('Get all permissions', () => {
    it('should successfully get all permissions', (done) => {
      chai
        .request(app)
        .get('/api/permissions')
        .end((err, res) => {
          expect(res.status).equals(200);
          expect(res.status).to.be.a('number');
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.be.an('array');
          role = res.body.data.shift();
          roleId = role[Object.keys(role)[0]];
          done();
        });
    });
  });

  describe('Grant permissions', () => {
    it('should successfully grant admin permissions', (done) => {
      chai
        .request(app)
        .post(`/api/permissions/${roleId}`)
        .send(testPermission)
        .end((err, res) => {
          expect(res.status).equals(201);
          expect(res.status).to.be.a('number');
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('data');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.be.a('string');
          expect(res.body.message).equals('The Permission was successfully granted');
          permissionId = res.body.data.id;
          done();
        });
    });

    it('should validate resource', (done) => {
      chai
        .request(app)
        .post(`/api/permissions/${roleId}`)
        .send({
          resource: ''
        })
        .end((err, res) => {
          expect(res.status).equals(400);
          expect(res.status).to.be.a('number');
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');

          expect(res.body.message).to.be.a('string');
          expect(res.body.message).equals('resource is not allowed to be empty');
          done();
        });
    });

    it('Should respond Role not found', (done) => {
      chai
        .request(app)
        .post('/api/permissions/13387')
        .send(testPermission)
        .end((err, res) => {
          expect(res.status).to.be.equal(404);
          expect(res.status).to.be.a('number');
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).equals('The role was not found');
          done();
        });
    });

    it('should fail to grant permission', (done) => {
      chai
        .request(app)
        .post('/api/permissions/4627290909080')
        .send(testPermission)
        .end((err, res) => {
          expect(res.status).equals(500);
          expect(res.status).to.be.a('number');
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');

          expect(res.body.message).to.be.a('string');
          expect(res.body.message).equals('Fail to grant permissions to this role');
          done();
        });
    });
  });

  describe('Get a specific permission', () => {
    it('should successfully get a specific permission', (done) => {
      chai
        .request(app)
        .get(`/api/permissions/${permissionId}`)
        .end((err, res) => {
          expect(res.status).equals(200);
          expect(res.status).to.be.a('number');
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('data');
          done();
        });
    });

    it('should validate the permission Id', (done) => {
      chai
        .request(app)
        .get('/api/permissions/wrong-id')
        .end((err, res) => {
          expect(res.status).equals(400);
          expect(res.status).to.be.a('number');
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equals('permissionId must be a number');
          done();
        });
    });

    it('should respond permission not found', (done) => {
      chai
        .request(app)
        .get('/api/permissions/23232')
        .end((err, res) => {
          expect(res.status).equals(404);
          expect(res.status).to.be.a('number');
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equals('The permission was not found');
          done();
        });
    });

    it('should fail to retrieve the permission', (done) => {
      chai
        .request(app)
        .get('/api/permissions/2323239839283')
        .end((err, res) => {
          expect(res.status).equals(500);
          expect(res.status).to.be.a('number');
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equals('Fail to get the permission');
          done();
        });
    });
  });

  describe('Get permissions for a specific role', () => {
    it('should successfully permissions for a specific role', (done) => {
      chai
        .request(app)
        .get('/api/roles/1/permissions')
        .end((err, res) => {
          expect(res.status).equals(200);
          expect(res.status).to.be.a('number');
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.be.an('array');
          done();
        });
    });

    it('should respond The role was not found', (done) => {
      chai
        .request(app)
        .get('/api/roles/23232/permissions')
        .end((err, res) => {
          expect(res.status).equals(404);
          expect(res.status).to.be.a('number');
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equals('The role was not found');
          done();
        });
    });

    it('should fail to retrieve the permission', (done) => {
      chai
        .request(app)
        .get('/api/roles/wrong-id/permissions/')
        .end((err, res) => {
          expect(res.status).equals(500);
          expect(res.status).to.be.a('number');
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.equals('Fail to get the permission list for this role');
          done();
        });
    });
  });

  describe('Update permission', () => {
    it('should successfully update admin permission', (done) => {
      chai
        .request(app)
        .put(`/api/permissions/${permissionId}`)
        .send(testPermission)
        .end((err, res) => {
          expect(res.status).equals(200);
          expect(res.status).to.be.a('number');
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('data');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.be.a('string');
          expect(res.body.message).equals('The permission was successfully updated');
          done();
        });
    });

    it('should respond The permission was not found', (done) => {
      chai
        .request(app)
        .put('/api/permissions/46272')
        .send(testPermission)
        .end((err, res) => {
          expect(res.status).equals(404);
          expect(res.status).to.be.a('number');
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');

          expect(res.body.message).to.be.a('string');
          expect(res.body.message).equals('The permission was not found');
          done();
        });
    });

    it('Should fail to update the permission', (done) => {
      chai
        .request(app)
        .put('/api/permissions/878786768787')
        .end((err, res) => {
          expect(res.status).to.be.equal(500);
          expect(res.status).to.be.a('number');
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).equals('Fail to update the permission');
          done();
        });
    });
  });

  describe('Revoke permission', () => {
    it('should successfully revoke admin permissions', (done) => {
      chai
        .request(app)
        .delete(`/api/permissions/${permissionId}`)
        .end((err, res) => {
          expect(res.status).equals(200);
          expect(res.status).to.be.a('number');
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');
          expect(res.body.message).to.be.a('string');
          expect(res.body.message).equals('The permission was successfully revoked');
          done();
        });
    });

    it('should respond The permission was not found', (done) => {
      chai
        .request(app)
        .delete('/api/permissions/46272')
        .end((err, res) => {
          expect(res.status).equals(404);
          expect(res.status).to.be.a('number');
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');

          expect(res.body.message).to.be.a('string');
          expect(res.body.message).equals('The permission was not found');
          done();
        });
    });

    it('should fail to revoke permission', (done) => {
      chai
        .request(app)
        .delete('/api/permissions/4627290909080')
        .end((err, res) => {
          expect(res.status).equals(500);
          expect(res.status).to.be.a('number');
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('message');

          expect(res.body.message).to.be.a('string');
          expect(res.body.message).equals('Fail to revoke the permission');
          done();
        });
    });
  });
});

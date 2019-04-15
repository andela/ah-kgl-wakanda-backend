import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import User from '../controllers/users';

const { expect } = chai;
chai.use(sinonChai);

describe('Social login', () => {
  afterEach(() => {
    sinon.restore();
  });
  it('should create a new user', async () => {
    const req = {
      user: {
        provider: 'facebook',
        displayName: 'user name',
        emails: [{ value: 'username@mail.com' }],
        photos: [{ value: 'image.jpg' }]
      }
    };

    const res = {
      status() { },
      json() { },
    };
    sinon.stub(res, 'status').returnsThis();
    await User.socialLogin(req, res);
    expect(res.status).to.have.been.calledWith(200);
  });

  it('should not create a new user with a bad req', async () => {
   const req = {
      user: {
        provider: 'facebook',
        displayName: 'Karl Musingo',
      }
    };

    const res = {
      status() { },
      json() { },
    };
    sinon.stub(res, 'status').returnsThis();
    await User.socialLogin(req, res);
    expect(res.status).to.have.been.calledWith(400);
  });
});

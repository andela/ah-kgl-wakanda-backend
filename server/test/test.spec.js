import chai from 'chai';
import chaiHttp from 'chai-http';

// Chai configurations
const { expect } = chai;
chai.use(chaiHttp);

describe('Testing tests settings', () => {
  it('Should Pass', () => {
    expect(1).to.equal(1);
  });
});

import chai from "chai";
import chaiHttp from "chai-http";

// Chai configurations
const expect = chai.expect;
chai.use(chaiHttp);

describe("Testing tests settings", () => {
  it("Should Pass", () => {
    expect(true).to.be.true;
  });
});

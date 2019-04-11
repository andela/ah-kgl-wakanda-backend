import chai from "chai";
import chaiHttp from "chai-http";
import nock from "nock";

// Chai configuration
const expect = chai.expect;
chai.use(chaiHttp);

const message = {
  email: "kivubox@gmail.com",
  subject: "hello",
  link: "google.com",
  link_text: "send",
  name: "grace",
  title: "title",
  body: "Here is the message"
};

const token = `Bearer ${process.env.SENDGRID_API_KEY}`;

beforeEach(() => {
  nock("https://api.sendgrid.com/v3/", {
    reqheaders: {
      authorization: token
    }
  })
    .post("/mail/send", message)
    .reply(202);

  nock("https://api.sendgrid.com/v3/")
    .post("/mail/send", message)
    .reply(401);

  nock("https://api.sendgrid.com/v3/", {
    reqheaders: {
      authorization: token
    }
  })
    .post("/mail/send", { bad: "request" })
    .reply(400);
});

describe("SendGrid email api calls", () => {
  it("Should send an email", () => {
    chai
      .request("https://api.sendgrid.com/v3")
      .post("/mail/send")
      .set("Authorization", token)
      .send(message)
      .end((error, res) => {
        expect(res.status).to.be.equal(202);
      });
  });

  it("Should fail to send an email", () => {
    chai
      .request("https://api.sendgrid.com/v3")
      .post("/mail/send")
      .send(message)
      .end((error, res) => {
        expect(res.status).to.be.equal(401);
      });
  });

  it("Should fail to send an email", () => {
    chai
      .request("https://api.sendgrid.com/v3")
      .post("/mail/send")
      .set("Authorization", token)
      .send({ bad: "request" })
      .end((error, res) => {
        expect(res.status).to.be.equal(400);
      });
  });
});

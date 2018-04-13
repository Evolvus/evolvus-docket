const chai = require("chai");
/*
 ** chaiAsPromised is needed to test promises
 ** it adds the "eventually" property
 **
 ** chai and others do not support async / await
 */
const chaiAsPromised = require("chai-as-promised");

const expect = chai.expect;
chai.use(chaiAsPromised);

const docket = require("../index");

describe("docket model validation", () => {

  it("valid user should validate successfully", (done) => {
    let docketObject = {
      name: 'LOGIN_EVENT',
      application: 'FLUX-CDA',
      source: 'APPLICATION',
      ipAddress: "193.168.11.115",
      status: "success",
      level: "info",
      createdBy: "meghad",
      details: "User meghad logged into the application Platform",
      eventDateTime: 'Date.now()',
      keyDataAsJSON: "keydata"
    };

    try {
      var res = docket.validate(docketObject);
      expect(res)
        .to.eventually.equal(true)
        .notify(done);
      // if notify is not done the test will fail
      // with timeout
    } catch (e) {
      expect.fail(e, null, `valid docket object should not throw exception: ${e}`);
    }
  });

});
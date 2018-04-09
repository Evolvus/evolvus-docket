const docketSchema = require("./model/docketSchema");
//const docket = require("./db/docket");
const validate = require("jsonschema")
  .validate;

module.exports.validate = (docket) => {
  return new Promise((resolve, reject) => {
    try {
      var res = validate(docket, docketSchema);
      resolve(res.valid);
    } catch (err) {
      reject(err);
    }
  });
};
module.exports.docketObject1 = {
  name: 'LOGIN_EVENT',
  application: 'SANDSTORM_CONSOLE',
  source: 'APPLICATION',
  ipAddress: "193.168.11.115",
  status: "SUCCESS",
  level: "info",
  createdBy: "kavyak",
  details: "User kavyak logged into the application SANDSTORM_CONSOLE",
  eventDateTime: "2018-08-07T09:26:07.990Z",
  keyDataAsJSON: "keydata"
};

module.exports.docketObject2 = {
  name: 'LOGIN_EVENT',
  application: 'FLUX_CDA',
  source: 'APPLICATION',
  ipAddress: "193.168.11.115",
  status: "SUCCESS",
  level: "info",
  createdBy: "meghad",
  details: "User meghad logged into the application FLUX_CDA",
  eventDateTime: "2018-08-07T09:26:07.990Z",
  keyDataAsJSON: "keydata"
};

module.exports.docketObject3 = {
  name: 'MANDATE_CREATE',
  application: 'FLUX_CDA',
  source: 'APPLICATION',
  ipAddress: "193.168.11.115",
  status: "SUCCESS",
  level: "info",
  createdBy: "kavyak",
  details: "Mandate created",
  eventDateTime: "2018-08-08T09:26:07.990Z",
  keyDataAsJSON: "keydata"
};

module.exports.docketObject4 = {
  name: 'MANDATE_REJECT',
  application: 'FLUX_CDA',
  source: 'APPLICATION',
  ipAddress: "193.168.11.115",
  status: "SUCCESS",
  level: "info",
  createdBy: "kavyak",
  details: "Mandate rejected",
  eventDateTime: "2018-08-09T09:26:07.990Z",
  keyDataAsJSON: "keydata"
};

module.exports.docketObject5 = {
  name: 'LOGIN_EVENT',
  application: 'FLUX_CDA',
  source: 'APPLICATION',
  ipAddress: "193.168.11.115",
  status: "FAILURE",
  level: "info",
  createdBy: "meghad",
  details: "User meghad login failed into the application FLUX_CDA",
  eventDateTime: "2018-08-10T09:26:07.990Z",
  keyDataAsJSON: "keydata"
};

module.exports.docketObject6 = {
  name: 'LOGIN_EVENT',
  application: 'SANDSTORM_CONSOLE',
  source: 'APPLICATION',
  ipAddress: "193.168.11.115",
  status: "FAILURE",
  level: "info",
  createdBy: "kavyak",
  details: "User kavyak login failed into the application SANDSTORM_CONSOLE",
  eventDateTime: "2018-08-10T09:26:07.990Z",
  keyDataAsJSON: "keydata"
};

module.exports.invalidObject = {
  name: 'LOGIN_EVENT',
  source: 'APPLICATION',
  ipAddress: "193.168.11.115",
  status: "success",
  level: "info",
  createdBy: "meghad",
  details: "User meghad logged into the application FLUX_CDA",
  eventDateTime: new Date().toISOString(),
  keyDataAsJSON: "keydata"
};
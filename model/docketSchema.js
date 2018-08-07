const _=require("lodash");
/*
 ** JSON Schema representation of the Docket model
 */
var docketSchema = {
  "$schema": "http://json-schema.org/draft-06/schema#",
  "title": "DocketModel",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "minLength": 5,
      "maxLength": 35
    },
    "eventCode": {
      "type": "string"
    },
    "application": {
      "type": "string",
      "minLength": 3,
      "maxLength": 20,
      "filterable":"true",
      "sortable":"false"
    },
    "source": {
      "type": "string",
      "minLength": 3,
      "maxLength": 50,
      "filterable":"true",
      "sortable":"false"
    },
    "ipAddress": {
      "type": "string",
      "filterable":"true",
      "sortable":"false"
    },
    "level": {
      "type": "string",
      "filterable":"true",
      "sortable":"false"
    },
    "status": {
      "type": "string",
      "enum": ["SUCCESS", "FAILURE", "PENDING"],
      "filterable":"true",
      "sortable":"false"
    },
    "eventDateTime": {
      "type": "string",
      "format": "date-time"
    },
    "details": {
      "type": "string",
      "minLength": 5,
      "maxLength": 250
    },
    "keyDataAsJSON": {
      "type": "string"
    },
    "createdBy": {
      "type": "string",
      "filterable":"true",
      "sortable":"false"
    },
    "keywords": {
      "type": "string"
    }
  },
  "required": ["name","application", "source", "createdBy", "ipAddress", "status", "keyDataAsJSON", "details", "eventDateTime"]
};

module.exports.schema=docketSchema;

filterAttributes = _.keys(_.pickBy(docketSchema.properties, (a) => {
  return (a.filterable);
}));



module.exports.filterAttributes = filterAttributes;

sortableAttributes = _.keys(_.pickBy(docketSchema.properties, (a) => {
  return (a.sortable);
}));

module.exports.sortableAttributes = sortableAttributes;
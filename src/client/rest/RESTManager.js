const request = require('superagent');
const Constants = require('../../util/Constants');
const UserAgentManager = require('./UserAgentManager');
const RESTMethods = require('./RESTMethods');
const Bucket = require('./Bucket');
const APIRequest = require('./APIRequest');

class RESTManager {

  constructor(client) {
    this.client = client;
    this.buckets = {};
    this.userAgentManager = new UserAgentManager(this);
    this.methods = new RESTMethods(this);
    this.rateLimitedEndpoints = {};
  }

  addToBucket(bucket, apiRequest) {
    return new Promise((resolve, reject) => {
      bucket.add({
        request: apiRequest,
        resolve,
        reject,
      });
    });
  }

  makeRequest(method, url, auth, data, file) {
    /*
    	file is {file, name}
     */
    const apiRequest = new APIRequest(this, method, url, auth, data, file);

    if (!this.buckets[apiRequest.getBucketName()]) {
      console.log('new bucket', apiRequest.getBucketName());
      this.buckets[apiRequest.getBucketName()] = new Bucket(this, 1, 1);
    }
    
    return this.addToBucket(this.buckets[apiRequest.getBucketName()], apiRequest);
  }
}

module.exports = RESTManager;

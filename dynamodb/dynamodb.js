const aws = require('./helper.js'),
      ddb = new aws.DynamoDB({ endpoint: new aws.Endpoint('http://localhost:8888') });

let params = { TableName: 'topics' };

const dynamodb = {
  populate(feeds) {

    params = { RequestItems: { topics: [] } };

    feeds.map

    return new Promise(function(resolve, reject) {
      resolve();
    });
  }
};

module.exports = dynamodb;

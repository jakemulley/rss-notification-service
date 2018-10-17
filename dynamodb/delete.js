const AWS = require('./helper.js'),
      ddb = new AWS.DynamoDB({ endpoint: new AWS.Endpoint('http://localhost:8888') }),
      params = {
        TableName: 'topics'
      };

ddb.deleteTable(params, function(err,done) {
  console.log('error', err);
  console.log('done', done);
});

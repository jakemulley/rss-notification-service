const AWS = require('../aws/aws.js'),
      ddb = new AWS.DynamoDB({ endpoint: new AWS.Endpoint('http://localhost:8888') }),
      params = {
        TableName: 'topics',
        KeySchema: [
          {
            AttributeName: 'topic_id',
            KeyType: 'HASH'
          }
        ],
        AttributeDefinitions: [
          {
            AttributeName: 'topic_id',
            AttributeType: 'S' // N for number
          }
        ],
        StreamSpecification: {
          StreamEnabled: false
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1
        }
      };

ddb.createTable(params, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data);
  }
});

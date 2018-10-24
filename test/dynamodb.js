const ddblocal = require('local-dynamo');
const aws = require('./helper.js');
const mockItems = require('../mock/feeds.json');

describe('DynamoDB', () => {

  let dynamoInstance;
  let db;

  const helper = {
    createTable() {
      let params = {
        TableName: 'Test',
        KeySchema: [ { AttributeName: 'TestAttr', KeyType: 'HASH' } ],
        AttributeDefinitions: [ { AttributeName: 'TestAttr', AttributeType: 'S' } ],
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1
        }
      };
      return db.createTable(params).promise().then(() => db.waitFor('tableExists', params));
    },
    deleteTable() {
      let params = {
        TableName: 'Test'
      };
      return db.deleteTable(params).promise().then(() => db.waitFor('tableNotExists', params));
    },
    addItems(items) {
      items = items.slice(0, 10).filter(item => item.rss_link).map(value => {
        const obj = {
          PutRequest: {
            Item: {
              TestAttr: { S: value.rss_link }
            }
          }
        };

        for(const key in value) {
          obj.PutRequest.Item[key] = (value[key] ? { S: value[key].toString() } : { NULL: true });
        }

        return obj;
      });

      const params = { RequestItems: { Test: items } };

      return Promise.all([db.batchWriteItem(params).promise()]);
    },
    getItems() {
      const params = { TableName: 'Test' };
      params.ExpressionAttributeValues = {
        ':a': {
          S: '0'
        }
      };
      params.FilterExpression = 'enabled <> :a';
      params.Limit = 100;
      return db.scan(params).promise();
    }
  };

  before(() => {
    dynamoInstance = ddblocal.launch(null, 8000);
    db = aws;
  });

  after(() => {
    dynamoInstance.kill();
    db = null;
  });

  beforeEach(() => helper.createTable());

  afterEach(() => helper.deleteTable());

  describe('populates the DynamoDB table', () => {
    it('adds items from mock file', () => {
      return helper.addItems(mockItems);
    });
  });

  describe('gets all topics', () => {
    it('returns items from the database', () => {
      return helper.getItems();
    });
  });

});

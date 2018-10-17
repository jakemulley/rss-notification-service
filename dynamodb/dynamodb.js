const aws = require('./helper.js'),
      ddb = new aws.DynamoDB({
        endpoint: new aws.Endpoint('http://localhost:8888'),
        apiVersion: '2012-08-10',
        convertEmptyValues: true
      }),
      maxChunks = 25;

let params = { TableName: 'topics' };

const dynamodb = {
  populate(feeds) {
    const params = { RequestItems: { topics: [] } };
    const promises = [];

    feeds = feeds.filter(item => item.rss_link).map(value => {
      const obj = {
        PutRequest: {
          Item: {
            topic_id: { S: value.rss_link }
          }
        }
      };

      for(const key in value) {
        obj.PutRequest.Item[key] = (value[key] ? { S: value[key].toString() } : { NULL: true });
      }

      return obj;
    });

    const totalCalls = Math.ceil(feeds.length / maxChunks);

    for (let i = 0; i < totalCalls; i++) {
      const chunk = params;
      chunk.RequestItems.topics = feeds.slice(i * maxChunks, (i * maxChunks) + maxChunks);
      promises.push(ddb.batchWriteItem(chunk).promise());
    }

    return Promise.all(promises);
  }
};

module.exports = dynamodb;

const aws = require('./helper.js')
      ddb = new aws.DynamoDB({
        endpoint: new aws.Endpoint('http://localhost:8888'),
        apiVersion: '2012-08-10',
        convertEmptyValues: true
      }),
      maxChunks = 25;

let params = { TableName: 'topics' };

const dynamodb = {
  populate(feeds) {
    const totalCalls = Math.ceil(feeds.length / maxChunks);
    const params = { RequestItems: { topics: [] } };
    const promises = [];

    for (let i = 0; i < totalCalls; i++) {
      const chunk = params;
      chunk.RequestItems.topics = feeds.slice(i * maxChunks, (i * maxChunks) + maxChunks).map((value, e) => {
        if(value.rss_link) {
          const obj = {
            PutRequest: {
              Item: {
                topic_id: { S: value.rss_link }
              }
            }
          };

          for(const key in value) {
            let val = { NULL: true };
            if(value[key]) {
              val = { S: value[key].toString() };
            }
            obj.PutRequest.Item[key] = val;
          }

          return obj;
        }
      });

      promises.push(ddb.batchWriteItem(chunk).promise());
    }

    return Promise.all(promises);
  }
};

module.exports = dynamodb;

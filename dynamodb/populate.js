const publicBills = require('../sources/public-bills.js');
const privateBills = require('../sources/private-bills.js');
const committees = require('../sources/committees.js');

const AWS = require('aws-sdk');
AWS.config.update({
  region: 'local'
});
ddb = new AWS.DynamoDB({ endpoint: new AWS.Endpoint('http://localhost:8888') });

const populate = {
  requestAll() {
    return Promise.all([publicBills.getAll(), privateBills.getAll()]);
  },
  getAll() {
    this.requestAll().then(function(feeds) {
      const concat = [].concat.apply([], feeds);
      const params = {
        RequestItems: {
          topics: []
        }
      };

      for (var i = 0; i < concat.length; i++) {
        params.RequestItems.topics.push({
          PutRequest: {
            Item: {
              'topic_id': { 'N': i.toString() },
              'description': { 'S': concat[i].description },
              'enabled': { 'N': concat[i].enabled.toString() },
              'guid': { 'S': concat[i].guid },
              'last_updated': { 'S': concat[i].last_updated },
              'rss_link': { 'S': concat[i].rss_link },
              'title': { 'S': concat[i].title },
              'type': { 'S': concat[i].type },
              'granicus_code': { 'S': 'UK_Parliament_1' }
            }
          }
        });
      }

      params.RequestItems.topics = params.RequestItems.topics.slice(0, 25);

      console.log(params);
      console.log(params.RequestItems.topics[0]);

      // ddb.batchWriteItem(params, function(error, data) {
      //   if (error) {
      //     console.log("Error", error);
      //   } else {
      //     console.log("Success", data);
      //   }
      // });

    }).catch(function(error) {
      console.log('error', error);
    });
  }
};

populate.getAll();

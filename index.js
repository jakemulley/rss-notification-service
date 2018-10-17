const dynamodb = require('./dynamodb/dynamodb.js');
const feeds = require('./mock/feeds.json');

dynamodb.populate(feeds).then(function(result) {
  console.log('done');
}).catch(function(error) {
  console.log('e', error);
});

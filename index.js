// const dynamodb = require('./dynamodb/dynamodb.js');
// const feeds = require('./mock/feeds.json');

// dynamodb.populate(feeds);

const ses = require('./ses/ses.js');
ses.send({
  recipients: ['mulleyjb@parliament.uk', 'gantf@parliament.uk', 'rainsleya@parliament.uk', 'rogersgb@parliament.uk', 'thompsonsc@parliament.uk', 'allets@parliament.uk'],
  html: 'Automated email test - <b>html body</b>',
  text: 'Automated email test - text body',
  subject: 'Automated email test'
});

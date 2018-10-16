/*
  steps:
  - get all urls
  - check if updated
  - if updated...
    - get list of subscribers for that page
    - send an email
    - one complete, update 'last_feed_sent' date
  - if not updated...
    - exit
*/

// const bills = require('./bills.js');

// bills.getAll();

// function getUrlsByType(type) {
//   // bills.then();
//   // return dynamodb query
// }

// function getSubscribersByTopic(topicId) {
//   // return dynamodb query
// }

// function sendEmail() {
//   // fire off lambda function to send email via sns
// }

// // update and check dynamodb bills

// getUrlsByType();

// const Watcher = require('./watcher/watcher.js');

// let watcher = new Watcher(60000);

// watcher.onPoll(() => {
//   console.log('triggered');
//   watcher.poll();
// });

// watcher.poll();

// const emailer = require('./emailer/emailer.js');

// emailer.getLists().then(emailer.getSubscribers);

// let rssFeeds = ['http://feeds.bbci.co.uk/news/world/africa/rss.xml', 'http://feeds.bbci.co.uk/news/world/asia/rss.xml', 'http://feeds.bbci.co.uk/news/world/europe/rss.xml', 'http://feeds.bbci.co.uk/news/world/latin_america/rss.xml', 'http://feeds.bbci.co.uk/news/world/middle_east/rss.xml', 'http://feeds.bbci.co.uk/news/world/us_and_canada/rss.xml', 'http://feeds.bbci.co.uk/news/england/rss.xml', 'http://feeds.bbci.co.uk/news/northern_ireland/rss.xml', 'http://feeds.bbci.co.uk/news/scotland/rss.xml', 'http://feeds.bbci.co.uk/news/wales/rss.xml', 'http://404.parliament.uk'];

const emailer = require('./emailer/emailer.js');

emailer.getLists().then(emailer.getAllSubscribers).then(emailer.filterSubscribers);

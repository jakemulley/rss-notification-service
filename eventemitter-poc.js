const rssParser = require('rss-parser');
const parser = new rssParser({ maxRedirects: 100 });
const articles = [];
const interval = 600000; // seconds * 100 = milliseconds

let rssFeeds = require('./mock/feeds.json');

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}

const poller = {
  async requestFeeds(feeds) {
    let promises = [];
    for (let i = 0; i < feeds.length; i++) {
      if(feeds[i].rss_link) {
        await sleep(100);
        promises.push(
          parser.parseURL(feeds[i].rss_link).catch(error => {
            console.warn(`Error for feed: ${feeds[i].rss_link}: "${error}", but carrying on...`);
          })
        );
      }
    }
    return Promise.all(promises);
  },
  checkFeeds() {
    console.log('running');
    return poller.requestFeeds(rssFeeds).then(promises => {
      for (let i = 0; i < promises.length; i++) {
        if(promises[i]) {
          // use Moment for better checking
          if(articles[promises[i].title] != promises[i].items[0].pubDate) {
            console.log(`New article on ${promises[i].title}: ${promises[i].items[0].title}, published at ${promises[i].items[0].pubDate}`);
          }

          articles[promises[i].title] = promises[i].items[0].pubDate;
        }
      }
    });
  },
  start() {
    this.checkFeeds();
    setInterval(this.checkFeeds, interval);
  }
};

poller.start();

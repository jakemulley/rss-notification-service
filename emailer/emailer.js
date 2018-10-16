const MailChimp = require('mailchimp-api-v3'),
      mailchimp = new MailChimp(process.env.MC_API_KEY);

const limitPerRequest = 200;

const emailer = {
  getLists() {
    return mailchimp.get('/lists', { count: 50, fields: 'lists.id,lists.stats.member_count' });
  },
  getAllSubscribers(result) {
    mailchimp.get('/search-members', { query: 'aeid:1,2' }).then(function(result) {
      console.log(result);
    });

    const calls = [];

    // get all lists and their total count but specify users who only have AUTOMATED_TOPICS set ?fields, ?search?
    const allLists = result.lists.map(value => ({
      path: `/lists/${value.id}/members`,
      total: value.stats.member_count
    }));

    for (var i = 0; i < allLists.length; i++) {
      const totalCalls = Math.ceil(allLists[i].total / limitPerRequest);
      for (let k = 0; k < totalCalls; k++) {
        calls.push({
          method: 'get',
          path: allLists[i].path,
          query: {
            count: limitPerRequest,
            offset: (k * limitPerRequest),
            status: 'subscribed',
            // fields: 'members.email_address,members.merge_fields,members.status'
          }
        });
      }
    }

    return mailchimp.batch(calls, { interval: 5000, unpack: true });
    // filter by if their AUTOMATED_TOPICS (when exploded) includes the TOPIC ID
    // return
  },
  filterSubscribers(subscribers, topicId) {
    var count = 0;
    for (var i = 0; i < subscribers.length; i++) {
      count = (count + subscribers[i].members.length);
      console.log(subscribers[i]);
    }
    console.log('Done, count:', count);
    // for (var i = 0; i < subscribers.length; i++) {
    //   var AUTOMATED_TOPICS = subscribers[i].merge_field_blah blah blah.implode(',');
    //   for (var i = 0; i < AUTOMATED_TOPICS.length; i++) {
    //     if(AUTOMATED_TOPICS[i] === topic_id) {

    //     }
    //   }
    // }
  }
};

module.exports = emailer;

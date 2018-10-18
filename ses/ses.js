const aws = require('../aws/aws.js'),
      ses = new aws.SES({ region: 'local', endpoint: 'http://localhost:9001' }),
      maxChunks = 1;

const emails = {
  send(options) {
    // Need to be able to cope with 51 or more recipients - chunk it up
    var totalCalls = Math.ceil((options.recipients.length / maxChunks));
    var promises = [];

    for (var i = 0; i < totalCalls; i++) {
      var obj = {
        Source: 'noreply@email.parliament.uk',
        Destination: {
          BccAddresses: [options.recipients[i]],
          ToAddresses: ['noreply@email.parliament.uk']
        },
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: options.html
            },
            Text: {
             Charset: 'UTF-8',
             Data: options.text
            }
          },
          Subject: {
            Charset: 'UTF-8',
            Data: options.subject
          }
        }
      };
      promises.push(ses.sendEmail(obj).promise());
    }

    return Promise.all(promises);
  }
};

module.exports = emails;

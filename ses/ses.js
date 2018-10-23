const ses = require('./helper.js'),
      maxChunks = 25,
      sendingDefaults = {
        Source: process.env.AWS_SES_FROM_EMAIL ? process.env.AWS_SES_FROM_EMAIL : 'noreply@localhost',
        Destination: {
          BccAddresses: [],
          ToAddresses: [process.env.AWS_SES_FROM_EMAIL ? process.env.AWS_SES_FROM_EMAIL : 'noreply@localhost']
        },
        Message: {
          Body: {
            Html: {
              Charset: 'UTF-8',
              Data: null
            },
            Text: {
             Charset: 'UTF-8',
             Data: null
            }
          },
          Subject: {
            Charset: 'UTF-8',
            Data: null
          }
        }
      };

const emails = {
  send(options) {
    const totalCalls = Math.ceil(options.recipients.length / maxChunks);
    const promises = [];

    for (let i = 0; i < totalCalls; i++) {
      const chunk = sendingDefaults;
      chunk.Destination.BccAddresses = options.recipients.slice(i * maxChunks, (i * maxChunks) + maxChunks);
      chunk.Message.Body.Html.Data = options.html;
      chunk.Message.Body.Text.Data = options.text;
      chunk.Message.Subject.Data = options.subject;
      promises.push(ses.sendEmail(chunk).promise());
    }

    return Promise.all(promises);
  }
};

module.exports = emails;

const aws = require('../aws/aws.js'),
      ses = new aws.SES({ region: 'local', endpoint: 'http://localhost:9001' });

const emails = {
  send(options) {
    // Need to be able to cope with 51 or more recipients - chunk it up
    return ses.sendEmail({
      Source: 'noreply@email.parliament.uk',
      Destination: {
        BccAddresses: options.recipients,
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
    }).promise();
  }
};

module.exports = emails;

const AWS = require('aws-sdk');
AWS.config.update({
  region: 'local'
});

module.exports = AWS;

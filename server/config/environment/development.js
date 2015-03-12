var path = require('path');
module.exports = {
    DOMAIN: 'http://localhost:9000',
    db: 'mongodb://localhost/mean',
    sessionSecret: 'developmentSessionSecret',
    port: process.env.PORT || 9000,
    root: path.normalize(__dirname + '/../../..')
};


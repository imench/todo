var path = require('path');
module.exports = {
    DOMAIN: 'http://localhost:8081',
    db: 'mongodb://localhost/mean-todo-test',
    sessionSecret: 'testSessionSecret',
    port: process.env.PORT || 8081,
    root: path.normalize(__dirname + '/../../..')
}
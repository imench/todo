var path = require('path');
module.exports = {
    DOMAIN: 'http://localhost:8081',
    db: 'mongodb://localhost/mean-prod',
    sessionSecret: 'prodSessionSecret',
    // Server IP
    ip:       process.env.OPENSHIFT_NODEJS_IP ||
        process.env.IP ||
        undefined,

    // Server port
    port:     process.env.OPENSHIFT_NODEJS_PORT ||
        process.env.PORT || 8081,

    root: path.normalize(__dirname + '/../../..')
};


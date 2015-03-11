/**
 * Main application routes
 */

'use strict';


module.exports = function(app) {

    // Insert routes below
   // app.use(express.static(__dirname + '/client'));
    app.use('/api/todos', require('./api/todo'));
    app.use('/api/users', require('./api/user'));

    app.use('/auth', require('./auth'));

    app.use(function (err, req, res, next) {
        //console.trace(err);
        if (err.stack)
            console.log(err.stack);

        switch (err.name) {
            case 'ValidationError':
                // res.sendStatus(400);
                return res.status(400).json(err);
            default:
                //console.log(err.name);
                return res.sendStatus(500);
        }
    });
    // All undefined asset or api routes should return a 404
    /*app.route('/:url(api|auth|components|app|bower_components|assets)/*')
        .get(errors[404]);*/

    // All other routes should redirect to the index.html
    /*app.route('/*')
        .get(function(req, res) {
            res.sendfile(app.get('appPath') + '/index.html');
        });*/
    //
};

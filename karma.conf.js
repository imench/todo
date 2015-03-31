module.exports = function(config) {
    config.set({
        // base path, that will be used to resolve files and exclude
        basePath: '',
        frameworks: ['jasmine'],
        files: [

            'client/bower_components/angular/angular.js',
            'client/bower_components/angular-mocks/angular-mocks.js',
            'client/bower_components/angular-resource/angular-resource.js',
            'client/bower_components/angular-route/angular-route.js',
            'client/app/app.js',
            'client/app/**/*.js',
            'client/components/**/*.js',
            'client/app/**/*.html',
            'client/components/**/*.html'
        ],
        preprocessors: {
            "**/*.html": "html2js"
        },

        ngHtml2JsPreprocessor: {
            // If your build process changes the path to your templates,
            // use stripPrefix and prependPrefix to adjust it.
            stripPrefix: "client/",
            prependPrefix: "client/",

            // the name of the Angular module to create
            moduleName: "to_do"
        },
        reporters: ['progress'],
        browsers: ['PhantomJS'],
        captureTimeout: 60000,
        singleRun: true
    });
};
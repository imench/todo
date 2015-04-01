describe('Unit testing ensureUnique directive', function() {
    var $compile,
        $rootScope;

    // Load the to_do module, which contains the directive
    beforeEach(module('to_do'));

    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    beforeEach(inject(function(_$httpBackend_, _$compile_, _$rootScope_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
    }));

    it('should not set usernameUnique validity to true if username is not unique', function() {
        var element = $compile('<form name="signup_form" novalidate><input type="text" name="username" ng-model="username" ensure-unique required/></form>')($rootScope);

        form = $rootScope.signup_form;

        $httpBackend.expect('POST','/auth/local/signup/check/username', {username:'imen'}).respond(200,{isUnique:false});
        form.username.$setViewValue('imen');
        $httpBackend.flush();
        expect(form.username.$error.unique).toBe(true);

        $httpBackend.expect('POST','/auth/local/signup/check/username', {username:'imen2'}).respond(200,{isUnique:true});
        form.username.$setViewValue('imen2');
        $httpBackend.flush();
        expect(form.username.$error.unique).toBe(undefined);
    });

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});

describe('Unit testing match directive', function() {
    var $compile,
        $rootScope;

    // Load the to_do module, which contains the directive
    beforeEach(module('to_do'));

    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    beforeEach(inject(function(_$compile_, _$rootScope_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    it('should not set match validity to true if password and confirm password do not match', function() {
        var element = $compile('<form name="signup_form" novalidate><input type="password" name="verification" ng-model="verification" match="password" required/><input type="password" name="password" ng-model="password" match="password" required/></form>')($rootScope);
        form = $rootScope.signup_form;
        form.password.$setViewValue('1234');
        form.verification.$setViewValue('12345');
        $rootScope.$digest();
        expect(form.verification.$error.match).toBe(true);

        form.password.$setViewValue('1234');
        form.verification.$setViewValue('1234');
        $rootScope.$digest();
        expect(form.verification.$error.match).toBe(undefined);
    });
});

describe('Unit testing overwriteEmail directive', function() {
    var $compile,
        $rootScope;

    // Load the to_do module, which contains the directive
    beforeEach(module('to_do'));

    // Store references to $rootScope and $compile
    // so they are available to all tests in this describe block
    beforeEach(inject(function(_$compile_, _$rootScope_){
        // The injector unwraps the underscores (_) from around the parameter names when matching
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    it('should not set email validity to true if email is not valid', function() {
        var element = $compile('<form name="signup_form" novalidate><input type="email" overwrite-email name="email" ng-model="email" required/></form>')($rootScope);
        form = $rootScope.signup_form;

        form.email.$setViewValue('imen@yahoo');
        $rootScope.$digest();
        expect(form.email.$error.email).toBe(true);


        form.email.$setViewValue('imen@yahoo.fr');
        $rootScope.$digest();
        expect(form.email.$error.email).toBe(undefined);
    });
});



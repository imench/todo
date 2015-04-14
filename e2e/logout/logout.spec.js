var LoginPage = require('../login/login.po');
var User = require('../../server/api/user/user.model');

describe('Logout', function() {
  var user = new User({
    username: 'imen',
    password: '12345'
  });

  beforeEach(function(done) {
    User.remove(function(err) {
      if (err) return done(err);

      User.create([user], function(err) {
        if (err) return done(err);

        var page = new LoginPage();
        page.visit();
        page.setUsername('imen');
        page.setPassword('12345');
        page.login();
        browser.waitForAngular().then(done);
      });
    });

  });

  it('should return to the home page after logout', function() {
    element(by.css('[ng-click="logout()"]')).click();
    expect(browser.getCurrentUrl()).toEqual('http://localhost:8081/#/');
  });
});
require('../../server/config/mongoose')();

var User = require('../../server/api/user/user.model');
var LoginPage = require('./login.po');

describe('login page', function() {
  var user = new User({
    username: 'imen',
    password: '1234'
  });

  beforeEach(function(done) {
    User.remove(function(err) {
      if (err) return done(err);

      User.create([user], function(err) {
        if (err) return done(err);

        done();
      });
    });
  });

  it('should login successfully', function() {
    var page = new LoginPage();
    page.visit();
    page.setUsername('imen');
    page.setPassword('1234');
    page.login();
    expect(browser.getCurrentUrl()).toEqual('http://localhost:8081/#/todo');
  });

  it('should not login successfully', function() {
    var page = new LoginPage();
    page.visit();
    page.setUsername('imen');
    page.setPassword('12345');
    page.login();
    expect(browser.getCurrentUrl()).toEqual('http://localhost:8081/#/login');
    expect(page.unauthorizedError.isDisplayed()).toBe(true);
    expect(page.unauthorizedError.getText()).toBe('username or password incorrect');
    //expect(element.all(by.tagName('span')).get(2).isDisplayed()).toBe(true);
  });
});
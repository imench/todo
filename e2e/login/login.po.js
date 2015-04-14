var LoginPage = function() {
  this.username = element(by.model('user.username'));
  this.password = element(by.model('user.password'));
  this.loginButton = element(by.css('[ng-click="login()"]'));
  this.unauthorizedError = element(by.id('unauthorizedError'));
  this.visit = function() {
    browser.get('http://localhost:8081/#/login');
  };

  this.setUsername = function(username) {
    this.username.clear();
    this.username.sendKeys(username);
  };

  this.setPassword = function(password) {
    this.password.clear();
    this.password.sendKeys(password);
  };

  this.login = function() {
    this.loginButton.click();
  };
};
module.exports = LoginPage;

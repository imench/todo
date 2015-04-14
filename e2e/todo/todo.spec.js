var LoginPage = require('../login/login.po');
var Todo = require('../../server/api/todo/todo.model');
var User = require('../../server/api/user/user.model');
var TodoPage = require('../todo/todo.po');

describe('Todo list', function() {
  var user = new User({
    username: 'imen',
    password: '12345'
  });

  var todo1 = new Todo({
    name: 'todo1',
    done: false,
    owner: user
  });

  var todo2 = new Todo({
    name: 'todo2',
    done: true,
    owner: user
  });

  beforeEach(function(done) {
    User.remove(function(err) {
      if (err) return done(err);

      Todo.remove(function(err) {
        if (err) return done(err);

        User.create([user], function(err) {
          if (err) return done(err);

          Todo.create([todo1, todo2], function(err) {
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
    });
  });

  it('should add a todo', function() {
    var page = new TodoPage();
    page.visit();
    page.setName('write a protractor test');
    page.add();
    expect(page.todoList.count()).toEqual(3);
    expect(page.todoList.get(2).getText()).toEqual('write a protractor test');
  });

  it('should update a todo', function() {
    var page = new TodoPage();
    page.visit();
    expect(page.todoList.all(by.css('.strike')).count()).toEqual(1);
    page.update();
    expect(page.todoList.all(by.css('.strike')).count()).toEqual(2);
    expect(page.todoList.all(by.css('.strike')).get(0).getText()).toEqual('todo1');
    //expect($('[ng-class="{strike: todo.done}"]').isDisplayed()).toBe(true);
  });

  it('should delete a todo', function() {
    var page = new TodoPage();
    page.visit();
    page.delete();
    browser.switchTo().alert().accept();
    expect(page.todoList.count()).toEqual(1);
    expect(page.todoList.get(0).getText()).toEqual('todo2');
  });

  it('should clean todos list', function() {
    var page = new TodoPage();
    page.visit();
    page.clean();
    browser.switchTo().alert().accept();
    expect(page.todoList.count()).toEqual(1);
    expect(page.todoList.get(0).getText()).toEqual('todo1');
  });
});
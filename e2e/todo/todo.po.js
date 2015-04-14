var TodoPage = function() {
  this.addButton = element(by.css('[ng-click="myCtrl.addTodo(tk, selectorForm)"]'));
  this.updateButton = element.all(by.css('[ng-click="myCtrl.updateTodo(todo._id)"]'));
  this.deleteButton = element.all(by.css('[ng-click="myCtrl.delete(todo._id)"]'));
  this.cleanButton = element(by.css('[ng-click="myCtrl.cleanTodo()"]'));
  this.name = element(by.model('tk.name'));
  this.todoList = element.all(by.repeater('todo in myCtrl.todoS'));

  this.visit = function() {
    browser.get('http://localhost:8081/#/todo');
  };

  this.add = function() {
    this.addButton.click();
  };

  this.update = function() {
    this.updateButton.get(0).click();
  };

  this.delete = function() {
    this.deleteButton.get(0).click();
  };

  this.clean = function() {
    this.cleanButton.click();
  };

  this.setName = function(name) {
    this.name.clear();
    this.name.sendKeys(name);
  };
};
module.exports = TodoPage;

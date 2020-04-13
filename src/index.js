import "./styles.scss";

// BUDGET CONTROLLER

var budgetController = (function() {
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    }
  };

  return {
    addItem: function(type, desc, val) {
      var newItem, ID, lastItem;
      //ID = 0;
      // get lastID to add
      if (data.allItems[type].length > 0) {
        lastItem = data.allItems[type].length - 1;
        ID = data.allItems[type][lastItem].id + 1;
      } else {
        ID = 1;
      }

      //create new Item
      if (type === "exp") {
        newItem = new Expense(ID, desc, val);
      } else if (type === "inc") {
        newItem = new Income(ID, desc, val);
      }

      // push in to data structure
      data.allItems[type].push(newItem);

      // return new elm
      return newItem;
    },

    testData: function() {
      console.log(data);
    }
  };
})();

// UI CONTROLLER
var UIController = (function() {
  // best practice for control input name
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
    containerIncome: ".income__list",
    containerExpense: ".expenses__list"
  };

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // inc or exp
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value
      };
    },

    addListItem: function(obj, type) {
      console.log(obj, type);

      var html, container;

      if (type === "inc") {
        container = DOMstrings.containerIncome;
        html =
          '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><ion-icon name="close-outline"></ion-icon></button></div></div></div>';
      } else if (type === "exp") {
        container = DOMstrings.containerExpense;
        html =
          '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><ion-icon name="close-outline"></ion-icon></button></div></div></div>';
      }

      html = html.replace("%id%", obj.id);
      html = html.replace("%description%", obj.description);
      html = html.replace("%value%", obj.value);

      document.querySelector(container).insertAdjacentHTML("beforeend", html);
    },

    getDOMStr: function() {
      return DOMstrings;
    }
  };
})();

// GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {
  var setupEventListeners = function() {
    var DOMS = UICtrl.getDOMStr();
    document
      .querySelector(DOMS.inputBtn)
      .addEventListener("click", ctrlAddItem);
    document.addEventListener("keypress", function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  };

  var ctrlAddItem = function() {
    var input, newItem;
    //1. Get field input data
    input = UICtrl.getInput();
    console.log(input);
    //2. Add item to budget controller

    newItem = budgetCtrl.addItem(input.type, input.description, input.value);
    // budgetCtrl.testData();

    //3. add list item to UI
    UICtrl.addListItem(newItem, input.type);
  };

  return {
    init: function() {
      console.log("App starts");
      setupEventListeners();
    }
  };
})(budgetController, UIController);

controller.init();

// BUDGET CONTROLLER

var budgetController = (function () {
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  Expense.prototype.percentageExpense = function () {
    if (data.allItems.inc.length > 0) {
      return Math.round((this.value / data.totals.inc) * 100);
    } else {
      return -1;
    }
  };

  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function (type) {
    var somme = 0;
    data.allItems[type].forEach(function (curr) {
      somme += curr.value;
    });
    data.totals[type] = somme;
  };

  var data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0,
    },
    budget: 0,
    percentage: -1,
  };

  return {
    addItem: function (type, desc, val) {
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

    deleteItem: function (type, id) {
      var ids, index;
      // id different from index so solution array indexs
      ids = data.allItems[type].map(function (current) {
        return current.id;
      });

      index = ids.indexOf(id); // find index

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    calculateBudget: function () {
      calculateTotal("inc");
      calculateTotal("exp");

      //income - expense
      data.budget = data.totals.inc - data.totals.exp;

      // percentage
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },

    calculatePercentages: function () {
      /**
       * a =20 , b = 10, c = 40
       * totalIncome : 100
       * percentage a = 20/100; b = 10/100 ...
       */
      return data.allItems.exp.map(function (curr) {
        var x = curr.percentageExpense();
        console.log(x);
        return x;
      });
    },

    getBudget: function () {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage,
      };
    },

    testData: function () {
      console.log(data);
    },
  };
})();

// UI CONTROLLER
var UIController = (function () {
  // best practice for control input name
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
    containerIncome: ".income__list",
    containerExpense: ".expenses__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expenseLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    container: ".container",
    percentageItem: ".item__percentage",
  };

  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // inc or exp
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value),
      };
    },

    addListItem: function (obj, type) {
      console.log(obj, type);

      var html, container;

      if (type === "inc") {
        container = DOMstrings.containerIncome;
        html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><ion-icon name="close-outline"></ion-icon></button></div></div></div>';
      } else if (type === "exp") {
        container = DOMstrings.containerExpense;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"><button class="item__delete--btn"><ion-icon name="close-outline"></ion-icon></button></div></div></div>';
      }

      html = html.replace("%id%", obj.id);
      html = html.replace("%description%", obj.description);
      html = html.replace("%value%", obj.value);

      document.querySelector(container).insertAdjacentHTML("beforeend", html);
    },

    deleteListItem: function (selectorId) {
      // no need type cause delete income-1
      var el = document.getElementById(selectorId);
      el.parentNode.removeChild(el);
    },

    clearFields: function () {
      var fields, arr;
      fields = document.querySelectorAll(
        DOMstrings.inputDescription + ", " + DOMstrings.inputValue
      ); // return list

      // convert list to array use slice method : create copy array
      arr = Array.prototype.slice.call(fields);

      // loop array and clear
      arr.forEach(function (current, index, array) {
        current.value = "";
      });

      // focus
      arr[0].focus();
    },

    displayBudget: function (obj) {
      document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMstrings.expenseLabel).textContent =
        obj.totalExp;

      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          obj.percentage + "%";
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = "---";
      }
    },

    displayPercentageItem: function (percentages) {
      console.log("display UI");
      // select all expense item, loop through . get dom
      var fields = document.querySelectorAll(DOMstrings.percentageItem);

      var nodeListForEach = function (nodes, callback) {
        for (var i = 0; i < nodes.length; i++) {
          callback(nodes[i], i);
        }
      };

      nodeListForEach(fields, function (current, index) {
        // function call back

        if (percentages[index] > 0) {
          current.textContent = percentages[index] + "%";
        } else {
          current.textContent = "---";
        }
      });
    },

    getDOMStr: function () {
      return DOMstrings;
    },
  };
})();

// GLOBAL APP CONTROLLER
var controller = (function (budgetCtrl, UICtrl) {
  var setupEventListeners = function () {
    var DOMS = UICtrl.getDOMStr();
    document
      .querySelector(DOMS.inputBtn)
      .addEventListener("click", ctrlAddItem);
    document.addEventListener("keypress", function (event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    document
      .querySelector(DOMS.container)
      .addEventListener("click", ctrlDeleteItem);
  };

  var updateBudget = function () {
    //1. Cal budget
    budgetCtrl.calculateBudget();

    // 2. Return budget
    var budget = budgetCtrl.getBudget();
    console.log(budget);

    //3. UI Budget update
    UICtrl.displayBudget(budget);
  };

  var updatePercentages = function () {
    var percentages = budgetCtrl.calculatePercentages();
    console.log("day la", percentages);

    UIController.displayPercentageItem(percentages);
    //1. Cal percentage
    //2. Read percentage from budget controller
    //3. Update UI percentage
  };

  var ctrlAddItem = function () {
    var input, newItem;
    //1. Get field input data
    input = UICtrl.getInput();
    console.log(input);
    //2. Add item to budget controller

    if (input.description === "" || isNaN(input.value) || input.value <= 0)
      return;
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);
    // budgetCtrl.testData();

    //3. add list item to UI
    UICtrl.addListItem(newItem, input.type);

    // 4. Clear the fiedls
    UICtrl.clearFields();

    //5. Cal budget & update
    updateBudget();

    //6. Cal & update percentage
    updatePercentages();
  };

  var ctrlDeleteItem = function (event) {
    var itemID, splitID, type, ID;
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    console.log(itemID);
    if (itemID) {
      //inc-1
      splitID = itemID.split("-");
      type = splitID[0];
      ID = +splitID[1];

      //1. Delete item from data structure
      budgetCtrl.deleteItem(type, ID);
      //2. Delete from UI

      UICtrl.deleteListItem(itemID);
      //3. Update budget
      updateBudget();
      budgetCtrl.testData();

      //4. percentage too when delete item
      updatePercentages();
    }
  };

  return {
    init: function () {
      console.log("App starts");
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1,
      }); // reset data budget
      setupEventListeners();
    },
  };
})(budgetController, UIController);

controller.init();

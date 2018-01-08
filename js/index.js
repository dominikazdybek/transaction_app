$(document).ready(function() {
  var idGenerator = 0;
  var rate = 1;
  var sum = 0;
  var highestTransaction;
  var max = 0;
  var transactions = [];

  $("#add-transaction").click(addTransaction);
  $("#transaction-list").on("click", ".delete-transaction", deleteTransaction);
  $("#converter").keyup(updateConverter);

  function addTransaction(event) {
    event.preventDefault();
    var name = $("#title").val();
    var value = $("#amount").val();

    if (isIncorrectForm(name, value)) {
      alert("Wrong title or value!");
      return;
    }

    newTransaction = appendTransactionObject(name, +value);
    changeSum();
    findHighestTransaction(transactions);
    addTransactionDOM(newTransaction);
    updateHighestTransactionDOM();
    shouldListAppear();
  }

  function deleteTransaction() {
    var idToDelete = $(this).data("id");

    deleteTransactionObject(idToDelete);
    deleteTransactionDOM($(this));
    changeSum();
    shouldListDisappear();
    deleteHighestTransaction(idToDelete);
  }

  function updateConverter() {
    var val = $("#converter").val();
    updateRate(val);
    updateTransactionsObject();
    updateTransactionsPlnDOM();
    changeSum();
  }

  function isIncorrectForm(name, value) {
    return name.length == 0 || name.length > 100 || value.length == 0;
  }

  function shouldListAppear() {
    if (transactions.length == 1) {
      $("#hide").removeClass("hidden");
    }
  }

  function shouldListDisappear() {
    if (transactions.length == 0) {
      $("#hide").addClass("hidden");
    }
  }

  function deleteHighestTransaction(idToDelete) {
    if (highestTransaction.id == idToDelete) {
      max = 0;
      findHighestTransaction();
      updateHighestTransactionDOM();
    }
  }

  function appendTransactionObject(name, value) {
    var newTransaction = {
      id: idGenerator,
      name: name,
      value: {
        EUR: value,
        PLN: value * rate
      }
    };
    idGenerator += 1;
    transactions.push(newTransaction);
    return newTransaction;
  }

  function addTransactionDOM(newTransaction) {
    var newTransactionDOM = generateTransactionElement(newTransaction);
    $("#transaction-list").append(newTransactionDOM);
  }

  function changeSum() {
    sum = 0;
    for (var i = 0; i < transactions.length; i++) {
      sum += transactions[i].value.PLN;
    }
    $("#sum").val(sum.toFixed(2));
  }

  function findHighestTransaction() {
    for (var i = 0; i < transactions.length; i++) {
      if (transactions[i].value.EUR > max) {
        highestTransaction = transactions[i];
        max = transactions[i].value.EUR;
      }
    }
  }

  function updateHighestTransactionDOM() {
    var highestTransactionDOM = generateTransactionElement(highestTransaction);
    $("#highest").html(highestTransactionDOM);
  }

  function deleteTransactionObject(idToDelete) {
    for (var i = 0; i < transactions.length; i++) {
      if (transactions[i].id == idToDelete) transactions.splice(i, 1);
    }
  }

  function deleteTransactionDOM(deleteButtonElem) {
    deleteButtonElem.closest("li").remove();
  }

  function updateRate(val) {
    rate = val;
  }

  function updateTransactionsObject() {
    for (var i = 0; i < transactions.length; i++) {
      transactions[i].value.PLN = transactions[i].value.EUR * rate;
    }
  }

  function updateTransactionsPlnDOM() {
    $(".pln-val").val($(".eur-val").val() * rate);
  }

  function generateTransactionElement(transaction) {
    return (
      '<li class="single-transaction">' +
      '<div class="form-group">' +
      '<div class="col-xs-7">' +
      '<input type="text" class="form-control" value="' +
      transaction.name +
      '" readonly>' +
      "</div>" +
      '<div class="col-xs-2">' +
      '<input type="number" class="form-control eur-val" value="' +
      transaction.value.EUR.toFixed(2) +
      '" readonly>' +
      '<small id="eurHelp" class="form-text text-muted">' +
      "Value in EUR" +
      "</small>" +
      "</div>" +
      '<div class="col-xs-2">' +
      '<input type="number" class="form-control pln-val" value="' +
      transaction.value.PLN.toFixed(2) +
      '" readonly>' +
      '<small id="eurHelp" class="form-text text-muted">' +
      "Value in PLN" +
      "</small>" +
      "</div>" +
      '<span class="form-inline-btn">' +
      '<button class="btn btn-danger delete-task-btn delete-transaction" data-id="' +
      transaction.id +
      '"><span class="glyphicon glyphicon-remove"></span></button>' +
      "</span>" +
      "</li>"
    );
  }
});

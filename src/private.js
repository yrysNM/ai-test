const bank = (function () {
  const accounts = [];

  //private function
  function getInternalbankLogs() {}

  function openAccount(data) {
    accounts.push(data);
  }

  function deposit(accountNum, amount) {
    //...
  }

  function withdraw(accountNum, amount) {
    //..
  }

  return {
    openAccount,
    deposit,
    withdraw,
  };
})();

bank.openAccount();
// console.
// bank.accounts();

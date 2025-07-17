function Employee(name, age, id) {
  this.name = name;
  this.age = age;
  this.id = id;
}

function BankEmployee(name, age, id, bankName) {
  // delegate the responsibility of adding
  // 'name',  'age', 'id' properties to
  // the PErson constructor
  Employee.call(this, name, age, id);
  this.bankName = bankName;
}

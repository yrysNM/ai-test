let name = "Jane Doe";
var age = 20;

function introduce(name, age) {
  console.log("Hello, I am " + name + " and I am " + age + " years old");
}

/**
 * uncought typeerror: getAge is not a function 
getAge(1990);
const getAge = function (yearOfBirth) {
  console.log(new Date().getFullYear - yearOfBirth);
};
  */

/**
 * @INFO first debug rule

  debugger;
  function bar() {
    console.log("TEST");
  }

  function baz() {
    bar();
  }

  function foo() {
    baz();
  }

  foo();

*/

// ("use strict");
// function process() {
//   var fnInsideBlockVar;

//   if (true) {
//     // console.log("processing...");

//     let fnInsideBlock = function fnInsideBlock() {
//       console.log("test fm inside a block");
//     };

//     console.log("processing...");
//     fnInsideBlockVar = fnInsideBlock;
//   }
//   fnInsideBlockVar();
// }

// process();

{
  // TDZ start
  console.log("hello");
  console.log("world");
  let ocunt = 5; // TDZ end

  // can access "count" after TDZ ends
}

const test = "Test";
let prefix = ">";
const test_name = "John Wick";

function hello() {
  const greeting = "hello " + test;
  console.log(greeting);
}

function printSquare(num) {
  let res = num * num;
  console.log(res);
}

function log(logLevel, msg) {
  let prefix = ":::";
  console.log(`${prefix} ${logLevel} : ${msg}`);
}

function param_scope(arr = ["initial array"], buff = () => arr) {
  var arr = [1, 2, 3];
  console.log(arr);
  console.log(buff());
}

function hello_John() {
  const greeting = "hello " + test_name;

  function greet() {
    console.log(greeting);
  }

  greet();
}

hello_John();
printSquare(9);
log("debug", "error cought");
hello();
param_scope();
// console.log("implicit global " + res);

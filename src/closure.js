/**
 * @CLOSURE how it calls and works
 */

function outerFn() {
  const outerVal = 123;

  return function insideFn() {
    console.log(outerVal);
  };
}

const insideFn = outerFn();

insideFn();

/**
 * @CLOSURES test function call variable
 */

let isReading = true;

function testJS() {
  function stepsToLearnJS() {
    console.log(isReading);
  }

  stepsToLearnJS();
}

testJS();

function createGreeting(greetMsg) {
  function greet(personName) {
    console.log(`${greetMsg} ${personName}!`);
  }
  return greet;
}

const sayHello = createGreeting("Hello");
sayHello("Mike");

/**
 * @CLOSURE in loop
 */

// for (var i = 1; i <= 3; i++) {
//   ((counter) => {
//     setTimeout(() => {
//       console.log(counter, i);
//     }, 1000);
//   })(i);
// }

for (let i = 1; i <= 3; i++) {
  setTimeout(() => {
    console.log(i);
  }, 1000);
}

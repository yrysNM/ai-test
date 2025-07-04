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

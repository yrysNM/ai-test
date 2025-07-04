/**
 * @PREFER string
 * obj => return hello world if toString undefiend or not primative value obj will call valueOf method
 * obj2 => if valueOf and toString are not primative it turns error **Uncaught TypeError: Cannot convert object to primitive value**
 */

const obj = {
  toString() {
    console.log("to string invoked");
    return "hello world";
  },
  valueOf() {
    console.log("valueof invoked");
    return 123;
  },
};

console.log(`${obj}`);

const obj2 = {
  toString() {
    console.log("to string invoked");
    return [];
  },
  valueOf() {
    console.log("valueof invoked");
    return [];
  },
};

// console.log(`${obj2}`);

/**
 * @NoPreference toPerimitive
 */

const obj3 = {
  [Symbol.toPrimitive](hint) {
    if (hint === "string") {
      return "hello";
    } else {
      return 123;
    }
  },
};

console.log(obj3 + 1, `${obj3}`, obj3.toString(), obj3.valueOf());

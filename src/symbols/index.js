const propSymbol = Symbol("property symbol.");

console.log(propSymbol.description);

const globalSymbolKey = "my-global-test-Symbol";
const mySymbol = Symbol.for(globalSymbolKey);

console.log(mySymbol === Symbol.for(globalSymbolKey));

const movie = {
  name: "TEST",
  releaseDate: "09 June, 1992",

  [Symbol.toPrimitive](hint) {
    if (hint === "number") {
      return new Date(this.releaseDate).getTime();
    } else {
      return this.name;
    }
  },
};

console.log(Number(movie));
console.log(String(movie));

const arr = [1, 2, 4];

console.log(arr.toString());
console.log(Object.prototype.toString.call(arr));

const task = {
  title: "exercise",
  isComplete: false,
  [Symbol.toStringTag]: "Task",
};

console.log(task.toString());

// Symbol.isConcatSpreadable
// _________________________________________________
console.log([].concat(arr));

arr[Symbol.isConcatSpreadable] = false;
console.log([].concat(arr));
const obj = {
  0: 123,
  1: 456,
  length: 2,
  [Symbol.isConcatSpreadable]: true,
};

console.log([].concat(obj));

function block() {
  const start = new Date();

  while (new Date() - start < 3000) {
    // simulate long running operation
    // that takes approximately 3 seconds
  }
}

console.log("Before long running operation");
// gets logged immediately

block();
console.log("After long running operation");
// gets logged after approximately 3 seconds

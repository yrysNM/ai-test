function Car(name, model) {
  this.name = name;
  this.model = model;
}

Car.prototype.start = function () {
  console.log("starting the engine of " + this.name);
};

const kia = new Car("kia", "1995");
const honda = new Car("honda", "2021");

kia.start();
honda.start();

console.log(Object.getOwnPropertyNames(Car));

// {
//   constructor: <Car function />;
// }

console.log(Car.prototype.constructor === Car);

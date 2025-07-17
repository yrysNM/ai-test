const btnElement = document.getElementById("form-btn");

class FormHandler {
  constructor(submitBtn) {
    // submitBtn.addEventListener("click",  this.submitForm); // error handler this undefiend

    submitBtn.addEventListener("click", () => this.submitForm());
  }

  submitForm() {
    this.sendRequest();
  }

  sendRequest() {
    console.log("sending request");
  }
}

new FormHandler(btnElement);

function Counter(startingValue) {
  this.value = startingValue;
}

Counter.prototype.incrementFactory = function (incrementStep) {
  // one of  the solution is bind method
  /**
   * const incrementFN = function() {
   *  this.value += incrementStep
   *  console.log(this.value)
   * }
   *
   * return a function with 'this' bound
   * to the object use to invoke the
   * incrementFactory method
   * return incrementFN.bind(this);
   */
  return () => {
    this.value += incrementStep;
    console.log(this.value);
  };
};

const counter = new Counter(0);
const inc5 = counter.incrementFactory(5);
inc5();
inc5();
inc5();

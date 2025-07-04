// import "./base";
import "./coercion";
import "./private";

for (var i = 1; i <= 3; i++) {
  (function (counter) {
    setTimeout(() => {
      console.log(counter, i);
    }, 1000);
  })(i);
}

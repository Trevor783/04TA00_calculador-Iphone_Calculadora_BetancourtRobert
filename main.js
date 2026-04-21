const display = document.getElementById("display");
const historyDisplay = document.getElementById("history");
const buttons = document.querySelectorAll(".btn");

let currentValue = "0";
let previousValue = null;
let operator = null;
let shouldResetDisplay = false;

function updateDisplay() {
  display.textContent = currentValue;
}

function updateHistory(text = "") {
  historyDisplay.textContent = text;
}

function inputNumber(num) {
  if (shouldResetDisplay) {
    currentValue = num;
    shouldResetDisplay = false;
  } else {
    currentValue = currentValue === "0" ? num : currentValue + num;
  }
}

function inputDecimal() {
  if (shouldResetDisplay) {
    currentValue = "0.";
    shouldResetDisplay = false;
    return;
  }
  if (!currentValue.includes(".")) {
    currentValue += ".";
  }
}

function clear() {
  currentValue = "0";
  previousValue = null;
  operator = null;
  updateHistory("");
}

function toggleSign() {
  currentValue = (parseFloat(currentValue) * -1).toString();
}

function percent() {
  currentValue = (parseFloat(currentValue) / 100).toString();
}

function handleOperator(op) {
  if (operator && !shouldResetDisplay) {
    calculate();
  }
  previousValue = currentValue;
  operator = op;
  shouldResetDisplay = true;
  updateHistory(`${previousValue} ${operator}`);
}

function calculate() {
  if (!operator || previousValue === null) return;

  const prev = parseFloat(previousValue);
  const current = parseFloat(currentValue);
  let result;

  switch (operator) {
    case "+": result = prev + current; break;
    case "−": result = prev - current; break;
    case "×": result = prev * current; break;
    case "÷": result = current === 0 ? "Error" : prev / current; break;
  }

  updateHistory(`${previousValue} ${operator} ${current} =`);
  currentValue = result.toString();
  operator = null;
  previousValue = null;
  shouldResetDisplay = true;
}


buttons.forEach(button => {
  button.addEventListener("click", () => handleInput(button));
});


document.addEventListener("keydown", (e) => {
  const key = e.key;

  if (!isNaN(key)) inputNumber(key);
  else if (key === ".") inputDecimal();
  else if (key === "Enter" || key === "=") calculate();
  else if (key === "Backspace") clear();
  else if (key === "+") handleOperator("+");
  else if (key === "-") handleOperator("−");
  else if (key === "*") handleOperator("×");
  else if (key === "/") handleOperator("÷");
  else return;

  animateKey(key);
  updateDisplay();
});


function handleInput(button) {
  const number = button.getAttribute("data-number");
  const action = button.getAttribute("data-action");

  if (number !== null) inputNumber(number);
  else if (action === "decimal") inputDecimal();
  else if (action === "clear") clear();
  else if (action === "sign") toggleSign();
  else if (action === "percent") percent();
  else if (action === "operator") handleOperator(button.textContent);
  else if (action === "equals") calculate();

  updateDisplay();
}


function animateKey(key) {
  buttons.forEach(btn => {
    if (
      btn.textContent === key ||
      (key === "*" && btn.textContent === "×") ||
      (key === "/" && btn.textContent === "÷") ||
      (key === "-" && btn.textContent === "−")
    ) {
      btn.classList.add("active");
      setTimeout(() => btn.classList.remove("active"), 100);
    }
  });
}

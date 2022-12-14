const display = document.querySelector("#display");
const prevValueDisplay = document.querySelector("#prevValue");
const moduleButton = document.querySelector(".module");
const powButton = document.querySelector(".pow");
const sqrtButton = document.querySelector(".sqrt");
const sumButton = document.querySelector(".sum");
const resButton = document.querySelector(".minus");
const byButton = document.querySelector(".by");
const divButton = document.querySelector(".div");
const dotButton = document.querySelector(".dot");
const resetButton = document.querySelector(".reset");
const equalButton = document.querySelector(".equal");
const inputValues = document.querySelectorAll(".value");
const operatorButtons = document.querySelectorAll(".operator");

const errorMessage = "ERROR"

//we only are using this if we are carrying previus operation
let prevOperandValue = undefined;
let prevOperator = undefined;
let currentOperator = undefined;
let firstValue = 0;
let secondValue = undefined;

inputValues.forEach(el => {
  const value = el.dataset.value
  el.addEventListener("click", () => pushValue(value))
})

operatorButtons.forEach(el => {
  const operator = el.dataset.value;
  el.addEventListener("click",() => {
    handleOperationInputs(operator)
  })
})

resetButton.addEventListener("click",resetCalculator)

equalButton.addEventListener("click",() => calculate())

const operations = ["+","-","/","*","mod"]

function pushValue(value){
  if  (value === "." && firstValue?.toString().includes(".")) return
  if (!firstValue || firstValue === '0')
    firstValue = value
  else
    firstValue = `${firstValue}${value}`
  updateDisplay()
}

function updateDisplay(){
  let resp = ''
  if (firstValue || firstValue == 0) resp = `${resp}${firstValue}`
  // if (currentOperator) {
  //   const operator = currentOperator === "mod" ? " mod " : currentOperator
  //   resp = `${resp}${operator}`
  // }
  // if (secondValue) resp = `${resp}${secondValue}`
  putValueOnDisplay(resp)
}

function putValueOnDisplay(value){
  display.textContent = firstValue;
  let prevTextContent = secondValue ?? ""
  prevTextContent+=currentOperator ? ` ${currentOperator}` : ""
  prevValueDisplay.textContent = prevTextContent
}

function resetCalculator() {
  prevOperandValue = undefined
  prevOperator = undefined
  currentOperator = undefined
  firstValue = 0;
  secondValue = undefined;
  putValueOnDisplay(firstValue)
}

function handleOperationInputs(operator){
  if (firstValue === "") return
  if (secondValue || secondValue == 0)
    calculate()
  currentOperator = operator;
  secondValue = firstValue;
  firstValue = ""
  //if the new operator is different than the one before then reset the previous operands
  // if (prevOperator !== operator){
  //   prevOperator = undefined;
  //   prevOperandValue = undefined
  // }
  // if there is a first and second value then calculate the result before everything

  // if (!secondValue)
  //   currentOperator = operator
  // if (operator === "-"){
    // const subs = display.innerHTML.substr(1, display.innerHTML.length - 1)
    // console.log(subs)
    // if (!subs.includes("-") && display.innerHTML !== "-")
  //     pushValue("-")
  // }
  // if (operator === "mod"){
  //   if (!display.innerHTML.includes(operator))
  //     pushValue(" mod ")
  // }
  // else {
  //   if (!display.innerHTML.includes(operator))
  //     pushValue(operator)
  // }
  updateDisplay()
}

function calculate(){
  // const {firstValue,secondValue,operator} = getOperationInputs()
  let operator = currentOperator;
  let first = parseFloat(firstValue);
  let second = parseFloat(secondValue);

  let resp
  switch (operator) {
    case "+":
      resp = first + second
      break;
    case "-":
      resp = first - second
      break;
    case "*":
      resp = first * second
      break;
    case "/":
      resp = first / second
      break;
    case "mod":
      resp = first % second
      break
    default:
      resp = undefined
      break;
  }
  firstValue = resp;
  //storing values of the prev operation
  // prevOperandValue = second
  // prevOperator = operator
  //resetting operator and firstValue
  currentOperator = undefined;
  secondValue = undefined;
  updateDisplay()
}

const regExp = /[+\-\*\/]/g

function getOperationInputs(){
  let currentValue = display.innerHTML;
  let isFirstNegative = false
  //checking if the display has a "-" at the beginning meaning a negative number
  const firstOperator = currentValue[0].match(regExp)
  if (firstOperator?.length > 0){
    if (currentValue[0] === "-"){
      currentValue = currentValue.substr(1,currentValue.length)
      isFirstNegative = true
    } else {
      //is it is other operator the make the first value a 0
      currentValue = `0${currentValue}`
    }
  }

  //getting values and operators
  let operator = currentOperator
  let firstValue,secondValue
  if (operator === "mod")
    [firstValue,secondValue] = currentValue.split(" mod ");
  else
    [firstValue,secondValue] = currentValue.split(regExp);

  //multipliying first value by (-1) if it was negative
  if (isFirstNegative)
    firstValue = parseFloat(firstValue)*(-1)

  //if there is no second value and operator it means we are carrying the prev operation
  if (!secondValue && !operator){
    // secondValue = prevOperandValue
    // operator = prevOperator
  }

  return {
    firstValue,secondValue,operator
  }
}

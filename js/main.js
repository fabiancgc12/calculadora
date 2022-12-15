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

equalButton.addEventListener("click",() => {
  if (!secondValue && !currentOperator && prevOperandValue && prevOperator)
    calculate(prevOperandValue,firstValue,prevOperator)
  else
    calculate(firstValue, secondValue, currentOperator)
})

function pushValue(value){
  prevOperandValue = undefined;
  prevOperator = undefined
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
  prevOperandValue = undefined;
  prevOperator = undefined
  if (firstValue === "-") return
  if (operator === "root"){
    currentOperator = operator;
    calculate(firstValue,1,currentOperator)
    return
  }
  if (operator === "-" && !firstValue){
    firstValue="-";
    updateDisplay()
    return
  }
  if (firstValue === "") {
    currentOperator = operator;
    updateDisplay()
    return
  }
  if (secondValue || secondValue == 0)
    calculate(firstValue,secondValue,currentOperator)

  currentOperator = operator;
  secondValue = firstValue;
  firstValue = ""
  updateDisplay()
}

function calculate(currentValue,prevValue,operator){
  // const {firstValue,secondValue,operator} = getOperationInputs()
  currentValue = parseFloat(currentValue);
  prevValue = parseFloat(prevValue);
  if ((isNaN(prevValue) || isNaN(currentValue)) && operator !== "root") return
  let resp
  switch (operator) {
    case "+":
      resp =  prevValue + currentValue
      break;
    case "-":
      resp =  prevValue - currentValue
      break;
    case "*":
      resp =  prevValue * currentValue
      break;
    case "/":
      resp = prevValue / currentValue
      break;
    case "mod":
      resp =  prevValue % currentValue
      break;
    case "^":
      resp =  prevValue ** currentValue
      break;
    case "root":
      resp =  Math.sqrt(currentValue)
      break;
    default:
      resp = undefined
      break;
  }
  // if the case was default then do nothing
  if (resp === undefined) return
  //if the result is NaN or infinity then show error message
  if (isNaN(resp) || resp === Number.POSITIVE_INFINITY || resp === Number.NEGATIVE_INFINITY){
    resetCalculator()
    firstValue = undefined
    updateDisplay()
    display.innerHTML = errorMessage;
    return
  }
  firstValue = resp;
 // storing values of the prev operation only when there is none set
  if (!prevOperandValue){
    prevOperandValue = currentValue
    prevOperator = operator
  }
  //resetting operator and firstValue
  currentOperator = undefined;
  secondValue = undefined;
  updateDisplay()
}

const display = document.querySelector("#display");
const prevValueDisplay = document.querySelector("#prevValue");
const backButton = document.querySelector(".back");
const resetButton = document.querySelector(".reset");
const equalButton = document.querySelector(".equal");
const inputValues = document.querySelectorAll(".value");
const operatorButtons = document.querySelectorAll(".operator");

const maxDigits = 6
const errorMessage = "ERROR"

//we only are using this if we are carrying previus operation
let prevOperandValue = undefined;
let prevOperator = undefined;
let currentOperator = undefined;
let firstValue = '';
let secondValue = undefined;

inputValues.forEach(el => {
  const value = el.dataset.value
  el.addEventListener("click", () => pushValueOnDisplay(value))
})

operatorButtons.forEach(el => {
  const operator = el.dataset.value;
  el.addEventListener("click",() => {
    handleOperationInputs(operator)
  })
})

resetButton.addEventListener("click",resetCalculator)

equalButton.addEventListener("click",() => {
  if (hasError()) return
  if (secondValue === undefined && !currentOperator && prevOperandValue && prevOperator)
    calculate(prevOperandValue,firstValue,prevOperator)
  else if ((secondValue || secondValue === 0) && currentOperator){
    display.classList.add("moveDisplayDown");
    calculate(firstValue, secondValue, currentOperator);
    display.onanimationend = () => {
      display.classList.remove("moveDisplayDown")
      display.onanimationend = () => {}
    }
  }

})

backButton.addEventListener("click",(e) => {
  prevOperator = undefined
  prevOperandValue = undefined;
  //dont do nothing if there was an error
  if (hasError()) return
  if (firstValue?.toString().length > 0){
    firstValue = firstValue.toString().substr(0,firstValue.toString().length - 1)
    updateDisplay()
  }
  else{
    display.classList.add("moveDisplayDown");
    currentOperator = undefined
    firstValue = secondValue ?? "";
    secondValue = undefined;
    updateDisplay();
    //this will start the animation of the current value on top to down
    //pure css was not enough
    display.onanimationend = () => {
      display.classList.remove("moveDisplayDown")
      display.onanimationend = () => {}
    }
  }
})

function pushValueOnDisplay(value){
  prevOperandValue = undefined;
  prevOperator = undefined;
  if (hasError()) return
  if  (value === "." && firstValue?.toString().includes(".")) return
  firstValue = `${firstValue}${value}`
  updateDisplay()
}

function updateDisplay(){
  let prevTextContent = "";
  if (secondValue || secondValue == 0){
    prevTextContent = formatDisplay(secondValue)
  }
  prevTextContent+=currentOperator ? ` ${currentOperator}` : ""
  // display.textContent = formatDisplay(firstValue)
  prevValueDisplay.textContent = prevTextContent
  putValueOnDisplay(formatDisplay(firstValue))
}

function putValueOnDisplay(value){
  display.textContent = value
}

function formatDisplay(value){
  if (value === undefined)
    return ""
  const normalFormat = value.toLocaleString("en-US",{
    maximumFractionDigits:maxDigits,
  });
  if (normalFormat === "0") return value;
  if (normalFormat.length > 15){
    return value.toLocaleString("en-US",{
      maximumFractionDigits:maxDigits,
      notation:"scientific"
    })
    const dot = value.toString().endsWith(".") ? "." : ""
    return scientificFormatter.format(value) + dot
  }
  return normalFormat
}

const scientificFormatter = new Intl.NumberFormat("en-US",{
  maximumFractionDigits:maxDigits,
  notation:"scientific"
})


function hasError(){
  return display.textContent === errorMessage
}

function resetCalculator() {
  prevOperandValue = undefined
  prevOperator = undefined
  currentOperator = undefined
  firstValue = '';
  secondValue = undefined;
  updateDisplay()
}

function handleOperationInputs(operator){
  prevOperandValue = undefined;
  prevOperator = undefined;
  if (hasError()) return
  if (firstValue === "" && !secondValue && operator !== "-") return
  if (firstValue === "-") return
  if (operator === "root"){
    currentOperator = operator;
    calculate(1,firstValue,currentOperator)
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
      resp =  Math.sqrt(prevValue)
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
    putValueOnDisplay(errorMessage)
    return
  }
  // haciendo que tenga un maximo de 5 digitos
  firstValue = parseFloat(resp.toFixed(maxDigits));
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

const valuesKeys = ['1','2','3','4','5','6','7','8','9','0','.']
const operatorsKeys = ['+','-','/','*','r','m','p']

document.addEventListener("keydown",(e) => {
  //this one is to stop the normal behavior of enter
  //THIS CAUSED A BUG THAT TOOK LIKE 24 HOURS TO SOLVE WTF
  e.preventDefault()
  const key = e.key.toLowerCase()
  if (valuesKeys.includes(key)){
    pushValueOnDisplay(key)
  }
  else if (operatorsKeys.includes(key)){
    if (key === "r")
      handleOperationInputs("root")
    else if (key === "m")
      handleOperationInputs("mod")
    else if (key === "p")
      handleOperationInputs("^")
    else
      handleOperationInputs(key)
  }
  else if (key === "enter"){
    equalButton.click()
  }
  else if (key === "backspace"){
    backButton.click()
  }
  else if (key === "delete"){
    resetButton.click()
  }
})

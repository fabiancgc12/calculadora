const display = document.querySelector("#display");
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

//we only are using this if we are carrying previus operation
let prevOperandValue = undefined;
let prevOperator = undefined;
let currentOperator = undefined;
let firstValue = undefined;
let secondValue = undefined;

inputValues.forEach(el => {
  const value = el.dataset.value
  if (value === ".")
    el.addEventListener("click", () => {
      //checking if display already has a dot
      pushValue(value)
    })
  else
    el.addEventListener("click", () => pushValue(value))
})

operatorButtons.forEach(el => {
  const operator = el.dataset.value;
  el.addEventListener("click",() => {
    handleOperationInputs(operator)
  })
})

resetButton.addEventListener("click",() => {
  prevOperandValue = undefined
  prevOperator = undefined
  currentOperator = undefined
  firstValue = undefined;
  secondValue = undefined;
  putValueOnDisplay(firstValue)
})

equalButton.addEventListener("click",() => calculate())

const operations = ["+","-","/","*","mod"]

function pushValue(value){
  // const currentValue = display.innerHTML;
  if (currentOperator){
    if  (value === "." && secondValue?.toString().includes(".")) return
    if (!secondValue || secondValue === "0")
      secondValue = value
    else
      secondValue = `${secondValue}${value}`
  }
  else{
    if  (value === "." && firstValue?.toString().includes(".")) return
    if (!firstValue || firstValue === '0')
      firstValue = value
    else
      firstValue = `${firstValue}${value}`
  }
  updateDisplay()
  // if (currentValue === "0")
  //   putValueOnDisplay(value)
  // else
  //   putValueOnDisplay(`${display.innerHTML}${value}`)
}

function updateDisplay(){
  let resp = ''
  if (firstValue) resp = `${resp}${firstValue}`
  if (currentOperator) {
    const operator = currentOperator === "mod" ? " mod " : currentOperator
    resp = `${resp}${operator}`
  }
  if (secondValue) resp = `${resp}${secondValue}`
  putValueOnDisplay(resp)
}

function putValueOnDisplay(value){
  display.textContent = value
}

function handleOperationInputs(operator){
  // if there is a first and second value then calculate the result before everything
  if (firstValue && secondValue)
    calculate()
  if (!secondValue)
    currentOperator = operator
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
  let first = firstValue ?? 0;
  let second = secondValue ?? 0;

  if (!secondValue && !operator){
    second = prevOperandValue
    operator = prevOperator
  }
//   console.log({
//     firstValue,secondValue,operator
// })

  // if prev is empty it means there is no value to make and operation,
  // just put the first value on the display
  // if (!secondValue){
  //   putValueOnDisplay(firstValue)
  // }

  let resp
  switch (operator) {
    case "+":
      resp = parseFloat(first) + parseFloat(second)
      break;
    case "-":
      resp = parseFloat(first) - parseFloat(second)
      break;
    case "*":
      resp = parseFloat(first) * parseFloat(second)
      break;
    case "/":
      resp = parseFloat(first) / parseFloat(second)
      break;
    case "mod":
      resp = parseFloat(first) % parseFloat(second)
      break
    default:
      resp = undefined
      break;
  }
  firstValue = resp;
  //storing values of the prev operation
  prevOperandValue = second
  prevOperator = operator
  //resetting operator and secondvalue
  currentOperator = undefined;
  secondValue = undefined

  // debugger
  if (resp || resp === 0){
    putValueOnDisplay(resp)
  }
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
    secondValue = prevOperandValue
    operator = prevOperator
  }

  return {
    firstValue,secondValue,operator
  }
}

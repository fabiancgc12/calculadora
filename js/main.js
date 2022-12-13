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

//we only are using this if we are carrying previus operation
let prevOperandValue = undefined;
let prevOperator = undefined

function pushValue(digit){
  const currentValue = display.innerHTML;
  if (currentValue === "0")
    putValueOnDisplay(digit)
  else
    putValueOnDisplay(`${display.innerHTML}${digit}`)
}

inputValues.forEach(el => {
  const value = el.dataset.value
  if (value === ".")
    el.addEventListener("click", () => {
      //checking if display already has a dot
      if (!display.innerHTML.includes("."))
        pushValue(value)
    })
  else
    el.addEventListener("click", () => pushValue(value))
})

function putValueOnDisplay(value){
  display.textContent = value
}

resetButton.addEventListener("click",() => {
  prevOperandValue = undefined
  prevOperator = undefined
  putValueOnDisplay(0)
})

equalButton.addEventListener("click",() => calculate())

sumButton.addEventListener("click", () => {
  handleOperationInputs("+")

})

resButton.addEventListener("click",() =>{
  handleOperationInputs("-")
})

function handleOperationInputs(operator){
  if (prevOperator === operator)
    calculate()
  if (operator === "-"){
    const subs = display.innerHTML.substr(1, display.innerHTML.length - 1)
    console.log(subs)
    if (!subs.includes("-") && display.innerHTML !== "-")
      pushValue("-")
  } else {
    if (!display.innerHTML.includes(operator))
      pushValue(operator)
  }
}

function calculate(){
  const {firstValue,secondValue,operator} = getOperationInputs()

  console.log({
    firstValue,secondValue,operator
  })

  // if prev is empty it means there is no value to make and operation,
  // just put the first value on the display
  if (!secondValue){
    putValueOnDisplay(firstValue)
  }

  let resp
  switch (operator) {
    case "+":
      resp = parseFloat(firstValue) + parseFloat(secondValue)
      break;
    case "-":
      resp = parseFloat(firstValue) - parseFloat(secondValue)
      break;
    default:
      resp = undefined
      break;
  }
  prevOperandValue = secondValue
  prevOperator = operator
  // debugger
  if (resp)
    putValueOnDisplay(resp)
}

function getOperationInputs(){
  let currentValue = display.innerHTML;
  let isFirstNegative = false
  //checking if the display has a "-" at the beggining meaning a negative number
  const firstOperator = currentValue[0].match(/[+-]/g)
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
  let [firstValue,secondValue] = currentValue.split(/[+-]/g);
  let operator = currentValue.substr(firstValue.length,1)

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

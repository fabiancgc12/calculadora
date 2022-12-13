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
  //checking if display is number, if it is concat digit if not just put the digit
  // debugger
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
  calculate()
  pushValue("+")
})

resButton.addEventListener("click",() =>{
  calculate()
  pushValue("-")
})

function calculate(){
  let currentValue = display.innerHTML;
  let isFirstNegative = false
  //checking if the display has a "-" at the beggining meaning a negative number
  const firstOperator = currentValue[0].match(/[+-]/g)
  if (currentValue[0] === "-"){
    currentValue = currentValue.substr(1,currentValue.length)
    isFirstNegative = true
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


  // if prev is still empty it means there is no value to make and operation,
  // just put the first value on the display
  if (!secondValue){
    putValueOnDisplay(firstValue)
  }

  //if the is a second value but not first it means the operations is "-operator-number"
  //then make the first a 0
  if (!firstValue){
    firstValue = 0
  }

  console.log({
    firstValue,secondValue,operator
  })

  //now we are making the maths
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

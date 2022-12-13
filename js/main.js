const display = document.querySelector("#display");
const moduleButton = document.querySelector(".module");
const powButton = document.querySelector(".pow");
const sqrtButton = document.querySelector(".sqrt");
const sumButton = document.querySelector(".sum");
const resButton = document.querySelector(".res");
const byButton = document.querySelector(".by");
const divButton = document.querySelector(".div");
const dotButton = document.querySelector(".dot");
const resetButton = document.querySelector(".reset");
const equalButton = document.querySelector(".equal");
const inputValues = document.querySelectorAll(".value");

let prevValue = 0;
let operation = () => prevValue

function pushValue(digit){
  const currentValue = parseFloat(display.innerHTML);
  //checking if display is number, if it is concat digit if not just put the digit
  if (isNaN(currentValue))
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
  putValueOnDisplay("")
})

equalButton.addEventListener("click",() => {
  operation()
})

sumButton.addEventListener("click", () => {
  if (!isNaN(parseFloat(display.innerHTML)))
    prevValue = display.innerHTML
  putValueOnDisplay("+")
  operation = () => {
    display.textContent = `${parseFloat(prevValue) + parseFloat(display.innerHTML)}`
  }
})

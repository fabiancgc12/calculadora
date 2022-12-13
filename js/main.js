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
const values = document.querySelectorAll(".value");

function pushValue(digit){
  const currentValue = display.innerHTML;
  putValueOnDisplay(`${currentValue}${digit}`)
}

values.forEach(el => {
  const value = el.dataset.value
  el.addEventListener("click", () => pushValue(value))
})

function putValueOnDisplay(value){
  display.textContent = value
}

resetButton.addEventListener("click",() => {
  putValueOnDisplay("")
})

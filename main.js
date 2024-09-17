const form = document.getElementById("form");
const billInput = document.getElementById("bill-input");
const peopleInput = document.getElementById("people-input");
const billErrorLabel = document.getElementById("bill-error-label");
const peopleErrorLabel = document.getElementById("people-error-label");
const tipsOptionsList = document.querySelector(".tips-options-list");
const tipOptions = document.querySelectorAll(".radio-button");
const customTipOption = document.getElementById("custom-tip-option");
const resetButton = document.getElementById("reset-button");

const roundDown = (amount) => {
  return Math.floor(amount * 100) / 100;
};

const roundUp = (amount) => {
  return Math.round(amount * 100) / 100;
};

const calculateTipAmountPerPerson = (bill, tip, people) => {
  const tipAmount = (bill * (tip / 100)) / people;
  return roundDown(tipAmount);
};

const calculateTotalTipPersPerson = (bill, tip, people) => {
  const newBill = bill + bill * (tip / 100);
  return roundUp(newBill / people);
};

const appendCustomTip = (list, element, tipAmount) => {
  const label = document.createElement("label");
  label.classList.add("tip-option");

  label.innerHTML = `
    ${tipAmount}%
    <input
      class="radio-button"
      type="radio"
      id="option-${list.children.length}"
      name="tip"
      value="${tipAmount}"
    />
  `;

  list.insertBefore(label, element);
  element.value = "";
};

const updateTipLabel = (id, value) => {
  const label = document.getElementById(id);
  label.innerText = `$${value}`;
};

const addError = (label, input, errorMessage) => {
  input.classList.add("error");
  label.classList.remove("hidden");
  label.innerText = errorMessage;
};

const removeError = (label, input) => {
  input.classList.remove("error");
  label.classList.add("hidden");
  label.innerText = "";
};

const isInvalidInput = (value) => value === "" || value === "0";

const handleCustomTipOptionOnMouseEnter = (event) => {
  if (event.key === "Enter") {
    event.preventDefault();

    appendCustomTip(tipsOptionsList, customTipOption, event.target.value);
  }
};

const handleSubmit = (event) => {
  event.preventDefault();

  const formData = Object.fromEntries(new FormData(event.target));

  const { bill, tip, people } = formData;

  const parsedBill = parseFloat(bill);
  const parsedTip = parseInt(tip);
  const parsedPeople = parseInt(people);

  console.log(isInvalidInput(bill), isInvalidInput(people));

  if (isInvalidInput(bill) || isInvalidInput(people)) {
    if (!isInvalidInput(bill)) removeError(billErrorLabel, billInput);
    if (!isInvalidInput(people)) removeError(peopleErrorLabel, peopleInput);

    const errorMessage = "Can't be zero";

    if (isInvalidInput(bill)) addError(billErrorLabel, billInput, errorMessage);
    if (isInvalidInput(people))
      addError(peopleErrorLabel, peopleInput, errorMessage);

    return;
  }

  removeError(billErrorLabel, billInput);
  removeError(peopleErrorLabel, peopleInput);

  updateTipLabel(
    "tip-amount-per-person",
    calculateTipAmountPerPerson(parsedBill, parsedTip, parsedPeople)
  );
  updateTipLabel(
    "total-tip-per-person",
    calculateTotalTipPersPerson(parsedBill, parsedTip, parsedPeople)
  );
};

const handleKeydown = (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    event.target.form.requestSubmit();
  }
};

const handleReset = (event, submitForm) => {
  event.preventDefault();
  submitForm.reset();
};

billInput.addEventListener("keydown", handleKeydown);
peopleInput.addEventListener("keydown", handleKeydown);
form.addEventListener("submit", handleSubmit);
customTipOption.addEventListener("keydown", handleCustomTipOptionOnMouseEnter);
resetButton.addEventListener("click", (event) => handleReset(event, form));

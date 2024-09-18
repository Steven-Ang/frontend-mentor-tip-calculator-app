const form = document.getElementById("form");
const billInput = document.getElementById("bill-input");
const peopleInput = document.getElementById("people-input");
const billErrorLabel = document.getElementById("bill-error-label");
const peopleErrorLabel = document.getElementById("people-error-label");
const tipErrorLabel = document.getElementById("tip-error-label");
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

const appendCustomTip = (label, list, element, tipAmount) => {
  removeError(label, element);

  if (isInputEmpty(tipAmount)) {
    const errorMessage = "Can't be zero";
    addError(label, element, errorMessage);
    return;
  }

  const tipLabel = document.createElement("label");
  tipLabel.classList.add("tip-option");

  tipLabel.innerHTML = `
    ${tipAmount}%
    <input
      class="radio-button"
      type="radio"
      id="option-${list.children.length}"
      name="tip"
      value="${tipAmount}"
    />
  `;

  list.insertBefore(tipLabel, element);
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

const enableResetButton = () => resetButton.removeAttribute("disabled");

const disableResetButton = () => resetButton.setAttribute("disabled", true);

const isInputEmpty = (value) => value === "" || value === "0";
const isInputEndsWithDot = (value) => value.endsWith(".");

const requestSubmit = (event) => {
  event.preventDefault();
  event.target.form.requestSubmit();
};

const handleReset = (event, submitForm) => {
  event.preventDefault();

  updateTipLabel("tip-amount-per-person", "0.00");
  updateTipLabel("total-tip-per-person", "0.00");

  disableResetButton();
  submitForm.reset();
};

const handleKeydown = (event, regex, callback = null, callbackOptions = {}) => {
  const value = event.target.value + event.key;

  if (event.key === "Enter" && event.target.value !== "") {
    event.preventDefault();
    if (callback === null) requestSubmit(event);
    else if (callback) {
      const { label, list, element } = callbackOptions;
      callback(label, list, element, event.target.value);
    }
  }

  if (event.key === "Backspace") return;
  if (!value.match(regex)) event.preventDefault();
};

const handleOnInput = (event, otherInput) => {
  const inputValue = event.target.value;
  const otherInputValue = otherInput.value;

  if (inputValue !== "" && otherInputValue === "") {
    enableResetButton();
  } else if (inputValue === "" && otherInputValue === "") {
    disableResetButton();
  }
};

const handleSubmit = (event) => {
  event.preventDefault();

  enableResetButton();

  const formData = Object.fromEntries(new FormData(event.target));

  const { bill, tip, people } = formData;

  const parsedBill = parseFloat(bill);
  const parsedTip = parseInt(tip);
  const parsedPeople = parseInt(people);

  removeError(tipErrorLabel, customTipOption);

  if (isInputEmpty(bill) || isInputEndsWithDot(bill) || isInputEmpty(people)) {
    if (!isInputEmpty(bill) || !isInputEndsWithDot(bill))
      removeError(billErrorLabel, billInput);
    if (!isInputEmpty(people)) removeError(peopleErrorLabel, peopleInput);

    let billErrorMessage = "";
    let peopleErrorMessage = "";

    if (isInputEmpty(bill)) {
      billErrorMessage = "Can't be zero";
      addError(billErrorLabel, billInput, billErrorMessage);
    }
    if (isInputEndsWithDot(bill)) {
      billErrorMessage = "Can't end with .";
      addError(billErrorLabel, billInput, billErrorMessage);
    }
    if (isInputEmpty(people)) {
      peopleErrorMessage = "Can't be zero";
      addError(peopleErrorLabel, peopleInput, peopleErrorMessage);
    }

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

const billInputRegex = /^(0|[1-9]\d*)(\.\d{0,2})?$/;
const peopleInputRegex = /^(0|[1-9]\d*)$/;
const customTipOptionRegex = /^(0|100|[1-9][0-9]?)$/;

form.addEventListener("submit", handleSubmit);
billInput.addEventListener("keydown", (event) =>
  handleKeydown(event, billInputRegex)
);
peopleInput.addEventListener("keydown", (event) =>
  handleKeydown(event, peopleInputRegex)
);
billInput.addEventListener("input", (event) =>
  handleOnInput(event, peopleInput)
);
peopleInput.addEventListener("input", (event) =>
  handleOnInput(event, billInput)
);
customTipOption.addEventListener("keydown", (event) =>
  handleKeydown(event, customTipOptionRegex, appendCustomTip, {
    label: tipErrorLabel,
    list: tipsOptionsList,
    element: customTipOption,
  })
);
resetButton.addEventListener("click", (event) => handleReset(event, form));

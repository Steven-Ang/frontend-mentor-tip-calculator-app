const form = document.getElementById("form");
const billInput = document.getElementById("bill-input");
const peopleInput = document.getElementById("people-input");
const billErrorLabel = document.getElementById("bill-error-label");
const peopleErrorLabel = document.getElementById("people-error-label");
const tipErrorLabel = document.getElementById("tip-error-label");
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

const updateTipLabel = (id, value) => {
  const label = document.getElementById(id);
  label.innerText = `$${value}`;
};

const addError = (label, errorMessage, input = null) => {
  if (input) input.classList.add("error");
  label.classList.remove("hidden");
  label.innerText = errorMessage;
};

const removeError = (label, input = null) => {
  if (input) input.classList.remove("error");
  label.classList.add("hidden");
  label.innerText = "";
};

const isInputEmpty = (value) => !value || value === "" || value === "0";
const isInputEndsWithDot = (value) => value.endsWith(".");

const enableResetButton = (button) => button.removeAttribute("disabled");
const disableResetButton = (button) => button.setAttribute("disabled", true);

const requestSubmit = (event) => {
  event.target.form.requestSubmit();
};

const deselectOptions = (list) => {
  [...list].forEach((option) => {
    if (option.checked) option.checked = false;
  });
};

const handleKeydown = (event, regex) => {
  const value = event.target.value + event.key;

  if (event.key === "Enter" && event.target.value !== "") {
    requestSubmit(event);
  }

  if (event.key === "Backspace") return;
  if (!value.match(regex)) event.preventDefault();
};

const handleOnInput = (event, otherInput, button) => {
  const inputValue = event.target.value;
  const otherInputValue = otherInput.value;

  if (inputValue !== "" && otherInputValue === "") {
    enableResetButton(button);
  } else if (inputValue === "" && otherInputValue === "") {
    disableResetButton(button);
  }
};

const handleCustomTipOtionOnClick = (list) => {
  deselectOptions(list);
};

const handleFormReset = (event) => {
  event.preventDefault();

  updateTipLabel("tip-amount-per-person", "0.00");
  updateTipLabel("total-tip-per-person", "0.00");

  removeError(billErrorLabel, billInput);
  removeError(tipErrorLabel);
  removeError(peopleErrorLabel, peopleInput);

  disableResetButton();
  form.reset();
};

const handleSubmit = (event) => {
  event.preventDefault();

  enableResetButton(resetButton);

  const formData = Object.fromEntries(new FormData(event.target));

  const { bill, tip, people } = formData;

  const parsedBill = parseFloat(bill);
  const parsedSelectedTip = parseInt(tip);
  const parsedPeople = parseInt(people);
  const parsedCustomTip = parseInt(customTipOption.value);

  removeError(tipErrorLabel, customTipOption);

  if (
    isInputEmpty(bill) ||
    isInputEndsWithDot(bill) ||
    (isInputEmpty(parsedCustomTip) && isInputEmpty(tip)) ||
    isInputEmpty(people)
  ) {
    if (!isInputEmpty(bill) || !isInputEndsWithDot(bill))
      removeError(billErrorLabel, billInput);
    if (!isInputEmpty(people)) removeError(peopleErrorLabel, peopleInput);

    let billErrorMessage = "";
    let tipErrorMessage = "";
    let peopleErrorMessage = "";

    if (isInputEmpty(bill)) {
      billErrorMessage = "Can't be zero";
      addError(billErrorLabel, billErrorMessage, billInput);
    }

    if (isInputEndsWithDot(bill)) {
      billErrorMessage = "Can't end with .";
      addError(billErrorLabel, billErrorMessage, billInput);
    }

    if (isInputEmpty(parsedCustomTip) && isInputEmpty(tip)) {
      tipErrorMessage = "Please select a tip";
      addError(tipErrorLabel, tipErrorMessage);
    }

    if (isInputEmpty(people)) {
      peopleErrorMessage = "Can't be zero";
      addError(peopleErrorLabel, peopleErrorMessage, peopleInput);
    }

    return;
  }

  removeError(billErrorLabel, billInput);
  removeError(tipErrorLabel);
  removeError(peopleErrorLabel, peopleInput);

  const tipAmount = parsedSelectedTip || parsedCustomTip;

  updateTipLabel(
    "tip-amount-per-person",
    calculateTipAmountPerPerson(parsedBill, tipAmount, parsedPeople)
  );
  updateTipLabel(
    "total-tip-per-person",
    calculateTotalTipPersPerson(parsedBill, tipAmount, parsedPeople)
  );
};

for (const option of tipOptions) {
  option.addEventListener("click", (event) => {
    event.stopPropagation();
    requestSubmit(event);
  });
}

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
  handleOnInput(event, peopleInput, resetButton)
);
peopleInput.addEventListener("input", (event) =>
  handleOnInput(event, billInput, resetButton)
);
customTipOption.addEventListener("keydown", (event) =>
  handleKeydown(event, customTipOptionRegex)
);
customTipOption.addEventListener("click", () =>
  handleCustomTipOtionOnClick(tipOptions)
);
resetButton.addEventListener("click", handleFormReset);

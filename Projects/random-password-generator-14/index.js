const btnEl = document.querySelector(".btn");
const inputEl = document.getElementById("input");
const copyIconEl = document.querySelector(".fa-copy");
const alertContainerEl = document.querySelector(".alert-container");

const CHARACTERS =
  "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()_+?:{}[]ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const PASSWORD_LENGTH = 14;

btnEl.addEventListener("click", () => {
  createPassword();
});

copyIconEl.addEventListener("click", () => {
  if (!inputEl.value) return; // nothing to copy
  navigator.clipboard.writeText(inputEl.value).then(() => {
    showAlert(`${inputEl.value} copied!`);
  });
});

function createPassword() {
  let password = "";
  for (let i = 0; i < PASSWORD_LENGTH; i++) {
    const randomIndex = Math.floor(Math.random() * CHARACTERS.length);
    password += CHARACTERS[randomIndex];
  }
  inputEl.value = password;
  inputEl.focus();
}

function showAlert(message) {
  alertContainerEl.innerText = message;
  alertContainerEl.classList.add("active");
  setTimeout(() => {
    alertContainerEl.classList.remove("active");
  }, 2000);
}
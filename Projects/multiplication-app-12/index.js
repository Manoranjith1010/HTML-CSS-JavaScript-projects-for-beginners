let num1 = Math.ceil(Math.random() * 10);
let num2 = Math.ceil(Math.random() * 10);

const questionEl = document.getElementById("question");

const inputEl = document.getElementById("input");

const formEl = document.getElementById("form");

const scoreEl = document.getElementById("score");

let score = JSON.parse(localStorage.getItem("score"));

if (!score) {
  score = 0;
}

scoreEl.innerText = `score: ${score}`;

questionEl.innerText = `What is ${num1} multiply by ${num2}?`;

let correctAns = num1 * num2;

formEl.addEventListener("submit", (e) => {
  e.preventDefault();
  const userAns = +inputEl.value;
  if (userAns === correctAns) {
    score++;
    updateLocalStorage();
  } else {
    score--;
    updateLocalStorage();
  }
  inputEl.value = "";
  num1 = Math.ceil(Math.random() * 10);
  num2 = Math.ceil(Math.random() * 10);
  questionEl.innerText = `What is ${num1} multiply by ${num2}?`;
  correctAns = num1 * num2;
  scoreEl.innerText = `score: ${score}`;
});

function updateLocalStorage() {
  localStorage.setItem("score", JSON.stringify(score));
}
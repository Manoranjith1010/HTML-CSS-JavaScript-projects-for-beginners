const ratingEls = document.querySelectorAll(".rating");
const btnEl = document.getElementById("btn");
const containerEl = document.getElementById("container");

let selectedRating = "";

ratingEls.forEach((ratingEl) => {
  ratingEl.addEventListener("click", () => selectRating(ratingEl));

  // Keyboard support: activate on Enter or Space
  ratingEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      selectRating(ratingEl);
    }
  });
});

function selectRating(ratingEl) {
  removeActive();
  ratingEl.classList.add("active");
  selectedRating = ratingEl.dataset.rating;
  btnEl.disabled = false;
}

btnEl.addEventListener("click", () => {
  if (!selectedRating) return;

  const thankYouEl = document.createElement("div");
  thankYouEl.classList.add("thank-you");

  const iconEl = document.createElement("div");
  iconEl.classList.add("thank-you-icon");
  iconEl.textContent = "✓";

  const titleEl = document.createElement("p");
  titleEl.classList.add("thank-you-title");
  titleEl.textContent = "Thank you for your feedback!";

  const feedbackEl = document.createElement("p");
  feedbackEl.classList.add("thank-you-badge");
  feedbackEl.textContent = selectedRating;

  const messageEl = document.createElement("p");
  messageEl.classList.add("thank-you-message");
  messageEl.textContent = "We'll use your feedback to improve our customer support.";

  thankYouEl.appendChild(iconEl);
  thankYouEl.appendChild(titleEl);
  thankYouEl.appendChild(feedbackEl);
  thankYouEl.appendChild(messageEl);

  containerEl.innerHTML = "";
  containerEl.appendChild(thankYouEl);
});

function removeActive() {
  ratingEls.forEach((ratingEl) => ratingEl.classList.remove("active"));
}
const searchBarContainerEl = document.querySelector(".search-bar-container");
const magnifierEl = document.querySelector(".magnifier");

magnifierEl.addEventListener("click", () => {
  searchBarContainerEl.classList.toggle("active");
  if (searchBarContainerEl.classList.contains("active")) {
    document.querySelector(".input").focus(); // auto-focus input
  }
});
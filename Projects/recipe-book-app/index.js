const API_KEY = "275d58779ccf4e22af03e792e8819fff";
const recipeListEl = document.getElementById("recipe-list");
const loadingEl = document.getElementById("loading");
const errorMessageEl = document.getElementById("error-message");
const searchInputEl = document.getElementById("search-input");

let allRecipes = [];

function createRecipeItem(recipe) {
  const recipeItemEl = document.createElement("li");
  recipeItemEl.classList.add("recipe-item");

  const recipeImageEl = document.createElement("img");
  recipeImageEl.src = recipe.image;
  recipeImageEl.alt = recipe.title;
  recipeImageEl.loading = "lazy";

  const recipeTitleEl = document.createElement("h2");
  recipeTitleEl.textContent = recipe.title;

  const recipeIngredientsEl = document.createElement("p");
  const strongEl = document.createElement("strong");
  strongEl.textContent = "Ingredients: ";
  const ingredientsText = document.createTextNode(
    recipe.extendedIngredients.map((i) => i.original).join(", ")
  );
  recipeIngredientsEl.appendChild(strongEl);
  recipeIngredientsEl.appendChild(ingredientsText);

  const recipeLinkEl = document.createElement("a");
  recipeLinkEl.href = recipe.sourceUrl;
  recipeLinkEl.textContent = "View Recipe";
  recipeLinkEl.target = "_blank";
  recipeLinkEl.rel = "noopener noreferrer";

  recipeItemEl.appendChild(recipeImageEl);
  recipeItemEl.appendChild(recipeTitleEl);
  recipeItemEl.appendChild(recipeIngredientsEl);
  recipeItemEl.appendChild(recipeLinkEl);
  return recipeItemEl;
}

function displayRecipes(recipes) {
  recipeListEl.innerHTML = "";
  if (recipes.length === 0) {
    recipeListEl.innerHTML = '<li class="no-results">No recipes found.</li>';
    return;
  }
  const fragment = document.createDocumentFragment();
  recipes.forEach((recipe) => fragment.appendChild(createRecipeItem(recipe)));
  recipeListEl.appendChild(fragment);
}

function filterRecipes(query) {
  const filtered = allRecipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(query.toLowerCase())
  );
  displayRecipes(filtered);
}

async function getRecipes() {
  const response = await fetch(
    `https://api.spoonacular.com/recipes/random?number=10&apiKey=${API_KEY}`
  );
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  return data.recipes;
}

function setLoading(isLoading) {
  loadingEl.hidden = !isLoading;
}

function showError(message) {
  errorMessageEl.textContent = message;
  errorMessageEl.hidden = false;
}

async function init() {
  setLoading(true);
  try {
    allRecipes = await getRecipes();
    displayRecipes(allRecipes);
  } catch (error) {
    showError("Failed to load recipes. Please try again later.");
    console.error(error);
  } finally {
    setLoading(false);
  }
}

searchInputEl.addEventListener("input", (e) => filterRecipes(e.target.value));

init();
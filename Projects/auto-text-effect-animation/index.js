const containerEl = document.querySelector(".container");
const careers = ["YouTuber", "Web Developer", "Freelancer", "Instructor"];

let careerIndex = 0;
let characterIndex = 0;

function updateText() {
  const currentCareer = careers[careerIndex];
  const article = ["A","E","I","O","U"].includes(currentCareer[0].toUpperCase()) ? "an" : "a";
  
  containerEl.innerHTML = `<h1>I am ${article} ${currentCareer.slice(0, characterIndex)}</h1>`;
  
  characterIndex++;

  let delay = 400;
  if(characterIndex > currentCareer.length) {
    careerIndex = (careerIndex + 1) % careers.length;
    characterIndex = 0;
    delay = 1000; // pause before next word
  }
  
  setTimeout(updateText, delay);
}

updateText();
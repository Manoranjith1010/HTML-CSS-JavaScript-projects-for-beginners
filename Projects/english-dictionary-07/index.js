const inputEl = document.getElementById("input");
const searchBtnEl = document.getElementById("search-btn");
const infoTextEl = document.getElementById("info-text");
const meaningContainerEl = document.getElementById("meaning-container");
const titleEl = document.getElementById("title");
const phoneticEl = document.getElementById("phonetic");
const partOfSpeechEl = document.getElementById("part-of-speech");
const meaningEl = document.getElementById("meaning");
const exampleEl = document.getElementById("example");
const audioEl = document.getElementById("audio");

function showInfo(message, isError = false) {
  infoTextEl.textContent = message;
  infoTextEl.className = "info-text" + (isError ? " error" : "");
  infoTextEl.hidden = false;
  meaningContainerEl.hidden = true;
}

function showResult(data, word) {
  const entry = data[0];
  const firstMeaning = entry.meanings[0];
  const firstDef = firstMeaning.definitions[0];

  titleEl.textContent = entry.word;

  // Phonetic
  const phonetic = entry.phonetic || entry.phonetics?.find((p) => p.text)?.text || "";
  phoneticEl.textContent = phonetic;

  // Part of speech
  partOfSpeechEl.textContent = firstMeaning.partOfSpeech;

  // Definition
  meaningEl.textContent = firstDef.definition;

  // Example sentence
  if (firstDef.example) {
    exampleEl.textContent = `"${firstDef.example}"`;
    exampleEl.hidden = false;
  } else {
    exampleEl.hidden = true;
  }

  // Audio — find first phonetics entry that has an audio URL
  const audioSrc = entry.phonetics?.find((p) => p.audio)?.audio || "";
  if (audioSrc) {
    audioEl.src = audioSrc;
    audioEl.hidden = false;
  } else {
    audioEl.hidden = true;
  }

  infoTextEl.hidden = true;
  meaningContainerEl.hidden = false;
}

async function fetchAPI(word) {
  const trimmed = word.trim();
  if (!trimmed) return;

  showInfo(`Searching the meaning of "${trimmed}"…`);

  try {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(trimmed)}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok || data.title) {
      showInfo(`No definition found for "${trimmed}". Please try another word.`, true);
    } else {
      showResult(data, trimmed);
    }
  } catch (error) {
    console.error(error);
    showInfo("Something went wrong. Please check your connection and try again.", true);
  }
}

function handleSearch() {
  const value = inputEl.value.trim();
  if (value) fetchAPI(value);
}

inputEl.addEventListener("keyup", (e) => {
  if (e.key === "Enter") handleSearch();
});

searchBtnEl.addEventListener("click", handleSearch);
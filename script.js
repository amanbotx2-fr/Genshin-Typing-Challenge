const quotes = [
  "Wind, hear me!",
  "I will have order.",
  "Let's light it up!",
  "Time for takeoff!",
  "Let the show begin!",
  "Time to act.",
  "Rain outlines your fate."
];

const paragraphs = [
  "Mondstadt is the city of freedom, and its citizens live by the Anemo Archon’s blessing.",
  "Liyue is a harbor of contracts, run by the Geo Archon who values tradition and commerce.",
  "Inazuma, ruled by the Raiden Shogun, is a nation of eternity. Beneath its stormy skies, visions are seized and rebellion stirs."
];

let timerInterval;
let startTime;
let isTyping = false;
let selectedMode = "quote";
let selectedTime = 30;

const quoteDisplay = document.getElementById("quoteDisplay");
const inputArea = document.getElementById("inputArea");
const timerEl = document.getElementById("timer");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const startBtn = document.getElementById("startBtn");
const keySound = document.getElementById("keySound");

// Mode selection
document.querySelectorAll(".mode-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".mode-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedMode = btn.dataset.mode;
  });
});

// Time selection
document.querySelectorAll(".time-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".time-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedTime = parseInt(btn.dataset.time);
  });
});

startBtn.addEventListener("click", startTest);

function startTest() {
  const sourceText = selectedMode === "quote"
    ? quotes[Math.floor(Math.random() * quotes.length)]
    : paragraphs[Math.floor(Math.random() * paragraphs.length)];

  inputArea.value = "";
  inputArea.disabled = true;
  isTyping = false;
  quoteDisplay.textContent = "";
  quoteDisplay.classList.remove("typing-cursor");

  timerEl.textContent = selectedTime;
  wpmEl.textContent = "0";
  accuracyEl.textContent = "0";

  let i = 0;
  const speed = 25;

  function typeChar() {
    if (i < sourceText.length) {
      quoteDisplay.textContent += sourceText.charAt(i);
      quoteDisplay.classList.add("typing-cursor");
      keySound.currentTime = 0;
      keySound.play();
      i++;
      setTimeout(typeChar, speed);
    } else {
      inputArea.disabled = false;
      inputArea.focus();
      isTyping = true;
      startTime = new Date().getTime();
      clearInterval(timerInterval);
      timerInterval = setInterval(updateTimer, 1000);
    }
  }

  typeChar();
}

function updateTimer() {
  const elapsed = Math.floor((new Date().getTime() - startTime) / 1000);
  const remaining = selectedTime - elapsed;
  timerEl.textContent = remaining;

  if (remaining <= 0) {
    finishTest();
  }
}

inputArea.addEventListener("input", () => {
  if (!isTyping) return;

  const typedText = inputArea.value;
  const originalText = quoteDisplay.textContent;

  if (typedText === originalText) {
    finishTest();
  }
});

// Typing sound on every keypress
inputArea.addEventListener("keydown", () => {
  if (!inputArea.disabled) {
    try {
      keySound.currentTime = 0;
      keySound.play();
    } catch (e) {}
  }
});

function finishTest() {
  clearInterval(timerInterval);
  isTyping = false;
  inputArea.disabled = true;

  const typedText = inputArea.value.trim();
  const originalText = quoteDisplay.textContent.trim();
  const timeTaken = selectedTime;

  const words = typedText.split(/\s+/).filter(word => word !== "").length;
  const wpm = Math.round((words / timeTaken) * 60);
  wpmEl.textContent = isNaN(wpm) ? "0" : wpm;

  const correctChars = typedText
    .split("")
    .filter((char, i) => char === originalText[i]).length;
  const accuracy = Math.round((correctChars / originalText.length) * 100);
  accuracyEl.textContent = isNaN(accuracy) ? "0" : accuracy;
}

// 🎯 Highlight virtual keys on press
document.addEventListener("keydown", (e) => {
  const key = document.querySelector(`.key[data-key="${e.key.toUpperCase()}"]`);
  if (key) {
    key.classList.add("active");
    setTimeout(() => key.classList.remove("active"), 150);
  }
});

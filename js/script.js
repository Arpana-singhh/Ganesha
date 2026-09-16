// ==========================================
// BAPPA'S BLESSINGS
// Messages are loaded from ../blessings.json
// ==========================================

let blessings = {};
let currentLanguage = "en";
let lastIndex = -1;
let hasReceivedBlessing = false;
let indexQueue = [];

const blessingText = document.getElementById("blessingText");
const blessingButton = document.getElementById("blessingButton");
const buttonText = document.getElementById("buttonText");
const blessingSignature = document.getElementById("blessingSignature");
const langButtons = document.querySelectorAll(".lang-btn");

// ---------- Particles ----------

function createParticles() {
  const container = document.getElementById("particles");

  for (let i = 0; i < 18; i++) {
    const particle = document.createElement("span");
    particle.className = "particle";

    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${70 + Math.random() * 35}%`;
    particle.style.animationDuration = `${8 + Math.random() * 12}s`;
    particle.style.animationDelay = `${Math.random() * 10}s`;
    particle.style.width = `${2 + Math.random() * 3}px`;
    particle.style.height = particle.style.width;

    container.appendChild(particle);
  }
}

// ---------- Random blessing (no repeats until every blessing is shown) ----------

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function refillQueue() {
  const length = blessings[currentLanguage].length;
  indexQueue = shuffleArray([...Array(length).keys()]);

  // Avoid repeating the very last blessing shown right at the start of a new cycle
  if (indexQueue.length > 1 && indexQueue[0] === lastIndex) {
    [indexQueue[0], indexQueue[1]] = [indexQueue[1], indexQueue[0]];
  }
}

function getRandomBlessing() {
  if (indexQueue.length === 0) {
    refillQueue();
  }

  lastIndex = indexQueue.shift();
  return blessings[currentLanguage][lastIndex];
}

function receiveBlessing() {
  const message = getRandomBlessing();

  // Reset animation
  blessingText.classList.remove("blessing-reveal");
  blessingText.classList.add("is-hidden");

  setTimeout(() => {
    blessingText.textContent = message;
    blessingText.className = `blessing-text ${currentLanguage} blessing-reveal`;

    hasReceivedBlessing = true;
    buttonText.textContent = "Receive Another Blessing";
  }, 220);
}

// ---------- Language selection ----------

function setupLanguageSwitcher() {
  langButtons.forEach(button => {
    button.addEventListener("click", () => {
      currentLanguage = button.dataset.lang;

      langButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      // Reset animation class when changing language
      blessingText.className = `blessing-text ${currentLanguage}`;

      if (hasReceivedBlessing) {
        // Show the same blessing, just translated into the new language
        blessingText.textContent = blessings[currentLanguage][lastIndex];
        blessingText.classList.add("blessing-reveal");
      } else {
        blessingText.textContent =
          currentLanguage === "en"
            ? "Close your eyes for a moment. Your blessing awaits."
            : currentLanguage === "gu"
              ? "એક ક્ષણ માટે આંખો બંધ કરો. તમારા આશીર્વાદની રાહ જુઓ."
              : "एक पल के लिए आंखें बंद करें। आपका आशीर्वाद आपका इंतज़ार कर रहा है।";
      }
    });
  });
}

// ---------- Init ----------

async function init() {
  const response = await fetch("blessings.json");
  blessings = await response.json();

  setupLanguageSwitcher();
  blessingButton.addEventListener("click", receiveBlessing);
  createParticles();
}

init();

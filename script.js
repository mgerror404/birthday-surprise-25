let envelopeOpened = false;
let cardOpened = false;
let startX = 0;
let noteOpened = false;
let kissCount = 0;
const maxKiss = 22;

const envelope = document.getElementById("envelope");
const hint = document.querySelector(".hint");
const flap = document.getElementById("flap");
const card = document.getElementById("card");
const cardFront = document.getElementById("cardFront");
const note = document.getElementById("note");
const cake = document.getElementById("cake");
const blowBtn = document.getElementById("blowBtn");
const candles = document.getElementById("candles");
const cakeHint = document.getElementById("cake-hint");
const kissPop = document.getElementById('kiss-pop');
const kissPopup = document.getElementById("kiss-popup");

const music = document.getElementById("birthday-music");
const partyPop = document.getElementById('party-pop');
const popSound = document.getElementById('pop-sound');
const envelopeSound = document.getElementById("envelope-sound");
const cardFlipSound = document.getElementById("card-flip-sound");
const noteSound = document.getElementById("note-sound");
const yaySound = document.getElementById("yay-sound");
const kissSound = document.getElementById("kiss-sound");
const notificationSound = document.getElementById("notification-sound");

const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

kissPop.classList.add("hidden")

/* Click envelope → show closed card */
envelope.addEventListener("click", () => {
  if (envelopeOpened) return;
  envelopeOpened = true;

  hint.classList.add("hidden");

  flap.classList.add("open");
  envelope.classList.add("open");

  envelopeSound.currentTime = 0; // rewind
  envelopeSound.play().catch(err => console.log("Envelope sound blocked:", err));

  setTimeout(() => {
    envelope.classList.add("open");
    card.classList.add("show");
    const cardHint = document.getElementById("cardHint");
    cardHint?.classList.add("hidden");
  }, 800);
});

/* Click card front → open card */
function openCard()
{
  if (cardOpened) return;
  cardOpened = true;

  card.classList.add("open");

  cardFlipSound.currentTime = 0; // rewind
  cardFlipSound.play().catch(err => console.log("Card flip sound blocked:", err));

  popSound.play();
  launchConfetti();

  // play music after flip completes
  setTimeout(() => {
    music.play().catch(err => console.log("Music autoplay blocked:", err));
  }, 800); // 800ms = same as card flip duration
}

if (isMobile) {
  // Mobile: any tap on cardFront opens the card
  cardFront.addEventListener('pointerup', (e) => {
    e.preventDefault(); // avoid double-tap zoom / default
    openCard();
  });
} else {
  // Desktop: use swipe or click
  cardFront.addEventListener("mousedown", (e) => {
    e.preventDefault(); // prevent text/image selection
    startX = e.clientX;

    function onMouseUp(e) {
      const endX = e.clientX;
      if (startX - endX > 50) { // swipe left
        openCard();
      }
      document.removeEventListener("mouseup", onMouseUp);
    }

    document.addEventListener("mouseup", onMouseUp);
  });
}

/* Confetti */
function launchConfetti() {
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");

    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.backgroundColor =
      `hsl(${Math.random() * 360}, 100%, 50%)`;
    confetti.style.animationDuration =
      2 + Math.random() * 2 + "s";

    document.body.appendChild(confetti);
    setTimeout(() => confetti.remove(), 4000);
  }
}

partyPop.addEventListener('click', () => {
  popSound.currentTime = 0;
  popSound.play();
  partyPop.classList.remove('clicked');
  void partyPop.offsetWidth; // restart animation
  partyPop.classList.add('clicked');
});

music.addEventListener("ended", () => {
  note.classList.add("peek");
});

note.addEventListener("click", () => {
  // FIRST CLICK → open note, hide card
  if (!noteOpened) {
    noteSound.currentTime = 0; // rewind
    noteSound.play().catch(err => console.log("Note sound blocked:", err));

    noteOpened = true;

    note.classList.remove("peek");
    note.classList.add("open");

    // Hide card + card front immediately
    card.classList.add("hidden");

    return;
  }

  // SECOND CLICK → hide note, show cake
  note.classList.add("hidden");
  cake.classList.add("show");
  document.querySelector(".blow-container").classList.add("show");
  cakeHint.classList.add("show");
});

function launchSparkles(count = 200) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  for (let i = 0; i < count; i++) {
    const sparkle = document.createElement("div");
    sparkle.classList.add("sparkle");

    // Start from center of screen
    const startX = vw / 2;
    const startY = vh / 2;

    sparkle.style.left = startX + "px";
    sparkle.style.top = startY + "px";

    // Random X/Y direction across the screen
    const randomX = (Math.random() - 0.5) * vw * 2;  // ± viewport width
    const randomY = (Math.random() - 0.5) * vh * 2;  // ± viewport height

    sparkle.style.setProperty('--x', randomX + 'px');
    sparkle.style.setProperty('--y', randomY + 'px');

    document.body.appendChild(sparkle);

    // Remove sparkle after animation
    setTimeout(() => sparkle.remove(), 1500);
  }
}


blowBtn.addEventListener("click", () => {
  if (!candles) return; // safety
  
  // Turn flames off
  candles.classList.add("blown");

  // Extra safety: force flames hidden
  document.querySelectorAll(".flame").forEach(flame => {
    flame.style.opacity = "0";
    flame.style.animation = "none";
  });

  // Button feedback
  blowBtn.disabled = true;
  blowBtn.textContent = "✨ Deseo recibido!";

  cakeHint.classList.remove("show");
  cakeHint.classList.add("hidden");
  
  launchSparkles(250); // launch 40 sparkles

  yaySound.currentTime = 0; // rewind
  yaySound.play().catch(err => console.log("Yay sound blocked:", err));

  kissPop.classList.add("show");
});

kissPop.addEventListener('click', () => {
  // Increment counter
  kissCount++;

  kissSound.currentTime = 0;
  kissSound.play();

  if (kissCount == maxKiss) {
    kissPopup.classList.add("show");
    notificationSound.currentTime = 0; // rewind
    notificationSound.play().catch(err => console.log("Notification sound blocked:", err));
  }

  // trigger bounce animation
  kissPop.classList.remove('clicked');
  void kissPop.offsetWidth;
  kissPop.classList.add('clicked');

  // create a heart
  const heart = document.createElement('div');
  heart.classList.add('heart');
  heart.textContent = '🩵';

  // start at the kiss position
  const rect = kissPop.getBoundingClientRect();
  heart.style.left = rect.left + rect.width / 2 + 'px';
  heart.style.top = rect.top + 'px';

  // random x offset for a natural float
  const randomX = (Math.random() - 0.5) * 100; // ±50px
  const randomY = -150 - Math.random() * 50;   // float upward more

  heart.style.setProperty('--x', `${randomX}px`);
  heart.style.setProperty('--y', `${randomY}px`);

  document.body.appendChild(heart);

  // remove after animation
  setTimeout(() => heart.remove(), 1500);
});



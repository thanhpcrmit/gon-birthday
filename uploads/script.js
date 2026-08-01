const choices = document.querySelectorAll(".choice");
const guestBox = document.getElementById("guest-box");
const guestCount = document.getElementById("guest-count");
const minusBtn = document.getElementById("minus-btn");
const plusBtn = document.getElementById("plus-btn");
const familyName = document.getElementById("family-name");
const confirmBtn = document.getElementById("confirm-btn");
const result = document.getElementById("result");
const resultText = document.getElementById("result-text");
const replyList = document.getElementById("reply-list");
const emptyState = document.getElementById("empty-state");

const storageKey = "birthday-rsvps";

let currentChoice = "yes";
let count = 2;

function updateGuestUi() {
  guestCount.textContent = count;
  const disabled = currentChoice === "no";
  guestBox.classList.toggle("dimmed", disabled);
  minusBtn.disabled = disabled;
  plusBtn.disabled = disabled;
}

function selectChoice(nextChoice) {
  currentChoice = nextChoice;
  choices.forEach((choice) => {
    choice.classList.toggle("selected", choice.dataset.choice === nextChoice);
  });

  if (nextChoice === "no") {
    count = 0;
  } else if (count === 0) {
    count = 2;
  }

  updateGuestUi();
}

function readReplies() {
  return JSON.parse(localStorage.getItem(storageKey) || "[]");
}

function saveReply(entry) {
  const replies = readReplies();
  replies.unshift(entry);
  localStorage.setItem(storageKey, JSON.stringify(replies.slice(0, 20)));
}

function renderReplies() {
  const replies = readReplies().sort((a, b) => {
    if (a.choice === b.choice) return 0;
    if (a.choice === "yes") return -1;
    if (b.choice === "yes") return 1;
    return 0;
  });
  replyList.innerHTML = "";

  if (replies.length === 0) {
    replyList.appendChild(emptyState);
    return;
  }

  replies.forEach((entry) => {
    const card = document.createElement("article");
    card.className = "reply-card";

    const details = document.createElement("div");
    const name = document.createElement("p");
    name.className = "reply-name";
    name.textContent = entry.name;

    const meta = document.createElement("p");
    meta.className = "reply-meta";
    meta.textContent = entry.choice === "no"
      ? "Gửi lời chúc từ xa"
      : `${entry.count} người dự kiến tham gia`;

    details.append(name, meta);

    const pill = document.createElement("div");
    pill.className = `reply-pill ${entry.choice}`;
    pill.textContent = entry.choice === "yes" ? "Sẽ đến" : "Chúc mừng sinh nhật Gòn";

    card.append(details, pill);
    replyList.appendChild(card);
  });
}

choices.forEach((choice) => {
  choice.addEventListener("click", () => selectChoice(choice.dataset.choice));
});

minusBtn.addEventListener("click", () => {
  if (currentChoice === "no") return;
  count = Math.max(1, count - 1);
  updateGuestUi();
});

plusBtn.addEventListener("click", () => {
  if (currentChoice === "no") return;
  count = Math.min(12, count + 1);
  updateGuestUi();
});

confirmBtn.addEventListener("click", () => {
  const name = familyName.value.trim() || "Gia đình bạn";

  if (currentChoice === "yes") {
    resultText.textContent = `${name} đã xác nhận tham dự với ${count} người. Hẹn gặp cả nhà tại tiệc sinh nhật của bé Gòn nhé!`;
  } else {
    resultText.textContent = `${name}: Mình không đến được, chúc mừng sinh nhật Gòn nhé.`;
  }

  saveReply({ name, choice: currentChoice, count });
  renderReplies();

  result.classList.remove("hidden");
  result.animate(
    [
      { transform: "scale(0.96)", opacity: 0.4 },
      { transform: "scale(1.02)", opacity: 1 },
      { transform: "scale(1)", opacity: 1 }
    ],
    { duration: 320, easing: "ease-out" }
  );
});

updateGuestUi();
renderReplies();

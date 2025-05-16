const questions = [
  {
    q: "3 + 4 × 2 = ?",
    options: ["14", "11", "16", "10"],
    answer: "11"
  },
  {
    q: "3 × (2 + 3) = ?",
    options: ["15", "9", "10", "8"],
    answer: "15"
  },
  {
    q: "2 + 3 × 4 - 2 = ?",
    options: ["12", "10", "16", "13"],
    answer: "12"
  },
  {
    q: "3 + (2 × 3 + 2) = ?",
    options: ["10", "11", "13", "9"],
    answer: "11"
  },
  {
    q: "2 × 2³ + 1 = ?",
    options: ["17", "18", "9", "13"],
    answer: "17"
  },
  {
    q: "120 ÷ 4 + 3 × (12 - 7) = ?",
    options: ["45", "50", "30", "60"],
    answer: "45"
  },
  {
    q: "30 ÷ 2 × 3 = ?",
    options: ["45", "20", "18", "90"],
    answer: "45"
  },
  {
    q: "6 ÷ 2 × (1 + 2) = ?",
    options: ["9", "6", "1", "3"],
    answer: "9"
  },
  {
    q: "2³ × 3 + 1 = ?",
    options: ["25", "18", "13", "20"],
    answer: "25"
  },
  {
    q: "(3 + 5) × 2² = ?",
    options: ["32", "16", "20", "40"],
    answer: "32"
  },
  {
    q: "8 ÷ 4 × 2 + 3 = ?",
    options: ["7", "10", "8", "4"],
    answer: "7"
  },
  {
    q: "(2 + 2 × 2)² = ?",
    options: ["36", "49", "25", "64"],
    answer: "36"
  },
  {
    q: "2 × 5² + 10 ÷ 2 = ?",
    options: ["60", "55", "45", "70"],
    answer: "60"
  },
  {
    q: "(10 - 4) × 2³ = ?",
    options: ["48", "36", "32", "60"],
    answer: "48"
  },
  {
    q: "9 - 3 × 2 + 4 = ?",
    options: ["7", "13", "9", "10"],
    answer: "7"
  },
  {
    q: "3 × (2 + 4) ÷ 2 = ?",
    options: ["9", "12", "6", "3"],
    answer: "9"
  },
  {
    q: "6 × 2 + 8 ÷ 4 = ?",
    options: ["14", "13", "12", "16"],
    answer: "14"
  },
  {
    q: "5 + 2 × 3 - 1 = ?",
    options: ["10", "8", "9", "11"],
    answer: "10"
  },
  {
    q: "2 × (3 + 5) ÷ 2 = ?",
    options: ["8", "6", "10", "7"],
    answer: "8"
  },
  {
    q: "2 × 2 + 2 × 2 = ?",
    options: ["8", "6", "4", "12"],
    answer: "8"
  }
];

let playerName = prompt("İsminizi girin:");
while (!playerName || playerName.trim() === "") {
  playerName = prompt("Lütfen geçerli bir isim girin:");
}

let current = 0;
let score = 0;
let timer;
let timeLeft = 40;

const questionPath = document.getElementById("question-path");
const questionBox = document.getElementById("question-box");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const resultScreen = document.getElementById("result-screen");
const resultMsg = document.getElementById("result-message");
const leaderboard = document.getElementById("leaderboard-list");

const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");

function createCircles() {
  for (let i = 0; i < questions.length; i++) {
    const circle = document.createElement("div");
    circle.classList.add("circle");
    circle.textContent = i + 1;
    questionPath.appendChild(circle);
  }
}

function loadQuestion(index) {
  if (index !== current) return;
  const question = questions[index];
  questionBox.classList.remove("hidden");
  questionText.textContent = question.q;
  optionsContainer.innerHTML = "";
  timeLeft = 40;
  updateTimer();

  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) {
      clearInterval(timer);
      markAnswer(null);
    }
  }, 1000);

  const shuffled = [...question.options]
    .map(opt => ({ opt, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(el => el.opt);

  shuffled.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.onclick = () => {
      clearInterval(timer);
      markAnswer(opt);
    };
    optionsContainer.appendChild(btn);
  });

  document.querySelectorAll(".circle")[index].classList.add("active");
}

function updateTimer() {
  timerEl.textContent = `Süre: ${timeLeft}`;
  timerEl.style.color = timeLeft <= 10 ? "red" : "#000";
}

function markAnswer(selected) {
  const question = questions[current];
  const isCorrect = selected === question.answer;
  const circles = document.querySelectorAll(".circle");
  circles[current].classList.remove("active");

  if (isCorrect) {
    score += 5;
    correctSound.play();
    circles[current].classList.add("completed");
  } else {
    wrongSound.play();
    circles[current].classList.add("wrong");
  }

  scoreEl.textContent = `Puan: ${score}`;
  questionBox.classList.add("hidden");
  current++;

  if (current >= questions.length) {
    endGame();
  } else {
    setTimeout(() => {
      loadQuestion(current);
    }, 800);
  }
}

function endGame() {
  questionBox.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  let msg = "";
  if (score >= 90) msg = "🎓 Bilgin!";
  else if (score >= 80) msg = "🧠 Uzman!";
  else if (score >= 70) msg = "💡 Daha iyi olabilirsin!";
  else msg = "🔁 Yeniden deneyelim!";
  resultMsg.textContent = `Skorun: ${score} → ${msg}`;

  const entry = { name: playerName.trim(), score: score };
  const history = JSON.parse(localStorage.getItem("leaderboard") || "[]");
  history.push(entry);
  history.sort((a, b) => b.score - a.score);
  const top10 = history.slice(0, 10);
  localStorage.setItem("leaderboard", JSON.stringify(top10));

  leaderboard.innerHTML = "";
  top10.forEach(e => {
    const li = document.createElement("li");
    li.textContent = `${e.name} - ${e.score} puan`;
    leaderboard.appendChild(li);
  });
}

function restartGame() {
  score = 0;
  current = 0;
  scoreEl.textContent = "Puan: 0";
  resultScreen.classList.add("hidden");
  document.querySelectorAll(".circle").forEach(c =>
    c.classList.remove("completed", "wrong", "active")
  );
  loadQuestion(0);
}

// INIT
createCircles();
loadQuestion(0);

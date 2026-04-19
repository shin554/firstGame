'use strict'
const questionSets = {
  daily: [
    { text: "メニューはすぐ決める", type: 1 },
    { text: "流行りものはすぐ試す", type: 1 },
    { text: "初めての場所でも迷わず進む", type: 1 },
    { text: "新しいアプリは触りながら覚える", type: 1 },
    { text: "面白そうな誘いはその場で受ける", type: 1 },
    { text: "忘れ物がないか何度も確認する", type: -1 },
    { text: "買い物は事前に決めた物だけ買う", type: -1 },
    { text: "発言する前に頭の中で整理する", type: -1 },
    { text: "休みの日は家でゆっくり過ごす", type: -1 },
    { text: "旅行のしおりや計画表を作る", type: -1 },
  ],

  work: [
  { text: "やりながら考える方がしっくりくる", type: 1 },
  { text: "思いついた方法はまず試してみたくなる", type: 1 },
  { text: "人と話すときは自分の意見を言う方だ", type: 1 },
  { text: "新しいやり方を見ると気になってしまう", type: 1 },
  { text: "できるだけ早く終わる方法を考えるのが好き", type: 1 },

  { text: "始める前に手順を細かく考えることが多い", type: -1 },
  { text: "ミスがないか何度か見直すことが多い", type: -1 },
  { text: "慣れたやり方のほうが安心できる", type: -1 },
  { text: "決まったやり方があると動きやすい", type: -1 },
  { text: "安定したやり方を続ける方が好きだ", type: -1 },
],

  love: [
  { text: "気になる人には自分から話しかける方だ", type: 1 },
  { text: "好意はわりとすぐ態度に出やすい", type: 1 },
  { text: "相手と一気に距離が縮まることがある", type: 1 },
  { text: "気持ちはわりと直感で決めることが多い", type: 1 },
  { text: "思い切って行動する方だと思う", type: 1 },

  { text: "相手の気持ちを見てから動くことが多い", type: -1 },
  { text: "関係は少しずつ距離を縮めたいタイプだ", type: -1 },
  { text: "行動する前にタイミングを考える", type: -1 },
  { text: "失敗しないように慎重に進めることが多い", type: -1 },
  { text: "長く続く関係を大事にしたいと思う", type: -1 },
],
};

const modeSettings = {
  daily: {
    label: "日常編",
    color: "#00a86b",
    background: "linear-gradient(135deg, #85FFDE 0%, #FFFB7D 100%)"
  },
  work: {
    label: "仕事編",
    color: "#3b82f6",
    background: "linear-gradient(135deg, #8BC6EC 0%, #9599E2 100%)"
  },
  love: {
    label: "恋愛編",
    color: "#ef4444",
    background: "linear-gradient(135deg, #FF9A8B 0%, #FFD1FF 100%)"
  }
};

const dom = {
  game: document.getElementById("game"),
  question: document.getElementById("question"),

  btnA: document.getElementById("btnA"),
  btnB: document.getElementById("btnB"),

  startBtn: document.getElementById("startBtn"),
  backBtn: document.getElementById("backBtn"),
  restartBtn: document.getElementById("restartBtn"),

  resultCard: document.getElementById("resultCard"),
  result: document.getElementById("result"),
  resultType: document.getElementById("resultType"),
  resultComment: document.getElementById("resultComment"),

  timer: document.getElementById("timer"),
  progress: document.getElementById("progress"),

  tweetArea: document.getElementById("tweet-area"),

  modeLabelGame: document.getElementById("modeLabelGame"),
  modeLabelResult: document.getElementById("modeLabelResult"),

  description: document.getElementById("description"),
  startNotice: document.getElementById("startNotice"),
  modeSelect: document.getElementById("modeSelect"),
  modeButtons: document.querySelectorAll("#modeSelect button"),
  buttonGroup: document.getElementById("buttonGroup"),
  mainTitle: document.getElementById("mainTitle"),

  dailyBtn: document.getElementById("dailyBtn"),
  workBtn: document.getElementById("workBtn"),
  loveBtn: document.getElementById("loveBtn")
};

let questions = [];
let currentMode = "daily";
let score = 0;
let currentQuestion = 0;
let timeLeft = 5;
let timer;

let gameState = "select";
// select = 最初の画面
// ready = スタート待ち
// game = プレイ中
// loading = 結果待ち
// result = 結果画面

function renderUI() {
  dom.game.style.display = "none";
  dom.resultCard.style.display = "none";
  dom.modeSelect.style.display = "none";
  dom.description.style.display = "none";

  dom.question.style.display = "none";
  dom.buttonGroup.style.display = "none";
  dom.timer.style.display = "none";
  dom.restartBtn.style.display = "none";
  dom.startBtn.style.display = "none";
  dom.backBtn.style.display = "none";
  dom.startNotice.style.display = "none";
  dom.progress.style.display = "none";

  if (gameState === "select") {
    dom.game.style.display = "flex";
    dom.modeSelect.style.display = "flex";
    dom.description.style.display = "block";
  }

  if (gameState === "ready") {
    dom.game.style.display = "flex";
    dom.startBtn.style.display = "block";
    dom.backBtn.style.display = "block";
    dom.startNotice.style.display = "block";
  }

  if (gameState === "game") {
    dom.game.style.display = "flex";
    dom.progress.style.display = "block"
    dom.question.style.display = "flex";
    dom.timer.style.display = "block";
    dom.buttonGroup.style.display = "flex";
  }

  if (gameState === "loading") {
    dom.game.style.display = "flex";
    dom.question.style.display = "flex";

    dom.question.textContent = "診断終了！解析中...";
    dom.question.classList.add("loading");
  }

  if (gameState === "result") {
    dom.resultCard.style.display = "block";
    dom.restartBtn.style.display = "block";
  }
}

function updateModeLabel(text, color) {
  dom.modeLabelGame.textContent = text;
  dom.modeLabelGame.style.color = color;

  dom.modeLabelResult.textContent = text;
  dom.modeLabelResult.style.color = color;
}

function shuffleQuestions() {
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }
}

function createTweetButton(text) {
  dom.tweetArea.innerText = "";
  const anchor = document.createElement("a");
  const hrefValue = "https://x.com/intent/tweet?text=" + encodeURIComponent(text + "\n#直感5秒診断");

  anchor.setAttribute('href', hrefValue);
  anchor.setAttribute('target', '_blank');
  anchor.className = "custom-tweet-button";
  anchor.innerText = "診断結果をポストする";
  dom.tweetArea.appendChild(anchor);
}

function setMode(mode) {
  currentMode = mode;
  questions = questionSets[mode];

  const settings = modeSettings[mode];

  dom.modeButtons.forEach(btn => {
    btn.classList.remove("activeMode");
  });

  updateModeLabel(settings.label, settings.color);
  document.body.style.background = settings.background;
  dom[mode + "Btn"].classList.add("activeMode");

  gameState = "ready";
  renderUI();
}

function startGame() {

  gameState = "game";
  renderUI();

  shuffleQuestions();

  score = 0;
  currentQuestion = 0;

  dom.question.classList.remove("question-animate");
  void dom.question.offsetWidth;

  dom.question.textContent = questions[currentQuestion].text;
  dom.question.classList.add("question-animate");

  dom.progress.textContent =
    `${currentQuestion + 1}問目 / 全${questions.length}問`;

  startTimer();
}

function startTimer() {
  clearInterval(timer);
  timeLeft = 5;
  dom.timer.textContent = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    dom.timer.textContent = timeLeft;

    if (timeLeft === 0) {
      clearInterval(timer);
      dom.game.classList.add("shake-animation");

      setTimeout(() => {
        dom.game.classList.remove("shake-animation");
        showNextQuestion();
      }, 400);
    }
  }, 1000);
}

function getResult() {
  let resultType = "";
  let comment = "";

  if (currentMode === "daily") {
  if (score > 0) {
    resultType = "ノリ行動タイプ";
    comment = "思いついたらすぐ動く！フットワーク軽めなタイプ✨";
  } else if (score < 0) {
    resultType = "準備しっかりタイプ";
    comment = "確認や計画を大事にして安心して進めるタイプ🧠";
  } else {
    resultType = "マイペースタイプ";
    comment = "自分のペースで自然体に過ごすのが得意なタイプ🌿";
  }
}

if (currentMode === "work") {
  if (score > 0) {
    resultType = "即断即決タイプ";
    comment = "スピード感を大事にして、まず動いて結果を出すタイプ💼";
  } else if (score < 0) {
    resultType = "安定重視タイプ";
    comment = "ミスを防ぎながら、確実に積み上げていく堅実タイプ📊";
  } else {
    resultType = "戦略バランスタイプ";
    comment = "状況を見ながら最適なやり方を選べる柔軟タイプ🧩";
  }
}

if (currentMode === "love") {
  if (score > 0) {
    resultType = "スピード好意タイプ";
    comment = "気になると気持ちが先に動きやすく、関係が一気に進むこともあるタイプ❤️";
  } else if (score < 0) {
    resultType = "じっくり距離タイプ";
    comment = "相手との距離やタイミングを大事にしながら関係を育てていくタイプ🌱";
  } else {
    resultType = "バランス関係タイプ";
    comment = "近づきすぎず離れすぎず、ちょうどいい距離感を作るのが上手なタイプ💫";
  }
}

  return {
    resultType,
    comment
  };
}

function showNextQuestion() {
  clearInterval(timer);
  currentQuestion++;

  if (currentQuestion < questions.length) {
    dom.progress.textContent =
      `${currentQuestion + 1}問目 / 全${questions.length}問`;

    dom.question.classList.remove("question-animate");
    dom.question.classList.add("question-hide");

    setTimeout(() => {
      dom.question.classList.remove("question-hide");

      void dom.question.offsetWidth;

      dom.question.textContent = questions[currentQuestion].text;
      dom.question.classList.add("question-animate");

      setTimeout(() => {
        startTimer();
      }, 220);

    }, 180);

  } else {
    gameState = "loading";
    renderUI();

    setTimeout(() => {
      dom.question.classList.remove("loading");
      dom.mainTitle.classList.add("title-small");

      const resultData = getResult();

      if (window.innerWidth <= 500) {
        dom.resultType.classList.add("mobile-result");
        dom.resultType.innerHTML = `あなたは<br>「${resultData.resultType}」`;
      } else {
        dom.resultType.classList.remove("mobile-result");
        dom.resultType.textContent = `あなたは「${resultData.resultType}」`;
      }

      dom.resultComment.textContent = resultData.comment;

      const tweetText =
        `あなたは「${resultData.resultType}」！\n${resultData.comment}`;
      createTweetButton(tweetText);

      gameState = "result";
      renderUI();

      setTimeout(() => {
        dom.result.classList.add("pop-animation");
      }, 30);

    }, 2000);

    dom.btnA.disabled = true;
    dom.btnB.disabled = true;
  }
}

function resetGame() {
  gameState = "select";
  renderUI();
  dom.modeButtons.forEach(btn => {
    btn.classList.remove("activeMode");
  });

  dom.btnA.disabled = false;
  dom.btnB.disabled = false;

  dom.tweetArea.innerText = "";
  dom.mainTitle.classList.remove("title-small");
  dom.result.classList.remove("pop-animation");
  dom.resultType.classList.remove("mobile-result");

  score = 0;
  currentQuestion = 0;

  updateModeLabel("未選択", "#333");

  document.body.style.background =
    "linear-gradient(135deg, #FFDEE9 0%, #B5FFFC 100%)";
}

dom.dailyBtn.onclick = () => setMode("daily");
dom.workBtn.onclick = () => setMode("work");
dom.loveBtn.onclick = () => setMode("love");

dom.backBtn.addEventListener("click", function () {
  gameState = "select";
  renderUI();

  dom.modeButtons.forEach(btn => {
    btn.classList.remove("activeMode");
  });

  updateModeLabel("未選択", "#333");

  document.body.style.background = "linear-gradient(135deg, #FFDEE9 0%, #B5FFFC 100%)";
});

dom.startBtn.addEventListener("click", startGame);

dom.btnA.addEventListener("click", function () {
  score += questions[currentQuestion].type;
  showNextQuestion();
});

dom.btnB.addEventListener("click", function () {
  score -= questions[currentQuestion].type;
  showNextQuestion();
});

dom.restartBtn.addEventListener("click", resetGame);

document.querySelectorAll("button").forEach(button => {
  button.addEventListener("touchstart", () => {
    button.classList.add("pressed");
  });

  button.addEventListener("touchend", () => {
    button.classList.remove("pressed");
  });
});

renderUI();
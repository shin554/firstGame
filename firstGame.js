'use strict'
let questions = [];
let currentMode = "daily";

const questionSets = {
  daily:[
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
    { text: "締切はギリギリまで動かない", type: 1 },
    { text: "思いついたらすぐ行動する", type: 1 },
    { text: "会議では積極的に発言する", type: 1 },
    { text: "新しいやり方を試すのが好き", type: 1 },
    { text: "仕事はスピード重視", type: 1 },
    { text: "締切は余裕を持って終わらせる", type: -1 },
    { text: "ミスしないよう何度も確認する", type: -1 },
    { text: "計画を立ててから動く", type: -1 },
    { text: "安定したやり方を選ぶ", type: -1 },
    { text: "指示やルールをしっかり守る", type: -1 },
  ],

  love: [
    { text: "好きになったらすぐアプローチする", type: 1 },
    { text: "気になる人には自分から話しかける", type: 1 },
    { text: "ノリでデートに誘える", type: 1 },
    { text: "直感で相手を好きになることが多い", type: 1 },
    { text: "恋愛は勢いが大事だと思う", type: 1 },
    { text: "相手の気持ちをじっくり考える", type: -1 },
    { text: "告白のタイミングを慎重に考える", type: -1 },
    { text: "相手の反応を見ながら距離を縮める", type: -1 },
    { text: "失敗しないように行動する", type: -1 },
    { text: "長く続く関係を重視する", type: -1 },
  ]
};

let score = 0;
let currentQuestion = 0;
let timeLeft = 5;
let timer;

const description = document.getElementById("description");
const questionElement = document.getElementById("question");
const btnA = document.getElementById("btnA");
const btnB = document.getElementById("btnB");
const backBtn = document.getElementById("backBtn");
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const resultCard = document.getElementById("resultCard");
const resultElement = document.getElementById("result");
const resultTypeElement = document.getElementById("resultType");
const resultCommentElement = document.getElementById("resultComment");
const timerElement = document.getElementById("timer");
const progressElement = document.getElementById("progress");
const tweetArea = document.getElementById("tweet-area");

function updateModeLabel(text, color) {
  const labelGame = document.getElementById("modeLabelGame");
  const labelResult = document.getElementById("modeLabelResult");

  labelGame.textContent = text;
  labelGame.style.color = color;

  labelResult.textContent = text;
  labelResult.style.color = color;
}

function setMode(mode) {
  currentMode = mode;
  questions = questionSets[mode];

  document.querySelectorAll("#modeSelect button").forEach(btn => {
    btn.classList.remove("activeMode");
  });

  document.getElementById(mode + "Btn").classList.add("activeMode");

  if (mode === "daily") {
    updateModeLabel("日常編", "#00a86b");
  } else if (mode === "work") {
    updateModeLabel("仕事編", "#3b82f6");
  } else {
    updateModeLabel("恋愛編", "#ef4444");
  }

  description.style.display = "none";
  document.getElementById("startNotice").style.display = "block"; 
  document.getElementById("modeSelect").style.display = "none";
  backBtn.style.display = "block";
  startBtn.style.display = "block";

  if (mode === "daily") {
    document.body.style.background = "linear-gradient(135deg, #85FFDE 0%, #FFFB7D 100%)";
  } else if (mode === "work") {
    document.body.style.background = "linear-gradient(135deg, #8BC6EC 0%, #9599E2 100%)";
  } else if (mode === "love") {
    document.body.style.background = "linear-gradient(135deg, #FF9A8B 0%, #FFD1FF 100%)";

}
}

function shuffleQuestions() {
 for (let i = questions.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [questions[i], questions[j]] = [questions[j], questions[i]];
 }
}

function startTimer() {
  clearInterval(timer);
  timeLeft = 5;
  timerElement.textContent = timeLeft;

  timer = setInterval(function () {
    timeLeft--;
    timerElement.textContent = timeLeft;

    if (timeLeft === 0) {
      clearInterval(timer);
      const gameBoard = document.getElementById("game");
      gameBoard.classList.add("shake-animation");

      setTimeout(() => {
        gameBoard.classList.remove("shake-animation");
        showNextQuestion();
      }, 400);
    }
  }, 1000)
}

function createTweetButton(text) {
  tweetArea.innerText = "";
  const anchor = document.createElement("a");
  const hrefValue = "https://x.com/intent/tweet?text=" + encodeURIComponent(text + "\n#直感5秒診断");
  
  anchor.setAttribute('href', hrefValue);
  anchor.setAttribute('target', '_blank');
  anchor.className = "custom-tweet-button";
  anchor.innerText = "診断結果をポストする";
  tweetArea.appendChild(anchor);
}

function showNextQuestion() {
  clearInterval(timer);
   currentQuestion++;

  if (currentQuestion < questions.length) {
    progressElement.textContent = `${currentQuestion + 1}問目 / 全${questions.length}問`;
    questionElement.textContent = questions[currentQuestion].text;
    startTimer();
  } else {
    progressElement.textContent = "";
    questionElement.textContent = "診断終了！解析中...";
    document.getElementById("buttonGroup").style.display = "none";
    timerElement.style.display = "none";

    setTimeout(function () {
      document.getElementById("mainTitle").classList.add("title-small");
      document.getElementById("game").style.display = "none";
      resultCard.style.display = "block";
      restartBtn.style.display = "block";

      setTimeout(() => {
        resultElement.classList.add("pop-animation");
      }, 10);

      let resultType = "";
      let comment = "";

      if (currentMode === "daily") {
        if (score > 0) {
          resultType = "ノリ行動タイプ";
          comment = "思いついたらすぐ動く！フットワーク軽めなタイプ✨";
        } else if (score < 0) {
          resultType = "しっかり準備タイプ";
          comment = "確認と計画を大事にする安心感あるタイプ🧠";
        } else {
          resultType = "マイペースタイプ";
          comment = "自分のペースで自然体に過ごせるタイプ🌿";
        }


      } else if (currentMode === "work") {

        if (score > 0) {
          resultType = "即断即決タイプ";
          comment = "スピードで結果を出す仕事人💼";
        } else if (score < 0) {
          resultType = "慎重派タイプ";
          comment = "ミスなく確実に進める堅実タイプ📊";
        } else {
          resultType = "戦略バランスタイプ";
          comment = "状況を見て最適解を選べる有能タイプ🧩";
        }

      } else if (currentMode === "love") {

        if (score > 0) {
          resultType = "直感アタック型";
          comment = "好きになったら一直線の情熱タイプ❤️";
        } else if (score < 0) {
          resultType = "慎重タイプ";
          comment = "ゆっくり距離を縮める誠実タイプ🌱";
        } else {
          resultType = "空気読みタイプ";
          comment = "相手との距離感を大切にできる恋愛上手💫";
        }

      }

      resultTypeElement.textContent = `あなたは「${resultType}」！`;
      resultCommentElement.textContent = comment;

      const tweetText = `あなたは「${resultType}」！\n${comment}`;
      createTweetButton(tweetText);

    }, 2000);

  btnA.disabled = true;
  btnB.disabled = true;

  }
}

document.getElementById("dailyBtn").onclick = () => setMode("daily");
document.getElementById("workBtn").onclick = () => setMode("work");
document.getElementById("loveBtn").onclick = () => setMode("love");

backBtn.addEventListener("click", function () {
  
  document.getElementById("modeSelect").style.display = "flex";
  description.style.display = "block";
  document.getElementById("startNotice").style.display = "none";

  startBtn.style.display = "none";
  backBtn.style.display = "none";

  document.querySelectorAll("#modeSelect button").forEach(btn => {
    btn.classList.remove("activeMode");
  });

  updateModeLabel("未選択", "#333");

  document.body.style.background = "linear-gradient(135deg, #FFDEE9 0%, #B5FFFC 100%)";
});

startBtn.addEventListener("click", function () {
  questions = questionSets[currentMode];
  document.getElementById("modeSelect").style.display = "none"; 
  description.style.display = "none";
  document.getElementById("startNotice").style.display = "none";
  shuffleQuestions();
  questionElement.style.display = "block";
  document.getElementById("buttonGroup").style.display = "flex";
  btnA.style.display = "inline-block";
  btnB.style.display = "inline-block";
  timerElement.style.display = "block";

  score = 0;
  currentQuestion = 0;

  btnA.disabled = false;
  btnB.disabled = false;

  questionElement.textContent = questions[currentQuestion].text;
  progressElement.textContent = `${currentQuestion + 1}問目 / 全${questions.length}問`;

  startTimer();

  backBtn.style.display = "none";
  startBtn.style.display = "none";
});

btnA.addEventListener("click", function () {
  score += questions[currentQuestion].type;
  showNextQuestion();
});

btnB.addEventListener("click", function () {
  score -= questions[currentQuestion].type;
  showNextQuestion();
});

restartBtn.addEventListener("click", function () {
  document.getElementById("modeSelect").style.display = "flex";
   description.style.display = "block"; 
  document.getElementById("startNotice").style.display = "none";
   document.querySelectorAll("#modeSelect button").forEach(btn => {
    btn.classList.remove("activeMode");
  });

  tweetArea.innerText="";
  document.getElementById("mainTitle").classList.remove("title-small")

  resultElement.classList.remove("pop-animation");
  shuffleQuestions();
  score = 0;
  currentQuestion = 0;

  document.getElementById("game").style.display = "flex";

  resultCard.style.display = "none";
  restartBtn.style.display = "none";

  questionElement.style.display = "none";
  btnA.style.display = "none";
  btnB.style.display = "none";
  timerElement.style.display = "none";
  updateModeLabel("未選択", "#333");
  document.body.style.background = "linear-gradient(135deg, #FFDEE9 0%, #B5FFFC 100%)";
}); 
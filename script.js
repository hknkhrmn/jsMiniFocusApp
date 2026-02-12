const modeBadge = document.getElementById("modeBadge");
const timeText = document.getElementById("timeText");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

/************************************************/
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");

/************* */
const FOCUS_SECOND = 25 * 60;
const BREAK_SECOND = 5 * 60;

/***********state = uygulumanın durumu */
let mode = "focus";
let secondsLeft = FOCUS_SECOND;
let intervalId = null;
/** */
function formatTime(totalSeconds) {
  const m = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const s = String(totalSeconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function updateTimerUI() {
  timeText.textContent = formatTime(secondsLeft);
  modeBadge.textContent = mode === "focus" ? "Odak" : "Mola";
}

function switchMode() {
  mode = mode === "focus" ? "break" : "focus";
  secondsLeft = mode === "focus" ? FOCUS_SECONDS : BREAK_SECONDS;
  updateTimerUI();

  alert(mode === "focus" ? "Odak başladı!" : "Mola zamanı!");
}
function tick() {
  secondsLeft--;
  updateTimerUI();

  if (secondsLeft <= 0) {
    clearInterval(intervalId);
    intervalId = null;
    switchMode();
  }
}
function startTimer() {
  if (intervalId !== null) return;
  intervalId = setInterval(tick, 1000);
}

function pauseTimer() {
  clearInterval(intervalId);
  intervalId = null;
}

function resetTimer() {
  pauseTimer();
  mode = "focus";
  secondsLeft = FOCUS_SECOND;
  updateTimerUI();
}

/**event */
startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);

const TASK_KEY = "tasks_v1";
const tasks = JSON.parse(localStorage.getItem(TASK_KEY)) || [];

function saveTasks() {
  localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
}

function updateCount() {
  taskCount.textContent = `Toplam : ${tasks.length}`;
}

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((t) => {
    const li = document.createElement("li");

    const left = document.createElement("div");
    left.textContent = t.text;
    if (t.done) left.classList.add("done");

    const right = document.createElement("div");
    right.className = "row";

    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = t.done ? "Geri Al" : "Tamamla";
    toggleBtn.addEventListener("click", () => {
      t.done = !t.done;
      saveTasks();
      renderTasks();
    });

    const delBtn = document.createElement("button");
    delBtn.textContent = "Sil";
    delBtn.addEventListener("click", () => {
      const index = tasks.findIndex((x) => x.id === t.id);
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });
    right.appendChild(toggleBtn);
    right.appendChild(delBtn);

    li.appendChild(left);
    li.appendChild(right);
    taskList.appendChild(li);
  });
  updateCount();
}

function addTask() {
  const text = taskInput.value.trim();
  if (text.length < 2) {
    alert("Görev en az 2 karakter olmalı.");
    return;
  }
  tasks.push({
    id: Date.now(),
    text,
    done: false,
  });
  saveTasks();
  renderTasks();
  taskInput.value = "";
  taskInput.focus();
}

addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addTask();
});

updateTimerUI();
renderTasks();

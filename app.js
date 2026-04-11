const addButtonEl  = document.getElementById("AddButton");
const addTaskEl    = document.getElementById("AddTask");
const timeEl       = document.getElementById("DueDate");
const taskConEl    = document.getElementById("TaskContainer");
const banner       = document.getElementById("AlertBanner");
const countLabel   = document.getElementById("CountLabel");
const progressBar  = document.getElementById("ProgressBar");

let bannerTimer = null;

function showBanner(message, type = "success", duration = 2800) {
  if (bannerTimer) clearTimeout(bannerTimer);
  banner.textContent = message;
  banner.className = `alert-banner ${type} show`;
  bannerTimer = setTimeout(() => {
    banner.classList.add("fade-out");
    setTimeout(() => { banner.className = "alert-banner"; }, 200);
  }, duration);
}

function formatTime(t) {
  if (!t) return "";
  const [h, m] = t.split(":");
  const hr = parseInt(h);
  return `${hr > 12 ? hr - 12 : hr || 12}:${m} ${hr >= 12 ? "PM" : "AM"}`;
}

// ── Add task ──
addButtonEl.addEventListener("click", () => {
  const addTaskContent = addTaskEl.value.trim();
  const due = timeEl.value;
  const taskObj = { task: addTaskContent, dueDate: due, completed: false };

  if (addTaskContent.length && due.length !== 0) {
    addTaskToLocalStorage("task", taskObj);
    addTaskEl.value = "";
    timeEl.value = "";
    showBanner("Task added!", "success");
    displayTask();
  } else {
    showBanner("Please enter a valid task.", "error");
    addTaskEl.focus();
  }
});

addTaskEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addButtonEl.click();
});

// ── Save to localStorage ──
function addTaskToLocalStorage(key, newTask) {
  const existingData = localStorage.getItem(key);
  const dataArray = existingData ? JSON.parse(existingData) : [];
  dataArray.push(newTask);
  localStorage.setItem(key, JSON.stringify(dataArray));
}

// ── Display tasks ──
function displayTask() {
  const tasks = JSON.parse(localStorage.getItem("task")) || [];
  const total = tasks.length;
  const done  = tasks.filter(t => t.completed).length;
  const rem   = total - done;

  countLabel.textContent = rem === 0 && total > 0 ? "All done!" : `${rem} remaining`;
  progressBar.style.width = total ? `${(done / total) * 100}%` : "0%";

  if (!tasks.length) {
    taskConEl.innerHTML = `<div class="empty">No tasks yet</div>`;
    return;
  }

  taskConEl.innerHTML = tasks.map((task, index) => `
    <div class="taskItem${task.completed ? " done" : ""}">
      <div class="task-main">
        <span class="task-text">${task.task}</span>
        ${task.dueDate ? `<span class="task-time">${formatTime(task.dueDate)}</span>` : ""}
      </div>
      <div class="task-actions">
        <input type="checkbox" data-index="${index}" ${task.completed ? "checked" : ""}>
        <button class="action-btn" data-index="${index}" data-action="edit">Edit</button>
        <button class="action-btn del" data-index="${index}" data-action="delete">Del</button>
      </div>
    </div>
  `).join("");
}

// ── Handle clicks ──
taskConEl.addEventListener("click", (e) => {
  const index = e.target.dataset.index;
  if (index === undefined) return;

  let tasks = JSON.parse(localStorage.getItem("task")) || [];

  if (e.target.type === "checkbox") {
    tasks[index].completed = !tasks[index].completed;
  }

  if (e.target.dataset.action === "delete") {
    tasks.splice(index, 1);
  }

  if (e.target.dataset.action === "edit") {
    const newTask = prompt("Edit task:", tasks[index].task);
    if (newTask !== null && newTask.trim().length !== 0) {
      tasks[index].task = newTask.trim();
    } else if (newTask !== null) {
      showBanner("Please enter a valid task.", "error");
    }
  }

  localStorage.setItem("task", JSON.stringify(tasks));
  displayTask();
});

// ── Initial render ──
displayTask();
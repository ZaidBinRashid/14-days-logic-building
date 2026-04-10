const addButtonEl = document.getElementById("AddButton");
const addTaskEl   = document.getElementById("AddTask");
const taskConEl   = document.getElementById("TaskContainer");

// ── Banner setup ──
const banner = document.createElement("div");
banner.classList.add("alert-banner");
addButtonEl.insertAdjacentElement("afterend", banner);

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

// ── Add task ──
addButtonEl.addEventListener("click", () => {
  let addTaskContent = addTaskEl.value.trim();
  let taskObj = { task: addTaskContent, completed: false };

  if (addTaskContent.length !== 0) {
    addTaskToLocalStorage("task", taskObj);
    addTaskEl.value = "";
    showBanner("✓ Task added!", "success");
    displayTask();
  } else {
    showBanner("Please enter a valid task.", "error");
    addTaskEl.focus();
  }
});

// Allow pressing Enter to add a task
addTaskEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addButtonEl.click();
});

// ── Save to localStorage ──
function addTaskToLocalStorage(key, newTask) {
  let existingData = localStorage.getItem(key);
  let dataArray = existingData ? JSON.parse(existingData) : [];
  dataArray.push(newTask);
  localStorage.setItem(key, JSON.stringify(dataArray));
}

// ── Display tasks ──
function displayTask() {
  const tasks = JSON.parse(localStorage.getItem("task")) || [];

  taskConEl.innerHTML = tasks
    .map((task, index) => `
      <div class="taskItem">
        <span>${task.task}</span>
        <div>
          <input type="checkbox" data-index="${index}" ${task.completed ? "checked" : ""}>
          <button class="deleteBtn" data-index="${index}">Delete</button>
        </div>
      </div>
    `)
    .join("");
}

// ── Handle clicks ──
taskConEl.addEventListener("click", (e) => {
  const index = e.target.dataset.index;
  if (index === undefined) return;

  let tasks = JSON.parse(localStorage.getItem("task")) || [];

  if (e.target.type === "checkbox") {
    tasks[index].completed = !tasks[index].completed;
  }

  if (e.target.classList.contains("deleteBtn")) {
    tasks.splice(index, 1);
  }

  localStorage.setItem("task", JSON.stringify(tasks));
  displayTask();
});

// ── Initial render ──
displayTask();
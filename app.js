// ── Element references ──
const addButtonEl = document.getElementById("AddButton");
const addTaskEl = document.getElementById("AddTask");
const taskConEl = document.getElementById("TaskContainer");

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
    setTimeout(() => {
      banner.className = "alert-banner";
    }, 200);
  }, duration);
}

// ── Add task ──
addButtonEl.addEventListener("click", () => {
  let addTaskContent = addTaskEl.value.trim();

  let taskObj = {
    task: addTaskContent,
    completed: false,
  };

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
    .map(
      (task, index) => `
      <div class="taskItem">
        ${task.task}
        <input type="checkbox" data-index="${index}" ${
        task.completed ? "checked" : ""
      }>
      </div>
    `
    )
    .join("");
}

// ── Handle checkbox click (ONLY ONCE) ──
taskConEl.addEventListener("click", (e) => {
  if (e.target.type === "checkbox") {
    const index = e.target.dataset.index;

    // Get fresh data
    const tasks = JSON.parse(localStorage.getItem("task")) || [];

    // Toggle completed
    tasks[index].completed = !tasks[index].completed;

    // Save back
    localStorage.setItem("task", JSON.stringify(tasks));

    // Re-render
    displayTask();
  }
});

// ── Initial render ──
displayTask();
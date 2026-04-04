const addButtonEl = document.getElementById("AddButton");
const addTaskEl = document.getElementById("AddTask");
const taskConEl = document.getElementById("TaskContainer")


addButtonEl.addEventListener("click", () => {
  const addTaskContent = addTaskEl.value;
  
  if(addTaskContent.length !== 0) {
      addTaskToLocalStorage("task", addTaskContent);
      console.log(addTaskContent);
      alert("Task Added!!");
  }
  else{
      alert("Please enter a valid task");
  }
});

function addTaskToLocalStorage(task, newTask){
  // 1. Get existing data
    let existingData = localStorage.getItem(task);

    // 2. Parse data or initialize empty array if null
    let dataArray = existingData ? JSON.parse(existingData) : [];

    // 3. Add the new value
    dataArray.push(newTask);

    // 4. Stringify and save back to LocalStorage
    localStorage.setItem(task, JSON.stringify(dataArray));
  }
  
  let localStorageContent = localStorage.getItem("task")

  taskConEl.innerHTML = JSON.parse(localStorageContent)






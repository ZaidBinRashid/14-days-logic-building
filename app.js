const addButtonEl = document.getElementById("AddButton");
const addTaskEl = document.getElementById("AddTask");


addButtonEl.addEventListener("click", () => {
  const addTaskContent = addTaskEl.value;
  
  if(addTaskContent.length !== 0) {
      console.log(addTaskContent);
      console.log("Task Added!!");
  }
  else{
      console.log("Please enter a valid task");
  }
  
});



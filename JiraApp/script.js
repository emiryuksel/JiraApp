const listColumns = document.querySelectorAll(".drag-item-list");

const todoList = document.getElementById("todo-list");
const progressList = document.getElementById("progress-list");
const doneList = document.getElementById("done-list");

const addButtons = document.querySelectorAll(".add-btn:not(.update)");
const saveButtons = document.querySelectorAll(".update");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");

let todoListArray = [];
let progressListArray = [];
let doneListArray = [];
let listArrays = [];

let draggedItem;
let currentColumn;
let dragging = false;

let updatedOnLoad = false;

function getSavedColumns() {
  if (localStorage.getItem("todoItems")) {
    todoListArray = JSON.parse(localStorage.getItem("todoItems"));
    progressListArray = JSON.parse(localStorage.getItem("progressItems"));
    doneListArray = JSON.parse(localStorage.getItem("doneItems"));
  } else {
    todoListArray = ["React Integration", "Angular Integration"];
    progressListArray = ["Sendgrid Integration"];
    doneListArray = ["Verimor Integration"];
  }
}

function createItem(columnItem, column, item, index) {
  const listItem = document.createElement("li");
  listItem.classList.add("drag-item");
  listItem.textContent = item;
  listItem.draggable = true;
  listItem.contentEditable = false; // Editing is initially disabled
  listItem.setAttribute("onfocusout", `updateItem(${index}, ${column})`);
  listItem.setAttribute("ondragstart", "drag(event)");

  // Enable contentEditable and move the caret to the end during editing
  listItem.addEventListener("click", () => {
    listItem.contentEditable = true;
    listItem.focus(); // Ensure focus

    // Create a range to move the caret to the end of the text
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(listItem);
    range.collapse(false); // Move caret to the end of the text
    selection.removeAllRanges();
    selection.addRange(range);
  });

  // Disable contentEditable during dragging
  listItem.addEventListener("mousedown", () => {
    listItem.contentEditable = false;
  });

  // Save the edit when focus is lost
  listItem.addEventListener("focusout", () => {
    listItem.contentEditable = false; // Disable editing again when done
    updateItem(index, column); // Call the update function
  });

  columnItem.appendChild(listItem);
}

function updatedSavedColumn() {
  listArrays = [todoListArray, progressListArray, doneListArray];
  const arrayNames = ["todo", "progress", "done"];
  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(
      `${arrayName}Items`,
      JSON.stringify(listArrays[index])
    );
  });
}

function allowDrop(e) {
  e.preventDefault();
}

function dragEnter(column) {
  listColumns[column].classList.add("over");
  currentColumn = column;
}

function updateInsideArrays() {
  todoListArray = [];
  for (let i = 0; i < todoList.children.length; i++) {
    todoListArray.push(todoList.children[i].textContent);
  }

  progressListArray = [];
  for (let i = 0; i < progressList.children.length; i++) {
    progressListArray.push(progressList.children[i].textContent);
  }

  doneListArray = [];
  for (let i = 0; i < doneList.children.length; i++) {
    doneListArray.push(doneList.children[i].textContent);
  }

  updateDOM();
}

function drop(e) {
  e.preventDefault();
  const parent = listColumns[currentColumn];

  listColumns.forEach((column) => {
    column.classList.remove("over");
  });
  parent.appendChild(draggedItem);
  updateInsideArrays();
  dragging = false;
}

function drag(e) {
  draggedItem = e.target;
  console.log(draggedItem);
  dragging = true;
}

function filterArray(array) {
  const filteredArray = array.filter((item) => item !== null);
  return filteredArray;
}

function updateDOM() {
  if (!updatedOnLoad) {
    getSavedColumns();
    listArrays = [todoListArray, progressListArray, doneListArray];
  }

  todoList.textContent = "";
  todoListArray.forEach((todoItem, index) => {
    createItem(todoList, 0, todoItem, index);
  });

  todoListArray = filterArray(todoListArray);

  progressList.textContent = "";
  progressListArray.forEach((progressItem, index) => {
    createItem(progressList, 1, progressItem, index);
  });

  progressListArray = filterArray(progressListArray);

  doneList.textContent = "";
  doneListArray.forEach((doneItem, index) => {
    createItem(doneList, 2, doneItem, index);
  });

  doneListArray = filterArray(doneListArray);

  updatedOnLoad = true;
  updatedSavedColumn();
}

function showItemDiv(column) {
  addButtons[column].style.visibility = "hidden";
  addItemContainers[column].style.display = "flex";
  saveButtons[column].style.display = "flex";
}

function hideItemDiv(column) {
  addButtons[column].style.visibility = "visible";
  addItemContainers[column].style.display = "none";
  saveButtons[column].style.display = "none";
  addToColumn(column);
}

function addToColumn(column) {
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].textContent = "";
  updateDOM();
}

function updateItem(id, column) {
  const selectedArray = listArrays[column];
  const selectedColumn = listColumns[column].children;

  // If the item's content is empty, delete it from the array
  if (selectedColumn[id].textContent.trim() === "") {
    selectedArray.splice(id, 1); // Remove item from array
  } else {
    // If the item is not empty, save the updated content to the array
    selectedArray[id] = selectedColumn[id].textContent;
  }

  updateDOM();
}

updateDOM();

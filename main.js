const tasks = JSON.parse(localStorage.getItem("tasks")) ?? [];

// 1. Function to render the UI:
function render() {

    if (tasks.length === 0) {
        taskList.innerHTML = '<li class="empty-message">No task available</li>';
        return;
    }

    const html = tasks.map(
        (task, index) => `
            <li class="task-item ${task.completed ? 'completed' : ''}" data-index=${index}>
                <span class="task-title">${escapeHTML(task.title)}</span>
                <div class="task-action">
                    <button class="task-btn edit">Edit</button>
                    <button class="task-btn done">Mark as ${task.completed ? 'undone' : 'done'}</button>
                    <button class="task-btn delete">Delete</button>
                </div>
            </li>`).join("");
    taskList.innerHTML = html;
}

// 2. When submit form, add a new task

const taskList = document.querySelector("#task-list");
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");

todoForm.addEventListener("submit", addTask);

function addTask(e) {
    e.preventDefault();

    const value = todoInput.value.trim();
    // Ensure non-empty task title
    if (!value) {
        alert("Please enter something!");
        todoInput.value = "";
        return;
    }
    // Ensure non-duplicate task title
    if (isDuplicateTask(value)) {
        alert(`${value} is already in the list!`);
        todoInput.value = "";
        return;
    }

    tasks.unshift({ title: value, completed: false });
    todoInput.value = "";
    // Re-render
    render();
    saveTasks();
}

// 3. Action buttons
taskList.addEventListener("click", handleTaskActions);

function handleTaskActions(e) {
    const taskElement = e.target.closest(".task-item"); // closest parent with .task-item
    if (!taskElement) return; // if there's no task element, return

    const taskIndex = +taskElement.dataset.index; // turn index into number
    const task = tasks[taskIndex];
    const buttonName = e.target.classList[1];

    // 1. Edit
    if (buttonName === "edit") {
        const newTitle = prompt("Enter a new task title", task.title).trim();
        // Title not empty
        if (!newTitle) {
            alert("Please enter a valid task title!");
            return;
        }
        // Title not duplicate
        if (isDuplicateTask(newTitle, taskIndex)) {
            alert(`${newTitle} is already in the list!`);
            todoInput.value = "";
            return;
        }
        task.title = newTitle;
        render();
        saveTasks();
        return;
    }
    // 2. Mark
    if (buttonName === "done") {
        task.completed = !task.completed;
        render();
        saveTasks();
        return;
    }
    // 3. Delete
    if (buttonName === "delete") {
        if (confirm(`Do you want to delete "${task.title}"?`)) { tasks.splice(taskIndex, 1); }
    }
    render();
    saveTasks();
}

// 4. Ensure non-duplicate titles
function isDuplicateTask(newTitle, excludedIndex = -1) {
    const isDuplicate = tasks.some(
        (task, index) =>
            task.title.toLowerCase() === newTitle.toLowerCase() &&
            excludedIndex !== index);
    return isDuplicate;
}

// 5. Save tasks into local storage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// 6. Avoid XSS attack
function escapeHTML(html) {
    const div = document.createElement("div");
    div.innerText = html;
    return div.innerHTML;
}

// 100. Render to ensure that any existing task in the array gets rendered
render();
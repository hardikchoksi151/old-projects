const addBtn = document.querySelector("#new-task-btn");
const input = document.querySelector("#new-task-input");
const table = document.querySelector("#table");
const tBody = document.querySelector("#t-body");

let todos = [];

getTasks();

function Task(id , status , title){
    this.title = title;
    this.status = status;
    this.id = id;
}

input.addEventListener("keypress", function (event){
    if (event.key == "Enter") {
        event.preventDefault();
        addBtn.click();
    }
});

function template(id, title, status) {

    let statusLine;
    if (!status) {
        statusLine = `<button class="done-btn" taskId="${id}" onclick="task_done(this)">Done</button>`;
    } else {
        statusLine = `<span>Task Done</span>`;
    }

    return `
    <div id="${id}" class="task-container">
        <div class="title" id="title-${id}">${title}</div>
        <div class="edit" taskId="${id}"><i onclick="edit_Task(this)" taskId="${id}" class="fa-solid fa-pen-to-square"></i></div>
        <div class="delete" taskId="${id}"><i class="fa-solid fa-trash" taskId="${id}" onclick="delete_Task(this)"></i></div>
        <div class="status" id="status-${id}">${statusLine}</div>
    </div>
    `;
}

// CRUD methods

function task_done(DoneBtn) {
    let id = DoneBtn.getAttribute("taskId");
    let statusCell = document.querySelector(`#status-${id}`);
    statusCell.innerHTML = "";
    statusCell.innerHTML = "<span>Task Done</span>";
    todos.map(task => {
        if (task.id == id) {
            task.status = true;
        }
    });
    localStorage.setItem('todos', JSON.stringify(todos));
}

function getTasks() {
    let temp = localStorage.getItem('todos');

    if (temp == null) {
        return;
    }
    
    todos = JSON.parse(temp);

    todos.forEach(task => {
        tBody.innerHTML += template(task.id, task.title, task.status);
    });
}

function addTask() {

    if (input.value == '') {
        alert("Please Enter Title");
        return;
    }

    let task = new Task(create_UUID(), false, input.value);
    todos.push(task);
    localStorage.setItem('todos', JSON.stringify(todos));
    input.value = "";
    tBody.innerHTML += template(task.id, task.title, task.status);
    input.focus();
}

function delete_Task(row) {
    tBody.removeChild(document.getElementById(row.getAttribute("taskId")));
    todos = todos.filter(function (task) {
        return task.id !== row.getAttribute("taskId");
    });
    localStorage.setItem('todos', JSON.stringify(todos));
}

function edit_Task(row) {
    let tid = `title-${row.getAttribute('taskId')}`;
    let temp = document.getElementById(tid);

    if (temp.innerHTML.substring(0,6) === "<input") {
        return;
    }

    let id = row.getAttribute('taskId');
    let temp2 = temp.innerText;
    temp.textContent = "";
    temp.innerHTML = `<input type="text" class="editInput" id="edit-title-${id}" value="${temp2}"/>
                      <Button class="edit-btn" id="edit-btn-${id}" taskId="${id}" onclick="edit_save(this)">Save</Button>`;
    let editTitle = document.querySelector(`#edit-title-${id}`);
    editTitle.focus();
}

function edit_save(btn) {
    let id = btn.getAttribute("taskId");

    let title= document.querySelector(`#title-${id}`);
    let habi = document.querySelector(`#edit-title-${id}`);
    title.innerHTML = "";
    title.innerText = habi.value;

    todos.map((task) => {
        if (task.id == id) {
            task.title = title.innerText;
        }
    });

    localStorage.setItem('todos', JSON.stringify(todos));
}

// helper function
function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}
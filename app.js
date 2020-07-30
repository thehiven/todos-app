'use strict';

function createInputElement(placeholder) {
  const input = document.createElement('input');
  input.setAttribute('placeholder', placeholder);

  return input;
}

// let users insert their username in the welcome field
function usernameInputSetup() {
  const span = document.getElementById('username');

  // check if username is already set and display it
  if (localStorage.getItem('username')) {
    span.innerText = localStorage.getItem('username');
  }

  span.addEventListener('click', function() {
    const input = createInputElement('Type your username...');
    input.classList.add('name-input');
    span.replaceWith(input);

    input.focus();

    inputElement.addEventListener('keypress', (e) => { if (e.keyCode === 13) saveUsername(); });
    inputElement.addEventListener('blur', saveUsername);

    // store username in browser local storage
    // replace input element with span
    function saveUsername() {
      const username = input.value;
      localStorage.setItem('username', username);
      span.innerText = username;
      input.replaceWith(span);
    }
  })
}

// save task to browser local storage
function storeTask(id, text) {
  if (localStorage.getItem('tasks')) {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    const task = tasks.find(element => element.id === id);
    if (task) {
      task.text = text;
    } else {
      const task = {
        id,
        text
      };
      tasks.push(task);
    }

    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
}

function deleteTask(id) {
  if (localStorage.getItem('tasks')) {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.splice(tasks.findIndex((element) => element.id === id), 1);

    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
}

// creates a box container and sets its ID to taskID
// creates task paragraph and appends it to the box
// creates delete button and appends it to the box
function createTaskElement(taskID, text) {
  const tasksContainer = document.getElementById('tasks');
  const box = document.createElement('div');
  box.classList.add('box', 'content');
  box.id = taskID;

  const task = document.createElement('p');
  task.classList.add('is-size-4');
  task.innerText = text;

  // allow users to edit existing tasks by clicking on them
  task.addEventListener('click', function() {
    const input = createInputElement('');
    input.classList.add('edit-input');
    input.value = task.innerText;

    input.addEventListener('keypress', (e) => { if (e.keyCode === 13) saveTaskEdit(); });
    input.addEventListener('blur', saveTaskEdit);

    function saveTaskEdit() {
      task.innerText = input.value;
      storeTask(box.id, input.value);
      input.replaceWith(task);
    }

    task.replaceWith(input);
  });

  const deleteButton = document.createElement('button');
  deleteButton.classList.add('btn-delete', 'is-hidden');
  deleteButton.innerHTML = '<i class="fas fa-lg fa-trash"></i>';

  deleteButton.addEventListener('click', function() {
    deleteTask(box.id);
    tasksContainer.removeChild(box);
  });

  box.addEventListener('mouseover', function() {
    deleteButton.classList.remove('is-hidden');
  });

  box.addEventListener('mouseout', function() {
    deleteButton.classList.add('is-hidden');
  });

  box.append(deleteButton);
  box.append(task);

  tasksContainer.prepend(box);
}

function taskInputSetup() {
  const input = document.getElementById('task-input');
  const saveButton = document.getElementById('task-save');

  input.addEventListener('keypress', (e) => { if (e.keyCode === 13) createNewTask(); });
  saveButton.addEventListener('click', createNewTask);

  function createNewTask() {
    const date = new Date();
    const taskID = date.getDate() + '_' + date.getSeconds() + '_' + date.getMilliseconds();

    createTaskElement(taskID, input.value);
    storeTask(taskID, input.value);

    input.value = '';
  }
}

function displaySavedTasks() {
  if (localStorage.getItem('tasks')) {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    tasks.forEach(element => createTaskElement(element.id, element.text));
  }
}

document.addEventListener('DOMContentLoaded', function() {
  usernameInputSetup();
  taskInputSetup();
  displaySavedTasks();

  if (!localStorage.getItem('tasks')) localStorage.setItem('tasks', JSON.stringify([]));
});
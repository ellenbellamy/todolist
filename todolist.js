//Создаем переменные, которые понадобятся в дальнейшем
const addTask = document.getElementById('addition');
const inputTask = document.getElementById('taskDescription');
const allTasks = document.querySelector('.tasksField');

//Создаем массив задач
let tasks = [];
let todoTasks = [];

//Достаем из хранилища список задач, записанных туда раннее, используем формат JSON, тк этот формат удобнее для локального хранилища
if (!localStorage.tasks) {
  tasks = []
} else {
  tasks = JSON.parse(localStorage.getItem('tasks'))
}


//Функция-конструктор задач
function Task(task) {
  this.task = task;
  this.completed = false;
}

//Создаем шаблон для создания одной задачи
function createTask(description, index) {
  return `
        <div class="task-new ${description.completed ? 'checked' : ''}">
             <div class="task">${description.task}</div>
             <div class="editing">           
                  <input onclick="completedTask(${index})" class="taskComplete" type="checkbox" 
                        ${description.completed ? 'checked' : ''}>
                  <button onclick="editTask(${index})" class="buttonEdit">Edit</button>
                  <button onclick="deletedTask(${index})" class="buttonDelete">Delete</button>
             </div>
        </div>          
    `
}



//Функция отображения задач на странице
function showTasks() {
  allTasks.innerHTML = "";
  if (tasks.length > 0) {
    tasks.forEach((item, index) => {
      allTasks.innerHTML += createTask(item, index)
    });
    todoTasks = document.querySelectorAll('.task-new');

  }
}

showTasks();

//Функция для хранения задач в локальном хранилище
function updateStorage() {
  localStorage.setItem('tasks', JSON.stringify(tasks))
}

//Функция выполнения задачи
function completedTask(index) {
  tasks[index].completed = !tasks[index].completed;
  if (tasks[index].completed) {
    todoTasks[index].classList.add('checked') //При нажатии на кнопку присваиваем задаче класс "выполнено"
  } else {
    todoTasks[index].classList.remove('checked')
  }
  updateStorage();
  showTasks();
}


// Функция удаления задач
function deletedTask(index) {
  todoTasks[index].classList.add('deleted')
  tasks.splice(index, 1); //Удаляем из массива один элемент - нужную задaчу
  updateStorage();
  showTasks();
}

// Функция редактирования
function editTask(index) {
  let curTask = todoTasks[index]; 
  if(!curTask.classList.contains('edit')) { //Первый раз нажимаем - открывается окно редактирования
    curTask.classList.add('edit'); 
    curTask.querySelector('.task').innerHTML = `<input type="text" value="${tasks[index].task}">`; 
  } else { //Второй раз нажимаем - класс удаляется и сохраняется новый текст задачи
    let newTask = curTask.querySelector('.task > input').value;
    tasks[index].task = newTask;
    curTask.querySelector('.task').innerText = newTask;
    curTask.classList.remove('edit');
    updateStorage();
  }
}

//Добавление новой задачи
addTask.addEventListener("click", () => {
    tasks.push(new Task(kitcut(inputTask.value, 30))); //Добавляем задачу в массив задач
updateStorage();
showTasks();
inputTask.value = ''; //Очищаем строку ввода задачи
});

//Функция обрезания текста задачи, если в нем более определенного количества символов
function kitcut( text, limit) {
  text = text.trim();
  if( text.length <= limit) return text;
  text = text.slice( 0, limit); // тупо отрезать по лимиту
  lastSpace = text.lastIndexOf(" ");
  if( lastSpace > 0) { // нашлась граница слов, ещё укорачиваем
    text = text.substr(0, lastSpace);
  }
  return text + "...";
}
// Select DOM elements
const taskForm = document.getElementById('task-form');
const titleInput = document.getElementById('task-title');
const descInput = document.getElementById('task-desc');
const deadlineDateInput = document.getElementById('task-deadline-date');
const deadlineTimeInput = document.getElementById('task-deadline-time');

const now = new Date();
const currentDate = now.toISOString().split('T')[0];
const currentTime = now.toTimeString().split(':').slice(0, 2).join(':');

deadlineDateInput.value = currentDate;
deadlineTimeInput.value = currentTime;

const taskList = document.getElementById('task-list');
const priorityInput = document.getElementById('task-priority');
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = 'all';

// On page load
window.addEventListener('DOMContentLoaded', () => {
  filterTasks('all');
});

// Handle form submission
taskForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const title = titleInput.value.trim();
  const desc = descInput.value.trim();
  const deadline = `${deadlineDateInput.value} ${deadlineTimeInput.value}`;
  const priority = priorityInput.value;

  if (!title) return alert("Task title is required!");

  const task = {
    id: Date.now(),
    title,
    desc,
    deadline,
    completed: false,
    priority
  };

  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  filterTasks(currentFilter);
  taskForm.reset();
document.getElementById('task-deadline').value = new Date().toISOString().split('T')[0];

const now = new Date();
const hours = now.getHours().toString().padStart(2, '0');
const minutes = now.getMinutes().toString().padStart(2, '0');
document.getElementById('task-time').value = `${hours}:${minutes}`;

});

function addTaskToDOM(task) {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.setAttribute('data-id', task.id);
    li.setAttribute('draggable', true); // enable dragging
    renderTaskView(li, task);
    // Add drag listeners
    addDragListeners(li);
    taskList.appendChild(li);
  }
  

function renderTaskView(li, task) {
    li.innerHTML = `
    <div class="task-header">
        <div style="display: flex; align-items: center; gap: 0.5rem;">
        <input type="checkbox" class="task-complete" ${task.completed ? 'checked' : ''} />
        <span class="task-title ${task.completed ? 'completed' : ''}">
            ${task.title}
        </span>
        </div>
        <div>
        <button class="edit-btn">✏️</button>
        <button class="delete-btn">❌</button>
        </div>
    </div>
    ${task.priority ? `<span class="priority-symbol ${task.priority}" title="Priority: ${task.priority}"></span>` : ""}
    ${task.desc ? `<p class="task-desc">${task.desc}</p>` : ""}
    ${task.deadline ? `<p class="task-deadline">🗓 ${task.deadline}</p>` : ""}
    


    `;

  // Checkbox toggle
  li.querySelector('.task-complete').addEventListener('change', function () {
    task.completed = this.checked;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    filterTasks(currentFilter);
  });

  // Edit button
  li.querySelector('.edit-btn').addEventListener('click', () => {
    renderEditForm(li, task);
  });
  // Delete
  li.querySelector('.delete-btn').addEventListener('click', () => {
    // Remove from array
    tasks = tasks.filter(t => t.id !== task.id);
  
    // Save to localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));
  
    // Re-render filtered view
    filterTasks(currentFilter);
  });
  
}

function renderEditForm(li, task) {
  li.innerHTML = `
    <form class="edit-form">
      <input type="text" name="edit-title" value="${task.title}" required />
      <textarea name="edit-desc">${task.desc || ''}"></textarea>
      <input type="date" name="edit-deadline" value="${task.deadline || ''}" />
      <button type="submit">Save</button>
      <button type="button" class="cancel-btn">Cancel</button>
    </form>
  `;

  const form = li.querySelector('.edit-form');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const newTitle = form.elements['edit-title'].value.trim();
    const newDesc = form.elements['edit-desc'].value.trim();
    const newDeadline = form.elements['edit-deadline'].value;

    if (!newTitle) {
      alert("Title is required");
      return;
    }

    // Update the task
    task.title = newTitle;
    task.desc = newDesc;
    task.deadline = newDeadline;

    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTaskView(li, task);
  });

  form.querySelector('.cancel-btn').addEventListener('click', () => {
    renderTaskView(li, task);
  });
}

function filterTasks(filter) {
    currentFilter = filter;
    taskList.innerHTML = '';
  
    let filteredTasks = [];
  
    if (filter === 'all') {
      filteredTasks = tasks;
    } else if (filter === 'completed') {
      filteredTasks = tasks.filter(task => task.completed);
    } else if (filter === 'incomplete') {
      filteredTasks = tasks.filter(task => !task.completed);
    }
  
    // Apply search filter
    const query = searchInput.value.toLowerCase().trim();
    if (query) {
      filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(query) ||
        (task.desc && task.desc.toLowerCase().includes(query))
      );
    }
  
    filteredTasks.forEach(task => addTaskToDOM(task));
  }
  
const searchInput = document.getElementById('search-input');
searchInput.addEventListener('input', () => {
  filterTasks(currentFilter);
});

// Filter Buttons
document.querySelectorAll('[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      filterTasks(filter);
  
      // Remove existing active-filter class
      document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active-filter'));
  
      // Add to clicked button
      btn.classList.add('active-filter');
    });
  });

const weatherButton = document.getElementById('weather-button');
const weatherSection = document.getElementById('weather-section');
const locationText = document.getElementById('weather-location');
const tempText = document.getElementById('weather-temp');
const conditionText = document.getElementById('weather-condition');

const apiKey = '5819849eb25c56760964b69ed7cba6e7';
  
// weatherButton.addEventListener('click', () => {
//     if (weatherSection.style.display === 'none') {
//       weatherSection.style.display = 'block';
//       getWeather();
//     } else {
//       weatherSection.style.display = 'none';
//     }
//   });

  weatherButton.addEventListener('click', () => {
    weatherSection.style.display = 'block';
    weatherButton.style.display = 'none'; // hide the original button
    getWeather(); // fetch weather data
  });
  

  function getWeather() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  
    function success(position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
  
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  
      fetch(url)
        .then(response => response.json())
        .then(data => {
          locationText.textContent = `Location: ${data.name}`;
          tempText.textContent = `Temperature: ${data.main.temp} °C`;
          conditionText.textContent = `Condition: ${data.weather[0].main}`;
        })
        .catch(err => {
          console.error("Error fetching weather data:", err);
          locationText.textContent = "Unable to fetch weather.";
        });
    }
  
    function error() {
      alert("Unable to retrieve your location.");
    }
  }
  
  function addDragListeners(item) {
    item.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', item.dataset.id);
      item.classList.add('dragging');
    });
  
    item.addEventListener('dragend', () => {
      item.classList.remove('dragging');
    });
  
    item.addEventListener('dragover', (e) => {
      e.preventDefault();
      const dragging = document.querySelector('.dragging');
      const bounding = item.getBoundingClientRect();
      const offset = e.clientY - bounding.top;
      if (offset > bounding.height / 2) {
        item.after(dragging);
      } else {
        item.before(dragging);
      }
    });
  
    item.addEventListener('drop', () => {
      // Rebuild tasks array based on new DOM order
      const newOrder = [];
      document.querySelectorAll('.task-item').forEach((el) => {
        const id = parseInt(el.dataset.id);
        const task = tasks.find(t => t.id === id);
        newOrder.push(task);
      });
  
      tasks = newOrder;
      localStorage.setItem("tasks", JSON.stringify(tasks));
    });
  }
  
  document.getElementById('close-weather').addEventListener('click', () => {
    weatherSection.style.display = 'none';
    weatherButton.style.display = 'inline-block'; // show original button again
  });
  
  const themeToggle = document.getElementById('theme-toggle');

  // Load theme from LocalStorage
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.textContent = '☀️';
  }
  
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
  
    const isDark = document.body.classList.contains('dark-mode');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
  

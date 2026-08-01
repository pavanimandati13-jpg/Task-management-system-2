document.addEventListener("DOMContentLoaded", () => {
  const taskForm = document.getElementById("taskForm");
  const taskTitle = document.getElementById("taskTitle");
  const taskPriority = document.getElementById("taskPriority");
  const taskCategory = document.getElementById("taskCategory");
  const taskDueDate = document.getElementById("taskDueDate");
  const taskList = document.getElementById("taskList");
  const clearAllBtn = document.getElementById("clearAllBtn");

  const statTotal = document.getElementById("statTotal");
  const statPending = document.getElementById("statPending");
  const statCompleted = document.getElementById("statCompleted");

  let tasks = JSON.parse(localStorage.getItem("proTasks")) || [];

  function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;

    statTotal.textContent = total;
    statCompleted.textContent = completed;
    statPending.textContent = pending;
  }

  function saveAndRender() {
    localStorage.setItem("proTasks", JSON.stringify(tasks));
    renderTasks();
    updateStats();
  }

  function renderTasks() {
    taskList.innerHTML = "";

    if (tasks.length === 0) {
      taskList.innerHTML = `<li class="text-center text-muted py-4">No tasks added yet!</li>`;
      return;
    }

    tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.className = `list-group-item d-flex align-items-center justify-content-between task-item ${
        task.completed ? "task-completed" : ""
      }`;

      const priorityBadgeClass =
        task.priority === "High"
          ? "badge-high"
          : task.priority === "Medium"
          ? "badge-medium"
          : "badge-low";

      li.innerHTML = `
        <div class="d-flex align-items-center gap-3">
          <input type="checkbox" class="form-check-input mt-0" ${
            task.completed ? "checked" : ""
          } onchange="toggleTask(${index})" />
          <div>
            <span class="fw-semibold task-text">${escapeHtml(task.title)}</span>
            <div class="small text-muted mt-1">
              <span class="badge ${priorityBadgeClass} me-1">${task.priority}</span>
              <span class="badge bg-secondary me-1">${task.category}</span>
              ${
                task.dueDate
                  ? `<span><i class="fa-regular fa-calendar me-1"></i>${task.dueDate}</span>`
                  : ""
              }
            </div>
          </div>
        </div>
        <button class="btn btn-outline-danger btn-sm border-0" onclick="deleteTask(${index})">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      `;

      taskList.appendChild(li);
    });
  }

  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const newTask = {
      title: taskTitle.value.trim(),
      priority: taskPriority.value,
      category: taskCategory.value,
      dueDate: taskDueDate.value,
      completed: false,
    };

    tasks.push(newTask);
    taskTitle.value = "";
    taskDueDate.value = "";
    saveAndRender();
  });

  window.toggleTask = (index) => {
    tasks[index].completed = !tasks[index].completed;
    saveAndRender();
  };

  window.deleteTask = (index) => {
    tasks.splice(index, 1);
    saveAndRender();
  };

  clearAllBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear all tasks?")) {
      tasks = [];
      saveAndRender();
    }
  });

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  saveAndRender();
});

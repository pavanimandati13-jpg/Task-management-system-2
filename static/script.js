document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("taskForm");
  const titleInput = document.getElementById("taskTitle");
  const priorityInput = document.getElementById("taskPriority");
  const categoryInput = document.getElementById("taskCategory");
  const linkInput = document.getElementById("taskLink");
  const taskList = document.getElementById("taskList");

  const totalCount = document.getElementById("totalCount");
  const pendingCount = document.getElementById("pendingCount");
  const completedCount = document.getElementById("completedCount");

  let tasks = JSON.parse(localStorage.getItem("tasksData")) || [];

  function saveAndRender() {
    localStorage.setItem("tasksData", JSON.stringify(tasks));
    render();
  }

  function render() {
    taskList.innerHTML = "";

    let total = tasks.length;
    let completed = tasks.filter(t => t.completed).length;
    let pending = total - completed;

    totalCount.textContent = total;
    pendingCount.textContent = pending;
    completedCount.textContent = completed;

    if (tasks.length === 0) {
      taskList.innerHTML = `<p class="text-muted text-center py-3">No tasks added yet.</p>`;
      return;
    }

    tasks.forEach((t, index) => {
      const item = document.createElement("div");
      item.className = `task-item d-flex justify-content-between align-items-center ${t.completed ? 'opacity-50' : ''}`;

      let priorityClass = t.priority === 'High' ? 'badge-high' : t.priority === 'Medium' ? 'badge-medium' : 'badge-low';

      item.innerHTML = `
        <div class="d-flex align-items-center gap-3">
          <input type="checkbox" class="form-check-input" ${t.completed ? 'checked' : ''} onchange="toggleTask(${index})">
          <div>
            <div class="fw-semibold ${t.completed ? 'text-decoration-line-through' : ''}">${escapeHtml(t.title)}</div>
            <div class="mt-1">
              <span class="badge ${priorityClass} me-1">${t.priority}</span>
              <span class="badge badge-cat me-1">${t.category}</span>
              ${t.link ? `<a href="${escapeHtml(t.link)}" target="_blank" class="small text-primary"><i class="fa-solid fa-arrow-up-right-from-square"></i> Open Link</a>` : ''}
            </div>
          </div>
        </div>
        <button class="btn btn-link text-danger p-0 ms-2" onclick="deleteTask(${index})">
          <i class="fa-solid fa-trash"></i>
        </button>
      `;

      taskList.appendChild(item);
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    tasks.push({
      title: titleInput.value.trim(),
      priority: priorityInput.value,
      category: categoryInput.value,
      link: linkInput.value.trim(),
      completed: false
    });
    titleInput.value = "";
    linkInput.value = "";
    saveAndRender();
  });

  window.toggleTask = (i) => {
    tasks[i].completed = !tasks[i].completed;
    saveAndRender();
  };

  window.deleteTask = (i) => {
    tasks.splice(i, 1);
    saveAndRender();
  };

  window.clearAllTasks = () => {
    if (confirm("Clear all tasks?")) {
      tasks = [];
      saveAndRender();
    }
  };

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  render();
});

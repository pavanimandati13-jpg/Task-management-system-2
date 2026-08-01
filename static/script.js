document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("actionTaskForm");
  const taskTitle = document.getElementById("taskTitle");
  const taskUrl = document.getElementById("taskUrl");
  const taskDuration = document.getElementById("taskDuration");
  const taskCategory = document.getElementById("taskCategory");
  const taskList = document.getElementById("taskList");

  const focusSoundBtn = document.getElementById("focusSoundBtn");
  const audioPlayer = document.getElementById("audioPlayer");
  let isPlaying = false;

  let tasks = JSON.parse(localStorage.getItem("executionTasks")) || [];

  // Toggle Focus Audio
  focusSoundBtn.addEventListener("click", () => {
    if (isPlaying) {
      audioPlayer.pause();
      focusSoundBtn.classList.replace("btn-light", "btn-outline-light");
      focusSoundBtn.innerHTML = `<i class="fa-solid fa-headphones me-1"></i> Toggle Focus Audio`;
    } else {
      audioPlayer.play();
      focusSoundBtn.classList.replace("btn-outline-light", "btn-light");
      focusSoundBtn.innerHTML = `<i class="fa-solid fa-volume-high me-1"></i> Pause Audio`;
    }
    isPlaying = !isPlaying;
  });

  function saveAndRender() {
    localStorage.setItem("executionTasks", JSON.stringify(tasks));
    render();
  }

  function render() {
    taskList.innerHTML = "";

    if (tasks.length === 0) {
      taskList.innerHTML = `<p class="text-muted text-center py-4">No tasks configured. Add one above!</p>`;
      return;
    }

    tasks.forEach((t, index) => {
      const card = document.createElement("div");
      card.className = "card mb-3 border-0 bg-white shadow-sm p-3";

      card.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h6 class="fw-bold mb-0">${escapeHtml(t.title)}</h6>
          <span class="badge bg-primary">${t.category}</span>
        </div>
        <div class="d-flex align-items-center justify-content-between gap-2 flex-wrap mt-2">
          <a href="${t.url}" target="_blank" class="btn btn-primary btn-sm fw-bold">
            <i class="fa-solid fa-arrow-up-right-from-square me-1"></i> Execute Task (Launch Site)
          </a>
          <button class="btn btn-outline-dark btn-sm" onclick="startTimer(${index}, this)">
            <i class="fa-solid fa-stopwatch me-1"></i> Start ${t.duration}m Focus Timer
          </button>
          <button class="btn btn-outline-danger btn-sm border-0" onclick="deleteTask(${index})">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
        <div id="timerDisplay-${index}" class="mt-2 text-primary fw-bold small"></div>
      `;

      taskList.appendChild(card);
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    tasks.push({
      title: taskTitle.value,
      url: taskUrl.value,
      duration: taskDuration.value,
      category: taskCategory.value,
    });
    taskTitle.value = "";
    taskUrl.value = "";
    saveAndRender();
  });

  window.deleteTask = (i) => {
    tasks.splice(i, 1);
    saveAndRender();
  };

  window.startTimer = (i, btn) => {
    let seconds = tasks[i].duration * 60;
    btn.disabled = true;
    const display = document.getElementById(`timerDisplay-${i}`);

    const interval = setInterval(() => {
      let mins = Math.floor(seconds / 60);
      let secs = seconds % 60;
      display.textContent = `⏱️ Active Work Session: ${mins}m ${secs < 10 ? "0" : ""}${secs}s remaining`;

      if (seconds <= 0) {
        clearInterval(interval);
        display.textContent = "🎉 Session Complete! Take a break.";
        alert(`Time is up for task: ${tasks[i].title}`);
        btn.disabled = false;
      }
      seconds--;
    }, 1000);
  };

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  render();
});

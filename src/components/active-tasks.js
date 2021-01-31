class ActiveTasks {
  constructor() {
    this.activeTasks = JSON.parse(localStorage.getItem("activeTasks")) || [
      { projName: "break", taskID: 0, isRunning: false, time: 0 },
    ];
    this.activeTasksList = document.querySelector(".active-tasks__tasks");
    this.breakBtn = document.querySelector(".active-tasks__break");
    this.dayEndBtn = document.querySelector(".active-tasks__day-end");
    this.resetBtn = document.querySelector(".active-tasks__reset");
    this.populateActiveTasks(this.activeTasks);
    this.countBtns = document.querySelectorAll(".active-task__button-count");
    this.breakShow = document.querySelector(".active-tasks__span-break");
    this.breakBtn.addEventListener("click", (e) => this.startCount(e));
    this.dayEndBtn.addEventListener("click", () =>
      this.showWaraning(this.warningMessages[0])
    );
    this.resetBtn.addEventListener("click", () =>
      this.showWaraning(this.warningMessages[1])
    );
    this.interval = false;
    this.change = true;
    this.warningMessages = [
      "Po zakończeniu dnia nie ma już możliwości liczenia czasu aktywnych zadań. Czy napewno chcesz zakończyć ?",
      "Reset kasuje wszystkie aktywne zadania i zliczony czas. Czy napewno chcesz zresetować ?",
    ];
  }

  addActiveTask(activeProject, taskIndex) {
    if (this.dayEndBtn.disabled) return;

    const isExisted = this.activeTasks.find(
      (task) => task.taskID === activeProject.tasks[taskIndex].task_id
    )
      ? true
      : false;

    if (!isExisted) {
      const newActiveTask = {
        projName: activeProject.name,
        projIndex: activeProject.dataIndex,
        taskName: activeProject.tasks[taskIndex].name,
        taskIndex: activeProject.tasks[taskIndex].index,
        taskID: activeProject.tasks[taskIndex].task_id,
        isRunning: false,
        time: 0,
      };

      this.activeTasks.push(newActiveTask);
      localStorage.setItem("activeTasks", JSON.stringify(this.activeTasks));
      this.populateNewActiveTask(newActiveTask);
    } else return alert("To zadanie już zostało dodane do aktywnych");
  }

  populateActiveTasks(tasks) {
    const activeTasks = document.querySelectorAll(".active-task");
    if (activeTasks.length === 0) {
      this.activeTasksList.textContent = "";
      tasks.forEach((task) => {
        if (task.projName === "break") {
          task.isRunning = false;
          return;
        } else {
          task.isRunning = false;
          const div = document.createElement("div");
          div.setAttribute("class", "active-tasks__task active-task");
          div.setAttribute("data-id", `${task.taskID}`);
          div.innerHTML = `
                  <h3 class="active-task__project-name">Projekt: ${task.projName} </h3>
                  <h3 class="active-task__task-name">Zadanie: ${task.taskName} </h3>
                  <section class="active-task__counter">
                       <div class="active-task__hours time">00</div>
                      <span>:</span>
                      <div class="active-task__minutes time">00</div>
                      <span>:</span>
                       <div class="active-task__seconds time">00</div>
                  </section>
                   <button class="active-task__button-count">Licz czas</button>
              
              `;
          this.activeTasksList.appendChild(div);
        }
        if (this.activeTasks.length > 1) this.addCountListeners();
      });
    }
  }

  populateNewActiveTask(task) {
    const div = document.createElement("div");
    div.setAttribute("class", "active-tasks__task active-task");
    div.setAttribute("data-id", `${task.taskID}`);
    div.innerHTML = `
                <h3 class="active-task__project-name">Projekt: ${task.projName} </h3>
                <h3 class="active-task__task-name">Zadanie: ${task.taskName} </h3>
                <section class="active-task__counter">
                     <div class="active-task__hours time">00</div>
                    <span>:</span>
                    <div class="active-task__minutes time">00</div>
                    <span>:</span>
                     <div class="active-task__seconds time">00</div>
                </section>
                 <button class="active-task__button-count">Licz czas</button>
            
            `;
    div
      .querySelector(".active-task__button-count")
      .addEventListener("click", (e) => this.startCount(e));
    this.activeTasksList.appendChild(div);
    document;
  }
  addCountListeners() {
    const countBtnList = document.querySelectorAll(
      ".active-task__button-count"
    );
    countBtnList.forEach((btn) =>
      btn.addEventListener("click", (e) => this.startCount(e))
    );
  }

  timer(e, countedTask) {
    this.change = false;
    const countedTaskContainer = e.target.parentElement;
    countedTask.isRunning = true;
    let time = countedTask.time;

    this.interval = setInterval(() => {
      if (countedTask.isRunning) {
        time++;
        countedTask.time = time;
        localStorage.setItem("activeTasks", JSON.stringify(this.activeTasks));
        if (e.target.dataset.id === "break") {
          this.showBreakTime(countedTask.time);
        } else {
          this.showTime(countedTaskContainer, countedTask.time);
        }
      }
    }, 1000);
  }

  startCount(e) {
    this.countBtns = document.querySelectorAll(".active-task__button-count");

    this.countBtns.forEach((btn) => (btn.disabled = false));
    this.breakBtn.disabled = false;
    e.target.disabled = true;

    if (e.target.dataset.id === "break") {
      // if break is counted
      const countedTask = this.activeTasks[0];
      if (countedTask.isRunning) {
        return;
      } else {
        this.activeTasks.forEach((task) => (task.isRunning = false));
        countedTask.isRunning = true;
        this.change = !this.change;
        if (this.change) {
          clearInterval(this.interval);
          this.timer(e, countedTask);
        } else {
          this.timer(e, countedTask);
        }
      }
    } else {
      //if task is counted
      const countedTaskContainer = e.target.parentElement;
      const countedTaskId = countedTaskContainer.dataset.id;
      const countedTask = this.activeTasks.find(
        (task) => task.taskID === countedTaskId
      );

      if (countedTask.isRunning) {
        return;
      } else {
        this.activeTasks.forEach((task) => (task.isRunning = false));
        countedTask.isRunning = true;

        this.change = !this.change;
        if (this.change) {
          clearInterval(this.interval);
          this.timer(e, countedTask);
        } else {
          this.timer(e, countedTask);
        }
      }
    }
  }

  showTime(activeContainer, time) {
    const divSeconds = activeContainer.querySelector(".active-task__seconds");
    const divMinutes = activeContainer.querySelector(".active-task__minutes");
    const divHours = activeContainer.querySelector(".active-task__hours");

    let hours = Math.floor(time / 3600);
    let minutes = Math.floor((time % 3600) / 60);
    let seconds = time % 60;
    divSeconds.textContent = seconds < 10 ? `0${seconds}` : `${seconds}`;
    divMinutes.textContent = minutes < 10 ? `0${minutes}` : `${minutes}`;
    divHours.textContent = hours < 10 ? `0${hours}` : `${hours}`;
  }

  showBreakTime(time) {
    let hours = Math.floor(time / 3600);
    let minutes = Math.floor((time % 3600) / 60);
    let seconds = time % 60;
    let hoursTxt = hours < 10 ? `0${hours}` : `${hours}`;
    let minutesTxt = minutes < 10 ? `0${minutes}` : `${minutes}`;
    let secondsTxt = seconds < 10 ? `0${seconds}` : `${seconds}`;
    this.breakShow.textContent = `${hoursTxt}:${minutesTxt}:${secondsTxt}`;
  }

  showWaraning(message) {
    const warning = document.createElement("div");
    warning.classList.add("warning", "active");
    warning.innerHTML = `

      <h1 class="warning__title">UWAGA !</h1>
      <p class="warning__text">${message}</p>
      <div class="warning__buttons">
        <button class="warning__btn" data-result="yes">Tak</button>
        <button class="warning__btn" data-result="no">Nie</button>

    `;
    const btns = warning.querySelectorAll("button");
    btns.forEach((btn) =>
      btn.addEventListener("click", (e) => this.checkWarningResult(e))
    );
    const wrapper = document.querySelector(".wrapper");
    wrapper.appendChild(warning);
  }

  checkWarningResult(e) {
    if (e.target.dataset.result === "yes") {
      const isResetActive = !this.resetBtn.classList.contains("active");
      if (isResetActive) {
        this.resetBtn.style.visibility = "visible";
        this.resetBtn.classList.add("active");
        const warning = document.querySelector(".warning");
        warning.remove();
        this.statistics(e);
      } else {
        const warning = document.querySelector(".warning");
        warning.remove();
        this.reset();
      }
    } else {
      const warning = document.querySelector(".warning");
      warning.remove();
    }
  }

  statistics() {
    clearInterval(this.interval);
    this.countBtns.forEach((btn) => (btn.disabled = true));
    this.breakBtn.disabled = true;
    this.dayEndBtn.disabled = true;
    this.activeTasks.forEach((task) => (task.isRunning = false));
    const breakTime = this.activeTasks[0].time;
    let workTime = 0;
    this.activeTasks.forEach((task, index) => {
      if (index === 0) {
        return;
      } else {
        workTime += task.time;
        return;
      }
    });

    const totalTime = workTime + breakTime;
    const workTimeHours = Math.floor(workTime / 3600);
    const workTimeMinutes = Math.floor((workTime % 3600) / 60);
    const totalTimeHours = Math.floor(totalTime / 3600);
    const totalTimeMinutes = Math.floor((totalTime % 3600) / 60);

    const workTimeHoursTxt =
      workTimeHours < 10 ? `0${workTimeHours}` : `${workTimeHours}`;
    const workTimeHMinutesTxt =
      workTimeMinutes < 10 ? `0${workTimeMinutes}` : `${workTimeMinutes}`;
    const totalTimeHoursTxt =
      totalTimeHours < 10 ? `0${totalTimeHours}` : `${totalTimeHours}`;
    const totalTimeHMinutesTxt =
      totalTimeMinutes < 10 ? `0${totalTimeMinutes}` : `${totalTimeMinutes}`;

    document.querySelector(
      ".active-tasks__span-work"
    ).textContent = `${workTimeHours}h ${workTimeMinutes}m`;
    document.querySelector(
      ".active-tasks__span-total"
    ).textContent = `${totalTimeHours}h ${totalTimeMinutes}m`;
    return;
  }

  reset() {
    this.activeTasks.splice(1, this.activeTasks.length - 1);
    this.breakBtn.disabled = false;
    this.dayEndBtn.disabled = false;
    this.resetBtn.style.visibility = "hidden";
    this.resetBtn.classList.remove("active");
    localStorage.setItem("activeTasks", JSON.stringify(this.activeTasks));
    this.activeTasksList.textContent = "";
    this.activeTasks[0].time = 0;
    document.querySelector(".active-tasks__span-work").textContent = `0h 0m`;
    document.querySelector(".active-tasks__span-total").textContent = `0h 0m`;
    document.querySelector(
      ".active-tasks__span-break"
    ).textContent = `00:00:00`;
  }
}
export { ActiveTasks };

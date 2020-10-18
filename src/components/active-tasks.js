class ActiveTasks{
    constructor(){
    this.activeTasks=JSON.parse(localStorage.getItem('activeTasks')) || [];
    this.activeTasksList = document.querySelector('.active-tasks__tasks');
    this.breakBtn = document.querySelector('.active-tasks__break');
    this.populateActiveTasks(this.activeTasks)


    }

    addActiveTask(activeProject, taskIndex){

      const isExisted = this.activeTasks.find(task=> task.taskID === activeProject.tasks[taskIndex].task_id) ? true : false;

        if(!isExisted){ 
            const newActiveTask ={
                projName: activeProject.name,
                projIndex: activeProject.dataIndex,
                taskName: activeProject.tasks[taskIndex].name,
                taskIndex: activeProject.tasks[taskIndex].index,
                taskID: activeProject.tasks[taskIndex].task_id,
                isRunning: false
            };

            this.activeTasks.push(newActiveTask);
            localStorage.setItem('activeTasks', JSON.stringify(this.activeTasks));
            this.populateActiveTasks(this.activeTasks);

           
        } else return alert("To zadanie już zostało dodane do aktywnych")

       
    }

    populateActiveTasks(tasks){
        this.activeTasksList.textContent="";
        tasks.forEach(task => {
            const div = document.createElement('div');
            div.setAttribute('class', 'active-tasks__task active-task');
            div.setAttribute('data-id', `${task.taskID}`)
            div.innerHTML=`
                <h3 class="active-task__project-name">Projekt: ${task.projName} </h3>
                <h3 class="active-task__task-name">Zadanie:${task.taskName} </h3>
                <section class="active-task__counter">
                     <div class="active-task__hours time">00</div>
                    <span>:</span>
                    <div class="active-task__minutes time">00</div>
                    <span>:</span>
                     <div class="active-task__seconds time">00</div>
                </section>
                 <button class="active-task__button-count">Licz czas</button>
            
            `
            this.activeTasksList.appendChild(div);
        });
       this.addCountListeners()
     
    }
    addCountListeners(){
            const countBtnList = document.querySelectorAll('.active-task__button-count')
            countBtnList.forEach(btn => btn.addEventListener('click', (e)=> this.countTime(e)))
    }

  countTime(e){
      console.log(e.target.parentElement)
  }

}

export{ActiveTasks};
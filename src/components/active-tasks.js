class ActiveTasks{
    constructor(){
    this.activeTasks=JSON.parse(localStorage.getItem('activeTasks')) || [{projName:"break", taskID:0, isRunning:false, time:0}];
    this.activeTasksList = document.querySelector('.active-tasks__tasks');
    this.breakBtn = document.querySelector('.active-tasks__break');
    this.dayEndBtn = document.querySelector('.active-tasks__day-end');
    this.populateActiveTasks(this.activeTasks);
    this.countBtns=document.querySelectorAll('.active-task__button-count');
    this.breakShow=document.querySelector('.active-tasks__break-time');
    // this.isRunning = false;
    this.interval=false;
    this.change=true;
    this.breakBtn.addEventListener('click', (e)=>this.startCount(e))
    this.dayEndBtn.addEventListener('click', (e) => this.statistics(e))

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
                isRunning: false,
                time:0
            };

            this.activeTasks.push(newActiveTask);
            localStorage.setItem('activeTasks', JSON.stringify(this.activeTasks));
            this.populateActiveTasks(this.activeTasks);

           
        } else return alert("To zadanie już zostało dodane do aktywnych")

       
    }

    populateActiveTasks(tasks){
        this.activeTasksList.textContent="";
        tasks.forEach(task => {
          if(task.projName==='break'){
            return
          }else{
            const div = document.createElement('div');
            div.setAttribute('class', 'active-tasks__task active-task');
            div.setAttribute('data-id', `${task.taskID}`)
            div.innerHTML=`
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
            
            `
            this.activeTasksList.appendChild(div);
          }
            
        });
       this.addCountListeners()
     
    }
    addCountListeners(){
            const countBtnList = document.querySelectorAll('.active-task__button-count')
            countBtnList.forEach(btn => btn.addEventListener('click', (e)=> this.startCount(e)))
    }

    timer(e, countedTask){
      this.change=false;
      const countedTaskContainer = e.target.parentElement;
      countedTask.isRunning =true;
      let time = countedTask.time

      this.interval = setInterval(()=>{
          if(countedTask.isRunning){
            time++
            countedTask.time= time;
            if(e.target.dataset.id ==='break'){
              this.showBreakTime(countedTask.time);
            }else{
              this.showTime(countedTaskContainer, countedTask.time);
            }
            
          }
      },1000);
    }

    startCount(e){
    this.countBtns.forEach(btn=>btn.disabled=false);
    this.breakBtn.disabled=false;
    e.target.disabled=true;
    
    if(e.target.dataset.id ==='break'){
      // if break is counted
      const countedTask = this.activeTasks[0];
      if(countedTask.isRunning){
        return;
      }else{
        this.activeTasks.forEach(task=>task.isRunning=false);
        countedTask.isRunning=true;
        this.change=!this.change
        if(this.change){
            clearInterval(this.interval);
            this.timer(e, countedTask);
        }else{
          this.timer(e,countedTask)
        }
      }

    }else{
      //if task is counted
      const countedTaskContainer = e.target.parentElement;
      const countedTaskId = countedTaskContainer.dataset.id;
      const countedTask = this.activeTasks.find(task=> task.taskID === countedTaskId)
      
    if(countedTask.isRunning){
      return;
    }else{
      this.activeTasks.forEach(task=>task.isRunning=false)
      countedTask.isRunning=true;

      this.change=!this.change
      if(this.change){
          clearInterval(this.interval);
          this.timer(e, countedTask);
      }else{
        this.timer(e, countedTask)
      }
    }
    }

   }

    showTime(activeContainer,time){
    const divSeconds = activeContainer.querySelector('.active-task__seconds');
    const divMinutes = activeContainer.querySelector('.active-task__minutes');
    const divHours = activeContainer.querySelector('.active-task__hours');


    let hours = Math.floor(time / 3600);
    let minutes = Math.floor((time % 3600)/60);
    let seconds = time % 60;
    divSeconds.textContent = seconds <10 ? `0${seconds}`: `${seconds}`;
    divMinutes.textContent = minutes <10 ? `0${minutes}`: `${minutes}`;
    divHours.textContent = hours <10 ? `0${hours}`: `${hours}`;

    }

    showBreakTime(time){
      let hours = Math.floor(time / 3600);
      let minutes = Math.floor((time % 3600)/60);
      let seconds = time % 60;
      let hoursTxt = hours <10 ? `0${hours}`: `${hours}`;
      let minutesTxt = minutes <10 ? `0${minutes}`: `${minutes}`;
      let secondsTxt = seconds <10 ? `0${seconds}`: `${seconds}`;
      this.breakShow.textContent= `Przerwa: ${hoursTxt}:${minutesTxt}:${secondsTxt}`;
    }

    statistics(e){
      clearInterval(this.interval)
      this.activeTasks.forEach(task=>task.isRunning=false);
      this.activeTasks.forEach(task=>console.log(task.time));
      const breakTime = this.activeTasks[0].time;
      let workTime = 0

      this.activeTasks.forEach((task,index)=>{
        if(index ===0){
          return
        }else{
          workTime += task.time;
        }
      })

      const totalTime=workTime + breakTime;
      const workTimeHours = Math.floor(workTime / 3600);
      const workTimeMinutes = Math.floor((workTime % 3600)/60);
      const totalTimeHours = Math.floor(totalTime / 3600);
      const totalTimeMinutes = Math.floor((totalTime % 3600)/60);

      const workTimeHoursTxt = workTimeHours<10?`0${workTimeHours}`: `${workTimeHours}`;
      const workTimeHMinutesTxt = workTimeMinutes<10?`0${workTimeMinutes}`: `${workTimeMinutes}`;
      const totalTimeHoursTxt = totalTimeHours<10?`0${totalTimeHours}`: `${totalTimeHours}`;
      const totalTimeHMinutesTxt = totalTimeMinutes<10?`0${totalTimeMinutes}`: `${totalTimeMinutes}`;

    

      document.querySelector('.active-tasks__work-time').textContent = `Czas pracy: ${workTimeHours}h ${workTimeMinutes}m`;
      document.querySelector('.active-tasks__total-time').textContent=`Całkowity czas: ${totalTimeHours}h ${totalTimeMinutes}m`;

  

    


    }
}
export{ActiveTasks}
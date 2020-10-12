 class ProjectsMenu{
    constructor(){
        this.projectsList = document.querySelector('.project-menu__list');
    }

    addProject(e, newProject){
        e.preventDefault()
       
        const project = document.createElement('li');
        const input = document.querySelector('.projects-menu__input-project')

        input.value= '';
        project.setAttribute('class', 'projects-menu__project project');
        project.innerHTML=
        `
        <h2 class="project__title">${newProject}</h2>
        <span class="fas fa-caret-down expand"></span>
        <div class="project__container">
                <ul class="project__task-list">
                  
                </ul>
                <form class="project__form">
                  <input type="text" class="project__newTaskInp" name="newTask" placeholder="Nowe zadanie..." required>
                  <button class="project__button">Dodaj zadanie</button>
                </form>
              </div>
        `
        this.projectsList.appendChild(project)
        this.addListenersToProject(project);
   
    }

    addListenersToProject(project){
        const expandBtn = project.querySelector('.expand');
        const addTaskForm = project.querySelector('.project__form');
        console.log(expandBtn,addTaskForm)
        expandBtn.addEventListener('click', (e)=>this.showTasks(e));
        addTaskForm.addEventListener('submit', (e)=>this.addTask(
            e,
            addTaskForm.elements.newTask.value
            ))
    }

    showTasks(e){
        const btn = e.target;
        const parent = btn.parentElement;
        const divContainer = parent.querySelector('.project__container');
        btn.classList.toggle('open')
        divContainer.classList.toggle('open')
     
    }

    addTask(e,newTask){
        e.preventDefault()
        const input = e.target;
        input.querySelector('.project__newTaskInp').value='';
        
        const li = document.createElement('li');
        li.classList.add('project__task');
        li.innerHTML=
        `
        <h3 class="project__task-title">${newTask}</h3>
        <span class="fas fa-user-clock add"></span>
        `

        const divContainer = e.target.parentElement;
        const taskList = divContainer.querySelector('ul')
     
        taskList.appendChild(li);
        console.log(e.target.parentElement)
    }
}

export{ProjectsMenu};
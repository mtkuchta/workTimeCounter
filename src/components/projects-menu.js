import { ActiveTasks } from "./active-tasks";

 class ProjectsMenu{
    constructor(){
        this.projectsList = document.querySelector('.project-menu__list');
        this.projects=JSON.parse(localStorage.getItem('projects')) || [];
        this.populateProjects(this.projects,this.projectsList);
        this.activeTasks = new ActiveTasks();
    }

    addProject(e, newProject){
        e.preventDefault()
        const input = document.querySelector('.projects-menu__input-project')
        const isExisted = this.projects.find(project => project.name.toUpperCase() === newProject.toUpperCase()) ? true:false;
        if(isExisted) {
            input.value= '';
            return alert("Projekt o takiej nazwie już istnieje !")
        }
       
        const project = {
            name: newProject,
            dataIndex: this.projects.length ,
            tasks:[],
            isOpen:false,
        };

        input.value= '';
        this.projects.push(project)
        //add to localStorage
        localStorage.setItem('projects', JSON.stringify(this.projects));

        this.populateProjects(this.projects, this.projectsList)
        
    }

    populateProjects(projects =[], projectsList){
        projectsList.textContent='';
        projects.forEach((project)=>{
            const newProject = document.createElement('li');
            newProject.setAttribute('class', 'projects-menu__project project');
            newProject.setAttribute('data-index', `${project.dataIndex}`)
            newProject.innerHTML =
            `
            <h2 class="project__title">${project.name}</h2>
             <span class="fas fa-caret-down expand ${project.isOpen ===true? 'open': '' }"></span>
             <span class="fas fa-trash-alt delete-project"></span>
             <div class="project__container ${project.isOpen ===true? 'open': '' }" data-index="${project.dataIndex}">
                     <ul class="project__task-list">
                      
                     </ul>
                    <form class="project__form">
                       <input type="text" class="project__newTaskInp" name="newTask" placeholder="Nowe zadanie..." required>
                       <button class="project__button">Dodaj zadanie</button>
                     </form>
                   </div>
            `
            projectsList.appendChild(newProject)
            this.addListenersToProject(newProject)
            this.populateTasks(this.projects)
            
        })

    }

    addListenersToProject(project){
        const expandBtn = project.querySelector('.expand');
        const deleteProjectBtn = project.querySelector('.delete-project');
        const addTaskForm = project.querySelector('.project__form');
        expandBtn.addEventListener('click', (e)=>this.showTasks(e));
        addTaskForm.addEventListener('submit', (e)=>this.addTask(
            e,
            addTaskForm.elements.newTask.value
            ));

        deleteProjectBtn.addEventListener('click', (e)=>this.deleteProject(e))
    }

    showTasks(e){
        const btn = e.target;
        const projectIndex =e.target.parentElement.dataset.index;

        if(this.projects[projectIndex].isOpen === false){
            this.projects[projectIndex].isOpen=true;
        }else{
            this.projects[projectIndex].isOpen=false;
        }

        const parent = btn.parentElement;
        const divContainer = parent.querySelector('.project__container');
        btn.classList.toggle('open')
        divContainer.classList.toggle('open')
     
    }

    addTask(e,newTask){
        e.preventDefault()
        const projectIndex = e.target.parentElement.dataset.index;
        const isExisted = this.projects[projectIndex].tasks.find(task=> task.name.toUpperCase()===newTask.toUpperCase()) ? true: false;
        const input = e.target;
        if(isExisted) {
            input.querySelector('.project__newTaskInp').value=''; 
            return alert("Zadanie o takiej nazwie zostało już zdefiniowane !")
        }
        console.log(isExisted)
        const newTaskObj= {
            name: newTask,
            index: this.projects[projectIndex].tasks.length,
            task_id: `${this.projects[projectIndex].name}_${this.projects[projectIndex].tasks.length}`,
            startTime: 0,
            isActive:false
        }
        this.projects[projectIndex].tasks.push(newTaskObj);

        // const input = e.target;
        input.querySelector('.project__newTaskInp').value=''; 

        //add to local storage
        localStorage.setItem('projects', JSON.stringify(this.projects));
        this.populateProjects(this.projects, this.projectsList)

    }

    addListenersToTasks(){
        const deleteTaskBtns = document.querySelectorAll('.delete-task');
        const addTaskBtns = document.querySelectorAll('.add');
        deleteTaskBtns.forEach(btn=>btn.addEventListener('click', (e)=>this.deleteTask(e)));
        addTaskBtns.forEach(btn=>btn.addEventListener('click', (e)=>this.addTaskToActive(e)));
        
    }

    populateTasks(projects=[]){

        const projectsElements = document.querySelectorAll('.project')
        projectsElements.forEach((item,index)=>{
            const ul = item.querySelector('ul');
            ul.textContent='';
            projects[index].tasks.forEach((task, taskIndex)=>{
                const li = document.createElement('li');
                li.setAttribute('data-index',`${task.index}`)
                li.classList.add('project__task');
                li.innerHTML=
                `
                <h3 class="project__task-title">${task.name}</h3>
                <span class="fas fa-user-clock add"></span>
                <span class="fas fa-trash-alt delete-task"></span>
                    `
                 ul.appendChild(li)
            });       
        });

        this.addListenersToTasks();

        
    }

    deleteProject(e){
        const projectToDelete = e.target.parentElement.dataset.index;
        this.projects.splice(projectToDelete,1);
        this.projectsRenumber(this.projects);
        this.populateProjects(this.projects, this.projectsList);
 
    }

    deleteTask(e){
        const taskToDelete = e.target.parentElement;
        const taskToDeleteIndex = e.target.parentElement.dataset.index;      
        const activeProjectIndex = taskToDelete.parentElement.parentElement.dataset.index;
        this.projects[activeProjectIndex].tasks.splice(taskToDeleteIndex,1);
        this.populateTasks(this.projects);
        localStorage.setItem('projects', JSON.stringify(this.projects));
        
    }

    projectsRenumber(projects){
       projects.map((project,index)=>{
           project.dataIndex = index;
       });
       localStorage.setItem('projects', JSON.stringify(this.projects));
    }

    addTaskToActive(e){
        const task = e.target.parentElement;
        const taskIndex= task.dataset.index;
        const projectIndex = task.parentElement.parentElement.dataset.index;
        this.activeTasks.addActiveTask(this.projects[projectIndex], taskIndex);
        
    }
}

export{ProjectsMenu};
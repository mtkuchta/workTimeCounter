 class ProjectsMenu{
    constructor(){
        this.projectsList = document.querySelector('.project-menu__list');
        this.projects=JSON.parse(localStorage.getItem('projects')) || [];
        this.populateProjects(this.projects,this.projectsList);
    }

    addProject(e, newProject){
        e.preventDefault()
        const input = document.querySelector('.projects-menu__input-project')
        const project = {
            name: newProject,
            dataIndex: this.projects.length ,
            tasks:[],
            isActive:false,
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
             <span class="fas fa-caret-down expand ${project.isActive ===true? 'open': '' }"></span>
             <div class="project__container ${project.isActive ===true? 'open': '' }" data-index="${project.dataIndex}">
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
        const addTaskForm = project.querySelector('.project__form');
        expandBtn.addEventListener('click', (e)=>this.showTasks(e));
        addTaskForm.addEventListener('submit', (e)=>this.addTask(
            e,
            addTaskForm.elements.newTask.value
            ))
    }

    showTasks(e){
        const btn = e.target;
        const projectIndex =e.target.parentElement.dataset.index;

        if(this.projects[projectIndex].isActive === false){
            this.projects[projectIndex].isActive=true;
        }else{
            this.projects[projectIndex].isActive=false;
        }

        const parent = btn.parentElement;
        const divContainer = parent.querySelector('.project__container');
        btn.classList.toggle('open')
        divContainer.classList.toggle('open')
     
    }

    addTask(e,newTask){
        e.preventDefault()
        const projectIndex = e.target.parentElement.dataset.index;
        this.projects[projectIndex].tasks.push(newTask);

        const input = e.target;
        input.querySelector('.project__newTaskInp').value=''; 
        //add to local storage
        localStorage.setItem('projects', JSON.stringify(this.projects));
        this.populateProjects(this.projects, this.projectsList)

    }

    populateTasks(projects=[]){

        const projectsElements = document.querySelectorAll('.project')
        projectsElements.forEach((item,index)=>{
            const ul = item.querySelector('ul');
            ul.textContent='';
            projects[index].tasks.forEach(task=>{
                const li = document.createElement('li');
                li.classList.add('project__task');
                li.innerHTML=
                `
                <h3 class="project__task-title">${task}</h3>
                <span class="fas fa-user-clock add"></span>
                    `
                 ul.appendChild(li)
            });       
        });
    }
}

export{ProjectsMenu};
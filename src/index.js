// import {
//     message,
//     messageDOM
// } from './tools/message';
import {ProjectsMenu} from './components/projects-menu.js'
// import info from './data/title.txt';
import './sass/index.scss';
// import addImage from './tools/image';
// import Creator from './tools/creator';

const projectsMenu = new ProjectsMenu();


const addProjectForm = document.querySelector('.projects-menu__addForm');
addProjectForm.addEventListener('submit', (e)=>projectsMenu.addProject(
    e,
    addProjectForm.elements.newProject.value
    ));

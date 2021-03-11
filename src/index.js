import { ProjectsMenu } from "./components/projects-menu.js";
import "./sass/index.scss";

const projectsMenu = new ProjectsMenu();

const addProjectForm = document.querySelector(".projects-menu__addForm");
addProjectForm.addEventListener("submit", (e) =>
  projectsMenu.addProject(e, addProjectForm.elements.newProject.value)
);

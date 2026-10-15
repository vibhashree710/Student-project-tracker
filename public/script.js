const form = document.querySelector('#project-form');
const nameInput = document.querySelector('#project-name');
const statusInput = document.querySelector('#project-status');
const projectList = document.querySelector('#project-list');

const projects = [];

form.addEventListener('submit', event => {
  event.preventDefault();

  const name = nameInput.value.trim();
  const status = statusInput.value.trim();

  if (!name || !status) return;

  const newProject = {
    id: Date.now().toString(),
    name: name,
    status: status
  };

  projects.push(newProject);

  nameInput.value = '';
  statusInput.value = '';

  renderProjects();
});

function renderProjects() {
  projectList.innerHTML = '';

  projects.forEach(project => {
    const li = document.createElement('li');
    li.textContent = `${project.name} - Status: ${project.status}`;
    projectList.appendChild(li);
  });
}
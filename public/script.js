const form = document.querySelector('#project-form');
const nameInput = document.querySelector('#project-name');
const statusInput = document.querySelector('#project-status');
const projectList = document.querySelector('#project-list');

const STORAGE_KEY = 'workshop-projects-v1';

// Load saved records or start with an empty array
let projects = loadProjects();
let editingId = null;

function loadProjects() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Failed to parse projects from localStorage:', error);
    return [];
  }
}

function saveProjects() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

form.addEventListener('submit', event => {
  event.preventDefault();

  const name = nameInput.value.trim();
  const status = statusInput.value.trim();

  if (!name || !status) return;

  if (editingId) {
    projects = projects.map(project => {
      if (project.id === editingId) {
        return { ...project, name: name, status: status };
      }
      return project;
    });
    editingId = null;
  } else {
    const newProject = {
      id: Date.now().toString(),
      name: name,
      status: status
    };
    projects.push(newProject);
  }

  saveProjects();
  nameInput.value = '';
  statusInput.value = '';
  renderProjects();
});

function renderProjects() {
  projectList.innerHTML = '';

  if (projects.length === 0) {
    const emptyLi = document.createElement('li');
    emptyLi.textContent = 'No projects found.';
    projectList.appendChild(emptyLi);
    return;
  }

  projects.forEach(project => {
    const li = document.createElement('li');
    li.textContent = `${project.name} - Status: ${project.status} `;

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.type = 'button';
    editBtn.style.marginLeft = '10px';
    editBtn.addEventListener('click', () => {
      nameInput.value = project.name;
      statusInput.value = project.status;
      editingId = project.id;
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.type = 'button';
    deleteBtn.style.marginLeft = '5px';
    deleteBtn.addEventListener('click', () => {
      const confirmDelete = confirm(`Are you sure you want to delete "${project.name}"?`);
      if (confirmDelete) {
        if (editingId === project.id) {
          editingId = null;
          nameInput.value = '';
          statusInput.value = '';
        }
        projects = projects.filter(p => p.id !== project.id);
        saveProjects();
        renderProjects();
      }
    });

    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    projectList.appendChild(li);
  });
}

renderProjects();
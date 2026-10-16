const projectForm = document.getElementById('project-form');
const projectList = document.getElementById('project-list');

let editingId = null;

function getInputs() {
    const inputs = projectForm.querySelectorAll('input');
    return {
        nameInput: inputs[0],
        statusInput: inputs[1]
    };
}

async function loadProjects() {
    try {
        const response = await fetch('/api/projects');
        const projects = await response.json();
        renderProjects(projects);
    } catch (error) {
        console.error('Failed to load projects:', error);
    }
}

function renderProjects(projects) {
    projectList.innerHTML = '';
    projects.forEach(project => {
        const li = document.createElement('li');
        li.textContent = `${project.name} - Status: ${project.status} `;

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.addEventListener('click', () => {
            editingId = project.id;
            const { nameInput, statusInput } = getInputs();
            if (nameInput) nameInput.value = project.name;
            if (statusInput) statusInput.value = project.status;
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', async () => {
            const confirmed = confirm(`Are you sure you want to delete "${project.name}"?`);
            if (confirmed) {
                try {
                    const response = await fetch(`/api/projects/${project.id}`, {
                        method: 'DELETE'
                    });
                    if (response.ok) {
                        if (editingId === project.id) {
                            editingId = null;
                            const { nameInput, statusInput } = getInputs();
                            if (nameInput) nameInput.value = '';
                            if (statusInput) statusInput.value = '';
                        }
                        loadProjects();
                    }
                } catch (error) {
                    console.error('Failed to delete project:', error);
                }
            }
        });

        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        projectList.appendChild(li);
    });
}

projectForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const { nameInput, statusInput } = getInputs();
    const name = nameInput ? nameInput.value.trim() : '';
    const status = statusInput ? statusInput.value.trim() : '';
    if (!name || !status) return;

    try {
        if (editingId) {
            await fetch(`/api/projects/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, status })
            });
            editingId = null;
        } else {
            await fetch('/api/projects', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, status })
            });
        }
        if (nameInput) nameInput.value = '';
        if (statusInput) statusInput.value = '';
        loadProjects();
    } catch (error) {
        console.error('Failed to save project:', error);
    }
});

loadProjects();
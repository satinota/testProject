const projectsContainer = document.querySelector('.projects');
const projectDetailsContainer = document.querySelector('.project-details');
const token = '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';

async function fetchProjects() {
    try {
        const response = await fetch('https://api.github.com/repositories', {
            headers: {
                Authorization: `token ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch projects');
        }
        const projects = await response.json();
        // Получаем только последние 5 проектов
        return projects.slice(0, 6);
    } catch (error) {
        console.error('Error fetching projects:', error);
        return [];
    }
}

function renderProjects(projects) {
    projects.forEach(function(project) {
        const projectIcon = document.createElement('div');
        projectIcon.classList.add('project-icon');
        projectIcon.classList.add('custom-project-icon'); 

        const img = document.createElement('img');
        img.src = project.owner.avatar_url;
        img.classList.add('custom-icon'); 
        projectIcon.appendChild(img);

        const projectName = document.createElement('span');
        projectName.textContent = project.name;
        projectName.classList.add('custom-project-name'); 
        projectIcon.appendChild(projectName);

        projectIcon.addEventListener('click', function() {
            fetchProjectDetails(project);
        });
        projectsContainer.appendChild(projectIcon);
    });
}

async function fetchProjectDetails(project) {
    try {
        const response = await fetch(`https://api.github.com/repos/${project.full_name}`, {
            headers: {
                Authorization: `token ${token}`
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch project details');
        }
        const projectDetails = await response.json();
        renderProjectDetails(projectDetails);
    } catch (error) {
        console.error('Error fetching project details:', error);
    }
}

function renderProjectDetails(projectDetails) {
    projectDetailsContainer.innerHTML = `
        <h2 class="custom-project-name">${projectDetails.name}</h2>
        <p class="custom-project-description">Описание проекта: ${projectDetails.description || 'N/A'}</p>
        <p class="custom-project-language">Язык программирования: ${projectDetails.language || 'N/A'}</p>
        <p class="custom-project-stars">Рейтинг: ${projectDetails.stargazers_count || 0}</p>
        <p class="custom-project-watchers">Количество наблюдателей: ${projectDetails.watchers_count || 0}</p>
    `;
}

async function initializeApp() {
    const projects = await fetchProjects();
    renderProjects(projects);
}

initializeApp();
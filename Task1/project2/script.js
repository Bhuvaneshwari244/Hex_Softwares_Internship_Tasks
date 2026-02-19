// DOM Elements
const taskInput = document.getElementById('taskInput');
const taskLabel = document.getElementById('taskLabel');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const filterBtns = document.querySelectorAll('.filter-btn');

// State Management
let tasks = [];
let currentFilter = 'all';

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    tasks = getTasksFromStorage();
    renderTasks();
});

// Event Listeners for Adding
addBtn.addEventListener('click', handleAddTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleAddTask();
});

// Event Listeners for Filters
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active class
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Update filter state and re-render
        currentFilter = btn.getAttribute('data-filter');
        renderTasks();
    });
});

// --- Core Functions ---

function handleAddTask() {
    const text = taskInput.value.trim();
    const label = taskLabel.value;

    if (!text) {
        alert('Please enter a task description!');
        return;
    }

    const newTask = {
        id: Date.now().toString(),
        text: text,
        label: label,
        completed: false
    };

    tasks.push(newTask);
    saveTasksToStorage();
    
    taskInput.value = ''; // Clear input
    
    // Switch to 'all' or 'pending' view to see the new task
    if (currentFilter === 'completed') {
        document.querySelector('[data-filter="all"]').click();
    } else {
        renderTasks(); 
    }
}

function renderTasks() {
    // Clear current list
    taskList.innerHTML = '';

    // Filter tasks based on current selection
    let filteredTasks = tasks;
    if (currentFilter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }

    // Render empty state if no tasks
    if (filteredTasks.length === 0) {
        taskList.innerHTML = `<p style="text-align: center; color: #95a5a6; padding: 20px;">No tasks found in this section.</p>`;
        return;
    }

    // Build DOM for each task
    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.dataset.id = task.id;

        li.innerHTML = `
            <div class="checkbox-container">
                <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleStatus('${task.id}')">
            </div>
            <div class="task-content">
                <span class="task-text">${task.text}</span>
                <span class="task-label-badge label-${task.label}">${task.label}</span>
            </div>
            <div class="actions">
                <button class="action-btn edit-btn" onclick="startEdit('${task.id}')" title="Edit">✏️</button>
                <button class="action-btn delete-btn" onclick="deleteTask('${task.id}')" title="Delete">🗑️</button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

// --- Action Functions (Accessible via Global Scope for onclick) ---

window.toggleStatus = function(taskId) {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex > -1) {
        tasks[taskIndex].completed = !tasks[taskIndex].completed;
        saveTasksToStorage();
        renderTasks(); // Re-render to apply filters/styles
    }
}

window.deleteTask = function(taskId) {
    const li = document.querySelector(`li[data-id="${taskId}"]`);
    if (li) {
        li.classList.add('removing'); // Trigger animation
        li.addEventListener('animationend', () => {
            tasks = tasks.filter(t => t.id !== taskId);
            saveTasksToStorage();
            renderTasks();
        });
    }
}

window.startEdit = function(taskId) {
    const li = document.querySelector(`li[data-id="${taskId}"]`);
    const taskContentDiv = li.querySelector('.task-content');
    const currentTextSpan = li.querySelector('.task-text');
    const currentText = currentTextSpan.textContent;

    // Create input field
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.value = currentText;
    editInput.className = 'edit-input';

    // Replace text with input
    currentTextSpan.replaceWith(editInput);
    editInput.focus();

    // Handle Save
    const saveEdit = () => {
        const newText = editInput.value.trim();
        if (newText) {
            const taskIndex = tasks.findIndex(t => t.id === taskId);
            if (taskIndex > -1) {
                tasks[taskIndex].text = newText;
                saveTasksToStorage();
            }
        }
        renderTasks(); // Re-render to show updated text and badge
    };

    editInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') saveEdit();
    });
    editInput.addEventListener('blur', saveEdit);
}

// --- Local Storage ---

function getTasksFromStorage() {
    const stored = localStorage.getItem('advancedTasks');
    return stored ? JSON.parse(stored) : [];
}

function saveTasksToStorage() {
    localStorage.setItem('advancedTasks', JSON.stringify(tasks));
}
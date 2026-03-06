<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="com.example.todo.*" %>
<%@ page import="java.util.List" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern TODO List - Task Manager</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --primary: #667eea;
            --secondary: #764ba2;
            --accent: #f093fb;
            --dark: #1a202c;
            --light: #f7fafc;
            --white: #ffffff;
            --text: #2d3748;
            --border: #e2e8f0;
            --success: #48bb78;
            --danger: #f56565;
        }

        html {
            scroll-behavior: smooth;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: var(--text);
            line-height: 1.6;
            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
            min-height: 100vh;
            padding: 2rem;
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
        }

        /* Header */
        .header {
            text-align: center;
            color: var(--white);
            margin-bottom: 3rem;
            animation: slideDown 0.6s ease-out;
        }

        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .header h1 {
            font-size: 3rem;
            font-weight: 800;
            margin-bottom: 0.5rem;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        .header p {
            font-size: 1.1rem;
            opacity: 0.95;
        }

        /* Main Card */
        .todo-card {
            background: var(--white);
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            overflow: hidden;
            animation: slideUp 0.8s ease-out;
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Input Section */
        .input-section {
            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
            padding: 2.5rem;
            color: var(--white);
        }

        .input-group {
            display: flex;
            gap: 1rem;
            margin-bottom: 1.5rem;
        }

        .input-group input {
            flex: 1;
            padding: 1rem;
            border: none;
            border-radius: 12px;
            font-size: 1rem;
            font-family: inherit;
            transition: all 0.3s ease;
        }

        .input-group input:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
            transform: scale(1.02);
        }

        .input-group input::placeholder {
            color: rgba(255, 255, 255, 0.7);
        }

        .btn-add {
            background: var(--white);
            color: var(--primary);
            border: none;
            padding: 1rem 2rem;
            border-radius: 12px;
            font-weight: 700;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            white-space: nowrap;
        }

        .btn-add:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }

        .btn-add:active {
            transform: translateY(-1px);
        }

        .stats {
            display: flex;
            gap: 1rem;
            margin-top: 1rem;
            font-size: 0.9rem;
            opacity: 0.9;
        }

        .stat {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .stat i {
            font-size: 1.1rem;
        }

        /* Tasks Section */
        .tasks-section {
            padding: 2rem;
            min-height: 300px;
        }

        .tasks-list {
            display: flex;
            flex-direction: column;
            gap: 0.8rem;
        }

        .task-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1.2rem;
            background: var(--light);
            border-radius: 12px;
            border-left: 4px solid var(--primary);
            transition: all 0.3s ease;
            animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateX(-20px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        .task-item:hover {
            background: var(--white);
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
            transform: translateX(5px);
            border-left-color: var(--accent);
        }

        .task-item.completed {
            border-left-color: var(--success);
            opacity: 0.7;
        }

        .task-item.completed .task-text {
            text-decoration: line-through;
            color: #a0aec0;
        }

        /* Checkbox */
        .task-checkbox {
            width: 24px;
            height: 24px;
            cursor: pointer;
            appearance: none;
            background: var(--white);
            border: 2px solid var(--primary);
            border-radius: 6px;
            transition: all 0.3s ease;
            flex-shrink: 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .task-checkbox:hover {
            border-color: var(--accent);
            background: rgba(240, 147, 251, 0.1);
        }

        .task-checkbox:checked {
            background: linear-gradient(135deg, var(--success) 0%, var(--primary) 100%);
            border-color: var(--success);
        }

        .task-checkbox:checked::after {
            content: '✓';
            color: var(--white);
            font-weight: bold;
            font-size: 0.85rem;
        }

        /* Task Content */
        .task-content {
            flex: 1;
            display: flex;
            align-items: center;
            gap: 1rem;
        }

        .task-text {
            font-size: 1rem;
            font-weight: 500;
            color: var(--text);
            transition: all 0.3s ease;
            word-break: break-word;
            max-width: 500px;
        }

        .task-text-input {
            width: 100%;
            padding: 0.5rem;
            border: 2px solid var(--primary);
            border-radius: 8px;
            font-size: 1rem;
            font-family: inherit;
            font-weight: 500;
            color: var(--text);
            transition: all 0.3s ease;
        }

        .task-text-input:focus {
            outline: none;
            border-color: var(--accent);
            box-shadow: 0 0 0 3px rgba(240, 147, 251, 0.2);
        }

        /* Task Actions */
        .task-actions {
            display: flex;
            gap: 0.5rem;
            flex-shrink: 0;
        }

        .task-btn {
            width: 36px;
            height: 36px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.9rem;
            background: transparent;
        }

        .task-btn:hover {
            transform: scale(1.1);
        }

        .btn-edit {
            color: var(--primary);
            background: rgba(102, 126, 234, 0.1);
        }

        .btn-edit:hover {
            background: rgba(102, 126, 234, 0.2);
        }

        .btn-delete {
            color: var(--danger);
            background: rgba(245, 101, 101, 0.1);
        }

        .btn-delete:hover {
            background: rgba(245, 101, 101, 0.2);
        }

        .btn-save {
            color: var(--success);
            background: rgba(72, 187, 120, 0.1);
        }

        .btn-save:hover {
            background: rgba(72, 187, 120, 0.2);
        }

        .btn-cancel {
            color: var(--text);
            background: rgba(45, 55, 72, 0.1);
        }

        .btn-cancel:hover {
            background: rgba(45, 55, 72, 0.2);
        }

        /* Empty State */
        .empty-state {
            text-align: center;
            padding: 3rem 2rem;
            color: #a0aec0;
        }

        .empty-state i {
            font-size: 3rem;
            color: var(--primary);
            opacity: 0.3;
            margin-bottom: 1rem;
        }

        .empty-state p {
            font-size: 1.1rem;
        }

        /* Filter Section */
        .filter-section {
            display: flex;
            gap: 0.5rem;
            margin-bottom: 1.5rem;
            justify-content: center;
        }

        .filter-btn {
            padding: 0.5rem 1rem;
            border: 2px solid var(--border);
            background: var(--white);
            border-radius: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 600;
            font-size: 0.9rem;
        }

        .filter-btn:hover,
        .filter-btn.active {
            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
            color: var(--white);
            border-color: transparent;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
            body {
                padding: 1rem;
            }

            .header h1 {
                font-size: 2rem;
            }

            .input-group {
                flex-direction: column;
            }

            .input-group input,
            .btn-add {
                width: 100%;
            }

            .task-item {
                flex-wrap: wrap;
            }

            .task-text {
                max-width: 100%;
                flex: 1;
            }

            .task-actions {
                width: 100%;
                gap: 0.5rem;
            }

            .stats {
                flex-wrap: wrap;
            }
        }

        /* Loading State */
        .loading {
            text-align: center;
            padding: 2rem;
            color: var(--primary);
        }

        .loading i {
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1><i class="fas fa-tasks"></i> TODO Manager</h1>
            <p>Stay organized and manage your tasks efficiently</p>
        </div>

        <!-- Main Card -->
        <div class="todo-card">
            <!-- Input Section -->
            <div class="input-section">
                <div class="input-group">
                    <input type="text" id="taskInput" placeholder="Add a new task..." autocomplete="off">
                    <button class="btn-add" onclick="addTask()">
                        <i class="fas fa-plus"></i> Add Task
                    </button>
                </div>
                <div class="stats">
                    <div class="stat">
                        <i class="fas fa-list-check"></i>
                        <span id="totalTasks">0</span> Total
                    </div>
                    <div class="stat">
                        <i class="fas fa-check-circle"></i>
                        <span id="completedTasks">0</span> Completed
                    </div>
                    <div class="stat">
                        <i class="fas fa-circle"></i>
                        <span id="pendingTasks">0</span> Pending
                    </div>
                </div>
            </div>

            <!-- Filter Section -->
            <div style="padding: 1.5rem; border-bottom: 1px solid var(--border);">
                <div class="filter-section">
                    <button class="filter-btn active" onclick="filterTasks('all')">All</button>
                    <button class="filter-btn" onclick="filterTasks('active')">Active</button>
                    <button class="filter-btn" onclick="filterTasks('completed')">Completed</button>
                </div>
            </div>

            <!-- Tasks Section -->
            <div class="tasks-section">
                <div id="tasksList" class="tasks-list">
                    <div class="loading">
                        <i class="fas fa-spinner"></i> Loading tasks...
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div id="emptyState" class="empty-state" style="display: none;">
                <i class="fas fa-inbox"></i>
                <p>No tasks yet. Create one to get started!</p>
            </div>
        </div>
    </div>

    <script>
        let allTasks = [];
        let currentFilter = 'all';
        let editingId = null;

        // Load tasks on page load
        document.addEventListener('DOMContentLoaded', function() {
            loadTasks();
            document.getElementById('taskInput').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    addTask();
                }
            });
        });

        // Load all tasks from backend
        function loadTasks() {
            fetch('/api/tasks?action=list')
                .then(response => response.json())
                .then(tasks => {
                    allTasks = tasks || [];
                    updateStats();
                    renderTasks();
                })
                .catch(error => {
                    console.error('Error loading tasks:', error);
                    document.getElementById('tasksList').innerHTML = 
                        '<div class="empty-state"><i class="fas fa-exclamation-circle"></i><p>Error loading tasks. Please try again.</p></div>';
                });
        }

        // Add new task
        function addTask() {
            const input = document.getElementById('taskInput');
            const title = input.value.trim();

            if (title === '') {
                alert('Please enter a task title');
                return;
            }

            const formData = new URLSearchParams();
            formData.append('action', 'add');
            formData.append('title', title);

            fetch('/api/tasks', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(task => {
                    allTasks.unshift(task);
                    input.value = '';
                    updateStats();
                    renderTasks();
                })
                .catch(error => {
                    console.error('Error adding task:', error);
                    alert('Error adding task. Please try again.');
                });
        }

        // Toggle task completion status
        function toggleTask(id) {
            const formData = new URLSearchParams();
            formData.append('action', 'toggle');
            formData.append('id', id);

            fetch('/api/tasks', {
                method: 'PUT',
                body: formData
            })
                .then(response => response.json())
                .then(updatedTask => {
                    const index = allTasks.findIndex(t => t.id === id);
                    if (index > -1) {
                        allTasks[index] = updatedTask;
                    }
                    updateStats();
                    renderTasks();
                })
                .catch(error => {
                    console.error('Error toggling task:', error);
                    alert('Error updating task. Please try again.');
                });
        }

        // Delete task
        function deleteTask(id) {
            if (!confirm('Are you sure you want to delete this task?')) {
                return;
            }

            fetch('/api/tasks?id=' + id, {
                method: 'DELETE'
            })
                .then(response => response.json())
                .then(() => {
                    allTasks = allTasks.filter(t => t.id !== id);
                    updateStats();
                    renderTasks();
                })
                .catch(error => {
                    console.error('Error deleting task:', error);
                    alert('Error deleting task. Please try again.');
                });
        }

        // Start editing task
        function startEdit(id) {
            editingId = id;
            renderTasks();
        }

        // Save edited task
        function saveEdit(id) {
            const input = document.querySelector(`#edit-input-${id}`);
            const title = input.value.trim();

            if (title === '') {
                alert('Title cannot be empty');
                return;
            }

            const task = allTasks.find(t => t.id === id);
            const formData = new URLSearchParams();
            formData.append('action', 'update');
            formData.append('id', id);
            formData.append('title', title);
            formData.append('completed', task.completed);

            fetch('/api/tasks', {
                method: 'PUT',
                body: formData
            })
                .then(response => response.json())
                .then(updatedTask => {
                    const index = allTasks.findIndex(t => t.id === id);
                    if (index > -1) {
                        allTasks[index] = updatedTask;
                    }
                    editingId = null;
                    renderTasks();
                })
                .catch(error => {
                    console.error('Error saving task:', error);
                    alert('Error saving task. Please try again.');
                });
        }

        // Cancel editing
        function cancelEdit() {
            editingId = null;
            renderTasks();
        }

        // Filter tasks
        function filterTasks(filter) {
            currentFilter = filter;
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');
            renderTasks();
        }

        // Update statistics
        function updateStats() {
            const total = allTasks.length;
            const completed = allTasks.filter(t => t.completed).length;
            const pending = total - completed;

            document.getElementById('totalTasks').textContent = total;
            document.getElementById('completedTasks').textContent = completed;
            document.getElementById('pendingTasks').textContent = pending;
        }

        // Render tasks list
        function renderTasks() {
            const tasksList = document.getElementById('tasksList');
            const emptyState = document.getElementById('emptyState');

            let filteredTasks = allTasks;
            if (currentFilter === 'active') {
                filteredTasks = allTasks.filter(t => !t.completed);
            } else if (currentFilter === 'completed') {
                filteredTasks = allTasks.filter(t => t.completed);
            }

            if (filteredTasks.length === 0) {
                tasksList.style.display = 'none';
                emptyState.style.display = 'block';
                return;
            }

            tasksList.style.display = 'flex';
            emptyState.style.display = 'none';

            tasksList.innerHTML = filteredTasks.map(task => `
                <div class="task-item ${task.completed ? 'completed' : ''}">
                    <input type="checkbox" class="task-checkbox" 
                        ${task.completed ? 'checked' : ''} 
                        onchange="toggleTask(${task.id})">
                    
                    <div class="task-content">
                        ${editingId === task.id ? 
                            `<input type="text" id="edit-input-${task.id}" class="task-text-input" value="${escapeHtml(task.title)}" autofocus>` :
                            `<span class="task-text">${escapeHtml(task.title)}</span>`
                        }
                    </div>
                    
                    <div class="task-actions">
                        ${editingId === task.id ? 
                            `<button class="task-btn btn-save" onclick="saveEdit(${task.id})" title="Save">
                                <i class="fas fa-check"></i>
                            </button>
                            <button class="task-btn btn-cancel" onclick="cancelEdit()" title="Cancel">
                                <i class="fas fa-times"></i>
                            </button>` :
                            `<button class="task-btn btn-edit" onclick="startEdit(${task.id})" title="Edit">
                                <i class="fas fa-pen"></i>
                            </button>
                            <button class="task-btn btn-delete" onclick="deleteTask(${task.id})" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>`
                        }
                    </div>
                </div>
            `).join('');
        }

        // Helper function to escape HTML
        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
    </script>
</body>
</html>

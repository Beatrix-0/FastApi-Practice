const API_BASE = "/api";
let currentUser = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadPage('problems');
});

async function checkAuth() {
    const token = localStorage.getItem('token');
    if (token) {
        // For simplicity, we assume token is valid or will fail on API calls
        updateAuthUI(true);
    } else {
        updateAuthUI(false);
    }
}

function updateAuthUI(isLoggedIn) {
    const authSection = document.getElementById('auth-section');
    if (isLoggedIn) {
        authSection.innerHTML = `
            <button class="btn btn-secondary" onclick="logout()" style="width: 100%; background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2);">
                Logout
            </button>
        `;
    } else {
        authSection.innerHTML = `
            <button class="btn btn-primary" onclick="showLogin()" style="width: 100%;">Login / Signup</button>
        `;
    }
}

async function loadPage(page) {
    const content = document.getElementById('content');
    const title = document.getElementById('page-title');
    content.innerHTML = '<div class="loader">Loading...</div>';

    if (page === 'problems') {
        title.innerText = "Available Problems";
        const problems = await fetchAPI('/problems/');
        renderProblems(problems);
    } else if (page === 'submissions') {
        title.innerText = "My Submissions";
        const submissions = await fetchAPI('/submissions/');
        renderSubmissions(submissions);
    } else if (page === 'home') {
        title.innerText = "Dashboard";
        content.innerHTML = `
            <div class="card" style="max-width: 600px;">
                <h2>Welcome to Toph Clone</h2>
                <p style="color: var(--text-muted); margin-top: 1rem;">
                    Practice your coding skills, participate in contests, and improve your ranking.
                </p>
                <div style="margin-top: 2rem;">
                    <button class="btn btn-primary" onclick="loadPage('problems')">Start Solving</button>
                </div>
            </div>
        `;
    }
}

function renderProblems(problems) {
    const content = document.getElementById('content');
    let html = '<div class="problem-grid">';
    problems.forEach(p => {
        html += `
            <div class="card" onclick="viewProblem(${p.id})">
                <span class="difficulty-tag ${p.difficulty.toLowerCase()}">${p.difficulty}</span>
                <h3 style="margin-top: 1rem;">${p.title}</h3>
                <p style="color: var(--text-muted); font-size: 0.9rem; margin-top: 0.5rem;">
                    Limit: ${p.time_limit}s | ${p.memory_limit}MB
                </p>
            </div>
        `;
    });
    html += '</div>';
    content.innerHTML = html;
}

async function viewProblem(id) {
    const problem = await fetchAPI(`/problems/${id}`);
    const title = document.getElementById('page-title');
    const content = document.getElementById('content');
    
    title.innerText = problem.title;
    content.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 400px; gap: 2rem;">
            <div class="card">
                <div class="problem-description">
                    ${problem.description.replace(/\n/g, '<br>')}
                </div>
            </div>
            <div class="card">
                <h3>Submit Solution</h3>
                <div class="form-group" style="margin-top: 1.5rem;">
                    <label>Language</label>
                    <select id="language">
                        <option value="python">Python 3</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Code</label>
                    <textarea id="code-editor" style="height: 300px; font-family: monospace;"></textarea>
                </div>
                <button class="btn btn-primary" style="width: 100%;" onclick="submitCode(${id})">Submit</button>
            </div>
        </div>
    `;
}

async function submitCode(problemId) {
    const code = document.getElementById('code-editor').value;
    const language = document.getElementById('language').value;
    
    if (!code) return alert("Please enter some code");

    try {
        const res = await fetchAPI('/submissions/', {
            method: 'POST',
            body: JSON.stringify({ problem_id: problemId, code, language })
        });
        alert("Submitted! Status: " + res.status);
        loadPage('submissions');
    } catch (e) {
        alert("Error: " + e.message);
    }
}

function renderSubmissions(submissions) {
    const content = document.getElementById('content');
    let html = `
        <table style="width: 100%; border-collapse: collapse; background: var(--bg-card); border-radius: 1rem; overflow: hidden;">
            <thead>
                <tr style="text-align: left; background: rgba(255,255,255,0.05);">
                    <th style="padding: 1rem;">ID</th>
                    <th style="padding: 1rem;">Language</th>
                    <th style="padding: 1rem;">Status</th>
                    <th style="padding: 1rem;">Time</th>
                    <th style="padding: 1rem;">Created</th>
                </tr>
            </thead>
            <tbody>
    `;
    submissions.reverse().forEach(s => {
        const statusClass = s.status === 'Accepted' ? 'color: var(--success)' : (s.status === 'Pending' ? 'color: var(--warning)' : 'color: var(--error)');
        html += `
            <tr style="border-top: 1px solid rgba(255,255,255,0.05);">
                <td style="padding: 1rem;">#${s.id}</td>
                <td style="padding: 1rem;">${s.language}</td>
                <td style="padding: 1rem; font-weight: bold; ${statusClass}">${s.status}</td>
                <td style="padding: 1rem;">${s.execution_time ? s.execution_time.toFixed(3) + 's' : '-'}</td>
                <td style="padding: 1rem;">${new Date(s.created_at).toLocaleString()}</td>
            </tr>
        `;
    });
    html += '</tbody></table>';
    content.innerHTML = html;
}

// Auth Helper
function showLogin() {
    const content = document.getElementById('content');
    document.getElementById('page-title').innerText = "Login / Signup";
    content.innerHTML = `
        <div class="card" style="max-width: 400px; margin: 0 auto;">
            <div class="form-group">
                <label>Username</label>
                <input type="text" id="username">
            </div>
             <div class="form-group">
                <label>Email (for Signup)</label>
                <input type="email" id="email">
            </div>
            <div class="form-group">
                <label>Password</label>
                <input type="password" id="password">
            </div>
            <div style="display: flex; gap: 1rem;">
                <button class="btn btn-primary" style="flex: 1;" onclick="handleLogin()">Login</button>
                <button class="btn" style="flex: 1; background: rgba(255,255,255,0.05);" onclick="handleSignup()">Signup</button>
            </div>
        </div>
    `;
}

async function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        if (data.access_token) {
            localStorage.setItem('token', data.access_token);
            location.reload();
        } else {
            alert(data.detail);
        }
    } catch (e) {
        alert("Login failed");
    }
}

async function handleSignup() {
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetchAPI('/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ username, email, password })
        });
        alert("Signup successful! Please login.");
    } catch (e) {
        alert(e.message);
    }
}

function logout() {
    localStorage.removeItem('token');
    location.reload();
}

// Generic API fetcher
async function fetchAPI(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers
    });
    
    if (response.status === 401) {
        logout();
        throw new Error("Unauthorized");
    }
    
    const data = await response.json();
    if (!response.ok) throw new Error(data.detail || "API Error");
    return data;
}

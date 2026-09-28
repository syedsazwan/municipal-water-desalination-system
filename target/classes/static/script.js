// Municipal Water Facility Management System - Frontend Logic

document.addEventListener('DOMContentLoaded', () => {
    initLogin();
    initNavigation();
    initDashboard();
    initWaterIntake();
    initDesalination();
    initMineralExtraction();
    initWaterDistribution();
    initReports();
});

/* ==========================================================
   0. LOGIN SYSTEM (Frontend Presentation - Non-Empty Validation)
   ========================================================== */
function initLogin() {
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('login-username');
    const passwordInput = document.getElementById('login-password');
    const errorMsg = document.getElementById('login-error-msg');
    const togglePassBtn = document.getElementById('toggle-password-btn');
    const eyeIcon = document.getElementById('eye-icon');
    const logoutBtn = document.getElementById('sidebar-logout-btn') || document.getElementById('header-logout-btn');

    // Helper to hide error message
    const hideError = () => {
        if (errorMsg) {
            errorMsg.style.display = 'none';
            errorMsg.textContent = '';
        }
    };

    // Helper to clean/reset the login form
    const resetLoginForm = () => {
        if (loginForm) loginForm.reset();
        if (usernameInput) usernameInput.value = '';
        if (passwordInput) {
            passwordInput.value = '';
            passwordInput.setAttribute('type', 'password');
        }
        if (eyeIcon) {
            eyeIcon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
        }
        hideError();
    };

    // 1. Guarantee clean initial state on load / refresh
    resetLoginForm();

    // 2. Hide error message as soon as user types in either input field
    if (usernameInput) usernameInput.addEventListener('input', hideError);
    if (passwordInput) passwordInput.addEventListener('input', hideError);

    // 3. Show/hide password toggle
    if (togglePassBtn && passwordInput) {
        togglePassBtn.addEventListener('click', () => {
            const isPassword = passwordInput.getAttribute('type') === 'password';
            passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
            if (eyeIcon) {
                if (isPassword) {
                    eyeIcon.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>';
                } else {
                    eyeIcon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
                }
            }
        });
    }

    // Helper to show error message
    const showError = (msg) => {
        if (errorMsg) {
            errorMsg.textContent = msg;
            errorMsg.style.display = 'block';
        }
    };

    // 4. Login submission and validation (Accept ANY non-empty username & password)
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = (usernameInput ? usernameInput.value : '').trim();
            const password = (passwordInput ? passwordInput.value : '').trim();

            if (!username) {
                showError('Please enter username');
                if (usernameInput) usernameInput.focus();
                return;
            }

            if (!password) {
                showError('Please enter password');
                if (passwordInput) passwordInput.focus();
                return;
            }

            // Both credentials are non-empty: login successfully
            hideError();
            resetLoginForm();
            const loginScreen = document.getElementById('login-screen');
            if (loginScreen) {
                loginScreen.style.display = 'none';
            }
            // Open Dashboard and load data
            switchModule('dashboard', true);
        });
    }

    // 5. Logout action
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            const loginScreen = document.getElementById('login-screen');
            if (loginScreen) {
                loginScreen.style.display = 'flex';
            }
            // Clear credentials and hide errors
            resetLoginForm();
            // Reset active navigation to Dashboard for next successful login
            switchModule('dashboard', false);
        });
    }
}

/* ==========================================================
   NAVIGATION
   ========================================================== */
function switchModule(targetModule, shouldLoadData = true) {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.module-section');

    navButtons.forEach(btn => {
        if (btn.getAttribute('data-module') === targetModule) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    sections.forEach(sec => {
        if (sec.id === `module-${targetModule}`) {
            sec.classList.add('active');
        } else {
            sec.classList.remove('active');
        }
    });

    // Trigger data load on view
    if (shouldLoadData) {
        if (targetModule === 'dashboard') loadDashboardData();
        else if (targetModule === 'water-intake') loadWaterIntakeRecords();
        else if (targetModule === 'desalination') loadDesalinationRecords();
        else if (targetModule === 'mineral-extraction') loadMineralRecords();
        else if (targetModule === 'water-distribution') loadDistributionRecords();
        else if (targetModule === 'reports') loadReportsData();
    }
}

function initNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn[data-module]');
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetModule = button.getAttribute('data-module');
            if (targetModule) {
                switchModule(targetModule, true);
            }
        });
    });
}

/* ==========================================================
   MODULE 0: DASHBOARD
   ========================================================== */
function initDashboard() {
    const refreshBtn = document.getElementById('dashboard-refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            loadDashboardData();
        });
    }
}

async function loadDashboardData() {
    const activityTbody = document.querySelector('#dashboard-activity-table tbody');

    try {
        const [intakeRes, desalRes, mineralRes, distRes] = await Promise.all([
            fetch('/api/water-intake'),
            fetch('/api/desalination'),
            fetch('/api/minerals'),
            fetch('/api/distribution')
        ]);

        if (!intakeRes.ok || !desalRes.ok || !mineralRes.ok || !distRes.ok) {
            throw new Error('One or more facility APIs returned an error response.');
        }

        const [intakes, desals, minerals, dists] = await Promise.all([
            intakeRes.json(),
            desalRes.json(),
            mineralRes.json(),
            distRes.json()
        ]);

        // Summary Calculations (Sum using reduce)
        const totalIntake = intakes.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
        const totalProcessed = desals.reduce((sum, item) => sum + (Number(item.waterProcessed) || 0), 0);
        const totalFresh = desals.reduce((sum, item) => sum + (Number(item.freshWaterOutput) || 0), 0);
        const totalBrine = desals.reduce((sum, item) => sum + (Number(item.brineOutput) || 0), 0);
        const totalMinerals = minerals.reduce((sum, item) => sum + (Number(item.mineralQuantity) || 0), 0);
        const totalDistributed = dists.reduce((sum, item) => sum + (Number(item.waterQuantity) || 0), 0);

        const elIntake = document.getElementById('dash-water-intake');
        const elProcessed = document.getElementById('dash-water-processed');
        const elFresh = document.getElementById('dash-fresh-water');
        const elBrine = document.getElementById('dash-brine');
        const elMinerals = document.getElementById('dash-minerals');
        const elDistributed = document.getElementById('dash-distributed');

        if (elIntake) elIntake.textContent = totalIntake.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
        if (elProcessed) elProcessed.textContent = totalProcessed.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
        if (elFresh) elFresh.textContent = totalFresh.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
        if (elBrine) elBrine.textContent = totalBrine.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
        if (elMinerals) elMinerals.textContent = totalMinerals.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });
        if (elDistributed) elDistributed.textContent = totalDistributed.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });

        // Recent Activity (Combined from all 4 modules, latest first)
        const activities = [];

        intakes.forEach(r => {
            activities.push({
                module: 'Water Intake',
                code: r.intakeCode || '—',
                details: `${Number(r.quantity).toLocaleString()} m³ (${r.source || 'Raw Source'})`,
                date: r.intakeDate || '',
                status: r.status || 'Active',
                id: r.id
            });
        });

        desals.forEach(r => {
            activities.push({
                module: 'Desalination',
                code: r.processCode || '—',
                details: `${Number(r.waterProcessed).toLocaleString()} m³ in → ${Number(r.freshWaterOutput).toLocaleString()} m³ fresh`,
                date: r.processDate || '',
                status: r.status || 'Completed',
                id: r.id
            });
        });

        minerals.forEach(r => {
            activities.push({
                module: 'Mineral Extraction',
                code: r.extractionCode || '—',
                details: `${Number(r.mineralQuantity).toLocaleString()} kg ${r.mineralName} (${r.purity}%)`,
                date: r.extractionDate || '',
                status: r.status || 'Extracted',
                id: r.id
            });
        });

        dists.forEach(r => {
            activities.push({
                module: 'Water Distribution',
                code: r.distributionCode || '—',
                details: `${Number(r.waterQuantity).toLocaleString()} m³ → ${r.distributionZone}`,
                date: r.distributionDate || '',
                status: r.status || 'Delivered',
                id: r.id
            });
        });

        // Sort by date descending; if date same, sort by ID descending
        activities.sort((a, b) => {
            if (b.date !== a.date) {
                return (b.date || '').localeCompare(a.date || '');
            }
            return (b.id || 0) - (a.id || 0);
        });

        const recent = activities.slice(0, 8);

        if (activityTbody) {
            if (recent.length === 0) {
                activityTbody.innerHTML = '<tr><td colspan="5" class="text-center">No recent activity recorded across facility modules.</td></tr>';
            } else {
                activityTbody.innerHTML = recent.map(a => `
                    <tr>
                        <td><strong>${escapeHtml(a.module)}</strong></td>
                        <td>${escapeHtml(a.code)}</td>
                        <td>${escapeHtml(a.details)}</td>
                        <td>${escapeHtml(a.date)}</td>
                        <td>${escapeHtml(a.status)}</td>
                    </tr>
                `).join('');
            }
        }

    } catch (err) {
        console.error('Error loading dashboard data:', err);
        if (activityTbody) {
            activityTbody.innerHTML = '<tr><td colspan="5" class="text-center" style="color: #dc3545;">Error loading recent activity from facility services.</td></tr>';
        }
    }
}

/* ==========================================================
   MODULE 1: WATER INTAKE
   ========================================================== */
const INTAKE_API = '/api/water-intake';
let intakeMessageTimeout = null;

function showIntakeMessage(text, isError = false) {
    const msgEl = document.getElementById('intake-message');
    if (!msgEl) return;
    if (intakeMessageTimeout) clearTimeout(intakeMessageTimeout);

    msgEl.textContent = text;
    msgEl.className = isError ? 'message-box error' : 'message-box success';

    intakeMessageTimeout = setTimeout(() => {
        msgEl.className = 'message-box';
        msgEl.textContent = '';
    }, 5000);
}

function initWaterIntake() {
    const form = document.getElementById('water-intake-form');
    const resetBtn = document.getElementById('intake-reset-btn');
    const refreshBtn = document.getElementById('intake-refresh-btn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('intake-id').value;
        const intakeCode = document.getElementById('intake-code').value.trim();
        const source = document.getElementById('intake-source').value.trim();
        const quantity = parseFloat(document.getElementById('intake-quantity').value);
        const salinity = parseFloat(document.getElementById('intake-salinity').value);
        const intakeDate = document.getElementById('intake-date').value;
        const status = document.getElementById('intake-status').value;

        // Validation Rules
        if (!intakeCode) {
            showIntakeMessage('Validation Error: Intake Code must not be empty.', true);
            document.getElementById('intake-code').focus();
            return;
        }
        if (!source) {
            showIntakeMessage('Validation Error: Source must not be empty.', true);
            document.getElementById('intake-source').focus();
            return;
        }
        if (isNaN(quantity) || quantity <= 0) {
            showIntakeMessage('Validation Error: Quantity must be greater than 0.', true);
            document.getElementById('intake-quantity').focus();
            return;
        }
        if (isNaN(salinity) || salinity <= 0) {
            showIntakeMessage('Validation Error: Salinity must be greater than 0.', true);
            document.getElementById('intake-salinity').focus();
            return;
        }
        if (!intakeDate) {
            showIntakeMessage('Validation Error: Intake Date must be selected.', true);
            document.getElementById('intake-date').focus();
            return;
        }
        if (!status) {
            showIntakeMessage('Validation Error: Status must be selected.', true);
            document.getElementById('intake-status').focus();
            return;
        }

        const payload = {
            intakeCode: intakeCode,
            source: source,
            quantity: quantity,
            salinity: salinity,
            intakeDate: intakeDate,
            status: status
        };

        try {
            const isEditing = Boolean(id);
            const method = isEditing ? 'PUT' : 'POST';
            const url = isEditing ? `${INTAKE_API}/${id}` : INTAKE_API;

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(errText || 'Server returned an error.');
            }

            resetIntakeForm();
            await loadWaterIntakeRecords();
            showIntakeMessage(isEditing ? 'Water intake record updated successfully.' : 'Water intake record created successfully.');
        } catch (err) {
            showIntakeMessage('Error saving record: ' + err.message, true);
        }
    });

    resetBtn.addEventListener('click', () => {
        resetIntakeForm();
        const msgEl = document.getElementById('intake-message');
        if (msgEl) {
            msgEl.className = 'message-box';
            msgEl.textContent = '';
        }
    });

    refreshBtn.addEventListener('click', async () => {
        await loadWaterIntakeRecords();
        showIntakeMessage('Water intake records refreshed from MySQL.');
    });
}

function resetIntakeForm() {
    document.getElementById('intake-id').value = '';
    document.getElementById('water-intake-form').reset();
    const submitBtn = document.getElementById('intake-submit-btn');
    if (submitBtn) {
        submitBtn.textContent = 'Save Intake Record';
        submitBtn.classList.remove('btn-success');
        submitBtn.classList.add('btn-primary');
    }
    const titleEl = document.getElementById('intake-form-title');
    if (titleEl) {
        titleEl.textContent = 'Add New Water Intake Record';
    }
}

async function loadWaterIntakeRecords() {
    const tbody = document.querySelector('#intake-table tbody');
    try {
        const res = await fetch(INTAKE_API);
        if (!res.ok) throw new Error('Failed to retrieve records from server.');
        const data = await res.json();

        if (!data || data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center">No water intake records found in MySQL. Use the form above to add a new record.</td></tr>';
            return;
        }

        tbody.innerHTML = data.map(item => `
            <tr>
                <td>${item.id}</td>
                <td>${escapeHtml(item.intakeCode)}</td>
                <td>${escapeHtml(item.source)}</td>
                <td>${Number(item.quantity).toLocaleString()}</td>
                <td>${Number(item.salinity).toLocaleString()}</td>
                <td>${item.intakeDate}</td>
                <td>${escapeHtml(item.status)}</td>
                <td class="action-buttons">
                    <button type="button" class="btn btn-sm btn-success" onclick="editIntake(${item.id})">Edit</button>
                    <button type="button" class="btn btn-sm btn-danger" onclick="deleteIntake(${item.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center">Unable to load records. Ensure backend server and MySQL database are running.</td></tr>';
    }
}

window.editIntake = async function(id) {
    try {
        const res = await fetch(`${INTAKE_API}/${id}`);
        if (!res.ok) throw new Error('Unable to retrieve record from database.');
        const item = await res.json();

        document.getElementById('intake-id').value = item.id;
        document.getElementById('intake-code').value = item.intakeCode;
        document.getElementById('intake-source').value = item.source;
        document.getElementById('intake-quantity').value = item.quantity;
        document.getElementById('intake-salinity').value = item.salinity;
        document.getElementById('intake-date').value = item.intakeDate;
        document.getElementById('intake-status').value = item.status;

        const submitBtn = document.getElementById('intake-submit-btn');
        if (submitBtn) {
            submitBtn.textContent = 'Update Intake Record';
            submitBtn.classList.remove('btn-primary');
            submitBtn.classList.add('btn-success');
        }
        const titleEl = document.getElementById('intake-form-title');
        if (titleEl) {
            titleEl.textContent = `Edit Water Intake Record (ID: ${item.id})`;
        }

        // Scroll to form smoothly
        document.getElementById('water-intake-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
        showIntakeMessage(`Loaded record (ID: ${item.id}) for editing. Make your changes and click 'Update Intake Record'.`);
    } catch (err) {
        showIntakeMessage('Error loading record: ' + err.message, true);
    }
};

window.deleteIntake = async function(id) {
    const confirmed = confirm('Are you sure you want to delete this water intake record? This action cannot be undone.');
    if (!confirmed) return;

    try {
        const res = await fetch(`${INTAKE_API}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Server failed to delete the record.');

        // If the record being deleted was currently loaded in the edit form, reset the form
        if (document.getElementById('intake-id').value === String(id)) {
            resetIntakeForm();
        }

        await loadWaterIntakeRecords();
        showIntakeMessage(`Water intake record (ID: ${id}) deleted successfully.`);
    } catch (err) {
        showIntakeMessage('Error deleting record: ' + err.message, true);
    }
};

/* ==========================================================
   MODULE 2: DESALINATION PROCESS
   ========================================================== */
const DESAL_API = '/api/desalination';
let desalMessageTimeout = null;

function showDesalMessage(text, isError = false) {
    const msgEl = document.getElementById('desal-message');
    if (!msgEl) return;
    if (desalMessageTimeout) clearTimeout(desalMessageTimeout);

    msgEl.textContent = text;
    msgEl.className = isError ? 'message-box error' : 'message-box success';

    desalMessageTimeout = setTimeout(() => {
        msgEl.className = 'message-box';
        msgEl.textContent = '';
    }, 5000);
}

function initDesalination() {
    const form = document.getElementById('desalination-form');
    const resetBtn = document.getElementById('desal-reset-btn');
    const refreshBtn = document.getElementById('desal-refresh-btn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('desal-id').value;
        const processCode = document.getElementById('desal-code').value.trim();
        const waterProcessed = parseFloat(document.getElementById('desal-water-processed').value);
        const freshWaterOutput = parseFloat(document.getElementById('desal-fresh-output').value);
        const brineOutput = parseFloat(document.getElementById('desal-brine-output').value);
        const processDate = document.getElementById('desal-date').value;
        const status = document.getElementById('desal-status').value;

        // Validation Rules
        if (!processCode) {
            showDesalMessage('Validation Error: Process Code must not be empty.', true);
            document.getElementById('desal-code').focus();
            return;
        }
        if (isNaN(waterProcessed) || waterProcessed <= 0) {
            showDesalMessage('Validation Error: Water Processed must be greater than 0.', true);
            document.getElementById('desal-water-processed').focus();
            return;
        }
        if (isNaN(freshWaterOutput) || freshWaterOutput <= 0) {
            showDesalMessage('Validation Error: Fresh Water Output must be greater than 0.', true);
            document.getElementById('desal-fresh-output').focus();
            return;
        }
        if (isNaN(brineOutput) || brineOutput < 0) {
            showDesalMessage('Validation Error: Brine Output must be greater than or equal to 0.', true);
            document.getElementById('desal-brine-output').focus();
            return;
        }
        if (!processDate) {
            showDesalMessage('Validation Error: Process Date must be selected.', true);
            document.getElementById('desal-date').focus();
            return;
        }
        if (!status) {
            showDesalMessage('Validation Error: Status must be selected.', true);
            document.getElementById('desal-status').focus();
            return;
        }

        // Mass balance validation
        if ((freshWaterOutput + brineOutput) > waterProcessed) {
            showDesalMessage(`Validation Error: Combined outputs (${freshWaterOutput + brineOutput} m³) cannot exceed Water Processed (${waterProcessed} m³).`, true);
            document.getElementById('desal-fresh-output').focus();
            return;
        }

        const payload = {
            processCode: processCode,
            waterProcessed: waterProcessed,
            freshWaterOutput: freshWaterOutput,
            brineOutput: brineOutput,
            processDate: processDate,
            status: status
        };

        try {
            const isEditing = Boolean(id);
            const method = isEditing ? 'PUT' : 'POST';
            const url = isEditing ? `${DESAL_API}/${id}` : DESAL_API;

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(errText || 'Server returned an error.');
            }

            resetDesalForm();
            await loadDesalinationRecords();
            showDesalMessage(isEditing ? 'Desalination process batch updated successfully.' : 'Desalination process batch created successfully.');
        } catch (err) {
            showDesalMessage('Error saving batch: ' + err.message, true);
        }
    });

    resetBtn.addEventListener('click', () => {
        resetDesalForm();
        const msgEl = document.getElementById('desal-message');
        if (msgEl) {
            msgEl.className = 'message-box';
            msgEl.textContent = '';
        }
    });

    refreshBtn.addEventListener('click', async () => {
        await loadDesalinationRecords();
        showDesalMessage('Desalination batches refreshed from MySQL.');
    });
}

function resetDesalForm() {
    document.getElementById('desal-id').value = '';
    document.getElementById('desalination-form').reset();
    const submitBtn = document.getElementById('desal-submit-btn');
    if (submitBtn) {
        submitBtn.textContent = 'Save Process Record';
        submitBtn.classList.remove('btn-success');
        submitBtn.classList.add('btn-primary');
    }
    const titleEl = document.getElementById('desal-form-title');
    if (titleEl) {
        titleEl.textContent = 'Record Desalination Process Batch';
    }
}

async function loadDesalinationRecords() {
    const tbody = document.querySelector('#desalination-table tbody');
    try {
        const res = await fetch(DESAL_API);
        if (!res.ok) throw new Error('Failed to retrieve records from server.');
        const data = await res.json();

        if (!data || data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center">No desalination batches found in MySQL. Use the form above to add a new batch.</td></tr>';
            return;
        }

        tbody.innerHTML = data.map(item => `
            <tr>
                <td>${item.id}</td>
                <td>${escapeHtml(item.processCode)}</td>
                <td>${Number(item.waterProcessed).toLocaleString()}</td>
                <td>${Number(item.freshWaterOutput).toLocaleString()}</td>
                <td>${Number(item.brineOutput).toLocaleString()}</td>
                <td>${item.processDate}</td>
                <td>${escapeHtml(item.status)}</td>
                <td class="action-buttons">
                    <button type="button" class="btn btn-sm btn-success" onclick="editDesal(${item.id})">Edit</button>
                    <button type="button" class="btn btn-sm btn-danger" onclick="deleteDesal(${item.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center">Unable to load records. Ensure backend server and MySQL database are running.</td></tr>';
    }
}

window.editDesal = async function(id) {
    try {
        const res = await fetch(`${DESAL_API}/${id}`);
        if (!res.ok) throw new Error('Unable to retrieve record from database.');
        const item = await res.json();

        document.getElementById('desal-id').value = item.id;
        document.getElementById('desal-code').value = item.processCode;
        document.getElementById('desal-water-processed').value = item.waterProcessed;
        document.getElementById('desal-fresh-output').value = item.freshWaterOutput;
        document.getElementById('desal-brine-output').value = item.brineOutput;
        document.getElementById('desal-date').value = item.processDate;
        document.getElementById('desal-status').value = item.status;

        const submitBtn = document.getElementById('desal-submit-btn');
        if (submitBtn) {
            submitBtn.textContent = 'Update Process Record';
            submitBtn.classList.remove('btn-primary');
            submitBtn.classList.add('btn-success');
        }
        const titleEl = document.getElementById('desal-form-title');
        if (titleEl) {
            titleEl.textContent = `Edit Desalination Process Batch (ID: ${item.id})`;
        }

        // Scroll to form smoothly
        document.getElementById('desalination-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
        showDesalMessage(`Loaded batch (ID: ${item.id}) for editing. Make your changes and click 'Update Process Record'.`);
    } catch (err) {
        showDesalMessage('Error loading record: ' + err.message, true);
    }
};

window.deleteDesal = async function(id) {
    const confirmed = confirm('Are you sure you want to delete this desalination batch? This action cannot be undone.');
    if (!confirmed) return;

    try {
        const res = await fetch(`${DESAL_API}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Server failed to delete the record.');

        // If the record being deleted was currently loaded in the edit form, reset the form
        if (document.getElementById('desal-id').value === String(id)) {
            resetDesalForm();
        }

        await loadDesalinationRecords();
        showDesalMessage(`Desalination process batch (ID: ${id}) deleted successfully.`);
    } catch (err) {
        showDesalMessage('Error deleting record: ' + err.message, true);
    }
};

/* ==========================================================
   MODULE 3: MINERAL EXTRACTION
   ========================================================== */
const MINERAL_API = '/api/minerals';
let mineralMessageTimeout = null;

function showMineralMessage(text, isError = false) {
    const msgEl = document.getElementById('mineral-message');
    if (!msgEl) return;
    if (mineralMessageTimeout) clearTimeout(mineralMessageTimeout);

    msgEl.textContent = text;
    msgEl.className = isError ? 'message-box error' : 'message-box success';

    mineralMessageTimeout = setTimeout(() => {
        msgEl.className = 'message-box';
        msgEl.textContent = '';
    }, 5000);
}

function initMineralExtraction() {
    const form = document.getElementById('mineral-form');
    const resetBtn = document.getElementById('mineral-reset-btn');
    const refreshBtn = document.getElementById('mineral-refresh-btn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('mineral-id').value;
        const extractionCode = document.getElementById('mineral-code').value.trim();
        const mineralName = document.getElementById('mineral-name').value.trim();
        const mineralQuantity = parseFloat(document.getElementById('mineral-quantity').value);
        const purity = parseFloat(document.getElementById('mineral-purity').value);
        const extractionDate = document.getElementById('mineral-date').value;
        const utilization = document.getElementById('mineral-utilization').value.trim();
        const status = document.getElementById('mineral-status').value;

        // Validation Rules
        if (!extractionCode) {
            showMineralMessage('Validation Error: Extraction Code must not be empty.', true);
            document.getElementById('mineral-code').focus();
            return;
        }
        if (!mineralName) {
            showMineralMessage('Validation Error: Mineral Name must not be empty.', true);
            document.getElementById('mineral-name').focus();
            return;
        }
        if (isNaN(mineralQuantity) || mineralQuantity <= 0) {
            showMineralMessage('Validation Error: Mineral Quantity must be greater than 0.', true);
            document.getElementById('mineral-quantity').focus();
            return;
        }
        if (isNaN(purity) || purity <= 0 || purity > 100) {
            showMineralMessage('Validation Error: Purity must be greater than 0 and less than or equal to 100.', true);
            document.getElementById('mineral-purity').focus();
            return;
        }
        if (!extractionDate) {
            showMineralMessage('Validation Error: Extraction Date must be selected.', true);
            document.getElementById('mineral-date').focus();
            return;
        }
        if (!utilization) {
            showMineralMessage('Validation Error: Utilization must not be empty.', true);
            document.getElementById('mineral-utilization').focus();
            return;
        }
        if (!status) {
            showMineralMessage('Validation Error: Status must be selected.', true);
            document.getElementById('mineral-status').focus();
            return;
        }

        const payload = {
            extractionCode: extractionCode,
            mineralName: mineralName,
            mineralQuantity: mineralQuantity,
            purity: purity,
            extractionDate: extractionDate,
            utilization: utilization,
            status: status
        };

        try {
            const isEditing = Boolean(id);
            const method = isEditing ? 'PUT' : 'POST';
            const url = isEditing ? `${MINERAL_API}/${id}` : MINERAL_API;

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(errText || 'Server returned an error.');
            }

            resetMineralForm();
            await loadMineralRecords();
            showMineralMessage(isEditing ? 'Mineral extraction record updated successfully.' : 'Mineral extraction record created successfully.');
        } catch (err) {
            showMineralMessage('Error saving record: ' + err.message, true);
        }
    });

    resetBtn.addEventListener('click', () => {
        resetMineralForm();
        const msgEl = document.getElementById('mineral-message');
        if (msgEl) {
            msgEl.className = 'message-box';
            msgEl.textContent = '';
        }
    });

    refreshBtn.addEventListener('click', async () => {
        await loadMineralRecords();
        showMineralMessage('Mineral extraction records refreshed from MySQL.');
    });
}

function resetMineralForm() {
    document.getElementById('mineral-id').value = '';
    document.getElementById('mineral-form').reset();
    const submitBtn = document.getElementById('mineral-submit-btn');
    if (submitBtn) {
        submitBtn.textContent = 'Save Extraction Record';
        submitBtn.classList.remove('btn-success');
        submitBtn.classList.add('btn-primary');
    }
    const titleEl = document.getElementById('mineral-form-title');
    if (titleEl) {
        titleEl.textContent = 'Log Mineral Extraction';
    }
}

async function loadMineralRecords() {
    const tbody = document.querySelector('#mineral-table tbody');
    try {
        const res = await fetch(MINERAL_API);
        if (!res.ok) throw new Error('Failed to retrieve records from server.');
        const data = await res.json();

        if (!data || data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" class="text-center">No mineral extraction records found in MySQL. Use the form above to log an extraction.</td></tr>';
            return;
        }

        tbody.innerHTML = data.map(item => `
            <tr>
                <td>${item.id}</td>
                <td>${escapeHtml(item.extractionCode)}</td>
                <td>${escapeHtml(item.mineralName)}</td>
                <td>${Number(item.mineralQuantity).toLocaleString()}</td>
                <td>${item.purity}%</td>
                <td>${item.extractionDate}</td>
                <td>${escapeHtml(item.utilization)}</td>
                <td>${escapeHtml(item.status)}</td>
                <td class="action-buttons">
                    <button type="button" class="btn btn-sm btn-success" onclick="editMineral(${item.id})">Edit</button>
                    <button type="button" class="btn btn-sm btn-danger" onclick="deleteMineral(${item.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="9" class="text-center">Unable to load records. Ensure backend server and MySQL database are running.</td></tr>';
    }
}

window.editMineral = async function(id) {
    try {
        const res = await fetch(`${MINERAL_API}/${id}`);
        if (!res.ok) throw new Error('Unable to retrieve record from database.');
        const item = await res.json();

        document.getElementById('mineral-id').value = item.id;
        document.getElementById('mineral-code').value = item.extractionCode;
        document.getElementById('mineral-name').value = item.mineralName;
        document.getElementById('mineral-quantity').value = item.mineralQuantity;
        document.getElementById('mineral-purity').value = item.purity;
        document.getElementById('mineral-date').value = item.extractionDate;
        document.getElementById('mineral-utilization').value = item.utilization;
        document.getElementById('mineral-status').value = item.status;

        const submitBtn = document.getElementById('mineral-submit-btn');
        if (submitBtn) {
            submitBtn.textContent = 'Update Extraction Record';
            submitBtn.classList.remove('btn-primary');
            submitBtn.classList.add('btn-success');
        }
        const titleEl = document.getElementById('mineral-form-title');
        if (titleEl) {
            titleEl.textContent = `Edit Mineral Extraction Record (ID: ${item.id})`;
        }

        // Scroll to form smoothly
        document.getElementById('mineral-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
        showMineralMessage(`Loaded record (ID: ${item.id}) for editing. Make your changes and click 'Update Extraction Record'.`);
    } catch (err) {
        showMineralMessage('Error loading record: ' + err.message, true);
    }
};

window.deleteMineral = async function(id) {
    const confirmed = confirm('Are you sure you want to delete this mineral extraction record? This action cannot be undone.');
    if (!confirmed) return;

    try {
        const res = await fetch(`${MINERAL_API}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Server failed to delete the record.');

        // If the record being deleted was currently loaded in the edit form, reset the form
        if (document.getElementById('mineral-id').value === String(id)) {
            resetMineralForm();
        }

        await loadMineralRecords();
        showMineralMessage(`Mineral extraction record (ID: ${id}) deleted successfully.`);
    } catch (err) {
        showMineralMessage('Error deleting record: ' + err.message, true);
    }
};

/* ==========================================================
   MODULE 4: WATER DISTRIBUTION
   ========================================================== */
const DIST_API = '/api/distribution';
let distMessageTimeout = null;

function showDistMessage(text, isError = false) {
    const msgEl = document.getElementById('dist-message');
    if (!msgEl) return;
    if (distMessageTimeout) clearTimeout(distMessageTimeout);

    msgEl.textContent = text;
    msgEl.className = isError ? 'message-box error' : 'message-box success';

    distMessageTimeout = setTimeout(() => {
        msgEl.className = 'message-box';
        msgEl.textContent = '';
    }, 5000);
}

function initWaterDistribution() {
    const form = document.getElementById('distribution-form');
    const resetBtn = document.getElementById('dist-reset-btn');
    const refreshBtn = document.getElementById('dist-refresh-btn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('distribution-id').value;
        const distributionCode = document.getElementById('dist-code').value.trim();
        const waterQuantity = parseFloat(document.getElementById('dist-quantity').value);
        const distributionZone = document.getElementById('dist-zone').value.trim();
        const distributionDate = document.getElementById('dist-date').value;
        const status = document.getElementById('dist-status').value;

        // Validation Rules
        if (!distributionCode) {
            showDistMessage('Validation Error: Distribution Code must not be empty.', true);
            document.getElementById('dist-code').focus();
            return;
        }
        if (isNaN(waterQuantity) || waterQuantity <= 0) {
            showDistMessage('Validation Error: Water Quantity must be greater than 0.', true);
            document.getElementById('dist-quantity').focus();
            return;
        }
        if (!distributionZone) {
            showDistMessage('Validation Error: Distribution Zone must be selected.', true);
            document.getElementById('dist-zone').focus();
            return;
        }
        if (!distributionDate) {
            showDistMessage('Validation Error: Distribution Date must be selected.', true);
            document.getElementById('dist-date').focus();
            return;
        }
        if (!status) {
            showDistMessage('Validation Error: Status must be selected.', true);
            document.getElementById('dist-status').focus();
            return;
        }

        const payload = {
            distributionCode: distributionCode,
            waterQuantity: waterQuantity,
            distributionZone: distributionZone,
            distributionDate: distributionDate,
            status: status
        };

        try {
            const isEditing = Boolean(id);
            const method = isEditing ? 'PUT' : 'POST';
            const url = isEditing ? `${DIST_API}/${id}` : DIST_API;

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errText = await res.text();
                throw new Error(errText || 'Server returned an error.');
            }

            resetDistForm();
            await loadDistributionRecords();
            showDistMessage(isEditing ? 'Water distribution record updated successfully.' : 'Water distribution record created successfully.');
        } catch (err) {
            showDistMessage('Error saving record: ' + err.message, true);
        }
    });

    resetBtn.addEventListener('click', () => {
        resetDistForm();
        const msgEl = document.getElementById('dist-message');
        if (msgEl) {
            msgEl.className = 'message-box';
            msgEl.textContent = '';
        }
    });

    refreshBtn.addEventListener('click', async () => {
        await loadDistributionRecords();
        showDistMessage('Water distribution logs refreshed from MySQL.');
    });
}

function resetDistForm() {
    document.getElementById('distribution-id').value = '';
    document.getElementById('distribution-form').reset();
    const submitBtn = document.getElementById('dist-submit-btn');
    if (submitBtn) {
        submitBtn.textContent = 'Save Distribution Record';
        submitBtn.classList.remove('btn-success');
        submitBtn.classList.add('btn-primary');
    }
    const titleEl = document.getElementById('dist-form-title');
    if (titleEl) {
        titleEl.textContent = 'Dispatch Distribution Log';
    }
}

async function loadDistributionRecords() {
    const tbody = document.querySelector('#distribution-table tbody');
    try {
        const res = await fetch(DIST_API);
        if (!res.ok) throw new Error('Failed to retrieve records from server.');
        const data = await res.json();

        if (!data || data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center">No water distribution logs found in MySQL. Use the form above to add a distribution log.</td></tr>';
            return;
        }

        tbody.innerHTML = data.map(item => `
            <tr>
                <td>${item.id}</td>
                <td>${escapeHtml(item.distributionCode)}</td>
                <td>${Number(item.waterQuantity).toLocaleString()}</td>
                <td>${escapeHtml(item.distributionZone)}</td>
                <td>${item.distributionDate}</td>
                <td>${escapeHtml(item.status)}</td>
                <td class="action-buttons">
                    <button type="button" class="btn btn-sm btn-success" onclick="editDistribution(${item.id})">Edit</button>
                    <button type="button" class="btn btn-sm btn-danger" onclick="deleteDistribution(${item.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">Unable to load records. Ensure backend server and MySQL database are running.</td></tr>';
    }
}

window.editDistribution = async function(id) {
    try {
        const res = await fetch(`${DIST_API}/${id}`);
        if (!res.ok) throw new Error('Unable to retrieve record from database.');
        const item = await res.json();

        document.getElementById('distribution-id').value = item.id;
        document.getElementById('dist-code').value = item.distributionCode;
        document.getElementById('dist-quantity').value = item.waterQuantity;
        document.getElementById('dist-zone').value = item.distributionZone;
        document.getElementById('dist-date').value = item.distributionDate;
        document.getElementById('dist-status').value = item.status;

        const submitBtn = document.getElementById('dist-submit-btn');
        if (submitBtn) {
            submitBtn.textContent = 'Update Distribution Record';
            submitBtn.classList.remove('btn-primary');
            submitBtn.classList.add('btn-success');
        }
        const titleEl = document.getElementById('dist-form-title');
        if (titleEl) {
            titleEl.textContent = `Edit Distribution Record (ID: ${item.id})`;
        }

        // Scroll to form smoothly
        document.getElementById('distribution-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
        showDistMessage(`Loaded record (ID: ${item.id}) for editing. Make your changes and click 'Update Distribution Record'.`);
    } catch (err) {
        showDistMessage('Error loading record: ' + err.message, true);
    }
};

window.deleteDistribution = async function(id) {
    const confirmed = confirm('Are you sure you want to delete this distribution record? This action cannot be undone.');
    if (!confirmed) return;

    try {
        const res = await fetch(`${DIST_API}/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Server failed to delete the record.');

        // If the record being deleted was currently loaded in the edit form, reset the form
        if (document.getElementById('distribution-id').value === String(id)) {
            resetDistForm();
        }

        await loadDistributionRecords();
        showDistMessage(`Water distribution record (ID: ${id}) deleted successfully.`);
    } catch (err) {
        showDistMessage('Error deleting record: ' + err.message, true);
    }
};

/* ==========================================================
   MODULE 5: REPORTS & SUMMARY ANALYTICS
   ========================================================== */
function initReports() {
    const applyBtn = document.getElementById('report-apply-btn');
    const clearBtn = document.getElementById('report-clear-btn');
    const typeSelect = document.getElementById('report-type');

    if (applyBtn) {
        applyBtn.addEventListener('click', loadReportsData);
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            document.getElementById('report-from-date').value = '';
            document.getElementById('report-to-date').value = '';
            document.getElementById('report-type').value = 'All';
            loadReportsData();
        });
    }

    if (typeSelect) {
        typeSelect.addEventListener('change', loadReportsData);
    }
}

function isDateInRange(dateStr, fromDate, toDate) {
    if (!fromDate && !toDate) return true;
    if (!dateStr) return false;
    if (fromDate && dateStr < fromDate) return false;
    if (toDate && dateStr > toDate) return false;
    return true;
}

async function loadReportsData() {
    const fromDate = document.getElementById('report-from-date') ? document.getElementById('report-from-date').value : '';
    const toDate = document.getElementById('report-to-date') ? document.getElementById('report-to-date').value : '';
    const reportType = document.getElementById('report-type') ? document.getElementById('report-type').value : 'All';

    // Update filter status text
    const statusTextEl = document.getElementById('report-filter-status');
    if (statusTextEl) {
        let statusText = `Type: ${reportType}`;
        if (fromDate) statusText += ` | From: ${fromDate}`;
        if (toDate) statusText += ` | To: ${toDate}`;
        statusTextEl.textContent = statusText;
    }

    try {
        const [intakes, desals, minerals, dists] = await Promise.all([
            fetch(INTAKE_API).then(r => r.ok ? r.json() : []),
            fetch(DESAL_API).then(r => r.ok ? r.json() : []),
            fetch(MINERAL_API).then(r => r.ok ? r.json() : []),
            fetch(DIST_API).then(r => r.ok ? r.json() : [])
        ]);

        // Filter records by date
        const filteredIntakes = intakes.filter(r => isDateInRange(r.intakeDate, fromDate, toDate));
        const filteredDesals = desals.filter(r => isDateInRange(r.processDate, fromDate, toDate));
        const filteredMinerals = minerals.filter(r => isDateInRange(r.extractionDate, fromDate, toDate));
        const filteredDists = dists.filter(r => isDateInRange(r.distributionDate, fromDate, toDate));

        // 1. Calculate Summary Totals dynamically
        const totalWaterIntake = filteredIntakes.reduce((sum, r) => sum + (parseFloat(r.quantity) || 0), 0);
        const totalWaterProcessed = filteredDesals.reduce((sum, r) => sum + (parseFloat(r.waterProcessed) || 0), 0);
        const totalFreshWater = filteredDesals.reduce((sum, r) => sum + (parseFloat(r.freshWaterOutput) || 0), 0);
        const totalBrine = filteredDesals.reduce((sum, r) => sum + (parseFloat(r.brineOutput) || 0), 0);
        const totalMinerals = filteredMinerals.reduce((sum, r) => sum + (parseFloat(r.mineralQuantity) || 0), 0);
        const totalDistributed = filteredDists.reduce((sum, r) => sum + (parseFloat(r.waterQuantity) || 0), 0);

        // Update DOM elements for summary cards
        document.getElementById('summary-water-intake').textContent = Number(totalWaterIntake.toFixed(2)).toLocaleString();
        document.getElementById('summary-water-processed').textContent = Number(totalWaterProcessed.toFixed(2)).toLocaleString();
        document.getElementById('summary-fresh-water').textContent = Number(totalFreshWater.toFixed(2)).toLocaleString();
        document.getElementById('summary-brine').textContent = Number(totalBrine.toFixed(2)).toLocaleString();
        document.getElementById('summary-minerals').textContent = Number(totalMinerals.toFixed(2)).toLocaleString();
        document.getElementById('summary-distributed').textContent = Number(totalDistributed.toFixed(2)).toLocaleString();

        // 2. Control Visibility of Summary Cards based on Report Type
        const cardIntake = document.getElementById('summary-card-intake');
        const cardProcessed = document.getElementById('summary-card-processed');
        const cardFresh = document.getElementById('summary-card-fresh');
        const cardBrine = document.getElementById('summary-card-brine');
        const cardMinerals = document.getElementById('summary-card-minerals');
        const cardDistributed = document.getElementById('summary-card-distributed');

        const showAll = (reportType === 'All');
        if (cardIntake) cardIntake.style.display = (showAll || reportType === 'Water Intake') ? 'flex' : 'none';
        if (cardProcessed) cardProcessed.style.display = (showAll || reportType === 'Desalination') ? 'flex' : 'none';
        if (cardFresh) cardFresh.style.display = (showAll || reportType === 'Desalination') ? 'flex' : 'none';
        if (cardBrine) cardBrine.style.display = (showAll || reportType === 'Desalination') ? 'flex' : 'none';
        if (cardMinerals) cardMinerals.style.display = (showAll || reportType === 'Mineral Extraction') ? 'flex' : 'none';
        if (cardDistributed) cardDistributed.style.display = (showAll || reportType === 'Water Distribution') ? 'flex' : 'none';

        // 3. Control Visibility of Tables based on Report Type
        const tableCardIntake = document.getElementById('report-table-intake-card');
        const tableCardDesal = document.getElementById('report-table-desal-card');
        const tableCardMineral = document.getElementById('report-table-mineral-card');
        const tableCardDist = document.getElementById('report-table-dist-card');

        if (tableCardIntake) tableCardIntake.style.display = (showAll || reportType === 'Water Intake') ? 'block' : 'none';
        if (tableCardDesal) tableCardDesal.style.display = (showAll || reportType === 'Desalination') ? 'block' : 'none';
        if (tableCardMineral) tableCardMineral.style.display = (showAll || reportType === 'Mineral Extraction') ? 'block' : 'none';
        if (tableCardDist) tableCardDist.style.display = (showAll || reportType === 'Water Distribution') ? 'block' : 'none';

        // 4. Render Table Data (Read-Only)

        // A. Water Intake Table
        const intakeTbody = document.querySelector('#report-intake-table tbody');
        if (intakeTbody) {
            if (filteredIntakes.length === 0) {
                intakeTbody.innerHTML = '<tr><td colspan="6" class="text-center">No water intake records found for selected filter.</td></tr>';
            } else {
                intakeTbody.innerHTML = filteredIntakes.map(r => `
                    <tr>
                        <td>${escapeHtml(r.intakeCode)}</td>
                        <td>${escapeHtml(r.source)}</td>
                        <td>${Number(r.quantity).toLocaleString()}</td>
                        <td>${Number(r.salinity).toLocaleString()}</td>
                        <td>${r.intakeDate}</td>
                        <td>${escapeHtml(r.status)}</td>
                    </tr>
                `).join('');
            }
        }

        // B. Desalination Table
        const desalTbody = document.querySelector('#report-desal-table tbody');
        if (desalTbody) {
            if (filteredDesals.length === 0) {
                desalTbody.innerHTML = '<tr><td colspan="6" class="text-center">No desalination batches found for selected filter.</td></tr>';
            } else {
                desalTbody.innerHTML = filteredDesals.map(r => `
                    <tr>
                        <td>${escapeHtml(r.processCode)}</td>
                        <td>${Number(r.waterProcessed).toLocaleString()}</td>
                        <td>${Number(r.freshWaterOutput).toLocaleString()}</td>
                        <td>${Number(r.brineOutput).toLocaleString()}</td>
                        <td>${r.processDate}</td>
                        <td>${escapeHtml(r.status)}</td>
                    </tr>
                `).join('');
            }
        }

        // C. Mineral Extraction Table
        const mineralTbody = document.querySelector('#report-mineral-table tbody');
        if (mineralTbody) {
            if (filteredMinerals.length === 0) {
                mineralTbody.innerHTML = '<tr><td colspan="7" class="text-center">No mineral extraction records found for selected filter.</td></tr>';
            } else {
                mineralTbody.innerHTML = filteredMinerals.map(r => `
                    <tr>
                        <td>${escapeHtml(r.extractionCode)}</td>
                        <td>${escapeHtml(r.mineralName)}</td>
                        <td>${Number(r.mineralQuantity).toLocaleString()}</td>
                        <td>${r.purity}%</td>
                        <td>${r.extractionDate}</td>
                        <td>${escapeHtml(r.utilization)}</td>
                        <td>${escapeHtml(r.status)}</td>
                    </tr>
                `).join('');
            }
        }

        // D. Water Distribution Table
        const distTbody = document.querySelector('#report-dist-table tbody');
        if (distTbody) {
            if (filteredDists.length === 0) {
                distTbody.innerHTML = '<tr><td colspan="5" class="text-center">No water distribution logs found for selected filter.</td></tr>';
            } else {
                distTbody.innerHTML = filteredDists.map(r => `
                    <tr>
                        <td>${escapeHtml(r.distributionCode)}</td>
                        <td>${Number(r.waterQuantity).toLocaleString()}</td>
                        <td>${escapeHtml(r.distributionZone)}</td>
                        <td>${r.distributionDate}</td>
                        <td>${escapeHtml(r.status)}</td>
                    </tr>
                `).join('');
            }
        }

    } catch (err) {
        console.error('Error loading report data:', err);
    }
}

/* ==========================================================
   HELPER UTILITIES
   ========================================================== */
function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

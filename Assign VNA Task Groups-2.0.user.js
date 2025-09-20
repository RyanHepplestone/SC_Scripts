// ==UserScript==
// @name         Assign VNA Task Groups
// @namespace    https://github.com/RyanHepplestone/SC_Scripts
// @version      2.0
// @description  Assigns all task groups to a list of usernames via API using current session cookies
// @match        https://aagprod.sce.manh.com/*
// @match        https://uaafp.sce.manh.com/udc/dm/screen/dcorder/OriginalOrderVer2
// @grant        GM_addStyle
// @updateURL    https://raw.githubusercontent.com/RyanHepplestone/SC_Scripts/main/Assign%20VNA%20Task%20Groups-2.0.user.js
// @downloadURL  https://raw.githubusercontent.com/RyanHepplestone/SC_Scripts/main/Assign%20VNA%20Task%20Groups-2.0.user.js
// ==/UserScript==

(function() {
    'use strict';

    // List of task groups (copy from your Python script)
    const taskGroups = [
        "AAG Bulk Pick Task Group",
        "AAGUK Bulk Replenishment To Exotec",
        "AAGUK Bulk Priority Replenishment Task Group",
        "AAGUK Bulk Replenishment Task Group",
        "zAAGUK CD Exotec Standard Replenishment",
        "zAAGUK CD Mezz First Priority Replenishment",
        "zAAGUK CD Mezz First Standard Replenishment",
        "zAAGUK CD Mezz Second Priority Replenishment",
        "zAAGUK CD Mezz Second Standard Replenishment",
        "zAAGUK CD Bulk Pick Priority Replenishment",
        "zAAGUK CD Bulk Pick Standard Replenishment",
        "zAAGUK CD Exotec Priority Replenishment",
        "zAAGUK CE Exotec Standard Replenishment",
        "zAAGUK CE Mezz First Priority Replenishment",
        "zAAGUK CE Mezz First Standard Replenishment",
        "zAAGUK CE Mezz Second Priority Replenishment",
        "zAAGUK CE Mezz Second Standard Replenishment",
        "zAAGUK CE Bulk Pick Priority Replenishment",
        "zAAGUK CE Bulk Pick Standard Replenishment",
        "zAAGUK CE Exotec Priority Replenishment",
        "zAAGUK CF Exotec Standard Replenishment",
        "zAAGUK CF Mezz First Priority Replenishment",
        "zAAGUK CF Mezz First Standard Replenishment",
        "zAAGUK CF Mezz Second Priority Replenishment",
        "zAAGUK CF Mezz Second Standard Replenishment",
        "zAAGUK CF Bulk Pick Priority Replenishment",
        "zAAGUK CF Bulk Pick Standard Replenishment",
        "zAAGUK CF Exotec Priority Replenishment",
        "zAAGUK CG Exotec Standard Replenishment",
        "zAAGUK CG Mezz First Priority Replenishment",
        "zAAGUK CG Mezz First Standard Replenishment",
        "zAAGUK CG Mezz Second Priority Replenishment",
        "zAAGUK CG Mezz Second Standard Replenishment",
        "zAAGUK CG Bulk Pick Priority Replenishment",
        "zAAGUK CG Bulk Pick Standard Replenishment",
        "zAAGUK CG Exotec Priority Replenishment"
    ];

    // Add popup styles
    GM_addStyle(`
        #taskgroup-popup {
            position: fixed; top: 20%; left: 50%; transform: translate(-50%, 0);
            background: #fff; border: 2px solid #333; z-index: 99999; padding: 20px; border-radius: 8px;
            box-shadow: 0 2px 16px rgba(0,0,0,0.3); min-width: 350px;
        }
        #taskgroup-popup textarea { width: 100%; height: 120px; }
        #taskgroup-popup button { margin-top: 10px; }
    `);

    // Create popup
    function showPopup() {
        if (document.getElementById('taskgroup-popup')) return;
        const popup = document.createElement('div');
        popup.id = 'taskgroup-popup';
        popup.innerHTML = `
            <h3>Assign Task Groups to Users</h3>
            <label>Paste usernames (one per line):</label><br>
            <textarea id="usernames-input"></textarea><br>
            <button id="assign-btn" style="background:#28a745;color:#fff;border:none;border-radius:20px;padding:5px 10px;cursor:pointer;margin-right:10px;">Assign</button>
            <button id="close-btn" style="background:#CDCDCD;color:#fff;border:none;border-radius:20px;padding:5px 10px;cursor:pointer;margin-right:10px;">Close</button>
            <div id="taskgroup-status" style="margin-top:10px;color:#007700"></div>
        `;
        document.body.appendChild(popup);

        // Progress bar container
        if (!document.getElementById('taskgroup-progress-container')) {
            const progressContainer = document.createElement('div');
            progressContainer.id = 'taskgroup-progress-container';
            progressContainer.style = `
                position: fixed;
                top: 12px; left: 300px;
                z-index: 100000;
                padding: 0; border-radius: 0; box-shadow: none;
                display: none; min-width: 180px; max-width: 220px; text-align: center; background: none; border: none;
            `;
            progressContainer.innerHTML = `
                <div id="taskgroup-progress-bar-bg" style="width:100%;height:16px;background:#eee;border-radius:8px;overflow:hidden;position:relative;">
                    <div id="taskgroup-progress-bar" style="height:100%;width:0%;background:#28a745;transition:width 0.2s;display:flex;align-items:center;justify-content:center;position:absolute;top:0;left:0;white-space:nowrap;font-weight:bold;color:#fff;font-size:12px;"></div>
                    <span id="taskgroup-progress-bar-text" style="position:absolute;left:0;right:0;top:0;bottom:0;display:flex;align-items:center;justify-content:center;font-weight:bold;color:#222;font-size:12px;pointer-events:none;"></span>
                </div>
            `;
            document.body.appendChild(progressContainer);
        }

        document.getElementById('close-btn').onclick = () => popup.remove();
        document.getElementById('assign-btn').onclick = async () => {
            popup.style.display = 'none'; // Hide the popup when assigning starts
            const usernames = document.getElementById('usernames-input').value
                .split('\n').map(u => u.trim()).filter(Boolean);
            if (!usernames.length) {
                alert('Please enter at least one username.');
                popup.style.display = ''; // Show again if error
                return;
            }
            document.getElementById('assign-btn').disabled = true;
            await assignTaskGroups(usernames, popup);
            document.getElementById('assign-btn').disabled = false;
        };
    }

    // Helper to get XSRF token from cookies
    function getXsrfToken() {
        const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);
        return match ? decodeURIComponent(match[1]) : '';
    }

    // Assign task groups to each username
    async function assignTaskGroups(usernames, popup) {
        // Use the current domain for the API URL
        const url = `${window.location.origin}/task/api/task/userTaskGroupEligibility/bulkImport`;
        let usersProcessed = 0, totalTaskGroupsAdded = 0;
        const xsrfToken = getXsrfToken();
        const headers = {
            "x-xsrf-token": xsrfToken,
            "SelectedLocation": "AAG-AAU-RTM",
            "SelectedOrganization": "AAG-AAU-RTM",
            "Content-Type": "application/json",
            "Cookie": document.cookie
        };

        // Progress bar setup
        const progressContainer = document.getElementById('taskgroup-progress-container');
        const progressBar = document.getElementById('taskgroup-progress-bar');
        const progressText = document.getElementById('taskgroup-progress-text');
        const totalSteps = usernames.length * taskGroups.length;
        let currentStep = 0;
        progressContainer.style.display = 'block';

        for (const username of usernames) {
            let taskGroupsAdded = 0;
            for (const taskGroup of taskGroups) {
                const payload = {
                    maxLimit: 0,
                    Data: [{
                        ProfileId: "AAG-AAU-RTM",
                        TaskGroupId: taskGroup,
                        UserId: username,
                        Disabled: false
                    }]
                };
                try {
                    const response = await fetch(url, {
                        method: "POST",
                        credentials: "include",
                        headers,
                        body: JSON.stringify(payload)
                    });
                    const data = await response.json();
                    if (data.success) taskGroupsAdded++;
                } catch (e) {
                    // Optionally log error
                }
                currentStep++;
                // Update progress bar and number inside the bar
                const percent = Math.round((currentStep / totalSteps) * 100);
                progressBar.style.width = percent + "%";
                const progressText = `Completed: ${currentStep} / ${totalSteps}`;
                // Show text inside the bar, white if >40%, else dark text over background
                document.getElementById('taskgroup-progress-bar-text').textContent = progressText;

                await new Promise(r => setTimeout(r, 150)); // throttle
            }
            usersProcessed++;
            totalTaskGroupsAdded += taskGroupsAdded;
            document.getElementById('taskgroup-status').textContent =
                `Processed ${usersProcessed}/${usernames.length} users...`;
        }
        progressContainer.style.display = 'none';
        alert(`Processed ${usersProcessed} users. Added a total of ${totalTaskGroupsAdded} task groups across all users.`);
        popup.remove();
    }

    // Add a button to the page to open the popup
    function addToolbarButton() {
        if (document.getElementById('vnaTaskGroup-popup-btn')) return;
        const btn = document.createElement('button');
        btn.id = 'vnaTaskGroup-popup-btn';
        btn.textContent = 'VNA Tasks';
        btn.style = 'position:fixed;top:5px;right:550px;z-index:99999;padding:8px 12px;background:#690800;color:#fff;border:none;border-radius:2px;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.35);transition:transform 0.15s;';
        btn.onclick = function() {
            btn.style.transform = 'scale(0.8)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 40);
            showPopup();
        };
        document.body.appendChild(btn);

        // Hide button for 3 seconds when refresh button is clicked
        document.addEventListener('click', function(event) {
            if (event.target.id === 'navbar-btn-refresh' || event.target.closest('#navbar-btn-refresh')) {
                btn.style.opacity = '0.4';
                btn.style.background = '#4a4a4a';
                btn.style.color = '#888';
                btn.style.cursor = 'not-allowed';
                btn.disabled = true;
                setTimeout(() => {
                    btn.style.opacity = '';
                    btn.style.background = '#690800';
                    btn.style.color = '#fff';
                    btn.style.cursor = 'pointer';
                    btn.disabled = false;
                }, 3000);
            }
        });
    }
    // Wait for DOM and add button with 3 second delay
    window.addEventListener('load', () => {
        setTimeout(addToolbarButton, 3000);
    });
})();
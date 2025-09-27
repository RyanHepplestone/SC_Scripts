// ==UserScript==
// @name         Bulk Assign Task Groups to Users
// @namespace    https://github.com/RyanHepplestone/SC_Scripts
// @version      2.4
// @description  Assigns all task groups to a list of usernames via API using current session cookies
// @author       TB
// @match        https://*.sce.manh.com/udc/dm/screen/task/UserTaskGroupEligibility
// @match        https://*.sce.manh.com/udc/dm/screen/organization/user
// @match        https://*.sce.manh.com/udc/dm-config/screen/lmcore/EmployeeStatus
// @grant        GM_addStyle
// @updateURL    https://raw.githubusercontent.com/RyanHepplestone/SC_Scripts/main/Bulk%20Assign%20Task%20Groups%20to%20Users-2.0.user.js
// @downloadURL  https://raw.githubusercontent.com/RyanHepplestone/SC_Scripts/main/Bulk%20Assign%20Task%20Groups%20to%20Users-2.0.user.js
// ==/UserScript==

(function() {
    'use strict';

    // List of task groups (copy from your Python script)
    const taskGroups = [
        "AAG Bulk Pick Task Group",
        "AAGUK Awkward CO RTH Task Group",
        "AAGUK Awkward Pick Pack Big Order",
        "AAGUK Awkward Pick Pack CO-IO-NR",
        "AAGUK Awkward RDC Replen",
        "AAGUK Awkward Work Orders",
        "AAGUK Bulk Pick CO RTH Task Group",
        "AAGUK Bulk Pick E-Ful Remote",
        "AAGUK Bulk Pick Pack Big Order",
        "AAGUK Bulk Pick Pack CO-IO-NR",
        "AAGUK Bulk Pick Pick National Retailers",
        "AAGUK Bulk Pick Pick Pack Big Order",
        "AAGUK Bulk Pick Pick Pack CO-IO-NR",
        "AAGUK Bulk Pick Pick to Pallet",
        "AAGUK Bulk Pick RDC Replen",
        "AAGUK Bulk Pick Work Orders",
        "AAGUK Bulk Priority Replenishment Task Group",
        "AAGUK Bulk RDC Replen",
        "AAGUK Bulk Replenishment Task Group",
        "AAGUK Bulk Replenishment To Exotec",
        "AAGUK Bulk Work Orders",
        "AAGUK Consumables Picking",
        "AAGUK Dangerous Goods CO RTH Task Group",
        "AAGUK Dangerous Goods National Retailers",
        "AAGUK Dangerous Goods Pick to Pallet",
        "AAGUK DG Bulk Pick Pack Big Order",
        "AAGUK DG Bulk Pick Pack CO-IO-NR",
        "AAGUK DG Bulk Priority Replenishment Task Group",
        "AAGUK DG Bulk RDC Replen",
        "AAGUK DG Bulk Replenishment Task Group",
        "AAGUK DG Bulk Replenishment To Exotec",
        "AAGUK DG Bulk Work Orders",
        "AAGUK DG E-Ful Remote",
        "AAGUK DG Pick Pack Big Order",
        "AAGUK DG Pick Pack CO-IO-NR",
        "AAGUK DG RDC Replen",
        "AAGUK DG Work Orders",
        "AAGUK East Bulk Pick CO RTH Task Group",
        "AAGUK East Bulk Pick E-Ful Remote",
        "AAGUK East Bulk Pick Pick National Retailers",
        "AAGUK East Bulk Pick Pick Pack Big Order",
        "AAGUK East Bulk Pick Pick Pack CO-IO-NR",
        "AAGUK East Bulk Pick Pick to Pallet",
        "AAGUK East Bulk Pick RDC Replen",
        "AAGUK East VB Bulk CO RTH Pick Task Group",
        "AAGUK East VB Bulk E-Ful Pick Task Group",
        "AAGUK East VB Bulk Pick Task Group",
        "AAGUK Inbound Priority Task Group",
        "AAGUK LPN Disposition",
        "AAGUK Mezz First CO RTH Task Group",
        "AAGUK Mezz First E-Ful Remote",
        "AAGUK Mezz First E-Fulfilment & Remote",
        "AAGUK Mezz First National Retailers",
        "AAGUK Mezz First Pick Pack Big Order",
        "AAGUK Mezz First Pick Pack CO-IO-NR",
        "AAGUK Mezz First Pick to Pallet",
        "AAGUK Mezz First RDC Replen",
        "AAGUK Mezz First Work Orders",
        "AAGUK Mezz Second CO RTH Task Group",
        "AAGUK Mezz Second E-Ful Remote",
        "AAGUK Mezz Second E-Fulfilment and Customer Orders",
        "AAGUK Mezz Second National Retailers",
        "AAGUK Mezz Second Pick Pack Big Order",
        "AAGUK Mezz Second Pick Pack CO-IO-NR",
        "AAGUK Mezz Second Pick to Pallet",
        "AAGUK Mezz Second RDC Replen",
        "AAGUK Mezz Second Single Line Orders",
        "AAGUK Mezz Second Work Orders",
        "AAGUK MF Zone Picking",
        "AAGUK OS NAT Task Group",
        "AAGUK OS Pick to Pallet",
        "AAGUK Outbound Putaway",
        "AAGUK Outside Priority Replenishment Task Group",
        "AAGUK Outside Replenishment Task Group",
        "AAGUK Outside Replenishment To Exotec",
        "AAGUK Oversize Pick Task Group",
        "AAGUK Oversized Bulk Pick Pack CO-IO-NR",
        "AAGUK Oversized Bulk RDC Replen",
        "AAGUK Oversized Bulk Work Orders",
        "AAGUK Oversized CO RTH Task Group",
        "AAGUK Oversized E-Ful Remote",
        "AAGUK Oversized National Retailers",
        "AAGUK Oversized Pick Pack Big Order",
        "AAGUK Oversized Pick Pack CO-IO-NR",
        "AAGUK Oversized RDC Replen",
        "AAGUK Oversized Work Orders",
        "AAGUK Putaway",
        "AAGUK Putaway Holding",
        "AAGUK Recall Task Group",
        "AAGUK RL (all zones) Task Group",
        "AAGUK RL OC Pick Task Group",
        "AAGUK RL Suppl Cleanse Awk Task Group",
        "AAGUK RL Suppl Cleanse Awkward Bulk Task Group",
        "AAGUK RL Suppl Cleanse Bulk Task Group",
        "AAGUK RL Suppl Cleanse DG Bulk Bulk Task Group",
        "AAGUK RL Suppl Cleanse DG Bulk Task Group",
        "AAGUK RL Suppl Cleanse Mezz First Task Group",
        "AAGUK RL Suppl Cleanse Mezz Second Task Group",
        "AAGUK RL Suppl Cleanse TEMP Task Group",
        "AAGUK Supplier Cleanse Bulk Pick Task Group",
        "AAGUK Supplier Cleanse Dangerous Goods Task Group",
        "AAGUK Temp CO RTH Task Group",
        "AAGUK Temp CO-IO-NR Task Group",
        "AAGUK Temp E-Ful Remote Task Group",
        "AAGUK Temp National Retailers Task Group",
        "AAGUK Temp Pick Pack Big Order Task Group",
        "AAGUK Temp Pick to Pallet",
        "AAGUK Temp RDC Replen Task Group",
        "AAGUK VB Bulk Pick CO RTH Task Group",
        "AAGUK VB Bulk Pick Task Group",
        "AAGUK VB Dangerous Goods CO RTH Task Group",
        "AAGUK VB Dangerous Goods Task Group",
        "AAGUK VB E-Ful Bulk Pick Task Group",
        "AAGUK VB E-Ful Dangerous Goods Task Group",
        "AAGUK VB E-Ful Mezz First Task Group",
        "AAGUK VB E-Ful Mezz Second Task Group",
        "AAGUK VB Mezz First CO RTH Task Group",
        "AAGUK VB Mezz First Task Group",
        "AAGUK VB Mezz Second CO RTH Task Group",
        "AAGUK VB Mezz Second Task Group",
        "AAGUK VB Temp CO RTH Task Group",
        "AAGUK VB Temp CO-IO-NR Task Group",
        "AAGUK VB Temp E-Ful Remote Task Group",
        "AAGUK West Bulk Pick CO RTH Task Group",
        "AAGUK West Bulk Pick E-Ful Remote",
        "AAGUK West Bulk Pick Pick National Retailers",
        "AAGUK West Bulk Pick Pick Pack Big Order",
        "AAGUK West Bulk Pick Pick Pack CO-IO-NR",
        "AAGUK West Bulk Pick Pick to Pallet",
        "AAGUK West Bulk Pick RDC Replen",
        "AAGUK West VB Bulk CO RTH Pick Task Group",
        "AAGUK West VB Bulk E-Ful Pick Task Group",
        "AAGUK West VB Bulk Pick Task Group",
        "AAGUK Mezz Second Multi Line Orders",
        "AAGUK Works Orders",
        "Outbound",
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
        if (document.getElementById('taskgroup-popup-btn')) return;
        const btn = document.createElement('button');
        btn.id = 'taskgroup-popup-btn';
        btn.textContent = 'Normal Tasks';
        btn.style = 'position:fixed;top:5px;right:640px;z-index:99999;padding:8px 12px;background:#690800;color:#fff;border:none;border-radius:2px;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.35);transition:transform 0.15s;';
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
// ==UserScript==
// @name         Color Code Manh w/ Exta Stuff
// @namespace    https://github.com/RyanHepplestone/SC_Scripts
// @version      3.7
// @description  Color codes labels, blocks toast notifications and persistent modals, and adds Display Status colors and Facility Names.
// @author       Ryan Hepplestone
// @match        https://*.sce.manh.com/*
// @grant        GM_addStyle
// @updateURL    https://raw.githubusercontent.com/RyanHepplestone/SC_Scripts/main/Color%20Code%20Manh%20w-%20Exta%20Stuff-3.7.user.js
// @downloadURL  https://raw.githubusercontent.com/RyanHepplestone/SC_Scripts/main/Color%20Code%20Manh%20w-%20Exta%20Stuff-3.7.user.js
// ==/UserScript==

(function() {
    'use strict';

    // status and their corresponding colors
    const statusColors = {
        "Created": { background: "#e4ebe9", text: "#000000" },// Light Gray background with Black text
        "Picking": "#add8e6",// Light Blue
        "Picked": "#87cefa",// Sky Blue
        "Packing": { background: "#FFDF00", text: "#000000" },// Light Green
        "Packed":  { background: "#3cb371", text: "#ffffff" },// Medium Sea Green
        "Staged": "#288a53",// Dark Sea Green
        "Manifested": "#2e8b57",// Sea Green
        "Loaded": "#228b22",// Forest Green
        "PendingShipConfirm": "#e6a12c",// Green
        "Shipped": "#006400",// Dark Green
        "Allocated": "#76b524",// Green
        "Not Allocated": "#4f93e4",// Blue
        "Consumed": "#808080",// Grey
        "Partially Allocated": "#e6a12c", // Yellow
        "Cancelled": "#a11f1f",// Red
        "Completed": "#76b524",// Green
        "Started": "#e6a12c",// Yellow
        "Released": "#e6a12c",// Yellow
        "Held": { background: "#D3D3D3", text: "#000000" },// Light Gray
        "Ready For Assignment": { background: "#84aff5", text: "#000000" }, // Light Blue
        "Assigned": "#4c74ed",// Sky Blue
        "In Progress": { background: "#a7ed4c", text: "#000000" },// Light Green
        "Pending Complete": "#3cb371",// Medium Sea Green
        "Completed": "#76b524", // Green
        "Pending Cancel":"#FFA500", // Orange
        "In Transit": { background: "#bab8b8", text: "#000000" },// Light Gray background with Black text
        "In Receiving": "#FFA500", // Green
        "Verified":"#76b524", // Green
        "ALLOCATED": "#76b524",// Green
        "CANCELLED": "#a11f1f",// Red
        "CREATED": { background: "#bab8b8", text: "#000000" },// Light Gray background with Black text
        "LOADED": "#228b22",// Forest Green
        "MANIFESTED": "#2e8b57",// Sea Green
        "PACKED": { backgound: "#3cb371", text: "#000000"},// Medium Sea Green
        "PACKING": { background: "#90ee90", text: "#000000" },// Light Green
        "READY": "#e6a12c",// Blue
        "SHIPPED": "#006400",// Dark Green
        "STAGED": "#3cb371",// Medium Sea Green
        "Docked": "#a11f1f",// Dark Green
        "Available": "#76b524"// Medium Sea Green
    };

    // Transaction Type colors
    const transactionTypeColors = {
        "CloseShipment": "#FFD1DC", // Pastel Pink
        "Cycle Count": "#ffc0cb",// Pastel Yellow
        "Load": "#90EE90",// Pastel Green
        "Pack": "#ADD8E6",// Pastel Blue
        "Pick": "#FFB347",// Pastel Orange
        "Putaway": "#FFFACD",// Pastel Purple
        "Receive": "#E0FFFF",// Pastel Cyan
        "SORT": "#F0E68C"// Pastel Lime
    };

    // Order Type colors - Light Colors
    const orderTypeColors = {
        "CO-AWK": "#a9ecf5", // Light Cyan
        "CO-REM": "#f79cbb", // Light Pink
        "CO-STK": "#97f09a", // Light Green
        "CA-FUL": "#81c7f7", // Light Blue
        "CO-VOR": "#f5c57d", // Light Orange
        "CO-COL": "#cf937e", // Light Grey-Brown
        "IO-OWN": "#ecf58c", // Light Yellow-Green
        "CA-NAT": "#4fa0e3", // Light Sky Blue
        "RR-REP": "#fc7784", // Light Red
        "CO-RTH": "#a6a1a1", // Light Blue-Grey
        "EX01": "#5cb4bf", // Lighter Cyan
        "IO-STF": "#f0da18", // Light Yellow
        "CA-SRE": "#a6e35f", // Light Lime Green
        "CA-SCL": "#d48aeb"// Very Light Blue
    };

    // Display Status colors - Medium Distinct Colors
    const displayStatusColors = {
        "aborted": "#F08080", // Light Coral
        "completed": "#90EE90", // Light Green
        "completed in multiple executions": "#98FB98", // Pale Green
        "completed with errors": "#FFA07A", // Light Salmon
        "failed": "#DC143C", // Crimson
        "force completed": "#3CB371", // Medium Sea Green
        "inprogress": "#FFD700", // Gold
        "no records processed": "#D3D3D3", // Light Grey
        "open": "#87CEFA", // Sky Blue
        "started": "#FFA500", // Orange
        "triggered": "#FFFFE0", // Light Yellow
        "unknown": "#A9A9A9"// Dark Grey
    };

    // Facility ID to Name mapping
    const facilityNames = {
        "11": "Leeds",
        "12": "Manchester",
        "13": "Preston",
        "14": "Newcastle",
        "15": "Glasgow",
        "16": "Liverpool",
        "17": "Cardiff",
        "18": "Sheffield",
        "19": "Luton",
        "20": "Barking",
        "21": "NAPA Shop",
        "30": "Charlton",
        "31": "Maidstone",
        "40": "Birmingham",
        "42": "CV-Logix",
        "50": "Reading",
        "51": "Southampton",
        "60": "Colchester",
        "70": "Bristol",
        "71": "Exeter",
        "80": "Leicester",
        "81": "Nottingham",
        "85": "Belfast",
        "270": "Sheffield Bulk Store",
        "12A": "Manchester Motor Factors",
        "14A": "Carlisle",
        "14B": "Darlington Motor Factors",
        "15A": "Glasgow Subs",
        "19A": "Staples Corner",
        "71A": "Launceston",
        "80A": "Shepshed Factors",
        "333": "Rotherham NDC",
        "25": "Rayleigh",
        "65": "Corby",
        "75": "Swindon",
        "120": "Recall",
        "02680": "do not use, use 02A instead",
        "02A": "J&S UNIT 17",
        "02B": "J&S UNIT 2",
        "03A": "BOYES",
        "03B": "BOYES",
        "3MF": "Mezz First",
        "3MS": "Mezz Second",
        "3EX": "Exotec",
        "3BP": "Ground Floor",
        "3DG": "Dangerous Goods",
        "3RL": "Reverse logistics"
    };

    // Location Type colors - Reusing and adding new colors
    const locationTypeColors = {
        "CONSOLIDATION": "#D8BFD8",
        "DOCK_DOOR": "#a0d6b4",
        "PACKING": "#f08080",
        "PICK_DROP": "#ffc06e",
        "SORTING": "#dda0dd",
        "STAGING": "#e6e6fa",
        "STORAGE": "#6eb9ff"
    };

    // Function to apply colors and facility names
    function applyColors(target) {
        // divs with the specific class and apply the colouring for the title
        const statusElements = (target || document).querySelectorAll('div.priorityCircle.ng-star-inserted');
        statusElements.forEach(function(element) {
            const status = element.getAttribute('title');
            if (status && statusColors.hasOwnProperty(status)) {
                if (typeof statusColors[status] === 'object' && statusColors[status].background) {
                    element.style.backgroundColor = statusColors[status].background;
                    element.style.color = statusColors[status].text;
                    element.style.border = "1px solid black";
                } else {
                    element.style.backgroundColor = statusColors[status];
               }
            }
        });

        // spans and links with the specific class and apply the colouring for the text
        const mixedElements = (target || document).querySelectorAll('span.field-value.ng-star-inserted, a.link-label.card-column.ng-star-inserted, span.field-value.locationValue[data-component-id]');
        mixedElements.forEach(function(element) {
            const componentId = element.getAttribute('data-component-id');
            const title = element.getAttribute('title');

            // Facility Name addition
            if (componentId === "DestinationFacilityId") {
                const facilityId = element.textContent.trim();
                if (facilityNames.hasOwnProperty(facilityId)) {
                    const facilityName = facilityNames[facilityId];
                    const facilityNameSpan = document.createElement('span');
                    facilityNameSpan.textContent = ` ${facilityName}`;
                    facilityNameSpan.style.fontWeight = 'bold';
                    // facilityNameSpan.style.color = '#007bff'; // Example styling, you can customize this
                    element.appendChild(facilityNameSpan);
                }
            }

            //MIXED COLOUR
            if(element.textContent.trim() === "MIXED"){
                element.style.backgroundColor = "#ff6e6e";//
                element.style.border = "1px solid black"; // Add black border
                element.style.borderRadius = "5px"; // Rounded corners
                element.style.padding = "0px 5px"; // Add padding
            }

            if(componentId === "UNIT"){
                element.style.backgroundColor = "#67a1e6";
                element.style.border = "1px solid black";
                element.style.borderRadius = "5px";
                element.style.padding = "0px 5px";
            }
            if(componentId === "LPN"){
                element.style.backgroundColor = "#9ed459";
                element.style.border = "1px solid black";
                element.style.borderRadius = "5px";
                element.style.padding = "0px 5px";
            }

            if(title === "PICK_DROP" && componentId === "CurrentLocationTypeId"){
                element.style.backgroundColor = "#ffc06e";
                element.style.border = "1px solid black";
                element.style.borderRadius = "5px";
                element.style.padding = "0px 5px";
            }

            if(title === "STORAGE" && componentId === "CurrentLocationTypeId"){
                element.style.backgroundColor = "#6eb9ff";
                element.style.border = "1px solid black";
                element.style.borderRadius = "5px";
                element.style.padding = "0px 5px";
            }

            if(title === "DOCK_DOOR" && componentId === "CurrentLocationTypeId"){
                element.style.backgroundColor = "#a0d6b4";
                element.style.border = "1px solid black";
                element.style.borderRadius = "5px";
                element.style.padding = "0px 5px";
            }

            if(title === "PACKING" && componentId === "CurrentLocationTypeId"){
                element.style.backgroundColor = "#f08080";
                element.style.border = "1px solid black";
                element.style.borderRadius = "5px";
                element.style.padding = "0px 5px";
            }

            if(title === "SORTING" && componentId === "CurrentLocationTypeId"){
                element.style.backgroundColor = "#dda0dd";
                element.style.border = "1px solid black";
                element.style.borderRadius = "5px";
                element.style.padding = "0px 5px";
            }

            if(title === "STAGING" && componentId === "CurrentLocationTypeId"){
                element.style.backgroundColor = "#e6e6fa";
                element.style.border = "1px solid black";
                element.style.borderRadius = "5px";
                element.style.padding = "0px 5px";
            }

            if(title === "PALLET" && componentId === "LpnType"){
                element.style.backgroundColor = "#6eb9ff";
                element.style.border = "1px solid black";
                element.style.borderRadius = "5px";
                element.style.padding = "0px 5px";
            }

            if(title === "OLPN" && componentId === "LpnType"){
                element.style.backgroundColor = "#ffad6e";
                element.style.border = "1px solid black";
                element.style.borderRadius = "5px";
                element.style.padding = "0px 5px";

            }

            if (componentId === "TransactionTypeDescription"){
                element.style.border = "1px solid black";
                element.style.borderRadius = "5px";
                element.style.padding = "0px 5px";
            }

            if (componentId === "TransactionTypeDescription") {
                if (title === "Cycle Count") {
                    element.style.backgroundColor = "#ffc0cb";
                    element.style.border = "1px solid black";
                    element.style.borderRadius = "5px";
                    element.style.padding = "0px 5px";
                } else if (title === "Pack") {
                    element.style.backgroundColor = "#90ee90";
                    element.style.border = "1px solid black";
                    element.style.borderRadius = "5px";
                    element.style.padding = "0px 5px";
                } else if (title === "Putaway") {
                    element.style.backgroundColor = "#add8e6";
                    element.style.border = "1px solid black";
                    element.style.borderRadius = "5px";
                    element.style.padding = "0px 5px";
                } else if (title === "Pick") {
                    element.style.backgroundColor = "#f5b289";
                    element.style.border = "1px solid black";
                    element.style.borderRadius = "5px";
                    element.style.padding = "0px 5px";
                }
            }

            if (componentId === "AsnLevelDescription") {
                if (title === "Item Level") {
                    element.style.backgroundColor = "#e0b0ff";
                    element.style.border = "1px solid black";
                    element.style.borderRadius = "5px";
                    element.style.padding = "0px 5px";
                } else if (title === "LPN Level") {
                    element.style.backgroundColor = "#fffacd";
                    element.style.border = "1px solid black";
                    element.style.borderRadius = "5px";
                    element.style.padding = "0px 5px";
                }
            }

            if (componentId === "CrossReferenceLpnId" && title && title.startsWith("OLPN")) {
                element.style.backgroundColor = "#f5e284"; // Yellow
                element.style.border = "1px solid black";
                element.style.borderRadius = "5px";
                element.style.padding = "0px 5px";
            }

            if (componentId === "OriginWarehouseStatusDescription") {
                const text = element.textContent.trim();
                if (text.includes("Open")) {
                    element.style.backgroundColor = { background: "#ded7b4", text: "#000000" }// Light Gray background with Black text
                    element.style.border = "1px solid black";
                    element.style.borderRadius = "5px";
                    element.style.padding = "0px 5px";
                } else if (text.includes("DC Accepted")) {
                    element.style.backgroundColor = "#f5e284";
                    element.style.border = "1px solid black";
                    element.style.borderRadius = "5px";
                    element.style.padding = "0px 5px";
                } else if (text.includes("Loading In Progress")) {
                    element.style.backgroundColor = "#FFA500";
                    element.style.border = "1px solid black";
                    element.style.borderRadius = "5px";
                    element.style.padding = "0px 5px";
                } else if (text.includes("Loading Complete")) {
                    element.style.backgroundColor = "#76b524";
                    element.style.border = "1px solid black";
                    element.style.borderRadius = "5px";
                    element.style.padding = "0px 5px";
                }
            }

            if (componentId === "ActiveDockDoorId" && title && title.startsWith("RO")) {
                element.style.backgroundColor = "#ff6e6e";
                element.style.border = "1px solid black";
                element.style.borderRadius = "5px";
                element.style.padding = "0px 5px";
            }

            // TransactionTypeId coloring
            if (componentId === "TransactionTypeId") {
                if (transactionTypeColors.hasOwnProperty(title)) {
                    element.style.backgroundColor = transactionTypeColors[title];
                }
                element.style.border = "1px solid black";
                element.style.borderRadius = "5px";
                element.style.padding = "0px 5px";
            }

            // OrderType coloring
            if (componentId === "OrderType") {
                if (orderTypeColors.hasOwnProperty(title)) {
                    element.style.backgroundColor = orderTypeColors[title];
                }
                element.style.border = "1px solid black";
                element.style.borderRadius = "5px";
                element.style.padding = "0px 5px";
            }

            // DisplayStatus coloring
            if (componentId === "DisplayStatus") {
                if (displayStatusColors.hasOwnProperty(title)) {
                    element.style.backgroundColor = displayStatusColors[title];
                    element.style.border = "1px solid black";
                    element.style.borderRadius = "5px";
                    element.style.padding = "0px 5px";
                }
            }

            // Location Type coloring for new elements
            if (locationTypeColors.hasOwnProperty(componentId)) {
                element.style.backgroundColor = locationTypeColors[componentId];
                element.style.border = "1px solid black";
                element.style.borderRadius = "5px";
                element.style.padding = "0px 5px";
                element.style.fontWeight = "normal"; // remove boldness
            }
        });

        // Color Code Title "RunCompletionDateTime"
        const runCompletionDateTimes = (target || document).querySelectorAll('span[data-component-id="RunCompletionDateTime"]');

        //Color Code Title "CreatedTimestamp"
        const createdTimestamps = (target || document).querySelectorAll('span[data-component-id="CreatedTimestamp"]');

        //Color Code Title "ActivityDateTime"
        const activityDateTimes = (target || document).querySelectorAll('span[data-component-id="ActivityDateTime"]');

        //Color Code Title "UpdatedTimestamp"
        const updatedTimestamps = (target || document).querySelectorAll('span[data-component-id="UpdatedTimestamp"]');

        //Color Code Title "StartTime"
        const StartTime = (target || document).querySelectorAll('span[data-component-id="StartTime"]');

        //Color Code Title "CompletionTime"
        const CompletionTime = (target || document).querySelectorAll('span[data-component-id="CompletionTime"]');

        // Combine the three nodelists
        const allTimestampElements = [...runCompletionDateTimes, ...createdTimestamps, ...activityDateTimes, ...updatedTimestamps, ...StartTime, ...CompletionTime];


        // Get all timestamps
        let timestamps = Array.from(allTimestampElements).map(element => {
            const title = element.getAttribute('title');
            try {
                // Attempt to parse the date, handling timezone abbreviations
                let date = new Date(title);

                // If parsing fails, try replacing the timezone abbreviation with UTC
                if (isNaN(date.getTime())) {
                    const titleUTC = title.replace(/\b(ACDT|ACST|ADT|AEDT|AEST|AKDT|AKST|AMDT|AMST|AST|AWDT|AWST|BDT|BST|CDT|CEST|CST|EASST|EDT|EEST|EST|GMT|HADT|HAST|HKT|HST|ICT|IDT|IST|JST|KST|MDT|MSD|MST|NDT|NST|PDT|PST|SGT|UTC|WADT|WIB|WIT|WITA)\b/g, ''); // Remove timezone abbrevations
                    date = new Date(titleUTC); // Try without abbreviations

                }

                return date.getTime();
            } catch (e) {
                console.error("Invalid date:", title, element, e);
                return null; // Or some default value.
            }
        }).filter(ts => ts !== null && !isNaN(ts)); // Remove invalid dates

        if (timestamps.length === 0) return;// Exit if no valid timestamps


        // Get min and max timestamps
        const minTimestamp = Math.min(...timestamps);
        const maxTimestamp = Math.max(...timestamps);

        allTimestampElements.forEach(element => {
            const title = element.getAttribute('title');
            let timestamp;

            try {
                // Attempt to parse the date, handling timezone abbreviations
                let date = new Date(title);

                // If parsing fails, try replacing the timezone abbreviation with UTC
                if (isNaN(date.getTime())) {
                    const titleUTC = title.replace(/\b(ACDT|ACST|ADT|AEDT|AEST|AKDT|AKST|AMDT|AMST|AST|AWDT|AWST|BDT|BST|CDT|CEST|CST|EASST|EDT|EEST|EST|GMT|HADT|HAST|HKT|HST|ICT|IDT|IST|JST|KST|MDT|MSD|MST|NDT|NST|PDT|PST|SGT|UTC|WADT|WIB|WIT|WITA)\b/g, ''); // Remove timezone abbrevations
                    date = new Date(titleUTC); // Try without abbreviations

                }

                timestamp = date.getTime();
            } catch (e) {
                console.error("Invalid date:", title, element, e);
                return; // Skip this element if the date is invalid.
            }


            if (isNaN(timestamp)) {
                console.error("Invalid timestamp (NaN):", title, element);
                return;// Skip if timestamp is NaN
            }

        });
    }

    // Add CSS to hide the modal overlays
    GM_addStyle(`
        ion-modal.modal-default.select-deselect-toast.hydrated.show-modal {
            display: none !important;
        }
    `);

    // Initial application of colors
    applyColors();

    // catch dynamic content
    const observer = new MutationObserver(function(mutations) {
        applyColors(); // Apply colors at start of mutations
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes) {
                mutation.addedNodes.forEach(function(node) {
                    if(node.nodeType === 1){
                        // Check for toast notification and remove it (if it still appears for any reason)
                        const toastElement = node.querySelector('div.toastMessage');
                        if (toastElement) {
                            toastElement.remove();
                            console.log('Toast notification removed.');
                            return; // Exit this iteration after removing toast
                        }

                        applyColors(node);
                    }
                    if(node.querySelectorAll){
                        applyColors(node);
                    }
                });
            }
        });
    });

    // Start observing the body for changes.
    observer.observe(document.body, { childList: true, subtree: true });
})();
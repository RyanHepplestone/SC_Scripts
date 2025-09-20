// ==UserScript==
// @name         Order Item Zone Viewer
// @namespace    https://github.com/RyanHepplestone/SC_Scripts
// @version      1.0
// @description  Adds a button to order cards to reveal all associated item zones for that order.
// @author       ri
// @match        https://*.sce.manh.com/*
// @grant        GM_addStyle
// @connect      aagprod.sce.manh.com
// @run-at       document-idle
// @updateURL    https://raw.githubusercontent.com/RyanHepplestone/SC_Scripts/main/Order%20Item%20Zone%20Viewer-1.0.user.js
// @downloadURL  https://raw.githubusercontent.com/RyanHepplestone/SC_Scripts/main/Order%20Item%20Zone%20Viewer-1.0.user.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Configuration ---
    const FACILITY_ID = 'AAG-AAU-RTM';

    // --- Styling ---
    GM_addStyle(`
        .show-zones-btn { background-color: #007bff; color: white; border: none; border-radius: 4px; padding: 2px 8px; font-size: 12px; cursor: pointer; margin-left: 10px; transition: background-color 0.2s; font-weight: bold; }
        .show-zones-btn:hover { background-color: #0056b3; }
        .show-zones-btn:disabled { background-color: #6c757d; cursor: not-allowed; }
        .zone-results-container { background-color: #f0f8ff; border: 1px solid #d1e7fd; border-radius: 5px; padding: 8px; margin-top: 5px; font-size: 14px; color: #052c65; word-wrap: break-word; grid-column: 1 / -1; }
        .zone-results-container strong { color: #0d6efd; }
        .zone-results-container .error { color: #dc3545; font-weight: bold; }
    `);

    // --- Helper Functions ---
    function getXsrfToken() {
        const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);
        return match ? decodeURIComponent(match[1]) : '';
    }

    /**
     * API Call 1: Fetches the list of items for a given OriginalOrderId.
     */
    async function fetchItemsForOrder(orderId) {
        const url = 'https://aagprod.sce.manh.com/dcorder/api/dcorder/originalOrder/search';
        const payload = { "Query": `OriginalOrderId = '${orderId}'` };

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-xsrf-token': getXsrfToken(), 'SelectedLocation': FACILITY_ID, 'SelectedOrganization': FACILITY_ID },
            body: JSON.stringify(payload)
        });

        if (!response.ok) { throw new Error(`API 1 HTTP Error: ${response.status}`); }

        const data = await response.json();

        if (data?.success && data.data?.[0]?.OriginalOrderLine) {
            const itemIds = data.data[0].OriginalOrderLine.map(line => line.ItemId).filter(Boolean);
            return [...new Set(itemIds)];
        }
        if (data.errors?.length > 0) { throw new Error(`API 1 Error from server: ${data.errors[0].message || 'Unknown API error'}`); }
        return [];
    }

    /**
     * API Call 2: Fetches the zone for a single ItemId.
     */
    async function fetchZoneForItem(itemId) {
        const guid = 'f8af960e-594d-44ae-9003-39e883e229f6';
        const url = `https://aagprod.sce.manh.com/dmui-facade/api/dmui-facade/entity/startExportTask?guid=${guid}&isConfig=false`;

        const payload = {
            "ViewName": "Item",
            "Filters": [{
                "ViewName": "Item",
                "AttributeId": "ItemId",
                "DataType": null,
                "requiredFilter": false,
                "Operator": "=",
                "SupportsExactMatch": null,
                "FilterValues": [itemId],
                "negativeFilter": false
            }],
            "RequestAttributeIds": ["Extended.MAUAAUZone"],
            "SearchOptions": [], "SearchChains": [], "FilterExpression": null, "Page": 0, "TotalCount": -1,
            "SortOrder": "asc", "TimeZone": "Europe/London", "IsCommonUI": false, "ComponentShortName": null,
            "EnableMaxCountLimit": true, "MaxCountLimit": 500, "ComponentName": "com-manh-cp-item-master",
            "Size": 25, "AdvancedFilter": false, "Sort": "ItemId", "noFilter": false
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-xsrf-token': getXsrfToken(), 'SelectedLocation': FACILITY_ID, 'SelectedOrganization': FACILITY_ID },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            console.error(`API 2 (Get Zone) Error for item ${itemId}: ${response.status} ${response.statusText}`);
            return null; 
        }

        const textResponse = await response.text();
        if (!textResponse || !textResponse.trim()) { return null; }

        // This parsing logic correctly gets the last line (the zone value, e.g., "EX")
        const lines = textResponse.trim().split(/\r?\n/);
        const lastLine = lines[lines.length - 1].trim().replace(/["',]/g, ''); // Get last line and clean it

        // Return the value only if it's not empty and not the header name
        if (lastLine && lastLine.toUpperCase() !== 'EXTENDED.MAUAAUZONE') {
            return lastLine;
        }

        return null; // Zone not found in a valid format
    }


    /**
     * Main logic executed on button click.
     */
    async function onShowZonesClick(event) {
        const button = event.target;
        const card = button.closest('div.card-row.primary');
        if (!card) return;

        const existingResults = card.querySelector('.zone-results-container');
        if (existingResults) { existingResults.remove(); return; }

        button.disabled = true; button.textContent = 'Loading...';

        const resultsContainer = document.createElement('div');
        resultsContainer.className = 'zone-results-container';
        resultsContainer.innerHTML = '<span>Loading...</span>';
        button.parentElement.insertAdjacentElement('afterend', resultsContainer);

        try {
            const orderIdElement = card.querySelector('span[data-component-id="OriginalOrderId"]');
            if (!orderIdElement?.textContent.trim()) { throw new Error('OriginalOrderId not found.'); }
            const orderId = orderIdElement.textContent.trim();

            resultsContainer.innerHTML = `<span>Fetching items for order ${orderId}...</span>`;
            const itemIds = await fetchItemsForOrder(orderId);

            if (itemIds.length === 0) {
                 resultsContainer.innerHTML = '<strong>Zones:</strong> No items found for this order.';
            } else {
                resultsContainer.innerHTML = `<span>Found ${itemIds.length} item(s). Fetching zones...</span>`;
                const zonePromises = itemIds.map(id => fetchZoneForItem(id));
                const zones = await Promise.all(zonePromises);
                const uniqueZones = [...new Set(zones.filter(Boolean))].sort();

                if (uniqueZones.length > 0) {
                    resultsContainer.innerHTML = `<strong>Zones:</strong> ${uniqueZones.join(', ')}`;
                } else {
                    resultsContainer.innerHTML = '<strong>Zones:</strong> Not found for any items in this order.';
                }
            }
        } catch (error) {
            console.error('Zone finder script error:', error);
            resultsContainer.innerHTML = `<span class="error">Error: ${error.message}. Check console (F12).</span>`;
        } finally {
            button.disabled = false; button.textContent = 'Show Zones';
        }
    }

    /**
     * Adds the button to a card.
     */
    function addZoneButtonToCard(cardNode) {
        if (cardNode.querySelector('.show-zones-btn')) return;
        const orderIdRow = cardNode.querySelector('div.field-row:has(span[data-component-id="OriginalOrderId"])');
        if (orderIdRow) {
            const button = document.createElement('button');
            button.textContent = 'Show Zones';
            button.className = 'show-zones-btn';
            button.title = 'Click to fetch and display all item zones for this order';
            button.addEventListener('click', onShowZonesClick);
            orderIdRow.appendChild(button);
        }
    }

    // ---Initialization with MutationObserver ---
    const observer = new MutationObserver((mutationsList) => {
        mutationsList.forEach(m => m.addedNodes.forEach(n => {
            if (n.nodeType === 1) {
                if (n.matches?.('div.card-row.primary')) addZoneButtonToCard(n);
                else n.querySelectorAll?.('div.card-row.primary').forEach(addZoneButtonToCard);
            }
        }));
    });

    document.querySelectorAll('div.card-row.primary').forEach(addZoneButtonToCard);
    observer.observe(document.body, { childList: true, subtree: true });

})();
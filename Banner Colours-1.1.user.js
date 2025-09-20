// ==UserScript==
// @name         Banner Colours
// @namespace    https://github.com/RyanHepplestone/SC_Scripts
// @version      1.1
// @description  Apply custom styles based on URL
// @author       Ryan Hepplestone
// @match        https://*.sce.manh.com/*
// @grant        GM_addStyle
// @updateURL    https://raw.githubusercontent.com/RyanHepplestone/SC_Scripts/main/Banner%20Colours-1.1.user.js
// @downloadURL  https://raw.githubusercontent.com/RyanHepplestone/SC_Scripts/main/Banner%20Colours-1.1.user.js
// ==/UserScript==

(function() {
    'use strict';

    const currentUrl = window.location.href;

    if (currentUrl.includes("uaafp") || currentUrl.includes("aagprod") ) {
        GM_addStyle(`
            #main .navbar .breadcrumb-container {
                background-color: #e74c3c !important; /* Red */
            }
            .toolbar-container {
                background-color: #e74c3c !important; /* Red */
            }
            :root {
                --manh-color-1: #80160a !important; /* Adjust if needed */
            }
            mat-toolbar.main-toolbar.ma-dark {
                background: #e74c3c !important; /* Red */
            }
        `);
    } else if (currentUrl.includes("uaafs") || currentUrl.includes("aagstage")) {
    GM_addStyle(`
        #main .navbar .breadcrumb-container {
            background-color: #28a745 !important; /* Green */
        }
        .toolbar-container {
            background-color: #28a745 !important; /* Green */
        }
        :root {
            --manh-color-1: #28a745 !important; /* Green */
        }
        mat-toolbar.main-toolbar.ma-dark {
            background: #28a745 !important; /* Green */
        }
        /* Additional specificity to ensure the styles apply */
        .toolbar-container, #main .navbar .breadcrumb-container, mat-toolbar.main-toolbar.ma-dark {
            background-color: #28a745 !important; /* Green */
        }
    `);
}
})();
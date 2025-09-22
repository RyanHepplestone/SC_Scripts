// ==UserScript==
// @name         Assign VNA Task Groups
// @namespace    https://github.com/RyanHepplestone/SC_Scripts
// @version      2.4
// @description  Assigns all task groups to a list of usernames via API using current session cookies
// @match        *aagprod.sce.manh.com/udc/dm/screen/task/UserTaskGroupEligibility
// @grant        GM_addStyle
// @updateURL    https://raw.githubusercontent.com/RyanHepplestone/SC_Scripts/main/Assign%20VNA%20Task%20Groups-2.0.user.js
// @downloadURL  https://raw.githubusercontent.com/RyanHepplestone/SC_Scripts/main/Assign%20VNA%20Task%20Groups-2.0.user.js
// ==/UserScript==

(function() {
    'use strict';

    // List of task groups (copy from your Python script)
    const taskGroups = [
        "AAGUK Bulk Replenishment Task Group",
        "AAGUK DG Bulk Replenishment Task Group",
        "AAGUK Bulk Priority Replenishment Task Group",
        "AAGUK DG Bulk Priority Replenishment Task Group",
        "AAGUK Bulk Replenishment To Exotec",
        "AAGUK DG Bulk Replenishment To Exotec",
        "AAGUK Outside Replenishment Task Group",
        "AAGUK Outside Priority Replenishment Task Group",
        "AAGUK Outside Replenishment To Exotec",
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
        "zAAGUK CG Exotec Priority Replenishment",
        "zAAGUK AA Exotec Standard Replenishment",
        "zAAGUK AA Mezz First Priority Replenishment",
        "zAAGUK AA Mezz First Standard Replenishment",
        "zAAGUK AA Mezz Second Priority Replenishment",
        "zAAGUK AA Mezz Second Standard Replenishment",
        "zAAGUK AA Bulk Pick Priority Replenishment",
        "zAAGUK AA Bulk Pick Standard Replenishment",
        "zAAGUK AA Exotec Priority Replenishment",
        "zAAGUK AB Exotec Standard Replenishment",
        "zAAGUK AB Mezz First Priority Replenishment",
        "zAAGUK AB Mezz First Standard Replenishment",
        "zAAGUK AB Mezz Second Priority Replenishment",
        "zAAGUK AB Mezz Second Standard Replenishment",
        "zAAGUK AB Bulk Pick Priority Replenishment",
        "zAAGUK AB Bulk Pick Standard Replenishment",
        "zAAGUK AB Exotec Priority Replenishment",
        "zAAGUK AC Exotec Standard Replenishment",
        "zAAGUK AC Mezz First Priority Replenishment",
        "zAAGUK AC Mezz First Standard Replenishment",
        "zAAGUK AC Mezz Second Priority Replenishment",
        "zAAGUK AC Mezz Second Standard Replenishment",
        "zAAGUK AC Bulk Pick Priority Replenishment",
        "zAAGUK AC Bulk Pick Standard Replenishment",
        "zAAGUK AC Exotec Priority Replenishment",
        "zAAGUK AD Exotec Standard Replenishment",
        "zAAGUK AD Mezz First Priority Replenishment",
        "zAAGUK AD Mezz First Standard Replenishment",
        "zAAGUK AD Mezz Second Priority Replenishment",
        "zAAGUK AD Mezz Second Standard Replenishment",
        "zAAGUK AD Bulk Pick Priority Replenishment",
        "zAAGUK AD Bulk Pick Standard Replenishment",
        "zAAGUK AD Exotec Priority Replenishment",
        "zAAGUK AE Exotec Standard Replenishment",
        "zAAGUK AE Mezz First Priority Replenishment",
        "zAAGUK AE Mezz First Standard Replenishment",
        "zAAGUK AE Mezz Second Priority Replenishment",
        "zAAGUK AE Mezz Second Standard Replenishment",
        "zAAGUK AE Bulk Pick Priority Replenishment",
        "zAAGUK AE Bulk Pick Standard Replenishment",
        "zAAGUK AE Exotec Priority Replenishment",
        "zAAGUK AF Exotec Standard Replenishment",
        "zAAGUK AF Mezz First Priority Replenishment",
        "zAAGUK AF Mezz First Standard Replenishment",
        "zAAGUK AF Mezz Second Priority Replenishment",
        "zAAGUK AF Mezz Second Standard Replenishment",
        "zAAGUK AF Bulk Pick Priority Replenishment",
        "zAAGUK AF Bulk Pick Standard Replenishment",
        "zAAGUK AF Exotec Priority Replenishment",
        "zAAGUK AG Exotec Standard Replenishment",
        "zAAGUK AG Mezz First Priority Replenishment",
        "zAAGUK AG Mezz First Standard Replenishment",
        "zAAGUK AG Mezz Second Priority Replenishment",
        "zAAGUK AG Mezz Second Standard Replenishment",
        "zAAGUK AG Bulk Pick Priority Replenishment",
        "zAAGUK AG Bulk Pick Standard Replenishment",
        "zAAGUK AG Exotec Priority Replenishment",
        "zAAGUK AH Exotec Standard Replenishment",
        "zAAGUK AH Mezz First Priority Replenishment",
        "zAAGUK AH Mezz First Standard Replenishment",
        "zAAGUK AH Mezz Second Priority Replenishment",
        "zAAGUK AH Mezz Second Standard Replenishment",
        "zAAGUK AH Bulk Pick Priority Replenishment",
        "zAAGUK AH Bulk Pick Standard Replenishment",
        "zAAGUK AH Exotec Priority Replenishment",
        "zAAGUK AI Exotec Standard Replenishment",
        "zAAGUK AI Mezz First Priority Replenishment",
        "zAAGUK AI Mezz First Standard Replenishment",
        "zAAGUK AI Mezz Second Priority Replenishment",
        "zAAGUK AI Mezz Second Standard Replenishment",
        "zAAGUK AI Bulk Pick Priority Replenishment",
        "zAAGUK AI Bulk Pick Standard Replenishment",
        "zAAGUK AI Exotec Priority Replenishment",
        "zAAGUK AJ Exotec Standard Replenishment",
        "zAAGUK AJ Mezz First Priority Replenishment",
        "zAAGUK AJ Mezz First Standard Replenishment",
        "zAAGUK AJ Mezz Second Priority Replenishment",
        "zAAGUK AJ Mezz Second Standard Replenishment",
        "zAAGUK AJ Bulk Pick Priority Replenishment",
        "zAAGUK AJ Bulk Pick Standard Replenishment",
        "zAAGUK AJ Exotec Priority Replenishment",
        "zAAGUK AK Exotec Standard Replenishment",
        "zAAGUK AK Mezz First Priority Replenishment",
        "zAAGUK AK Mezz First Standard Replenishment",
        "zAAGUK AK Mezz Second Priority Replenishment",
        "zAAGUK AK Mezz Second Standard Replenishment",
        "zAAGUK AK Bulk Pick Priority Replenishment",
        "zAAGUK AK Bulk Pick Standard Replenishment",
        "zAAGUK AK Exotec Priority Replenishment",
        "zAAGUK AL Exotec Standard Replenishment",
        "zAAGUK AL Mezz First Priority Replenishment",
        "zAAGUK AL Mezz First Standard Replenishment",
        "zAAGUK AL Mezz Second Priority Replenishment",
        "zAAGUK AL Mezz Second Standard Replenishment",
        "zAAGUK AL Bulk Pick Priority Replenishment",
        "zAAGUK AL Bulk Pick Standard Replenishment",
        "zAAGUK AL Exotec Priority Replenishment",
        "zAAGUK AM Exotec Standard Replenishment",
        "zAAGUK AM Mezz First Priority Replenishment",
        "zAAGUK AM Mezz First Standard Replenishment",
        "zAAGUK AM Mezz Second Priority Replenishment",
        "zAAGUK AM Mezz Second Standard Replenishment",
        "zAAGUK AM Bulk Pick Priority Replenishment",
        "zAAGUK AM Bulk Pick Standard Replenishment",
        "zAAGUK AM Exotec Priority Replenishment",
        "zAAGUK AN Exotec Standard Replenishment",
        "zAAGUK AN Mezz First Priority Replenishment",
        "zAAGUK AN Mezz First Standard Replenishment",
        "zAAGUK AN Mezz Second Priority Replenishment",
        "zAAGUK AN Mezz Second Standard Replenishment",
        "zAAGUK AN Bulk Pick Priority Replenishment",
        "zAAGUK AN Bulk Pick Standard Replenishment",
        "zAAGUK AN Exotec Priority Replenishment",
        "zAAGUK AO Exotec Standard Replenishment",
        "zAAGUK AO Mezz First Priority Replenishment",
        "zAAGUK AO Mezz First Standard Replenishment",
        "zAAGUK AO Mezz Second Priority Replenishment",
        "zAAGUK AO Mezz Second Standard Replenishment",
        "zAAGUK AO Bulk Pick Priority Replenishment",
        "zAAGUK AO Bulk Pick Standard Replenishment",
        "zAAGUK AO Exotec Priority Replenishment",
        "zAAGUK AP Exotec Standard Replenishment",
        "zAAGUK AP Mezz First Priority Replenishment",
        "zAAGUK AP Mezz First Standard Replenishment",
        "zAAGUK AP Mezz Second Priority Replenishment",
        "zAAGUK AP Mezz Second Standard Replenishment",
        "zAAGUK AP Bulk Pick Priority Replenishment",
        "zAAGUK AP Bulk Pick Standard Replenishment",
        "zAAGUK AP Exotec Priority Replenishment",
        "zAAGUK AQ Exotec Standard Replenishment",
        "zAAGUK AQ Mezz First Priority Replenishment",
        "zAAGUK AQ Mezz First Standard Replenishment",
        "zAAGUK AQ Mezz Second Priority Replenishment",
        "zAAGUK AQ Mezz Second Standard Replenishment",
        "zAAGUK AQ Bulk Pick Priority Replenishment",
        "zAAGUK AQ Bulk Pick Standard Replenishment",
        "zAAGUK AQ Exotec Priority Replenishment",
        "zAAGUK AR Exotec Standard Replenishment",
        "zAAGUK AR Mezz First Priority Replenishment",
        "zAAGUK AR Mezz First Standard Replenishment",
        "zAAGUK AR Mezz Second Priority Replenishment",
        "zAAGUK AR Mezz Second Standard Replenishment",
        "zAAGUK AR Bulk Pick Priority Replenishment",
        "zAAGUK AR Bulk Pick Standard Replenishment",
        "zAAGUK AR Exotec Priority Replenishment",
        "zAAGUK AS Exotec Standard Replenishment",
        "zAAGUK AS Mezz First Priority Replenishment",
        "zAAGUK AS Mezz First Standard Replenishment",
        "zAAGUK AS Mezz Second Priority Replenishment",
        "zAAGUK AS Mezz Second Standard Replenishment",
        "zAAGUK AS Bulk Pick Priority Replenishment",
        "zAAGUK AS Bulk Pick Standard Replenishment",
        "zAAGUK AS Exotec Priority Replenishment",
        "zAAGUK AT Exotec Standard Replenishment",
        "zAAGUK AT Mezz First Priority Replenishment",
        "zAAGUK AT Mezz First Standard Replenishment",
        "zAAGUK AT Mezz Second Priority Replenishment",
        "zAAGUK AT Mezz Second Standard Replenishment",
        "zAAGUK AT Bulk Pick Priority Replenishment",
        "zAAGUK AT Bulk Pick Standard Replenishment",
        "zAAGUK AT Exotec Priority Replenishment",
        "zAAGUK AU Exotec Standard Replenishment",
        "zAAGUK AU Mezz First Priority Replenishment",
        "zAAGUK AU Mezz First Standard Replenishment",
        "zAAGUK AU Mezz Second Priority Replenishment",
        "zAAGUK AU Mezz Second Standard Replenishment",
        "zAAGUK AU Bulk Pick Priority Replenishment",
        "zAAGUK AU Bulk Pick Standard Replenishment",
        "zAAGUK AU Exotec Priority Replenishment",
        "zAAGUK AV Exotec Standard Replenishment",
        "zAAGUK AV Mezz First Priority Replenishment",
        "zAAGUK AV Mezz First Standard Replenishment",
        "zAAGUK AV Mezz Second Priority Replenishment",
        "zAAGUK AV Mezz Second Standard Replenishment",
        "zAAGUK AV Bulk Pick Priority Replenishment",
        "zAAGUK AV Bulk Pick Standard Replenishment",
        "zAAGUK AV Exotec Priority Replenishment",
        "zAAGUK AW Exotec Standard Replenishment",
        "zAAGUK AW Mezz First Priority Replenishment",
        "zAAGUK AW Mezz First Standard Replenishment",
        "zAAGUK AW Mezz Second Priority Replenishment",
        "zAAGUK AW Mezz Second Standard Replenishment",
        "zAAGUK AW Bulk Pick Priority Replenishment",
        "zAAGUK AW Bulk Pick Standard Replenishment",
        "zAAGUK AW Exotec Priority Replenishment",
        "zAAGUK AX Exotec Standard Replenishment",
        "zAAGUK AX Mezz First Priority Replenishment",
        "zAAGUK AX Mezz First Standard Replenishment",
        "zAAGUK AX Mezz Second Priority Replenishment",
        "zAAGUK AX Mezz Second Standard Replenishment",
        "zAAGUK AX Bulk Pick Priority Replenishment",
        "zAAGUK AX Bulk Pick Standard Replenishment",
        "zAAGUK AX Exotec Priority Replenishment",
        "zAAGUK AY Exotec Standard Replenishment",
        "zAAGUK AY Mezz First Priority Replenishment",
        "zAAGUK AY Mezz First Standard Replenishment",
        "zAAGUK AY Mezz Second Priority Replenishment",
        "zAAGUK AY Mezz Second Standard Replenishment",
        "zAAGUK AY Bulk Pick Priority Replenishment",
        "zAAGUK AY Bulk Pick Standard Replenishment",
        "zAAGUK AY Exotec Priority Replenishment",
        "zAAGUK AZ Exotec Standard Replenishment",
        "zAAGUK AZ Mezz First Priority Replenishment",
        "zAAGUK AZ Mezz First Standard Replenishment",
        "zAAGUK AZ Mezz Second Priority Replenishment",
        "zAAGUK AZ Mezz Second Standard Replenishment",
        "zAAGUK AZ Bulk Pick Priority Replenishment",
        "zAAGUK AZ Bulk Pick Standard Replenishment",
        "zAAGUK AZ Exotec Priority Replenishment",
        "zAAGUK BA Exotec Standard Replenishment",
        "zAAGUK BA Mezz First Priority Replenishment",
        "zAAGUK BA Mezz First Standard Replenishment",
        "zAAGUK BA Mezz Second Priority Replenishment",
        "zAAGUK BA Mezz Second Standard Replenishment",
        "zAAGUK BA Bulk Pick Priority Replenishment",
        "zAAGUK BA Bulk Pick Standard Replenishment",
        "zAAGUK BA Exotec Priority Replenishment",
        "zAAGUK BB Exotec Standard Replenishment",
        "zAAGUK BB Mezz First Priority Replenishment",
        "zAAGUK BB Mezz First Standard Replenishment",
        "zAAGUK BB Mezz Second Priority Replenishment",
        "zAAGUK BB Mezz Second Standard Replenishment",
        "zAAGUK BB Bulk Pick Priority Replenishment",
        "zAAGUK BB Bulk Pick Standard Replenishment",
        "zAAGUK BB Exotec Priority Replenishment",
        "zAAGUK BC Exotec Standard Replenishment",
        "zAAGUK BC Mezz First Priority Replenishment",
        "zAAGUK BC Mezz First Standard Replenishment",
        "zAAGUK BC Mezz Second Priority Replenishment",
        "zAAGUK BC Mezz Second Standard Replenishment",
        "zAAGUK BC Bulk Pick Priority Replenishment",
        "zAAGUK BC Bulk Pick Standard Replenishment",
        "zAAGUK BC Exotec Priority Replenishment",
        "zAAGUK BDE Exotec Standard Replenishment",
        "zAAGUK BDE Mezz First Priority Replenishment",
        "zAAGUK BDE Mezz First Standard Replenishment",
        "zAAGUK BDE Mezz Second Priority Replenishment",
        "zAAGUK BDE Mezz Second Standard Replenishment",
        "zAAGUK BDE Bulk Pick Priority Replenishment",
        "zAAGUK BDE Bulk Pick Standard Replenishment",
        "zAAGUK BDE Exotec Priority Replenishment",
        "zAAGUK BF Exotec Standard Replenishment",
        "zAAGUK BF Mezz First Priority Replenishment",
        "zAAGUK BF Mezz First Standard Replenishment",
        "zAAGUK BF Mezz Second Priority Replenishment",
        "zAAGUK BF Mezz Second Standard Replenishment",
        "zAAGUK BF Bulk Pick Priority Replenishment",
        "zAAGUK BF Bulk Pick Standard Replenishment",
        "zAAGUK BF Exotec Priority Replenishment",
        "zAAGUK BHI Exotec Priority Replenishment",
        "zAAGUK BHI Exotec Standard Replenishment",
        "zAAGUK BHI Mezz First Priority Replenishment",
        "zAAGUK BHI Mezz First Standard Replenishment",
        "zAAGUK BHI Mezz Second Priority Replenishment",
        "zAAGUK BHI Mezz Second Standard Replenishment",
        "zAAGUK BHI Bulk Pick Priority Replenishment",
        "zAAGUK BHI Bulk Pick Standard Replenishment",
        "zAAGUK BJ Exotec Standard Replenishment",
        "zAAGUK BJ Mezz First Priority Replenishment",
        "zAAGUK BJ Mezz First Standard Replenishment",
        "zAAGUK BJ Mezz Second Priority Replenishment",
        "zAAGUK BJ Mezz Second Standard Replenishment",
        "zAAGUK BJ Bulk Pick Priority Replenishment",
        "zAAGUK BJ Bulk Pick Standard Replenishment",
        "zAAGUK BJ Exotec Priority Replenishment",
        "zAAGUK BK Exotec Standard Replenishment",
        "zAAGUK BK Mezz First Priority Replenishment",
        "zAAGUK BK Mezz First Standard Replenishment",
        "zAAGUK BK Mezz Second Priority Replenishment",
        "zAAGUK BK Mezz Second Standard Replenishment",
        "zAAGUK BK Bulk Pick Priority Replenishment",
        "zAAGUK BK Bulk Pick Standard Replenishment",
        "zAAGUK BK Exotec Priority Replenishment",
        "zAAGUK BL Exotec Standard Replenishment",
        "zAAGUK BL Mezz First Priority Replenishment",
        "zAAGUK BL Mezz First Standard Replenishment",
        "zAAGUK BL Mezz Second Priority Replenishment",
        "zAAGUK BL Mezz Second Standard Replenishment",
        "zAAGUK BL Bulk Pick Priority Replenishment",
        "zAAGUK BL Bulk Pick Standard Replenishment",
        "zAAGUK BL Exotec Priority Replenishment",
        "zAAGUK BM Exotec Standard Replenishment",
        "zAAGUK BM Mezz First Priority Replenishment",
        "zAAGUK BM Mezz First Standard Replenishment",
        "zAAGUK BM Mezz Second Priority Replenishment",
        "zAAGUK BM Mezz Second Standard Replenishment",
        "zAAGUK BM Bulk Pick Priority Replenishment",
        "zAAGUK BM Bulk Pick Standard Replenishment",
        "zAAGUK BM Exotec Priority Replenishment",
        "zAAGUK BN Exotec Standard Replenishment",
        "zAAGUK BN Mezz First Priority Replenishment",
        "zAAGUK BN Mezz First Standard Replenishment",
        "zAAGUK BN Mezz Second Priority Replenishment",
        "zAAGUK BN Mezz Second Standard Replenishment",
        "zAAGUK BN Bulk Pick Priority Replenishment",
        "zAAGUK BN Bulk Pick Standard Replenishment",
        "zAAGUK BN Exotec Priority Replenishment",
        "zAAGUK BO Exotec Standard Replenishment",
        "zAAGUK BO Mezz First Priority Replenishment",
        "zAAGUK BO Mezz First Standard Replenishment",
        "zAAGUK BO Mezz Second Priority Replenishment",
        "zAAGUK BO Mezz Second Standard Replenishment",
        "zAAGUK BO Bulk Pick Priority Replenishment",
        "zAAGUK BO Bulk Pick Standard Replenishment",
        "zAAGUK BO Exotec Priority Replenishment",
        "zAAGUK BP Exotec Standard Replenishment",
        "zAAGUK BP Mezz First Priority Replenishment",
        "zAAGUK BP Mezz First Standard Replenishment",
        "zAAGUK BP Mezz Second Priority Replenishment",
        "zAAGUK BP Mezz Second Standard Replenishment",
        "zAAGUK BP Bulk Pick Priority Replenishment",
        "zAAGUK BP Bulk Pick Standard Replenishment",
        "zAAGUK BP Exotec Priority Replenishment",
        "zAAGUK BQ Exotec Standard Replenishment",
        "zAAGUK BQ Mezz First Priority Replenishment",
        "zAAGUK BQ Mezz First Standard Replenishment",
        "zAAGUK BQ Mezz Second Priority Replenishment",
        "zAAGUK BQ Mezz Second Standard Replenishment",
        "zAAGUK BQ Bulk Pick Priority Replenishment",
        "zAAGUK BQ Bulk Pick Standard Replenishment",
        "zAAGUK BQ Exotec Priority Replenishment",
        "zAAGUK BR Exotec Standard Replenishment",
        "zAAGUK BR Mezz First Priority Replenishment",
        "zAAGUK BR Mezz First Standard Replenishment",
        "zAAGUK BR Mezz Second Priority Replenishment",
        "zAAGUK BR Mezz Second Standard Replenishment",
        "zAAGUK BR Bulk Pick Priority Replenishment",
        "zAAGUK BR Bulk Pick Standard Replenishment",
        "zAAGUK BR Exotec Priority Replenishment",
        "zAAGUK BS Exotec Standard Replenishment",
        "zAAGUK BS Mezz First Priority Replenishment",
        "zAAGUK BS Mezz First Standard Replenishment",
        "zAAGUK BS Mezz Second Priority Replenishment",
        "zAAGUK BS Mezz Second Standard Replenishment",
        "zAAGUK BS Bulk Pick Priority Replenishment",
        "zAAGUK BS Bulk Pick Standard Replenishment",
        "zAAGUK BS Exotec Priority Replenishment",
        "zAAGUK BT Exotec Standard Replenishment",
        "zAAGUK BT Mezz First Priority Replenishment",
        "zAAGUK BT Mezz First Standard Replenishment",
        "zAAGUK BT Mezz Second Priority Replenishment",
        "zAAGUK BT Mezz Second Standard Replenishment",
        "zAAGUK BT Bulk Pick Priority Replenishment",
        "zAAGUK BT Bulk Pick Standard Replenishment",
        "zAAGUK BT Exotec Priority Replenishment",
        "zAAGUK BU Exotec Standard Replenishment",
        "zAAGUK BU Mezz First Priority Replenishment",
        "zAAGUK BU Mezz First Standard Replenishment",
        "zAAGUK BU Mezz Second Priority Replenishment",
        "zAAGUK BU Mezz Second Standard Replenishment",
        "zAAGUK BU Bulk Pick Priority Replenishment",
        "zAAGUK BU Bulk Pick Standard Replenishment",
        "zAAGUK BU Exotec Priority Replenishment",
        "zAAGUK BV Exotec Standard Replenishment",
        "zAAGUK BV Mezz First Priority Replenishment",
        "zAAGUK BV Mezz First Standard Replenishment",
        "zAAGUK BV Mezz Second Priority Replenishment",
        "zAAGUK BV Mezz Second Standard Replenishment",
        "zAAGUK BV Bulk Pick Priority Replenishment",
        "zAAGUK BV Bulk Pick Standard Replenishment",
        "zAAGUK BV Exotec Priority Replenishment",
        "zAAGUK BW Exotec Standard Replenishment",
        "zAAGUK BW Mezz First Priority Replenishment",
        "zAAGUK BW Mezz First Standard Replenishment",
        "zAAGUK BW Mezz Second Priority Replenishment",
        "zAAGUK BW Mezz Second Standard Replenishment",
        "zAAGUK BW Bulk Pick Priority Replenishment",
        "zAAGUK BW Bulk Pick Standard Replenishment",
        "zAAGUK BW Exotec Priority Replenishment",
        "zAAGUK BX Exotec Standard Replenishment",
        "zAAGUK BX Mezz First Priority Replenishment",
        "zAAGUK BX Mezz First Standard Replenishment",
        "zAAGUK BX Mezz Second Priority Replenishment",
        "zAAGUK BX Mezz Second Standard Replenishment",
        "zAAGUK BX Bulk Pick Priority Replenishment",
        "zAAGUK BX Bulk Pick Standard Replenishment",
        "zAAGUK BX Exotec Priority Replenishment",
        "zAAGUK BY Exotec Standard Replenishment",
        "zAAGUK BY Mezz First Priority Replenishment",
        "zAAGUK BY Mezz First Standard Replenishment",
        "zAAGUK BY Mezz Second Priority Replenishment",
        "zAAGUK BY Mezz Second Standard Replenishment",
        "zAAGUK BY Bulk Pick Priority Replenishment",
        "zAAGUK BY Bulk Pick Standard Replenishment",
        "zAAGUK BY Exotec Priority Replenishment",
        "zAAGUK BZ Exotec Standard Replenishment",
        "zAAGUK BZ Mezz First Priority Replenishment",
        "zAAGUK BZ Mezz First Standard Replenishment",
        "zAAGUK BZ Mezz Second Priority Replenishment",
        "zAAGUK BZ Mezz Second Standard Replenishment",
        "zAAGUK BZ Bulk Pick Priority Replenishment",
        "zAAGUK BZ Bulk Pick Standard Replenishment",
        "zAAGUK BZ Exotec Priority Replenishment",
        "zAAGUK CA Exotec Standard Replenishment",
        "zAAGUK CA Mezz First Priority Replenishment",
        "zAAGUK CA Mezz First Standard Replenishment",
        "zAAGUK CA Mezz Second Priority Replenishment",
        "zAAGUK CA Mezz Second Standard Replenishment",
        "zAAGUK CA Bulk Pick Priority Replenishment",
        "zAAGUK CA Bulk Pick Standard Replenishment",
        "zAAGUK CA Exotec Priority Replenishment",
        "zAAGUK CB Exotec Standard Replenishment",
        "zAAGUK CB Mezz First Priority Replenishment",
        "zAAGUK CB Mezz First Standard Replenishment",
        "zAAGUK CB Mezz Second Priority Replenishment",
        "zAAGUK CB Mezz Second Standard Replenishment",
        "zAAGUK CB Bulk Pick Priority Replenishment",
        "zAAGUK CB Bulk Pick Standard Replenishment",
        "zAAGUK CB Exotec Priority Replenishment",
        "zAAGUK CC Exotec Standard Replenishment",
        "zAAGUK CC Mezz First Priority Replenishment",
        "zAAGUK CC Mezz First Standard Replenishment",
        "zAAGUK CC Mezz Second Priority Replenishment",
        "zAAGUK CC Mezz Second Standard Replenishment",
        "zAAGUK CC Bulk Pick Priority Replenishment",
        "zAAGUK CC Bulk Pick Standard Replenishment",
        "zAAGUK CC Exotec Priority Replenishment"

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
// ==UserScript==
// @name         MouseHunt Auto-Send Gifts & Tickets (UI Button)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a button to send all daily gifts and raffle tickets
// @match        https://www.mousehuntgame.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // 1. Core trigger function
    function sendAllGiftsAndTickets() {
        const buttons = document.querySelectorAll('[data-action="send_daily_gift"] a, [data-action="send_draw_ballot"] a');

        if (buttons.length === 0) {
            alert('No available gift or ticket buttons found on this page!');
            return;
        }

        buttons.forEach((button, index) => {
            setTimeout(() => {
                button.click();
            }, index * 300); // 300ms delay between clicks
        });
    }

    // 2. Inject visual button into the container
    function injectTriggerButton() {
        // Prevent injecting duplicate buttons
        if (document.getElementById('mh-auto-send-btn')) return;

        const container = document.querySelector('.friendsPage-list-filterContainer');
        if (!container) return;

        // Create the button element
        const btn = document.createElement('button');
        btn.id = 'mh-auto-send-btn';
        btn.textContent = 'Send All Gifts & Tickets';

        // Basic MouseHunt-compatible styling
        btn.style.marginLeft = '10px';
        btn.style.padding = '5px 10px';
        btn.style.backgroundColor = '#4ba723';
        btn.style.color = '#ffffff';
        btn.style.border = '1px solid #367d18';
        btn.style.borderRadius = '4px';
        btn.style.cursor = 'pointer';
        btn.style.fontWeight = 'bold';
        btn.style.fontSize = '12px';

        // Hover effect
        btn.onmouseover = () => btn.style.backgroundColor = '#3e8e1d';
        btn.onmouseout = () => btn.style.backgroundColor = '#4ba723';

        // Attach action
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            sendAllGiftsAndTickets();
        });

        // Append to the filter container
        container.appendChild(btn);
    }

    // 3. Observe changes in case MouseHunt loads/re-renders the friends list dynamically
    const observer = new MutationObserver(() => {
        injectTriggerButton();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Initial check on load
    window.addEventListener('load', injectTriggerButton);
})();
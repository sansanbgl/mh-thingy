// ==UserScript==
// @name         MouseHunt - Bulk Add Friends
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Bulk add friends in MouseHunt using Hunter IDs with a premium UI.
// @author       Umar Hasan
// @match        https://www.mousehuntgame.com/*
// @match        https://apps.facebook.com/mousehunt/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
  'use strict';

  // 1. Inject Fonts and Styles for premium look and feel
  const injectFontsAndStyles = () => {
    // Inject Google Fonts
    if (!document.getElementById('mh-bulk-fonts')) {
      const link = document.createElement('link');
      link.id = 'mh-bulk-fonts';
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Outfit:wght@500;600;700&display=swap';
      document.head.appendChild(link);
    }

    // Inject Custom CSS
    const css = `
      /* FAB Button Styling */
      #mh-bulk-friend-fab {
        position: fixed;
        bottom: 25px;
        right: 25px;
        z-index: 9999;
        background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
        color: #ffffff;
        border: none;
        border-radius: 50px;
        padding: 14px 28px;
        font-family: 'Outfit', 'Inter', -apple-system, sans-serif;
        font-size: 14px;
        font-weight: 600;
        letter-spacing: 0.3px;
        box-shadow: 0 10px 25px rgba(79, 70, 229, 0.4);
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        display: flex;
        align-items: center;
        gap: 10px;
      }
      #mh-bulk-friend-fab:hover {
        transform: translateY(-3px) scale(1.02);
        box-shadow: 0 15px 30px rgba(79, 70, 229, 0.6);
        background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
      }
      #mh-bulk-friend-fab:active {
        transform: translateY(-1px) scale(1.0);
      }
      #mh-bulk-friend-fab svg {
        width: 18px;
        height: 18px;
        fill: currentColor;
      }

      /* Modal Background Overlay */
      #mh-bulk-friend-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 10000;
        background: rgba(15, 23, 42, 0.65);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      }
      #mh-bulk-friend-modal.active {
        opacity: 1;
        pointer-events: auto;
      }

      /* Modal Content Box */
      .mh-modal-content {
        background: rgba(30, 41, 59, 0.9);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 24px;
        width: 550px;
        max-width: 90%;
        padding: 35px;
        color: #f8fafc;
        box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
        font-family: 'Inter', sans-serif;
        transform: scale(0.92) translateY(20px);
        transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        max-height: 85vh;
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
      }
      #mh-bulk-friend-modal.active .mh-modal-content {
        transform: scale(1) translateY(0);
      }

      /* Title and Header */
      .mh-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
      }
      .mh-modal-header h2 {
        margin: 0;
        font-family: 'Outfit', sans-serif;
        font-size: 24px;
        font-weight: 700;
        background: linear-gradient(120deg, #a5b4fc, #818cf8);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .mh-modal-close-btn {
        background: transparent;
        border: none;
        color: #94a3b8;
        cursor: pointer;
        padding: 6px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      }
      .mh-modal-close-btn:hover {
        background: rgba(255, 255, 255, 0.08);
        color: #f8fafc;
      }

      /* Body Forms */
      .mh-modal-body {
        display: flex;
        flex-direction: column;
        gap: 18px;
        overflow-y: auto;
        padding-right: 4px;
        flex: 1;
      }
      .mh-label {
        font-size: 13px;
        font-weight: 600;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 6px;
      }
      .mh-textarea {
        background: rgba(15, 23, 42, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 12px;
        padding: 14px;
        color: #f8fafc;
        font-family: monospace;
        font-size: 14px;
        line-height: 1.5;
        resize: vertical;
        min-height: 110px;
        outline: none;
        transition: all 0.3s ease;
        box-sizing: border-box;
        width: 100%;
      }
      .mh-textarea:focus {
        border-color: #6366f1;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
        background: rgba(15, 23, 42, 0.8);
      }
      .mh-textarea::placeholder {
        color: #475569;
      }

      /* Controls */
      .mh-controls {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 10px;
      }
      .mh-btn {
        padding: 12px 24px;
        border-radius: 12px;
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        border: none;
      }
      .mh-btn-primary {
        background: #4f46e5;
        color: #fff;
      }
      .mh-btn-primary:hover:not(:disabled) {
        background: #4338ca;
      }
      .mh-btn-primary:disabled {
        background: rgba(79, 70, 229, 0.4);
        cursor: not-allowed;
        color: #94a3b8;
      }
      .mh-btn-secondary {
        background: rgba(255, 255, 255, 0.08);
        color: #e2e8f0;
      }
      .mh-btn-secondary:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.15);
      }

      /* Progress and Stats */
      .mh-progress-container {
        display: none;
        flex-direction: column;
        gap: 8px;
        background: rgba(15, 23, 42, 0.4);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 12px;
        padding: 16px;
      }
      .mh-progress-info {
        display: flex;
        justify-content: space-between;
        font-size: 13px;
        color: #94a3b8;
        font-weight: 500;
      }
      .mh-progress-bar-bg {
        background: rgba(255, 255, 255, 0.1);
        border-radius: 6px;
        height: 8px;
        overflow: hidden;
        width: 100%;
      }
      .mh-progress-bar {
        background: linear-gradient(90deg, #6366f1, #818cf8);
        height: 100%;
        width: 0%;
        transition: width 0.3s ease;
      }

      /* Log and Status Display */
      .mh-log-container {
        display: none;
        flex-direction: column;
        gap: 8px;
        max-height: 250px;
        overflow-y: auto;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
        margin-top: 12px;
        padding-top: 16px;
      }
      .mh-log-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: rgba(15, 23, 42, 0.3);
        border: 1px solid rgba(255, 255, 255, 0.04);
        border-radius: 10px;
        padding: 10px 14px;
        font-size: 13px;
        animation: mhFadeIn 0.3s ease forwards;
      }
      .mh-log-user-info {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .mh-log-avatar {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: #475569;
        object-fit: cover;
        border: 1px solid rgba(255, 255, 255, 0.1);
      }
      .mh-log-text {
        font-weight: 500;
        color: #e2e8f0;
      }
      .mh-log-hunter-id {
        font-size: 11px;
        color: #64748b;
        margin-left: 6px;
      }
      .mh-status-badge {
        font-size: 11px;
        font-weight: 600;
        padding: 4px 10px;
        border-radius: 30px;
        display: inline-flex;
        align-items: center;
      }
      .mh-status-resolving {
        background: rgba(245, 158, 11, 0.15);
        color: #fbbf24;
      }
      .mh-status-sent {
        background: rgba(16, 185, 129, 0.15);
        color: #34d399;
      }
      .mh-status-skipped {
        background: rgba(59, 130, 246, 0.15);
        color: #60a5fa;
      }
      .mh-status-error {
        background: rgba(239, 68, 68, 0.15);
        color: #f87171;
      }

      /* Animations */
      @keyframes mhFadeIn {
        from {
          opacity: 0;
          transform: translateY(6px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* Custom Scrollbar */
      .mh-modal-body::-webkit-scrollbar,
      .mh-log-container::-webkit-scrollbar {
        width: 6px;
      }
      .mh-modal-body::-webkit-scrollbar-track,
      .mh-log-container::-webkit-scrollbar-track {
        background: transparent;
      }
      .mh-modal-body::-webkit-scrollbar-thumb,
      .mh-log-container::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.15);
        border-radius: 10px;
      }
      .mh-modal-body::-webkit-scrollbar-thumb:hover,
      .mh-log-container::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.25);
      }
    `;

    const styleEl = document.createElement('style');
    styleEl.id = 'mh-bulk-friend-styles';
    styleEl.innerHTML = css;
    document.head.appendChild(styleEl);
  };

  // 2. Create and Append UI Elements
  const createUI = () => {
    // Check if user is logged in (has unique_hash)
    if (typeof user === 'undefined' || !user.unique_hash) {
      console.log('MouseHunt Bulk Add Friends: User is not logged in or unique_hash is missing.');
      return;
    }

    // Floating Action Button (FAB)
    const fab = document.createElement('button');
    fab.id = 'mh-bulk-friend-fab';
    fab.innerHTML = `
      <svg viewBox="0 0 24 24">
        <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </svg>
      Bulk Add Friends
    `;
    document.body.appendChild(fab);

    // Modal Template
    const modal = document.createElement('div');
    modal.id = 'mh-bulk-friend-modal';
    modal.innerHTML = `
      <div class="mh-modal-content">
        <div class="mh-modal-header">
          <h2>Bulk Add Friends</h2>
          <button class="mh-modal-close-btn" title="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="mh-modal-body">
          <div>
            <div class="mh-label">Hunter IDs</div>
            <textarea class="mh-textarea" placeholder="Enter Hunter IDs (comma or newline separated)\ne.g. 9128333, 1234567, 7654321"></textarea>
          </div>

          <div class="mh-progress-container">
            <div class="mh-progress-info">
              <span class="mh-progress-status">Initializing...</span>
              <span class="mh-progress-count">0 / 0</span>
            </div>
            <div class="mh-progress-bar-bg">
              <div class="mh-progress-bar"></div>
            </div>
          </div>

          <div class="mh-log-container"></div>
        </div>
        <div class="mh-controls">
          <button class="mh-btn mh-btn-secondary mh-close-action">Close</button>
          <button class="mh-btn mh-btn-primary mh-submit-action">Add Friends</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    // Event Listeners for Open/Close Modal
    const openModal = () => modal.classList.add('active');
    const closeModal = () => {
      if (modal.classList.contains('active')) {
        modal.classList.remove('active');
      }
    };

    fab.addEventListener('click', openModal);
    modal.querySelector('.mh-modal-close-btn').addEventListener('click', closeModal);
    modal.querySelector('.mh-close-action').addEventListener('click', closeModal);
    
    // Close on click outside modal content
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Form Submission Action
    const submitBtn = modal.querySelector('.mh-submit-action');
    const closeActionBtn = modal.querySelector('.mh-close-action');
    const textarea = modal.querySelector('.mh-textarea');
    const progressContainer = modal.querySelector('.mh-progress-container');
    const progressBar = modal.querySelector('.mh-progress-bar');
    const progressStatus = modal.querySelector('.mh-progress-status');
    const progressCount = modal.querySelector('.mh-progress-count');
    const logContainer = modal.querySelector('.mh-log-container');

    let isProcessing = false;

    submitBtn.addEventListener('click', async () => {
      if (isProcessing) return;

      // Extract Hunter IDs
      const rawText = textarea.value;
      const hunterIds = rawText
        .split(/[,\s\n]+/)
        .map(id => id.trim())
        .filter(id => /^\d+$/.test(id)); // Only digits

      if (hunterIds.length === 0) {
        alert('Please enter at least one valid numeric Hunter ID.');
        return;
      }

      // Start Processing UI
      isProcessing = true;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Processing...';
      closeActionBtn.disabled = true;
      textarea.disabled = true;
      
      progressContainer.style.display = 'flex';
      logContainer.style.display = 'flex';
      logContainer.innerHTML = '';
      
      progressBar.style.width = '0%';
      progressStatus.textContent = 'Starting requests...';
      progressCount.textContent = `0 / ${hunterIds.length}`;

      const uh = user.unique_hash;

      for (let i = 0; i < hunterIds.length; i++) {
        const id = hunterIds[i];
        
        // Update current progress text
        progressStatus.textContent = `Processing Hunter ID ${id}...`;
        progressCount.textContent = `${i} / ${hunterIds.length}`;
        progressBar.style.width = `${(i / hunterIds.length) * 100}%`;

        // Create initial log item
        const logItem = document.createElement('div');
        logItem.className = 'mh-log-item';
        logItem.innerHTML = `
          <div class="mh-log-user-info">
            <span class="mh-log-text">Hunter ID ${id}</span>
          </div>
          <span class="mh-status-badge mh-status-resolving">Resolving...</span>
        `;
        logContainer.appendChild(logItem);
        logContainer.scrollTop = logContainer.scrollHeight;

        try {
          // Delay to respect Hitgrab server rate limit (800ms)
          if (i > 0) {
            await new Promise(resolve => setTimeout(resolve, 800));
          }

          // 1. Search Hunter by ID
          const searchRes = await searchHunterById(id, uh);
          
          if (!searchRes || !searchRes.success) {
            updateLogItem(logItem, `ID ${id} - Error`, 'mh-status-error', 'Not Found', null);
            continue;
          }

          const friend = searchRes.friend;
          if (!friend) {
            updateLogItem(logItem, `ID ${id} - Error`, 'mh-status-error', 'No Profile', null);
            continue;
          }

          const name = `${friend.firstname || ''} ${friend.lastname || ''}`.trim() || friend.name || `Hunter ${id}`;
          const avatar = friend.profile_pic || 'https://www.mousehuntgame.com/images/ui/friends/anonymous_user.png';
          const snUserId = friend.sn_user_id;
          const relationship = friend.user_interactions?.relationship;

          if (!snUserId) {
            updateLogItem(logItem, name, 'mh-status-error', 'No SNUID', avatar, id);
            continue;
          }

          // 2. Filter by relationship status (should be "none")
          if (!relationship || relationship.status !== 'none') {
            const relStatus = relationship?.status || 'unknown';
            let displayStatus = relStatus.charAt(0).toUpperCase() + relStatus.slice(1);
            if (relationship?.is_pending) displayStatus = 'Pending';
            
            updateLogItem(logItem, name, 'mh-status-skipped', `Skipped (${displayStatus})`, avatar, id);
            continue;
          }

          // 3. Send Friend Request
          const sendRequestRes = await sendFriendRequestAjax(snUserId, uh);
          
          if (sendRequestRes && sendRequestRes.success) {
            updateLogItem(logItem, name, 'mh-status-sent', 'Request Sent', avatar, id);
          } else {
            const errorMsg = sendRequestRes?.error || 'Failed to send';
            updateLogItem(logItem, name, 'mh-status-error', errorMsg, avatar, id);
          }

        } catch (error) {
          console.error(`Error processing ID ${id}:`, error);
          updateLogItem(logItem, `ID ${id} - Error`, 'mh-status-error', 'Network Error', null);
        }
      }

      // Finish Processing UI
      progressBar.style.width = '100%';
      progressStatus.textContent = 'Completed bulk friend requests!';
      progressCount.textContent = `${hunterIds.length} / ${hunterIds.length}`;
      
      isProcessing = false;
      submitBtn.disabled = false;
      submitBtn.textContent = 'Add Friends';
      closeActionBtn.disabled = false;
      textarea.disabled = false;
    });
  };

  // Helper: Update log item element with resolved details
  const updateLogItem = (el, name, badgeClass, statusText, avatarUrl, hunterId = null) => {
    const avatarHtml = avatarUrl ? `<img class="mh-log-avatar" src="${avatarUrl}" alt="${name}">` : '';
    const idHtml = hunterId ? `<span class="mh-log-hunter-id">#${hunterId}</span>` : '';
    
    el.innerHTML = `
      <div class="mh-log-user-info">
        ${avatarHtml}
        <div>
          <span class="mh-log-text">${name}</span>
          ${idHtml}
        </div>
      </div>
      <span class="mh-status-badge ${badgeClass}">${statusText}</span>
    `;
  };

  // 3. AJAX request function: Search Hunter by ID
  async function searchHunterById(hunterId, uh) {
    const params = new URLSearchParams();
    params.append('sn', 'Hitgrab');
    params.append('hg_is_ajax', '1');
    params.append('action', 'community_search_by_id');
    params.append('user_id', hunterId);
    params.append('uh', uh);

    const response = await fetch('https://www.mousehuntgame.com/managers/ajax/pages/friends.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString()
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  // 4. AJAX request function: Send Friend Request
  async function sendFriendRequestAjax(snUserId, uh) {
    const params = new URLSearchParams();
    params.append('sn', 'Hitgrab');
    params.append('hg_is_ajax', '1');
    params.append('action', 'send_requests');
    params.append('sn_user_id', snUserId);
    params.append('uh', uh);

    const response = await fetch('https://www.mousehuntgame.com/managers/ajax/users/userfriendmanager.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString()
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  // 5. Initialize the Userscript
  const init = () => {
    injectFontsAndStyles();
    createUI();
  };

  // Wait for the document to be ready and target elements loaded
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})();

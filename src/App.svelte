<script lang="ts">
  import Sidebar from './lib/Sidebar.svelte'
  import EmailList from './lib/EmailList.svelte'
  import EmailDetail from './lib/EmailDetail.svelte'
  import { Sparkles } from 'lucide-svelte'
  import { folders, emails as initialEmails } from './lib/data'
  import type { Email, EmailFolder } from './lib/types'

  let emailList: Email[] = [...initialEmails]
  let selectedThreadId: string | null = null
  let activeFolder: EmailFolder = 'inbox'
  let showCompose = false
  let theme: 'light' | 'dark' = 'light'

  // Apply theme class to document root
  $: {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  $: visibleEmails = emailList.filter((e) => e.folder === activeFolder)
  $: selectedThreadEmails = selectedThreadId
    ? emailList
        .filter((e) => e.threadId === selectedThreadId)
        .sort((a, b) => a.id.localeCompare(b.id))
    : []

  // Whether to show the email list (hidden when an email is selected on narrow screens)
  $: showList = selectedThreadId === null

  function handleSelect(threadId: string) {
    selectedThreadId = threadId
    // Mark all emails in thread as read
    emailList = emailList.map((e) =>
      e.threadId === threadId ? { ...e, read: true } : e,
    )
  }

  function handleToggleStar(id: string) {
    emailList = emailList.map((e) => (e.id === id ? { ...e, starred: !e.starred } : e))
  }

  function handleArchive(id: string) {
    const threadId = emailList.find((e) => e.id === id)?.threadId
    emailList = emailList.map((e) =>
      e.threadId === threadId ? { ...e, folder: 'archive' as EmailFolder } : e,
    )
    selectedThreadId = null
  }

  function handleDelete(id: string) {
    const threadId = emailList.find((e) => e.id === id)?.threadId
    emailList = emailList.map((e) =>
      e.threadId === threadId ? { ...e, folder: 'trash' as EmailFolder } : e,
    )
    selectedThreadId = null
  }

  function handleBack() {
    selectedThreadId = null
  }

  function handleFolderChange(folder: EmailFolder) {
    activeFolder = folder
    selectedThreadId = null
  }

  function handleCompose() {
    showCompose = true
  }

  function toggleTheme() {
    theme = theme === 'light' ? 'dark' : 'light'
  }

  // Update folder counts dynamically
  $: folderCounts = folders.map((f) => ({
    ...f,
    count:
      f.id === 'inbox'
        ? emailList.filter((e) => e.folder === 'inbox' && !e.read).length
        : f.id === 'starred'
          ? emailList.filter((e) => e.starred).length
          : emailList.filter((e) => e.folder === f.id).length,
  }))
</script>

<div class="app-container">
  <Sidebar
    folders={folderCounts}
    {activeFolder}
    onFolderChange={handleFolderChange}
    onCompose={handleCompose}
    {theme}
    onToggleTheme={toggleTheme}
  />
  <div class="main-content" class:show-detail={!showList}>
    <div class="list-pane" class:hidden={!showList}>
      <EmailList
        emails={visibleEmails}
        {selectedThreadId}
        onSelect={handleSelect}
        onToggleStar={handleToggleStar}
      />
    </div>
    <div class="detail-pane" class:visible={!showList}>
      <EmailDetail
        threadEmails={selectedThreadEmails}
        onToggleStar={handleToggleStar}
        onArchive={handleArchive}
        onDelete={handleDelete}
        onBack={handleBack}
      />
    </div>
  </div>
</div>

{#if showCompose}
  <svelte:window on:keydown={(e) => e.key === 'Escape' && (showCompose = false)} />
  <div class="compose-modal-backdrop">
    <!-- Backdrop click target -->
    <button class="backdrop-close" on:click={() => (showCompose = false)} aria-label="Close dialog"></button>
    <div class="compose-modal">
      <div class="compose-header">
        <h3>New Message</h3>
        <button class="compose-close" on:click={() => (showCompose = false)} aria-label="Close">×</button>
      </div>
      <div class="compose-fields">
        <input type="text" placeholder="To" class="compose-input" />
        <input type="text" placeholder="Subject" class="compose-input" />
        <textarea placeholder="Write your message..." rows="10" class="compose-textarea"></textarea>
      </div>
      <div class="compose-footer">
        <button class="compose-send">
          Send
        </button>
        <button class="compose-ai">
          <Sparkles size={14} />
          Generate with AI
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .app-container {
    display: flex;
    height: 100vh;
    overflow: hidden;
  }

  .main-content {
    flex: 1;
    display: flex;
    overflow: hidden;
    position: relative;
  }

  .list-pane {
    display: flex;
    transition: opacity 0.2s;
  }

  .detail-pane {
    flex: 1;
    display: flex;
  }

  /* On narrow screens: hide list when detail is open */
  @media (max-width: 900px) {
    .list-pane.hidden {
      display: none;
    }

    .detail-pane {
      display: none;
    }

    .detail-pane.visible {
      display: flex;
    }
  }

  /* On wider screens: always show both side by side */
  @media (min-width: 901px) {
    .list-pane.hidden {
      display: flex;
    }

    .detail-pane {
      display: flex;
    }

    .detail-pane.visible {
      display: flex;
    }
  }

  .compose-modal-backdrop {
    position: fixed;
    inset: 0;
    background: var(--backdrop);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    animation: fade-in 0.2s;
  }

  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .compose-modal {
    background: var(--bg-compose);
    border-radius: 14px;
    width: 600px;
    max-width: 90vw;
    box-shadow: var(--shadow-modal);
    animation: slide-up 0.25s;
    transition: background-color 0.3s;
  }

  @keyframes slide-up {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  .compose-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid var(--border-light);
  }

  .compose-header h3 {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
  }

  .compose-close {
    border: none;
    background: transparent;
    font-size: 24px;
    color: var(--text-faint);
    cursor: pointer;
    line-height: 1;
    padding: 0 4px;
  }

  .compose-close:hover {
    color: var(--text-muted);
  }

  .compose-fields {
    padding: 16px 20px;
  }

  .compose-input {
    width: 100%;
    padding: 10px 0;
    border: none;
    border-bottom: 1px solid var(--border-input);
    font-size: 14px;
    color: var(--text-secondary);
    outline: none;
    background: transparent;
  }

  .compose-input::placeholder {
    color: var(--text-faint);
  }

  .compose-input:focus {
    border-bottom-color: var(--accent);
  }

  .compose-textarea {
    width: 100%;
    border: 1px solid var(--border-input);
    border-radius: 10px;
    padding: 12px;
    font-size: 14px;
    line-height: 1.6;
    color: var(--text-secondary);
    background: var(--bg-compose);
    outline: none;
    resize: vertical;
    font-family: inherit;
    margin-top: 12px;
  }

  .compose-textarea:focus {
    border-color: var(--accent);
  }

  .compose-footer {
    display: flex;
    gap: 8px;
    padding: 0 20px 16px;
    justify-content: flex-end;
  }

  .compose-send {
    padding: 9px 24px;
    background: var(--accent);
    color: var(--text-on-primary);
    border: none;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }

  .compose-send:hover {
    background: var(--accent-hover);
  }

  .compose-ai {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 9px 18px;
    background: var(--bg-compose-footer);
    color: var(--text-secondary);
    border: 1px solid var(--border-input);
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }

  .compose-ai:hover {
    background: var(--bg-hover);
  }
</style>


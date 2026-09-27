<script lang="ts">
  import {
    Inbox,
    Star,
    Send,
    FileText,
    Archive,
    Trash2,
    PenSquare,
    Settings,
    Sparkles,
    Sun,
    Moon,
  } from 'lucide-svelte'
  import type { EmailFolder } from './types'

  export let folders: { id: EmailFolder; name: string; count: number }[]
  export let activeFolder: EmailFolder
  export let onFolderChange: (folder: EmailFolder) => void
  export let onCompose: () => void
  export let theme: 'light' | 'dark'
  export let onToggleTheme: () => void

  const iconMap: Record<string, typeof Inbox> = {
    inbox: Inbox,
    starred: Star,
    sent: Send,
    drafts: FileText,
    archive: Archive,
    trash: Trash2,
  }

  const labels = [
    { name: 'Work', color: '#2563eb' },
    { name: 'Personal', color: '#16a34a' },
    { name: 'Important', color: '#dc2626' },
    { name: 'Design', color: '#db2777' },
    { name: 'GitHub', color: '#6b7280' },
  ]
</script>

<aside class="sidebar">
  <div class="compose-section">
    <button class="compose-btn" on:click={onCompose}>
      <PenSquare size={18} />
      <span>Compose</span>
    </button>
  </div>

  <nav class="folder-nav">
    {#each folders as folder}
      <button
        class="folder-item"
        class:active={activeFolder === folder.id}
        on:click={() => onFolderChange(folder.id)}
      >
        <div class="folder-left">
          {#if folder.id === 'starred'}
            <Star size={18} class="folder-icon" />
          {:else}
            <svelte:component this={iconMap[folder.id]} size={18} class="folder-icon" />
          {/if}
          <span class="folder-name">{folder.name}</span>
        </div>
        {#if folder.count > 0}
          <span class="folder-count" class:unread={folder.id === 'inbox' && folder.count > 0}>
            {folder.count}
          </span>
        {/if}
      </button>
    {/each}
  </nav>

  <div class="labels-section">
    <div class="section-title">Labels</div>
    {#each labels as label}
      <button class="label-item">
        <span class="label-dot" style="background-color: {label.color}"></span>
        <span class="label-name">{label.name}</span>
      </button>
    {/each}
  </div>

  <div class="ai-section">
    <div class="ai-card">
      <Sparkles size={20} class="ai-icon" />
      <div class="ai-title">AI Assistant</div>
      <div class="ai-desc">Summarize, draft replies, and triage your inbox automatically.</div>
      <button class="ai-btn">Try AI Triage</button>
    </div>
  </div>

  <div class="sidebar-footer">
    <button class="theme-btn" on:click={onToggleTheme}>
      {#if theme === 'light'}
        <Moon size={18} />
        <span>Dark Mode</span>
      {:else}
        <Sun size={18} />
        <span>Light Mode</span>
      {/if}
    </button>
    <button class="settings-btn">
      <Settings size={18} />
      <span>Settings</span>
    </button>
  </div>
</aside>

<style>
  .sidebar {
    width: 260px;
    min-width: 260px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: var(--bg-sidebar);
    border-right: 1px solid var(--border);
    overflow-y: auto;
    transition: background-color 0.3s, border-color 0.3s;
  }

  .compose-section {
    padding: 16px 12px 8px;
  }

  .compose-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 11px 16px;
    background: var(--accent);
    color: var(--text-on-primary);
    border: none;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, box-shadow 0.2s;
    box-shadow: 0 1px 3px var(--shadow-primary);
  }

  .compose-btn:hover {
    background: var(--accent-hover);
    box-shadow: 0 2px 8px var(--shadow-primary-hover);
  }

  .folder-nav {
    padding: 4px 8px;
  }

  .folder-item {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px;
    border: none;
    background: transparent;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    color: var(--text-secondary);
    transition: background 0.15s;
    margin-bottom: 1px;
  }

  .folder-item:hover {
    background: var(--bg-hover);
  }

  .folder-item.active {
    background: var(--accent-active-bg);
    color: var(--accent);
    font-weight: 600;
  }

  .folder-item.active :global(.folder-icon) {
    color: var(--accent);
  }

  .folder-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  :global(.folder-icon) {
    color: var(--text-muted);
    flex-shrink: 0;
  }

  .folder-name {
    line-height: 1;
  }

  .folder-count {
    font-size: 12px;
    color: var(--text-muted);
    font-weight: 500;
  }

  .folder-count.unread {
    background: var(--accent);
    color: var(--text-on-primary);
    padding: 1px 7px;
    border-radius: 10px;
    font-weight: 600;
  }

  .labels-section {
    padding: 12px 8px 4px;
    margin-top: 8px;
  }

  .section-title {
    font-size: 11px;
    font-weight: 600;
    color: var(--text-faint);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 0 12px 6px;
  }

  .label-item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 7px 12px;
    border: none;
    background: transparent;
    border-radius: 8px;
    cursor: pointer;
    font-size: 13px;
    color: var(--text-secondary);
    transition: background 0.15s;
  }

  .label-item:hover {
    background: var(--bg-hover);
  }

  .label-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .ai-section {
    padding: 12px;
    margin-top: auto;
  }

  .ai-card {
    background: var(--bg-ai-gradient);
    border: 1px solid var(--border-ai);
    border-radius: 12px;
    padding: 16px;
    text-align: center;
    transition: background 0.3s, border-color 0.3s;
  }

  :global(.ai-icon) {
    color: var(--accent);
    margin: 0 auto 8px;
  }

  .ai-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-ai-title);
    margin-bottom: 4px;
  }

  .ai-desc {
    font-size: 12px;
    color: var(--text-ai-desc);
    line-height: 1.4;
    margin-bottom: 12px;
  }

  .ai-btn {
    width: 100%;
    padding: 7px 12px;
    background: var(--accent);
    color: var(--text-on-primary);
    border: none;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }

  .ai-btn:hover {
    background: var(--accent-hover);
  }

  .sidebar-footer {
    padding: 8px 12px 12px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .theme-btn,
  .settings-btn {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 12px;
    border: none;
    background: transparent;
    border-radius: 8px;
    cursor: pointer;
    font-size: 13px;
    color: var(--text-muted);
    transition: background 0.15s;
  }

  .theme-btn:hover,
  .settings-btn:hover {
    background: var(--bg-hover);
  }
</style>

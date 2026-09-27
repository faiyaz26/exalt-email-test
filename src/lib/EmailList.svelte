<script lang="ts">
  import { Star, Search, Archive, Trash2, MailOpen, ChevronRight } from 'lucide-svelte'
  import type { Email, EmailCategory } from './types'

  export let emails: Email[]
  export let selectedThreadId: string | null
  export let onSelect: (threadId: string) => void
  export let onToggleStar: (id: string) => void

  let searchQuery = ''
  let activeCategory: EmailCategory = 'all'

  // Group emails by threadId, pick the latest email per thread
  function buildThreadGroups(emails: Email[]): { threadId: string; latest: Email; count: number; emails: Email[] }[] {
    const groups = new Map<string, Email[]>()
    for (const e of emails) {
      const arr = groups.get(e.threadId) ?? []
      arr.push(e)
      groups.set(e.threadId, arr)
    }
    const result: { threadId: string; latest: Email; count: number; emails: Email[] }[] = []
    for (const [threadId, arr] of groups) {
      const sorted = [...arr].sort((a, b) => b.id.localeCompare(a.id))
      result.push({ threadId, latest: sorted[0], count: sorted.length, emails: sorted })
    }
    return result.sort((a, b) => b.latest.id.localeCompare(a.latest.id))
  }

  $: threadGroups = buildThreadGroups(emails)

  $: categoryCounts = {
    all: threadGroups.length,
    work: threadGroups.filter((t) => t.latest.category === 'work').length,
    personal: threadGroups.filter((t) => t.latest.category === 'personal').length,
    updates: threadGroups.filter((t) => t.latest.category === 'updates').length,
    promotions: threadGroups.filter((t) => t.latest.category === 'promotions').length,
  } as Record<EmailCategory, number>

  $: filteredThreads = threadGroups.filter((t) => {
    const matchesSearch =
      t.latest.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.latest.from.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.latest.preview.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === 'all' || t.latest.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const categoryList: { id: EmailCategory; name: string }[] = [
    { id: 'all', name: 'All' },
    { id: 'work', name: 'Work' },
    { id: 'personal', name: 'Personal' },
    { id: 'updates', name: 'Updates' },
    { id: 'promotions', name: 'Promotions' },
  ]

  function getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }
</script>

<section class="email-list">
  <div class="list-header">
    <div class="header-top">
      <h1 class="title">Inbox</h1>
      <div class="header-actions">
        <button class="icon-action" title="Mark all as read">
          <MailOpen size={18} />
        </button>
        <button class="icon-action" title="Archive all">
          <Archive size={18} />
        </button>
        <button class="icon-action" title="Delete all">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
    <div class="search-bar">
      <Search size={16} class="search-icon" />
      <input
        type="text"
        placeholder="Search email..."
        bind:value={searchQuery}
      />
    </div>
    <div class="category-tabs">
      {#each categoryList as cat}
        <button
          class="category-tab"
          class:active={activeCategory === cat.id}
          on:click={() => (activeCategory = cat.id)}
        >
          {cat.name}
          {#if categoryCounts[cat.id] > 0}
            <span class="category-count">{categoryCounts[cat.id]}</span>
          {/if}
        </button>
      {/each}
    </div>
  </div>

  <div class="email-items">
    {#each filteredThreads as thread (thread.threadId)}
      {@const email = thread.latest}
      {@const hasUnread = thread.emails.some((e) => !e.read)}
      <button
        class="email-item"
        class:active={selectedThreadId === thread.threadId}
        class:unread={hasUnread}
        on:click={() => onSelect(thread.threadId)}
      >
        <div class="avatar" style="background-color: {email.from.avatarColor}">
          {getInitials(email.from.name)}
        </div>
        <div class="email-content">
          <div class="email-top-row">
            <span class="email-from">{email.from.name}</span>
            <div class="email-meta">
              {#if hasUnread}
                <span class="unread-dot"></span>
              {/if}
              <span class="email-date" class:unread={hasUnread}>{email.date}</span>
            </div>
          </div>
          <div class="email-subject" class:unread={hasUnread}>
            {email.subject}
            {#if thread.count > 1}
              <span class="thread-count">({thread.count})</span>
            {/if}
          </div>
          <div class="email-preview">{email.preview}</div>
          <div class="email-bottom-row">
            <div class="email-labels">
              {#each email.labels as label}
                <span class="email-label">{label}</span>
              {/each}
            </div>
            <div class="email-bottom-actions">
              {#if thread.count > 1}
                <span class="thread-badge">
                  <ChevronRight size={13} />
                  {thread.count} in thread
                </span>
              {/if}
              {#if email.attachments && email.attachments.length > 0}
                <span class="has-attachment" title="Has attachment">
                  <MailOpen size={13} />
                </span>
              {/if}
              <button
                class="star-btn"
                class:starred={email.starred}
                on:click|stopPropagation={() => onToggleStar(email.id)}
              >
                <Star size={15} fill={email.starred ? 'var(--star)' : 'none'} />
              </button>
            </div>
          </div>
        </div>
      </button>
    {:else}
      <div class="empty-list">
        <MailOpen size={32} class="empty-icon" />
        <p>No emails found</p>
      </div>
    {/each}
  </div>
</section>

<style>
  .email-list {
    width: 420px;
    min-width: 380px;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--bg-main);
    border-right: 1px solid var(--border);
    transition: background-color 0.3s, border-color 0.3s;
  }

  .list-header {
    padding: 16px 16px 0;
    border-bottom: 1px solid var(--border-light);
  }

  .header-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  .title {
    font-size: 22px;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0;
  }

  .header-actions {
    display: flex;
    gap: 4px;
  }

  .icon-action {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 7px;
    border: none;
    background: transparent;
    border-radius: 8px;
    cursor: pointer;
    color: var(--text-muted);
    transition: background 0.15s, color 0.15s;
  }

  .icon-action:hover {
    background: var(--bg-hover);
    color: var(--text-secondary);
  }

  .search-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: var(--bg-input);
    border-radius: 10px;
    margin-bottom: 10px;
  }

  :global(.search-icon) {
    color: var(--text-faint);
    flex-shrink: 0;
  }

  .search-bar input {
    width: 100%;
    border: none;
    background: transparent;
    font-size: 13px;
    outline: none;
    color: var(--text-secondary);
  }

  .search-bar input::placeholder {
    color: var(--text-faint);
  }

  .category-tabs {
    display: flex;
    gap: 2px;
    overflow-x: auto;
    padding-bottom: 10px;
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .category-tabs::-webkit-scrollbar {
    display: none;
  }

  .category-tab {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 6px 12px;
    border: none;
    background: transparent;
    border-radius: 8px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    color: var(--text-muted);
    white-space: nowrap;
    transition: background 0.15s, color 0.15s;
  }

  .category-tab:hover {
    background: var(--bg-hover);
    color: var(--text-secondary);
  }

  .category-tab.active {
    background: var(--accent-active-bg);
    color: var(--accent);
    font-weight: 600;
  }

  .category-count {
    font-size: 11px;
    padding: 0px 6px;
    border-radius: 8px;
    background: var(--bg-input);
    color: var(--text-faint);
    font-weight: 500;
  }

  .category-tab.active .category-count {
    background: var(--accent);
    color: var(--text-on-primary);
  }

  .email-items {
    flex: 1;
    overflow-y: auto;
  }

  .email-item {
    display: flex;
    gap: 12px;
    width: 100%;
    text-align: left;
    padding: 12px 16px;
    border: none;
    border-bottom: 1px solid var(--border-light);
    background: transparent;
    cursor: pointer;
    transition: background 0.15s;
  }

  .email-item:hover {
    background: var(--bg-hover);
  }

  .email-item.active {
    background: var(--bg-active);
    border-left: 3px solid var(--border-active);
    padding-left: 13px;
  }

  .avatar {
    width: 40px;
    height: 40px;
    min-width: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    flex-shrink: 0;
  }

  .email-content {
    flex: 1;
    min-width: 0;
  }

  .email-top-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2px;
  }

  .email-from {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .email-item.unread .email-from {
    font-weight: 700;
    color: var(--text-primary);
  }

  .email-meta {
    display: flex;
    align-items: center;
    gap: 5px;
    flex-shrink: 0;
  }

  .unread-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--accent);
  }

  .email-date {
    font-size: 12px;
    color: var(--text-faint);
    white-space: nowrap;
  }

  .email-date.unread {
    color: var(--accent);
    font-weight: 600;
  }

  .email-subject {
    font-size: 13px;
    color: var(--text-muted);
    margin-bottom: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .email-subject.unread {
    font-weight: 600;
    color: var(--text-primary);
  }

  .thread-count {
    font-size: 11px;
    color: var(--text-faint);
    font-weight: 400;
  }

  .email-preview {
    font-size: 12px;
    color: var(--text-faint);
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .email-bottom-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 6px;
  }

  .email-labels {
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
  }

  .email-label {
    font-size: 10px;
    font-weight: 500;
    padding: 2px 8px;
    border-radius: 10px;
    background: var(--bg-label);
    color: var(--text-muted);
  }

  .email-bottom-actions {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .thread-badge {
    display: flex;
    align-items: center;
    gap: 2px;
    font-size: 10px;
    font-weight: 500;
    color: var(--accent);
    background: var(--bg-detail-label);
    padding: 2px 7px;
    border-radius: 8px;
  }

  .has-attachment {
    display: flex;
    color: var(--text-faint);
  }

  .star-btn {
    display: flex;
    align-items: center;
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 2px;
    color: var(--text-faint);
    transition: color 0.15s;
  }

  .star-btn:hover {
    color: var(--star);
  }

  .star-btn.starred {
    color: var(--star);
  }

  .empty-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 16px;
    color: var(--text-faint);
  }

  :global(.empty-icon) {
    margin-bottom: 8px;
    color: var(--text-faint);
  }

  .empty-list p {
    font-size: 14px;
    margin: 0;
  }
</style>

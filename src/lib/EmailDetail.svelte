<script lang="ts">
  import {
    Star,
    Reply,
    Forward,
    Archive,
    Trash2,
    Sparkles,
    Send,
    Paperclip,
    Clock,
    CheckCircle2,
    Calendar,
    FileText,
    ChevronLeft,
    ChevronDown,
    ChevronUp,
} from 'lucide-svelte'
  import type { Email } from './types'

  export let threadEmails: Email[]
  export let onToggleStar: (id: string) => void
  export let onArchive: (id: string) => void
  export let onDelete: (id: string) => void
  export let onBack: () => void

  let showAIReply = false
  let aiReplyText = ''
  let aiGenerating = false
  let showSummary = true

  // Track which messages are expanded in the thread
  let collapsed: Set<string> = new Set()

  $: primaryEmail = threadEmails.length > 0 ? threadEmails[threadEmails.length - 1] : null

  function generateAIReply() {
    aiGenerating = true
    showAIReply = true
    aiReplyText = ''
    setTimeout(() => {
      if (primaryEmail) {
        aiReplyText = `Hi ${primaryEmail.from.name.split(' ')[0]},

Thanks for reaching out. I've reviewed your message and wanted to get back to you quickly.

I'll take a closer look and follow up by end of day with more detailed thoughts. Let me know if there's anything urgent that needs immediate attention.

Best regards`
      }
      aiGenerating = false
    }, 1200)
  }

  function toggleCollapse(id: string) {
    const newSet = new Set(collapsed)
    if (newSet.has(id)) {
      newSet.delete(id)
    } else {
      newSet.add(id)
    }
    collapsed = newSet
  }

  function getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase()
  }

  $: summaryText = primaryEmail
    ? `AI Summary — ${threadEmails.length} message${threadEmails.length > 1 ? 's' : ''} in this thread`
    : ''
</script>

{#if primaryEmail}
  <section class="email-detail">
    <div class="detail-toolbar">
      <button class="toolbar-btn back-btn" on:click={onBack} title="Back to inbox">
        <ChevronLeft size={18} />
        <span class="back-text">Back</span>
      </button>
      <div class="toolbar-divider"></div>
      <button class="toolbar-btn" on:click={() => onArchive(primaryEmail.id)} title="Archive">
        <Archive size={18} />
      </button>
      <button class="toolbar-btn" on:click={() => onDelete(primaryEmail.id)} title="Delete">
        <Trash2 size={18} />
      </button>
      <button
        class="toolbar-btn"
        class:starred={primaryEmail.starred}
        on:click={() => onToggleStar(primaryEmail.id)}
        title="Star"
      >
        <Star size={18} fill={primaryEmail.starred ? 'var(--star)' : 'none'} />
      </button>
      <div class="toolbar-spacer"></div>
    </div>

    <div class="detail-scroll">
      <!-- AI Summary Card -->
      {#if showSummary}
        <div class="ai-summary-card">
          <div class="ai-summary-header">
            <Sparkles size={16} class="ai-spark" />
            <span class="ai-summary-title">{summaryText}</span>
            <button class="ai-summary-toggle" on:click={() => (showSummary = false)}>
              Dismiss
            </button>
          </div>
          <div class="ai-summary-body">
            <div class="summary-item">
              <CheckCircle2 size={14} class="summary-icon green" />
              <span>Q4 revenue grew 34% YoY, beating target by 8%</span>
            </div>
            <div class="summary-item">
              <CheckCircle2 size={14} class="summary-icon green" />
              <span>Enterprise accounts added $2.1M in new ARR</span>
            </div>
            <div class="summary-item">
              <CheckCircle2 size={14} class="summary-icon green" />
              <span>Churn dropped from 2.8% to 1.2%</span>
            </div>
            <div class="summary-item">
              <Clock size={14} class="summary-icon blue" />
              <span>Action needed: Review report before board meeting (EOD Friday)</span>
            </div>
            {#if threadEmails.length > 1}
              <div class="summary-item">
                <CheckCircle2 size={14} class="summary-icon green" />
                <span>{threadEmails.length} messages in thread — you replied {threadEmails.length - 1} time{threadEmails.length - 1 > 1 ? 's' : ''}</span>
              </div>
            {/if}
          </div>
          <div class="ai-summary-actions">
            <button class="ai-action-btn" on:click={generateAIReply}>
              <Sparkles size={14} />
              Generate AI Reply
            </button>
            <button class="ai-action-btn secondary">
              <Calendar size={14} />
              Schedule Follow-up
            </button>
          </div>
        </div>
      {/if}

      <!-- Thread Subject -->
      <div class="detail-subject-section">
        <h1 class="detail-subject">{primaryEmail.subject}</h1>
        <div class="detail-labels">
          {#each primaryEmail.labels as label}
            <span class="detail-label">{label}</span>
          {/each}
          {#if threadEmails.length > 1}
            <span class="detail-label thread-label">{threadEmails.length} messages</span>
          {/if}
        </div>
      </div>

      <!-- Thread Messages -->
      <div class="thread-container">
        {#each threadEmails as email, i}
          <div class="thread-message" class:collapsed={collapsed.has(email.id)}>
            <!-- Collapsed header -->
            {#if collapsed.has(email.id)}
              <button class="collapsed-header" on:click={() => toggleCollapse(email.id)}>
                <div class="avatar-sm" style="background-color: {email.from.avatarColor}">
                  {getInitials(email.from.name)}
                </div>
                <span class="collapsed-from">{email.from.name}</span>
                <span class="collapsed-date">{email.date}</span>
                <ChevronDown size={16} class="collapse-icon" />
              </button>
            {:else}
              <!-- Expanded message -->
              <div class="message-header">
                <div class="avatar" style="background-color: {email.from.avatarColor}">
                  {getInitials(email.from.name)}
                </div>
                <div class="sender-details">
                  <div class="sender-top">
                    <span class="sender-name">{email.from.name}</span>
                    <span class="sender-date">{email.date}</span>
                  </div>
                  <div class="sender-email">{email.from.email}</div>
                  <div class="sender-to">to me</div>
                </div>
                {#if threadEmails.length > 1 && i < threadEmails.length - 1}
                  <button class="collapse-toggle" on:click={() => toggleCollapse(email.id)} title="Collapse">
                    <ChevronUp size={16} />
                  </button>
                {/if}
              </div>

              <div class="email-body">
                {#each email.body.split('\n') as paragraph}
                  {#if paragraph.trim()}
                    <p>{paragraph}</p>
                  {:else}
                    <br />
                  {/if}
                {/each}
              </div>

              <!-- Attachments -->
              {#if email.attachments && email.attachments.length > 0}
                <div class="attachments-section">
                  <div class="attachments-title">
                    <Paperclip size={16} />
                    <span>{email.attachments.length} Attachment{email.attachments.length > 1 ? 's' : ''}</span>
                  </div>
                  {#each email.attachments as att}
                    <div class="attachment-item">
                      <div class="attachment-icon">
                        <FileText size={20} />
                      </div>
                      <div class="attachment-info">
                        <div class="attachment-name">{att.name}</div>
                        <div class="attachment-size">{att.size}</div>
                      </div>
                      <button class="attachment-download">Download</button>
                    </div>
                  {/each}
                </div>
              {/if}
            {/if}
          </div>
        {/each}
      </div>

      <!-- AI Reply Box -->
      {#if showAIReply}
        <div class="ai-reply-box">
          <div class="ai-reply-header">
            <Sparkles size={16} class="ai-spark" />
            <span>AI-Generated Reply</span>
            <button class="ai-reply-close" on:click={() => (showAIReply = false)}>×</button>
          </div>
          <div class="ai-reply-body">
            {#if aiGenerating}
              <div class="ai-generating">
                <div class="generating-dots">
                  <span></span><span></span><span></span>
                </div>
                <span>Generating reply...</span>
              </div>
            {:else}
              <textarea bind:value={aiReplyText} rows="6"></textarea>
              <div class="ai-reply-actions">
                <button class="reply-action regenerate" on:click={generateAIReply}>
                  <Sparkles size={14} />
                  Regenerate
                </button>
                <button class="reply-action send">
                  <Send size={14} />
                  Send Reply
                </button>
              </div>
            {/if}
          </div>
        </div>
      {/if}

      <!-- Action Buttons -->
      <div class="detail-actions">
        <button class="action-btn primary" on:click={generateAIReply}>
          <Sparkles size={16} />
          AI Reply
        </button>
        <button class="action-btn">
          <Reply size={16} />
          Reply
        </button>
        <button class="action-btn">
          <Forward size={16} />
          Forward
        </button>
      </div>
    </div>
  </section>
{:else}
  <section class="email-detail empty">
    <div class="empty-detail">
      <div class="empty-icon-wrap">
        <Sparkles size={32} />
      </div>
      <h2>Select an email to read</h2>
      <p>Your AI assistant can summarize threads, draft replies, and help you triage your inbox faster.</p>
    </div>
  </section>
{/if}

<style>
  .email-detail {
    flex: 1;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--bg-main);
    transition: background-color 0.3s;
  }

  .email-detail.empty {
    align-items: center;
    justify-content: center;
  }

  .detail-toolbar {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 8px 20px;
    border-bottom: 1px solid var(--border-header);
    min-height: 48px;
  }

  .toolbar-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    border: none;
    background: transparent;
    border-radius: 8px;
    cursor: pointer;
    color: var(--text-muted);
    transition: background 0.15s, color 0.15s;
  }

  .toolbar-btn:hover {
    background: var(--bg-hover);
    color: var(--text-secondary);
  }

  .toolbar-btn.starred {
    color: var(--star);
  }

  .back-btn {
    gap: 4px;
    padding: 6px 10px;
  }

  .back-text {
    font-size: 13px;
    font-weight: 500;
  }

  .toolbar-divider {
    width: 1px;
    height: 20px;
    background: var(--border);
    margin: 0 4px;
  }

  .toolbar-spacer {
    flex: 1;
  }

  .detail-scroll {
    flex: 1;
    overflow-y: auto;
    padding: 20px 28px;
  }

  /* AI Summary */
  .ai-summary-card {
    background: var(--bg-summary-gradient);
    border: 1px solid var(--border-summary);
    border-radius: 14px;
    padding: 16px 18px;
    margin-bottom: 20px;
    transition: background 0.3s, border-color 0.3s;
  }

  .ai-summary-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
  }

  :global(.ai-spark) {
    color: var(--accent);
  }

  .ai-summary-title {
    font-size: 14px;
    font-weight: 600;
    color: var(--text-ai-title);
    flex: 1;
  }

  .ai-summary-toggle {
    font-size: 12px;
    color: var(--text-faint);
    border: none;
    background: transparent;
    cursor: pointer;
    padding: 2px 6px;
    border-radius: 4px;
  }

  .ai-summary-toggle:hover {
    color: var(--text-muted);
  }

  .ai-summary-body {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 14px;
  }

  .summary-item {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 13px;
    color: var(--text-secondary);
    line-height: 1.5;
  }

  :global(.summary-icon) {
    margin-top: 2px;
    flex-shrink: 0;
  }

  :global(.summary-icon.green) {
    color: #16a34a;
  }

  :global(.summary-icon.blue) {
    color: var(--accent);
  }

  .ai-summary-actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .ai-action-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px;
    border: none;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, opacity 0.2s;
    background: var(--accent);
    color: var(--text-on-primary);
  }

  .ai-action-btn:hover {
    background: var(--accent-hover);
  }

  .ai-action-btn.secondary {
    background: var(--bg-card);
    color: var(--text-secondary);
    border: 1px solid var(--border-input);
  }

  .ai-action-btn.secondary:hover {
    background: var(--bg-hover);
  }

  /* Subject */
  .detail-subject-section {
    margin-bottom: 20px;
  }

  .detail-subject {
    font-size: 22px;
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1.3;
    margin: 0 0 10px 0;
  }

  .detail-labels {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
  }

  .detail-label {
    font-size: 11px;
    font-weight: 500;
    padding: 3px 10px;
    border-radius: 12px;
    background: var(--bg-detail-label);
    color: var(--accent);
  }

  .thread-label {
    background: var(--accent);
    color: var(--text-on-primary);
  }

  /* Thread */
  .thread-container {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .thread-message {
    border-bottom: 1px solid var(--border-light);
    padding-bottom: 20px;
    margin-bottom: 20px;
  }

  .thread-message:last-of-type {
    border-bottom: none;
  }

  .collapsed-header {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 10px 14px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--bg-hover);
    cursor: pointer;
    transition: background 0.15s;
  }

  .collapsed-header:hover {
    background: var(--bg-input);
  }

  .avatar-sm {
    width: 28px;
    height: 28px;
    min-width: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 11px;
    font-weight: 600;
  }

  .collapsed-from {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-secondary);
    flex: 1;
    text-align: left;
  }

  .collapsed-date {
    font-size: 12px;
    color: var(--text-faint);
  }

  :global(.collapse-icon) {
    color: var(--text-muted);
  }

  .message-header {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    margin-bottom: 16px;
  }

  .collapse-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px;
    border: none;
    background: transparent;
    border-radius: 6px;
    cursor: pointer;
    color: var(--text-muted);
    transition: background 0.15s, color 0.15s;
    align-self: flex-start;
  }

  .collapse-toggle:hover {
    background: var(--bg-hover);
    color: var(--text-secondary);
  }

  .avatar {
    width: 44px;
    height: 44px;
    min-width: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 15px;
    font-weight: 600;
  }

  .sender-details {
    flex: 1;
  }

  .sender-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .sender-name {
    font-size: 15px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .sender-date {
    font-size: 12px;
    color: var(--text-faint);
  }

  .sender-email {
    font-size: 13px;
    color: var(--text-muted);
    margin-top: 2px;
  }

  .sender-to {
    font-size: 12px;
    color: var(--text-faint);
    margin-top: 2px;
  }

  /* Body */
  .email-body {
    font-size: 14px;
    line-height: 1.7;
    color: var(--text-secondary);
    white-space: pre-wrap;
  }

  .email-body p {
    margin: 0 0 12px 0;
  }

  /* Attachments */
  .attachments-section {
    margin-top: 20px;
  }

  .attachments-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-secondary);
    margin-bottom: 12px;
  }

  .attachment-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border: 1px solid var(--border);
    border-radius: 10px;
    margin-bottom: 8px;
    transition: border-color 0.15s;
  }

  .attachment-item:hover {
    border-color: var(--border-ai);
  }

  .attachment-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: var(--bg-attachment-icon);
    border-radius: 8px;
    color: var(--accent);
    flex-shrink: 0;
  }

  .attachment-info {
    flex: 1;
  }

  .attachment-name {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-secondary);
  }

  .attachment-size {
    font-size: 12px;
    color: var(--text-faint);
  }

  .attachment-download {
    padding: 6px 14px;
    border: 1px solid var(--border-input);
    border-radius: 8px;
    background: var(--bg-card);
    color: var(--text-secondary);
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s;
  }

  .attachment-download:hover {
    background: var(--bg-hover);
  }

  /* AI Reply */
  .ai-reply-box {
    margin-top: 28px;
    border: 1px solid var(--border-reply);
    border-radius: 12px;
    overflow: hidden;
  }

  .ai-reply-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 16px;
    background: var(--bg-reply-header);
    font-size: 13px;
    font-weight: 600;
    color: var(--text-reply-header);
  }

  .ai-reply-close {
    margin-left: auto;
    border: none;
    background: transparent;
    font-size: 20px;
    color: var(--text-faint);
    cursor: pointer;
    line-height: 1;
  }

  .ai-reply-close:hover {
    color: var(--text-muted);
  }

  .ai-reply-body {
    padding: 16px;
  }

  .ai-reply-body textarea {
    width: 100%;
    border: 1px solid var(--border-input);
    border-radius: 10px;
    padding: 12px;
    font-size: 14px;
    line-height: 1.6;
    color: var(--text-secondary);
    background: var(--bg-card);
    resize: vertical;
    outline: none;
    font-family: inherit;
  }

  .ai-reply-body textarea:focus {
    border-color: var(--accent);
  }

  .ai-reply-actions {
    display: flex;
    gap: 8px;
    margin-top: 10px;
  }

  .reply-action {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border: none;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  }

  .reply-action.regenerate {
    background: var(--bg-input);
    color: var(--text-secondary);
  }

  .reply-action.regenerate:hover {
    background: var(--bg-hover);
  }

  .reply-action.send {
    background: var(--accent);
    color: var(--text-on-primary);
  }

  .reply-action.send:hover {
    background: var(--accent-hover);
  }

  .ai-generating {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 20px;
    color: var(--text-muted);
    font-size: 14px;
  }

  .generating-dots {
    display: flex;
    gap: 4px;
  }

  .generating-dots span {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--accent);
    animation: dot-pulse 1.4s infinite ease-in-out;
  }

  .generating-dots span:nth-child(2) {
    animation-delay: 0.2s;
  }

  .generating-dots span:nth-child(3) {
    animation-delay: 0.4s;
  }

  @keyframes dot-pulse {
    0%, 80%, 100% { opacity: 0.3; }
    40% { opacity: 1; }
  }

  /* Actions */
  .detail-actions {
    display: flex;
    gap: 8px;
    margin-top: 28px;
    padding-top: 20px;
    border-top: 1px solid var(--border-light);
  }

  .action-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 9px 18px;
    border: 1px solid var(--border-input);
    border-radius: 10px;
    background: var(--bg-card);
    color: var(--text-secondary);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
  }

  .action-btn:hover {
    background: var(--bg-hover);
    border-color: var(--text-faint);
  }

  .action-btn.primary {
    background: var(--accent);
    color: var(--text-on-primary);
    border-color: var(--accent);
  }

  .action-btn.primary:hover {
    background: var(--accent-hover);
    border-color: var(--accent-hover);
  }

  /* Empty state */
  .empty-detail {
    text-align: center;
    max-width: 320px;
  }

  .empty-icon-wrap {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: var(--bg-empty-icon);
    color: var(--accent);
    margin-bottom: 20px;
    transition: background 0.3s;
  }

  .empty-detail h2 {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-secondary);
    margin: 0 0 8px 0;
  }

  .empty-detail p {
    font-size: 14px;
    color: var(--text-faint);
    line-height: 1.6;
    margin: 0;
  }

  /* Responsive: on narrow screens, detail takes full width */
  @media (max-width: 768px) {
    .detail-scroll {
      padding: 16px 20px;
    }
  }
</style>

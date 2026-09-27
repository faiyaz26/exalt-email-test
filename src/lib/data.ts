import type { Email, Folder, Category } from './types'

export const folders: Folder[] = [
  { id: 'inbox', name: 'Inbox', icon: 'inbox', count: 12 },
  { id: 'starred', name: 'Starred', icon: 'star', count: 3 },
  { id: 'sent', name: 'Sent', icon: 'send', count: 0 },
  { id: 'drafts', name: 'Drafts', icon: 'draft', count: 2 },
  { id: 'archive', name: 'Archive', icon: 'archive', count: 0 },
  { id: 'trash', name: 'Trash', icon: 'trash', count: 0 },
]

export const categories: Category[] = [
  { id: 'all', name: 'All', count: 12 },
  { id: 'work', name: 'Work', count: 5 },
  { id: 'personal', name: 'Personal', count: 3 },
  { id: 'updates', name: 'Updates', count: 3 },
  { id: 'promotions', name: 'Promotions', count: 1 },
]

const avatarColors = [
  '#2563eb', '#16a34a', '#dc2626', '#d97706', '#0891b2',
  '#7c3aed', '#db2777', '#ea580c',
]

export const emails: Email[] = [
  {
    id: '1',
    threadId: 'thread-1',
    from: { name: 'Sarah Chen', email: 'sarah.chen@stripe.com', avatarColor: avatarColors[0] },
    subject: 'Q4 Revenue Report — Final Review Needed',
    preview: 'Hi team, I\'ve attached the final Q4 revenue report with all the updates we discussed in last week\'s sync...',
    body: `Hi team,

I've attached the final Q4 revenue report with all the updates we discussed in last week's sync. Key highlights:

• Revenue up 34% YoY, exceeding our target by 8%
• New enterprise accounts contributed $2.1M in ARR
• Churn rate dropped to 1.2% (down from 2.8% last quarter)

Please review by EOD Friday so we can finalize before the board meeting. Happy to jump on a call if anything needs clarification.

Best,
Sarah`,
    date: '2:34 PM',
    read: false,
    starred: true,
    folder: 'inbox',
    labels: ['Work', 'Important'],
    category: 'work',
    attachments: [{ name: 'Q4-Revenue-Report.pdf', size: '2.4 MB' }],
  },
  {
    id: '1b',
    threadId: 'thread-1',
    from: { name: 'You', email: 'me@gmail.com', avatarColor: avatarColors[3] },
    subject: 'Re: Q4 Revenue Report — Final Review Needed',
    preview: 'Thanks Sarah, I\'ll review the report this afternoon and send feedback before EOD.',
    body: `Thanks Sarah,

I'll review the report this afternoon and send feedback before EOD. The churn numbers look really promising — great work from the customer success team.

Let me know if you'd like to schedule a quick sync before the board meeting.

Best`,
    date: '3:02 PM',
    read: true,
    starred: false,
    folder: 'inbox',
    labels: ['Work'],
    category: 'work',
  },
  {
    id: '1c',
    threadId: 'thread-1',
    from: { name: 'Sarah Chen', email: 'sarah.chen@stripe.com', avatarColor: avatarColors[0] },
    subject: 'Re: Q4 Revenue Report — Final Review Needed',
    preview: 'Sounds good! I\'ll be available after 3pm if you want to sync. Looking forward to your feedback.',
    body: `Sounds good! I'll be available after 3pm if you want to sync. Looking forward to your feedback.

I also just noticed a small discrepancy in the enterprise revenue numbers on page 12 — I'll fix that before the final version goes out.

Thanks,
Sarah`,
    date: '3:15 PM',
    read: true,
    starred: false,
    folder: 'inbox',
    labels: ['Work'],
    category: 'work',
  },
  {
    id: '2',
    threadId: 'thread-2',
    from: { name: 'GitHub', email: 'noreply@github.com', avatarColor: avatarColors[4] },
    subject: '[inbox-zero] PR #284 was approved by 2 reviewers',
    preview: 'Your pull request "Add AI-powered email summarization" has been approved and is ready to merge...',
    body: `Your pull request "Add AI-powered email summarization" has been approved and is ready to merge.

Reviewers: @alex-wilson, @maria-santos
Checks: All CI tests passed ✓
Branch: feature/ai-summarization → main

View the PR on GitHub to merge.`,
    date: '1:15 PM',
    read: false,
    starred: false,
    folder: 'inbox',
    labels: ['GitHub'],
    category: 'updates',
  },
  {
    id: '3',
    threadId: 'thread-3',
    from: { name: 'Alex Wilson', email: 'alex@wilson.dev', avatarColor: avatarColors[1] },
    subject: 'Re: Architecture discussion for v2.0',
    preview: 'Great points on the microservices approach. I think we should start with extracting the notification service first...',
    body: `Great points on the microservices approach. I think we should start with extracting the notification service first since it's the most decoupled.

Here's what I'm thinking for the migration plan:
1. Extract notification service (2 sprints)
2. Move auth to its own service (3 sprints)
3. Gradually migrate the email processing pipeline

Let's discuss in tomorrow's standup.

Alex`,
    date: '11:42 AM',
    read: false,
    starred: false,
    folder: 'inbox',
    labels: ['Work'],
    category: 'work',
  },
  {
    id: '3b',
    threadId: 'thread-3',
    from: { name: 'You', email: 'me@gmail.com', avatarColor: avatarColors[3] },
    subject: 'Re: Architecture discussion for v2.0',
    preview: 'Agreed on the notification service first. Let\'s put together a more detailed plan for the standup.',
    body: `Agreed on the notification service first. It's the most isolated piece and would give us good practice for the rest of the migration.

Let's put together a more detailed plan for the standup tomorrow. I'll draft the notification service breakdown tonight.

One concern — how do we handle the shared database during the transition?`,
    date: '12:01 PM',
    read: true,
    starred: false,
    folder: 'inbox',
    labels: ['Work'],
    category: 'work',
  },
  {
    id: '4',
    threadId: 'thread-4',
    from: { name: 'Maria Santos', email: 'maria@designhub.io', avatarColor: avatarColors[6] },
    subject: 'New design system — feedback requested',
    preview: 'I\'ve published the updated design system with new components for the email client UI. Please review the sidebar patterns...',
    body: `I've published the updated design system with new components for the email client UI. Please review the sidebar patterns and let me know if the color palette works.

Key changes:
• New color tokens for light/dark mode
• Redesigned email list items with better density
• Updated typography scale for readability

Figma link is in the team channel.`,
    date: '9:08 AM',
    read: true,
    starred: false,
    folder: 'inbox',
    labels: ['Design', 'Work'],
    category: 'work',
  },
  {
    id: '5',
    threadId: 'thread-5',
    from: { name: 'Linear', email: 'notifications@linear.app', avatarColor: avatarColors[3] },
    subject: 'Weekly digest: 8 issues closed, 3 opened',
    preview: 'This week your team closed 8 issues and opened 3 new ones. Top contributor: Sarah Chen with 4 issues closed...',
    body: `This week your team closed 8 issues and opened 3 new ones.

Top contributor: Sarah Chen with 4 issues closed
Currently in progress: 5 issues
Blocked: 1 issue

View your team dashboard for more details.`,
    date: 'Yesterday',
    read: true,
    starred: false,
    folder: 'inbox',
    labels: ['Linear'],
    category: 'updates',
  },
  {
    id: '6',
    threadId: 'thread-6',
    from: { name: 'David Park', email: 'david.park@notion.so', avatarColor: avatarColors[2] },
    subject: 'Welcome to the team workspace!',
    preview: 'You\'ve been added to the Engineering workspace on Notion. Here are some pages to get you started...',
    body: `You've been added to the Engineering workspace on Notion. Here are some pages to get you started:

• Engineering OKRs (Q4)
• Team Wiki
• Onboarding Checklist
• Architecture Decision Records

Reach out if you have any questions!`,
    date: 'Yesterday',
    read: true,
    starred: true,
    folder: 'inbox',
    labels: ['Work'],
    category: 'updates',
  },
  {
    id: '7',
    threadId: 'thread-7',
    from: { name: 'Figma', email: 'no-reply@figma.com', avatarColor: avatarColors[5] },
    subject: 'Maria commented on your design file',
    preview: 'Maria Santos left a comment on "Email Client v2 — Sidebar" — "Love the new spacing, can we try a slightly darker accent?"',
    body: `Maria Santos left a comment on "Email Client v2 — Sidebar":

"Love the new spacing, can we try a slightly darker accent? Also wondering if we should add a subtle separator between the folders and labels sections."

Open Figma to reply.`,
    date: 'Mon',
    read: true,
    starred: false,
    folder: 'inbox',
    labels: ['Design'],
    category: 'updates',
  },
  {
    id: '8',
    threadId: 'thread-8',
    from: { name: 'Jamie Lee', email: 'jamie@startupco.com', avatarColor: avatarColors[7] },
    subject: 'Coffee next week?',
    preview: 'Hey! I\'ll be in town next Tuesday and Wednesday. Want to grab coffee and catch up? I\'d love to hear about the new project...',
    body: `Hey! I'll be in town next Tuesday and Wednesday. Want to grab coffee and catch up? I'd love to hear about the new project you've been working on.

Let me know what works for you!

Jamie`,
    date: 'Mon',
    read: true,
    starred: false,
    folder: 'inbox',
    labels: ['Personal'],
    category: 'personal',
  },
  {
    id: '8b',
    threadId: 'thread-8',
    from: { name: 'You', email: 'me@gmail.com', avatarColor: avatarColors[3] },
    subject: 'Re: Coffee next week?',
    preview: 'Tuesday afternoon works great! Let\'s do 2pm at Blue Bottle on 5th. Looking forward to catching up.',
    body: `Tuesday afternoon works great! Let's do 2pm at Blue Bottle on 5th. Looking forward to catching up — I have a lot to share about the new project.

See you then!`,
    date: 'Mon',
    read: true,
    starred: false,
    folder: 'inbox',
    labels: ['Personal'],
    category: 'personal',
  },
  {
    id: '9',
    threadId: 'thread-9',
    from: { name: 'Spotify', email: 'no-reply@spotify.com', avatarColor: avatarColors[5] },
    subject: 'Your 2026 Wrapped is almost ready',
    preview: 'You\'ve been listening to a lot of lo-fi beats this year. Get ready for your personalized Wrapped experience...',
    body: `You've been listening to a lot of lo-fi beats this year. Get ready for your personalized Wrapped experience coming next month.

In the meantime, check out your top artists and most-played songs in the Spotify app.`,
    date: 'Mon',
    read: true,
    starred: false,
    folder: 'inbox',
    labels: ['Personal'],
    category: 'promotions',
  },
  {
    id: '10',
    threadId: 'thread-10',
    from: { name: 'Mom', email: 'mom@family.com', avatarColor: avatarColors[7] },
    subject: 'Sunday dinner this weekend?',
    preview: 'Hi sweetie, are you free for dinner this Sunday? Dad is making his famous lasagna and your sister is coming too.',
    body: `Hi sweetie,

Are you free for dinner this Sunday? Dad is making his famous lasagna and your sister is coming too.

Let me know if 6pm works or if you need a different time. We'd love to see you!

Love,
Mom`,
    date: 'Sun',
    read: true,
    starred: false,
    folder: 'inbox',
    labels: ['Personal'],
    category: 'personal',
  },
]

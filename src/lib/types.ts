export interface Email {
  id: string
  threadId: string
  from: {
    name: string
    email: string
    avatarColor: string
  }
  subject: string
  preview: string
  body: string
  date: string
  read: boolean
  starred: boolean
  folder: EmailFolder
  labels: string[]
  category: EmailCategory
  attachments?: { name: string; size: string }[]
}

export type EmailFolder =
  | 'inbox'
  | 'starred'
  | 'sent'
  | 'drafts'
  | 'archive'
  | 'trash'

export type EmailCategory =
  | 'all'
  | 'work'
  | 'personal'
  | 'updates'
  | 'promotions'

export interface Folder {
  id: EmailFolder
  name: string
  icon: string
  count: number
}

export interface Category {
  id: EmailCategory
  name: string
  count: number
}

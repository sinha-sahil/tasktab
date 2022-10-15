# TaskTab

TaskTab is a task management app that helps to organize and manage tasks easily.

It provides functionality to

- Create a Task List
- Add Tasks
- Prioritize Tasks
- Calculate time taken to complete tasks

## Setup and Development

- For setup run `pnpm i`

- For running this app use `pnpm run dev`

## Code Artifacts

### Task Categories

```typescript
id: string
name: string
priority : number
isArchived : boolean
completed: boolean
tasks: Task []
```

### Task

```typescript
id : string
serialNumber : number
title: string
content : string
isArchived : boolean
priority: number
labels : string []
state : BackLog | Started | Paused | Completed | Discarded
timeTaken: number
createdAt: Timestamp
updatedAt: Timestamp
```

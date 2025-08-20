# Reliable Queue - Production-Ready Task Management

🚀 **A Powerful, Production-Ready Queue System for JavaScript & TypeScript**

`@aplanka/reliable-queue` is a comprehensive task queue management library designed to handle asynchronous operations with guaranteed execution and intelligent failure recovery. Whether you're building a file upload system, processing background jobs, or managing API calls, this library ensures your tasks are executed reliably with built-in retry mechanisms, real-time status tracking, and seamless React integration.

## 🎯 Why Choose This Library?

**Problem it solves:** In modern web applications, handling asynchronous tasks reliably is challenging. Network failures, server timeouts, and temporary errors can cause important operations to fail silently, leaving your users frustrated and your data inconsistent.

**Our solution:** This library provides a robust queue system that automatically handles failures, retries failed tasks with smart backoff strategies, provides real-time status updates, and ensures no task is lost - even if the user refreshes the page or closes their browser.

**Perfect for:**
- 📁 File upload systems with retry capabilities
- 📧 Email sending with delivery guarantees  
- 🔄 Background job processing
- 🌐 API call management with failure recovery
- 📊 Data synchronization tasks
- 🎨 Image/video processing pipelines
- 💾 Batch operations with progress tracking

## ✨ Features

### 🔄 Automatic Retry Logic
**Never lose a task again!** When tasks fail due to network issues, server errors, or temporary problems, the queue automatically retries them using intelligent strategies.

**How it works:**
- Failed tasks are automatically rescheduled for retry
- Each retry attempt is tracked and logged
- Smart exponential backoff prevents overwhelming failing services
- Maximum retry limits prevent infinite loops
- Custom retry delays can be configured per use case

**Retry Strategies:**
- **Fixed Delay:** Same delay between each retry (e.g., 1s, 1s, 1s)
- **Exponential Backoff:** Increasing delays (e.g., 1s, 2s, 4s, 8s) to give failing services time to recover
- **Capped Backoff:** Exponential with maximum delay limit

```typescript
// Example: Payment processing with smart retry
const paymentQueue = new ReliableQueue({
  maxRetries: 3,           // Try up to 3 times total
  retryDelay: 1000,        // Start with 1 second delay
  exponentialBackoff: true, // Double delay each retry: 1s → 2s → 4s
  maxRetryDelay: 30000     // Never wait more than 30 seconds
});

paymentQueue.setProcessor(async (payment) => {
  // This might fail due to network issues, server errors, etc.
  const response = await fetch('/api/process-payment', {
    method: 'POST',
    body: JSON.stringify(payment)
  });
  
  if (!response.ok) {
    throw new Error(`Payment failed: ${response.status}`);
  }
  
  return response.json();
});

// If this fails, it will be retried automatically:
// Attempt 1: Immediate
// Attempt 2: After 1 second
// Attempt 3: After 2 seconds  
// Attempt 4: After 4 seconds
// If still fails: Marked as permanently failed
paymentQueue.add({ 
  userId: '123', 
  amount: 99.99, 
  currency: 'USD' 
});
```

**Real-world benefits:**
- 🌐 **Network resilience:** Handles temporary internet disconnections
- ⚡ **Server recovery:** Gives overloaded servers time to recover
- 🔧 **Maintenance windows:** Automatically resumes after server maintenance
- 💪 **User experience:** Operations complete even with unstable connections

### 📊 Real-time Status Tracking
Monitor task progress with detailed status information.

```typescript
// Track individual task status
const taskId = queue.add({ data: 'example' });
const task = queue.getTask(taskId);
console.log(task.status); // 'pending' | 'processing' | 'completed' | 'failed'

// Get overall queue statistics
const stats = queue.getStats();
console.log(`${stats.pending} pending, ${stats.failed} failed`);
```

### 🔔 Event-Driven Architecture
Subscribe to real-time queue events for responsive applications.

```typescript
queue.on('taskCompleted', (task) => {
  console.log(`✅ Task ${task.id} completed successfully`);
});

queue.on('taskFailed', (task, error) => {
  console.log(`❌ Task ${task.id} failed: ${error.message}`);
  // Send notification, log error, etc.
});

queue.on('queueUpdated', (tasks) => {
  updateUI(tasks); // Update your UI in real-time
});
```

### 🚀 Concurrent Processing
Process multiple tasks simultaneously for better performance.

```typescript
const queue = new ReliableQueue({
  concurrency: 5 // Process up to 5 tasks at the same time
});

// All these tasks can be processed concurrently
for (let i = 0; i < 10; i++) {
  queue.add({ fileId: i, action: 'process-image' });
}
```

### ⚡ Priority-Based Processing
Higher priority tasks are processed first.

```typescript
// Low priority background task
queue.add({ task: 'cleanup' }, { priority: 1 });

// High priority user action
queue.add({ task: 'user-request' }, { priority: 10 });

// Critical system task
queue.add({ task: 'security-check' }, { priority: 100 });

// Tasks will be processed in priority order: security-check → user-request → cleanup
```

### ⏰ Delayed Task Scheduling
Schedule tasks to run at a specific time in the future.

```typescript
// Process this task after 5 seconds
queue.add(
  { action: 'send-reminder' }, 
  { delay: 5000 }
);

// Schedule for specific time
const delayUntilMidnight = new Date().setHours(24, 0, 0, 0) - Date.now();
queue.add(
  { action: 'daily-report' }, 
  { delay: delayUntilMidnight }
);
```

### 💾 Persistent Storage
Tasks survive page refreshes and browser restarts.

```typescript
const queue = new ReliableQueue({
  persistent: true,
  storageKey: 'my-app-queue' // Custom storage key
});

// Add tasks - they'll persist even if user refreshes the page
queue.add({ action: 'upload-file', fileId: '123' });

// After page refresh, tasks are automatically restored
```

### ⚛️ React Integration
Seamless integration with React applications using custom hooks.

```tsx
function FileUploader() {
  const { tasks, stats, addTask, retryTask } = useReliableQueue({
    queueName: 'file-uploads',
    processor: async (file) => {
      // Upload file logic
    }
  });

  return (
    <div>
      <div>Uploading: {stats.processing} files</div>
      <div>Failed: {stats.failed} files</div>
      
      {tasks.map(task => (
        <div key={task.id}>
          {task.data.name} - {task.status}
          {task.status === 'failed' && (
            <button onClick={() => retryTask(task.id)}>Retry</button>
          )}
        </div>
      ))}
    </div>
  );
}
```

### 🎯 Generic Type Safety
Full TypeScript support with custom data types.

```typescript
interface EmailTask {
  to: string;
  subject: string;
  body: string;
  priority: 'low' | 'high' | 'urgent';
}

const emailQueue = new ReliableQueue<EmailTask>();

// TypeScript enforces correct data structure
emailQueue.add({
  to: 'user@example.com',
  subject: 'Welcome!',
  body: 'Thanks for signing up',
  priority: 'high'
});

// Type-safe event handling
emailQueue.on('taskCompleted', (task) => {
  // task.data is properly typed as EmailTask
  console.log(`Email sent to ${task.data.to}`);
});
```

### 🏗️ Multiple Queue Management
Manage multiple independent queues for different purposes.

```typescript
import { QueueManager } from '@aplanka/reliable-queue';

const manager = QueueManager.getInstance();

// Create specialized queues
const emailQueue = manager.createQueue('emails', { 
  maxRetries: 5,
  concurrency: 3 
});

const imageQueue = manager.createQueue('images', { 
  maxRetries: 2,
  concurrency: 2 
});

const reportQueue = manager.createQueue('reports', { 
  maxRetries: 1,
  concurrency: 1 
});

// Each queue operates independently
emailQueue.add({ type: 'welcome-email' });
imageQueue.add({ type: 'resize-avatar' });
reportQueue.add({ type: 'monthly-summary' });
```

## Installation

```bash
npm install @aplanka/reliable-queue
```

## Quick Start Guide

### Step 1: Import and Create a Queue

```typescript
import { ReliableQueue, TaskStatus } from '@aplanka/reliable-queue';

// Create a queue with basic configuration
const queue = new ReliableQueue({
  maxRetries: 3,
  retryDelay: 1000,
  exponentialBackoff: true,
});
```

### Step 2: Set Up Task Processor

```typescript
// Define what happens when tasks are processed
queue.setProcessor(async (data) => {
  console.log('Processing task:', data);
  
  // Your task logic here - e.g., API call
  const response = await fetch('/api/process', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Processing failed');
  }
  
  return await response.json();
});
```

### Step 3: Add Tasks to Queue

```typescript
// Add a simple task
const taskId = queue.add({ 
  message: 'Process this data',
  userId: '123' 
});

// Add task with options
queue.add(
  { message: 'High priority task' },
  { 
    priority: 10,     // Higher number = higher priority
    delay: 5000,      // Wait 5 seconds before processing
  }
);
```

### Step 4: Monitor Queue Events

```typescript
// Listen for task completion
queue.on('taskCompleted', (task) => {
  console.log('✅ Task completed:', task.id);
});

// Listen for task failures
queue.on('taskFailed', (task, error) => {
  console.log('❌ Task failed:', task.id, error.message);
});

// Listen for queue updates
queue.on('queueUpdated', (tasks) => {
  console.log('📊 Queue now has', tasks.length, 'tasks');
});
```

### Step 5: Manage Queue

```typescript
// Get queue statistics
const stats = queue.getStats();
console.log(`Total: ${stats.total}, Pending: ${stats.pending}, Failed: ${stats.failed}`);

// Get all tasks
const tasks = queue.getTasks();

// Retry failed tasks
const retriedCount = queue.retryAll();

// Clear completed tasks
const clearedCount = queue.clearCompleted();
```

## React Integration

### Step 1: Use the Hook

```tsx
import React from 'react';
import { useReliableQueue } from '@aplanka/reliable-queue';

interface MyTask {
  id: string;
  action: string;
  data: any;
}

function TaskManager() {
  const {
    tasks,
    stats,
    addTask,
    retryTask,
    clearFailed,
  } = useReliableQueue<MyTask>({
    queueName: 'my-tasks',
    maxRetries: 3,
    processor: async (task) => {
      // Process your task
      await fetch('/api/process', {
        method: 'POST',
        body: JSON.stringify(task),
      });
    },
  });

  return (
    <div>
      <h2>Task Manager</h2>
      
      {/* Queue Stats */}
      <div>
        <span>Total: {stats.total}</span>
        <span>Pending: {stats.pending}</span>
        <span>Failed: {stats.failed}</span>
      </div>

      {/* Add Task Button */}
      <button onClick={() => addTask({
        id: Date.now().toString(),
        action: 'process-data',
        data: { message: 'Hello World' }
      })}>
        Add Task
      </button>

      {/* Task List */}
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <span>{task.status}</span> - {task.data.action}
            {task.status === 'failed' && (
              <button onClick={() => retryTask(task.id)}>Retry</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Common Use Cases

### File Upload Queue

```typescript
interface FileTask {
  file: File;
  uploadUrl: string;
}

const uploadQueue = new ReliableQueue<FileTask>({
  concurrency: 3, // Upload 3 files at once
});

uploadQueue.setProcessor(async ({ file, uploadUrl }) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(uploadUrl, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) throw new Error('Upload failed');
});

// Add files to upload
files.forEach(file => {
  uploadQueue.add({ file, uploadUrl: '/api/upload' });
});
```

### Background Job Processing

```typescript
interface JobTask {
  jobType: 'email' | 'report' | 'export';
  payload: any;
}

const jobQueue = new ReliableQueue<JobTask>({
  maxRetries: 5,
  persistent: true, // Survive page refreshes
});

jobQueue.setProcessor(async ({ jobType, payload }) => {
  await fetch(`/api/jobs/${jobType}`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
});

// Process different job types
jobQueue.add({ jobType: 'email', payload: { userId: '123' } });
jobQueue.add({ jobType: 'report', payload: { reportId: 'monthly' } });
```

## Configuration Options

```typescript
interface QueueConfig {
  maxRetries?: number;         // Default: 3
  retryDelay?: number;         // Default: 1000ms
  exponentialBackoff?: boolean; // Default: true
  maxRetryDelay?: number;      // Default: 30000ms
  concurrency?: number;        // Default: 1
  persistent?: boolean;        // Default: false
  storageKey?: string;         // Default: 'reliable-queue'
}
```

## Task Status Types

- `pending` - Task is waiting to be processed
- `processing` - Task is currently being processed
- `completed` - Task finished successfully
- `failed` - Task failed after all retry attempts

## API Methods

### Queue Management
- `add(data, options?)` - Add task to queue
- `remove(taskId)` - Remove task from queue
- `clear()` - Remove all non-processing tasks
- `getTasks()` - Get all tasks
- `getStats()` - Get queue statistics

### Task Control
- `retry(taskId)` - Retry specific failed task
- `retryAll()` - Retry all failed tasks
- `clearCompleted()` - Remove completed tasks
- `clearFailed()` - Remove failed tasks

### Events
- `taskAdded` - When task is added
- `taskStarted` - When task starts processing
- `taskCompleted` - When task completes successfully
- `taskFailed` - When task fails permanently
- `taskRetried` - When task is retried
- `queueUpdated` - When queue state changes

## TypeScript Support

Full TypeScript support with generic types:

```typescript
interface MyData {
  id: number;
  message: string;
}

const queue = new ReliableQueue<MyData>();

// Type-safe task data
queue.add({ id: 1, message: 'Hello' });

// Type-safe event handlers
queue.on('taskCompleted', (task) => {
  // task.data is typed as MyData
  console.log(task.data.message);
});
```

## License

MIT © Pasindu Lanka
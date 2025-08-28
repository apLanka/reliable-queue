import Link from 'next/link';
import { ArrowLeft, Code2, Settings, Type, Zap, Hash, FileText, Clock, CheckCircle, XCircle, Play } from 'lucide-react';
import CodeBlock from '../../../components/CodeBlock';

const reiliableQueueExample = `import { ReliableQueue, TaskStatus } from '@aplanka/reliable-queue';

// Create a queue with configuration
const queue = new ReliableQueue({
  maxRetries: 3,
  retryDelay: 1000,
  exponentialBackoff: true,
  concurrency: 2,
  persistent: true
});

// Set up task processor
queue.setProcessor(async (data, task) => {
  console.log('Processing task:', task.id, data);
  await processYourTask(data);
});

// Add tasks
const taskId = queue.add({ 
  message: 'Hello World' 
}, { 
  priority: 10, 
  delay: 5000 
});

// Subscribe to events
queue.on('taskCompleted', (task) => {
  console.log('Task completed:', task.id);
});

// Get stats and manage tasks
const stats = queue.getStats();
queue.retry('task-id');
queue.clearCompleted();`;

const queueManagerExample = `import { QueueManager } from '@aplanka/reliable-queue';

// Get singleton instance
const manager = QueueManager.getInstance();

// Create named queues
const emailQueue = manager.createQueue('emails', {
  maxRetries: 5,
  concurrency: 3
});

const imageQueue = manager.createQueue('images', {
  maxRetries: 2,
  concurrency: 1
});

// Get existing queue
const existingQueue = manager.getQueue('emails');`;

const typesExample = `import { QueuedTask, TaskStatus, QueueStats } from '@aplanka/reliable-queue';

// Task interface
interface MyTask {
  userId: string;
  action: 'send-email' | 'process-image';
  payload: any;
}

// Create typed queue
const typedQueue = new ReliableQueue<MyTask>({
  maxRetries: 3
});

// Type-safe processor
typedQueue.setProcessor(async (data: MyTask, task: QueuedTask<MyTask>) => {
  switch (data.action) {
    case 'send-email':
      await sendEmail(data.payload);
      break;
    case 'process-image':
      await processImage(data.payload);
      break;
  }
});`;

const methods = [
  {
    name: 'constructor',
    signature: 'constructor(config?: QueueConfig)',
    description: 'Creates a new ReliableQueue instance with optional configuration.',
    returns: 'ReliableQueue<T>',
    example: `const queue = new ReliableQueue({
  maxRetries: 5,
  concurrency: 2
});`
  },
  {
    name: 'setProcessor',
    signature: 'setProcessor(processor: TaskProcessor<T>): void',
    description: 'Sets the function that will process tasks in the queue.',
    returns: 'void',
    example: `queue.setProcessor(async (data, task) => {
  await processTask(data);
});`
  },
  {
    name: 'add',
    signature: 'add(data: T, options?: AddTaskOptions): string',
    description: 'Adds a new task to the queue and returns the task ID.',
    returns: 'string - Task ID',
    example: `const taskId = queue.add(
  { message: 'Hello' },
  { priority: 10, delay: 1000 }
);`
  },
  {
    name: 'remove',
    signature: 'remove(taskId: string): boolean',
    description: 'Removes a task from the queue. Cannot remove processing tasks.',
    returns: 'boolean - Success status',
    example: `const removed = queue.remove('task-123');`
  },
  {
    name: 'retry',
    signature: 'retry(taskId: string): boolean',
    description: 'Retries a failed task by resetting its status to pending.',
    returns: 'boolean - Success status',
    example: `const retried = queue.retry('failed-task-123');`
  },
  {
    name: 'retryAll',
    signature: 'retryAll(): number',
    description: 'Retries all failed tasks in the queue.',
    returns: 'number - Number of tasks retried',
    example: `const retriedCount = queue.retryAll();`
  },
  {
    name: 'clear',
    signature: 'clear(): void',
    description: 'Removes all tasks except those currently processing.',
    returns: 'void',
    example: `queue.clear();`
  },
  {
    name: 'clearCompleted',
    signature: 'clearCompleted(): number',
    description: 'Removes all completed tasks from the queue.',
    returns: 'number - Number of tasks cleared',
    example: `const cleared = queue.clearCompleted();`
  },
  {
    name: 'clearFailed',
    signature: 'clearFailed(): number',
    description: 'Removes all failed tasks from the queue.',
    returns: 'number - Number of tasks cleared',
    example: `const cleared = queue.clearFailed();`
  },
  {
    name: 'getTasks',
    signature: 'getTasks(): QueuedTask<T>[]',
    description: 'Returns a copy of all tasks in the queue.',
    returns: 'QueuedTask<T>[]',
    example: `const allTasks = queue.getTasks();`
  },
  {
    name: 'getTask',
    signature: 'getTask(taskId: string): QueuedTask<T> | undefined',
    description: 'Returns a specific task by its ID.',
    returns: 'QueuedTask<T> | undefined',
    example: `const task = queue.getTask('task-123');`
  },
  {
    name: 'getStats',
    signature: 'getStats(): QueueStats',
    description: 'Returns statistics about the queue.',
    returns: 'QueueStats',
    example: `const stats = queue.getStats();
console.log(\`Pending: \${stats.pending}\`);`
  },
  {
    name: 'on',
    signature: 'on<K extends keyof QueueEvents<T>>(event: K, callback: QueueEvents<T>[K]): () => void',
    description: 'Subscribes to queue events and returns an unsubscribe function.',
    returns: 'function - Unsubscribe function',
    example: `const unsubscribe = queue.on('taskCompleted', (task) => {
  console.log('Task done:', task.id);
});
// Later: unsubscribe();`
  }
];

const interfaces = [
  {
    name: 'QueueConfig',
    description: 'Configuration options for the queue',
    properties: [
      { name: 'maxRetries?', type: 'number', description: 'Maximum retry attempts (default: 3)' },
      { name: 'retryDelay?', type: 'number', description: 'Base retry delay in ms (default: 1000)' },
      { name: 'exponentialBackoff?', type: 'boolean', description: 'Use exponential backoff (default: true)' },
      { name: 'maxRetryDelay?', type: 'number', description: 'Maximum retry delay in ms (default: 30000)' },
      { name: 'concurrency?', type: 'number', description: 'Maximum concurrent tasks (default: 1)' },
      { name: 'persistent?', type: 'boolean', description: 'Persist to localStorage (default: false)' },
      { name: 'storageKey?', type: 'string', description: 'Storage key for persistence (default: "reliable-queue")' }
    ]
  },
  {
    name: 'QueuedTask<T>',
    description: 'A task in the queue with metadata',
    properties: [
      { name: 'id', type: 'string', description: 'Unique task identifier' },
      { name: 'data', type: 'T', description: 'The task payload' },
      { name: 'status', type: 'TaskStatus', description: 'Current task status' },
      { name: 'retryCount', type: 'number', description: 'Number of retry attempts' },
      { name: 'createdAt', type: 'number', description: 'Creation timestamp' },
      { name: 'updatedAt', type: 'number', description: 'Last update timestamp' },
      { name: 'error?', type: 'string', description: 'Error message if failed' },
      { name: 'priority?', type: 'number', description: 'Task priority (higher = first)' },
      { name: 'delay?', type: 'number', description: 'Processing delay in ms' },
      { name: 'processAt?', type: 'number', description: 'Scheduled processing time' }
    ]
  },
  {
    name: 'TaskProcessor<T>',
    description: 'Function type for processing tasks',
    properties: [
      { name: 'data', type: 'T', description: 'Task data to process' },
      { name: 'task', type: 'QueuedTask<T>', description: 'Complete task object' },
      { name: 'returns', type: 'Promise<void>', description: 'Async function returning void' }
    ]
  },
  {
    name: 'QueueStats',
    description: 'Statistics about the queue state',
    properties: [
      { name: 'total', type: 'number', description: 'Total number of tasks' },
      { name: 'pending', type: 'number', description: 'Tasks waiting to process' },
      { name: 'processing', type: 'number', description: 'Tasks currently processing' },
      { name: 'completed', type: 'number', description: 'Successfully completed tasks' },
      { name: 'failed', type: 'number', description: 'Failed tasks' }
    ]
  },
  {
    name: 'AddTaskOptions',
    description: 'Options for adding tasks to the queue',
    properties: [
      { name: 'priority?', type: 'number', description: 'Task priority (higher number = higher priority)' },
      { name: 'delay?', type: 'number', description: 'Delay before processing in milliseconds' },
      { name: 'id?', type: 'string', description: 'Custom task ID (auto-generated if not provided)' }
    ]
  }
];

const events = [
  {
    name: 'taskAdded',
    signature: '(task: QueuedTask<T>) => void',
    description: 'Fired when a new task is added to the queue.'
  },
  {
    name: 'taskStarted',
    signature: '(task: QueuedTask<T>) => void',
    description: 'Fired when a task begins processing.'
  },
  {
    name: 'taskCompleted',
    signature: '(task: QueuedTask<T>) => void',
    description: 'Fired when a task completes successfully.'
  },
  {
    name: 'taskFailed',
    signature: '(task: QueuedTask<T>, error: Error) => void',
    description: 'Fired when a task fails and exhausts all retries.'
  },
  {
    name: 'taskRetried',
    signature: '(task: QueuedTask<T>) => void',
    description: 'Fired when a task is retried (either manually or automatically).'
  },
  {
    name: 'queueUpdated',
    signature: '(tasks: QueuedTask<T>[]) => void',
    description: 'Fired whenever the queue state changes.'
  }
];

const taskStatuses = [
  { name: 'PENDING', value: "'pending'", description: 'Task is waiting to be processed', icon: Clock, color: 'text-yellow-600' },
  { name: 'PROCESSING', value: "'processing'", description: 'Task is currently being processed', icon: Play, color: 'text-blue-600' },
  { name: 'COMPLETED', value: "'completed'", description: 'Task completed successfully', icon: CheckCircle, color: 'text-green-600' },
  { name: 'FAILED', value: "'failed'", description: 'Task failed after all retry attempts', icon: XCircle, color: 'text-red-600' }
];

export default function APIReferencePage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-700 to-blue-800 pt-20">
        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <Link
            href="/docs"
            className="inline-flex items-center text-blue-200 hover:text-white transition-colors duration-200 mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Documentation
          </Link>
          
          <div className="flex items-center mb-6">
            <div className="bg-white/10 p-3 rounded-xl mr-4 backdrop-blur-sm border border-white/20">
              <Code2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              API Reference
            </h1>
          </div>
          <p className="text-xl text-blue-100 max-w-3xl">
            Complete reference for all classes, methods, interfaces, and configuration options in Reliable Queue.
          </p>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="#reliable-queue" className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200">
              <Code2 className="h-4 w-4 mr-2" />
              ReliableQueue
            </Link>
            <Link href="#queue-manager" className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200">
              <Settings className="h-4 w-4 mr-2" />
              QueueManager
            </Link>
            <Link href="#interfaces" className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200">
              <Type className="h-4 w-4 mr-2" />
              Interfaces
            </Link>
            <Link href="#events" className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200">
              <Zap className="h-4 w-4 mr-2" />
              Events
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {/* ReliableQueue Class */}
        <section id="reliable-queue" className="mb-20">
          <div className="flex items-center mb-8">
            <Code2 className="h-8 w-8 text-blue-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">ReliableQueue Class</h2>
          </div>
          
          <p className="text-lg text-gray-600 mb-8">
            The main queue class that provides reliable task processing with retry logic, status tracking, and event subscriptions.
          </p>

          <div className="mb-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Basic Usage</h3>
            <CodeBlock
              code={reiliableQueueExample}
              language="typescript"
              title="ReliableQueue Example"
            />
          </div>

          <div className="mb-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Methods</h3>
            <div className="space-y-8">
              {methods.map((method) => (
                <div key={method.name} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 font-mono">
                        {method.name}
                      </h4>
                      <p className="text-sm text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded mt-2 inline-block">
                        {method.signature}
                      </p>
                    </div>
                    <span className="text-sm text-blue-600 font-semibold bg-blue-50 px-2 py-1 rounded">
                      {method.returns}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-4">{method.description}</p>
                  <CodeBlock
                    code={method.example}
                    language="typescript"
                    title={`${method.name} example`}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* QueueManager Class */}
        <section id="queue-manager" className="mb-20">
          <div className="flex items-center mb-8">
            <Settings className="h-8 w-8 text-green-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">QueueManager Class</h2>
          </div>
          
          <p className="text-lg text-gray-600 mb-8">
            Singleton class for managing multiple named queues across your application.
          </p>

          <div className="mb-8">
            <CodeBlock
              code={queueManagerExample}
              language="typescript"
              title="QueueManager Example"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">getInstance()</h4>
              <p className="text-gray-700 mb-4">Returns the singleton QueueManager instance.</p>
              <p className="text-sm font-mono text-gray-600">Returns: QueueManager</p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">createQueue(name, config)</h4>
              <p className="text-gray-700 mb-4">Creates or returns an existing named queue.</p>
              <p className="text-sm font-mono text-gray-600">Returns: ReliableQueue&lt;T&gt;</p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">getQueue(name)</h4>
              <p className="text-gray-700 mb-4">Gets an existing queue by name.</p>
              <p className="text-sm font-mono text-gray-600">Returns: ReliableQueue&lt;T&gt; | undefined</p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">removeQueue(name)</h4>
              <p className="text-gray-700 mb-4">Removes a named queue from the manager.</p>
              <p className="text-sm font-mono text-gray-600">Returns: boolean</p>
            </div>
          </div>
        </section>

        {/* Interfaces */}
        <section id="interfaces" className="mb-20">
          <div className="flex items-center mb-8">
            <Type className="h-8 w-8 text-purple-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Interfaces & Types</h2>
          </div>
          
          <p className="text-lg text-gray-600 mb-8">
            TypeScript interfaces and types used throughout the Reliable Queue library.
          </p>

          <div className="mb-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">TypeScript Usage</h3>
            <CodeBlock
              code={typesExample}
              language="typescript"
              title="Type-safe Queue Usage"
            />
          </div>

          <div className="space-y-8">
            {interfaces.map((iface) => (
              <div key={iface.name} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 font-mono">{iface.name}</h3>
                  <p className="text-gray-600 mt-1">{iface.description}</p>
                </div>
                <div className="divide-y divide-gray-200">
                  {iface.properties.map((prop, propIndex) => (
                    <div key={propIndex} className="px-6 py-4 flex items-start justify-between">
                      <div className="flex-1 mr-4">
                        <h4 className="text-sm font-semibold font-mono text-gray-900">{prop.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{prop.description}</p>
                      </div>
                      <span className="text-sm font-mono bg-blue-50 text-blue-700 px-2 py-1 rounded whitespace-nowrap">
                        {prop.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Task Status Enum */}
          <div className="mt-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">TaskStatus Enum</h3>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 font-mono">TaskStatus</h4>
                <p className="text-gray-600 mt-1">Enumeration of possible task states</p>
              </div>
              <div className="divide-y divide-gray-200">
                {taskStatuses.map((status) => {
                  const IconComponent = status.icon;
                  return (
                    <div key={status.name} className="px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <IconComponent className={`h-5 w-5 mr-3 ${status.color}`} />
                        <div>
                          <h5 className="text-sm font-semibold font-mono text-gray-900">{status.name}</h5>
                          <p className="text-sm text-gray-600">{status.description}</p>
                        </div>
                      </div>
                      <span className="text-sm font-mono bg-gray-50 text-gray-700 px-2 py-1 rounded">
                        {status.value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Events */}
        <section id="events" className="mb-20">
          <div className="flex items-center mb-8">
            <Zap className="h-8 w-8 text-yellow-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Events</h2>
          </div>
          
          <p className="text-lg text-gray-600 mb-8">
            Queue events allow you to respond to changes in task and queue state.
          </p>

          <div className="space-y-6">
            {events.map((event) => (
              <div key={event.name} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold font-mono text-gray-900">{event.name}</h3>
                  <span className="text-sm font-mono bg-yellow-50 text-yellow-700 px-2 py-1 rounded">
                    Event
                  </span>
                </div>
                <p className="text-sm font-mono text-gray-600 mb-3 bg-gray-100 px-3 py-2 rounded">
                  {event.signature}
                </p>
                <p className="text-gray-700">{event.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Utilities */}
        <section id="utilities" className="mb-20">
          <div className="flex items-center mb-8">
            <Hash className="h-8 w-8 text-gray-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Utility Functions</h2>
          </div>
          
          <p className="text-lg text-gray-600 mb-8">
            Exported utility functions that can be used independently.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold font-mono text-gray-900 mb-2">generateId()</h3>
              <p className="text-gray-700 mb-3">Generates a unique identifier for tasks.</p>
              <p className="text-sm font-mono text-gray-600">Returns: string</p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold font-mono text-gray-900 mb-2">calculateRetryDelay()</h3>
              <p className="text-gray-700 mb-3">Calculates retry delay with exponential backoff.</p>
              <p className="text-sm font-mono text-gray-600">Returns: number</p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold font-mono text-gray-900 mb-2">sleep(ms)</h3>
              <p className="text-gray-700 mb-3">Promise-based sleep utility.</p>
              <p className="text-sm font-mono text-gray-600">Returns: Promise&lt;void&gt;</p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold font-mono text-gray-900 mb-2">isBrowser()</h3>
              <p className="text-gray-700 mb-3">Detects if running in browser environment.</p>
              <p className="text-sm font-mono text-gray-600">Returns: boolean</p>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
          <div className="flex items-center mb-4">
            <FileText className="h-6 w-6 text-blue-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">Next Steps</h3>
          </div>
          <p className="text-gray-700 mb-6">
            Now that you understand the API, explore other documentation sections to learn more about specific topics.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/docs/configuration"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
            >
              <Settings className="h-4 w-4 mr-2" />
              Configuration Guide
            </Link>
            <Link
              href="/docs/react"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-200"
            >
              <Code2 className="h-4 w-4 mr-2" />
              React Integration
            </Link>
            <Link
              href="/docs/events"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-yellow-600 text-white hover:bg-yellow-700 transition-colors duration-200"
            >
              <Zap className="h-4 w-4 mr-2" />
              Events & Monitoring
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
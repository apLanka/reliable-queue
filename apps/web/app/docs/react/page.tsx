import Link from 'next/link';
import { ArrowLeft, Wrench, Zap, Code2, Layers, RefreshCw, CheckCircle, Play, Clock, Settings } from 'lucide-react';
import CodeBlock from '../../../components/CodeBlock';

const basicHookExample = `import React from 'react';
import { useReliableQueue } from '@aplanka/reliable-queue';

function TaskManager() {
  const { 
    tasks, 
    stats, 
    addTask, 
    retryTask, 
    clearCompleted 
  } = useReliableQueue({
    queueName: 'my-tasks',
    maxRetries: 3,
    concurrency: 2,
    processor: async (data) => {
      // Your task processing logic
      console.log('Processing:', data);
      await fetch('/api/process', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  });

  return (
    <div className="p-6">
      <div className="mb-4">
        <h2>Queue Statistics</h2>
        <p>Total: {stats.total} | Pending: {stats.pending} | Failed: {stats.failed}</p>
      </div>

      <button 
        onClick={() => addTask({ message: 'Hello World!' })}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Add Task
      </button>

      <div className="space-y-2">
        {tasks.map(task => (
          <div key={task.id} className="p-3 border rounded flex justify-between items-center">
            <div>
              <span className={\`inline-block w-2 h-2 rounded-full mr-2 \${
                task.status === 'completed' ? 'bg-green-500' :
                task.status === 'failed' ? 'bg-red-500' :
                task.status === 'processing' ? 'bg-blue-500' : 'bg-yellow-500'
              }\`}></span>
              {task.status} - {JSON.stringify(task.data)}
            </div>
            {task.status === 'failed' && (
              <button 
                onClick={() => retryTask(task.id)}
                className="px-2 py-1 bg-orange-500 text-white rounded text-sm"
              >
                Retry
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaskManager;`;

const advancedHookExample = `import React, { useState, useCallback } from 'react';
import { useReliableQueue } from '@aplanka/reliable-queue';

function EmailQueueManager() {
  const [emailData, setEmailData] = useState({ to: '', subject: '', body: '' });
  
  const {
    tasks,
    stats,
    addTask,
    retryTask,
    retryAllTasks,
    clearCompleted,
    clearFailed,
    queue // Direct access to queue instance
  } = useReliableQueue<EmailTask>({
    queueName: 'email-queue',
    maxRetries: 5,
    retryDelay: 2000,
    exponentialBackoff: true,
    concurrency: 3,
    persistent: true,
    storageKey: 'app-email-queue',
    processor: async (data, task) => {
      console.log(\`Sending email to \${data.to}: \${data.subject}\`);
      
      // Simulate email sending
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(\`Email failed: \${response.statusText}\`);
      }
      
      console.log(\`Email sent successfully to \${data.to}\`);
    }
  });

  const handleAddEmail = useCallback(() => {
    if (!emailData.to || !emailData.subject) return;
    
    addTask(emailData, {
      priority: emailData.to.includes('urgent') ? 10 : 5,
      delay: 0
    });
    
    setEmailData({ to: '', subject: '', body: '' });
  }, [emailData, addTask]);

  const handleBulkActions = useCallback(() => {
    // Demonstrate bulk operations
    retryAllTasks();
    setTimeout(() => clearCompleted(), 1000);
  }, [retryAllTasks, clearCompleted]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Queue Statistics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.processing}</div>
          <div className="text-sm text-gray-600">Processing</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-gray-600">Completed</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
          <div className="text-sm text-gray-600">Failed</div>
        </div>
      </div>

      {/* Email Form */}
      <div className="bg-white border rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Send Email</h3>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="To"
            value={emailData.to}
            onChange={(e) => setEmailData(prev => ({ ...prev, to: e.target.value }))}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Subject"
            value={emailData.subject}
            onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
            className="w-full p-2 border rounded"
          />
          <textarea
            placeholder="Body"
            value={emailData.body}
            onChange={(e) => setEmailData(prev => ({ ...prev, body: e.target.value }))}
            className="w-full p-2 border rounded h-24"
          />
          <div className="flex gap-2">
            <button onClick={handleAddEmail} className="px-4 py-2 bg-blue-500 text-white rounded">
              Queue Email
            </button>
            <button onClick={handleBulkActions} className="px-4 py-2 bg-gray-500 text-white rounded">
              Bulk Actions
            </button>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-2">
        {tasks.map(task => (
          <EmailTaskItem key={task.id} task={task} onRetry={retryTask} />
        ))}
      </div>
    </div>
  );
}`;

const contextExample = `import React, { createContext, useContext, useEffect, useState } from 'react';
import { ReliableQueue, QueueManager } from '@aplanka/reliable-queue';

// Create Queue Context
const QueueContext = createContext();

// Queue Provider Component
export function QueueProvider({ children }) {
  const [manager] = useState(() => QueueManager.getInstance());
  const [queues, setQueues] = useState({});

  const createQueue = (name, config) => {
    const queue = manager.createQueue(name, config);
    setQueues(prev => ({ ...prev, [name]: queue }));
    return queue;
  };

  const getQueue = (name) => {
    return queues[name] || manager.getQueue(name);
  };

  return (
    <QueueContext.Provider value={{ 
      manager, 
      queues, 
      createQueue, 
      getQueue 
    }}>
      {children}
    </QueueContext.Provider>
  );
}

// Custom hook to use queue context
export function useQueue(name) {
  const context = useContext(QueueContext);
  if (!context) {
    throw new Error('useQueue must be used within QueueProvider');
  }
  
  return context.getQueue(name);
}

// App with Queue Provider
function App() {
  return (
    <QueueProvider>
      <EmailManager />
      <ImageProcessor />
      <NotificationCenter />
    </QueueProvider>
  );
}

// Components using shared queues
function EmailManager() {
  const emailQueue = useQueue('emails');
  // Use the shared email queue
}

function ImageProcessor() {
  const imageQueue = useQueue('images'); 
  // Use the shared image queue
}`;

const customHookExample = `import { useReliableQueue } from '@aplanka/reliable-queue';
import { useCallback, useMemo } from 'react';

// Custom hook for file uploads
export function useFileUploadQueue() {
  const {
    tasks,
    stats,
    addTask,
    retryTask,
    removeTask,
    queue
  } = useReliableQueue({
    queueName: 'file-uploads',
    maxRetries: 3,
    concurrency: 2,
    persistent: true,
    processor: async (fileData) => {
      const formData = new FormData();
      formData.append('file', fileData.file);
      formData.append('metadata', JSON.stringify(fileData.metadata));

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(\`Upload failed: \${response.statusText}\`);
      }

      return response.json();
    }
  });

  const uploadFile = useCallback((file, metadata = {}) => {
    return addTask({ file, metadata, fileName: file.name });
  }, [addTask]);

  const uploadFiles = useCallback((files, metadata = {}) => {
    return files.map(file => uploadFile(file, metadata));
  }, [uploadFile]);

  const cancelUpload = useCallback((taskId) => {
    return removeTask(taskId);
  }, [removeTask]);

  const uploadProgress = useMemo(() => {
    if (stats.total === 0) return 0;
    return (stats.completed / stats.total) * 100;
  }, [stats.completed, stats.total]);

  const activeUploads = useMemo(() => {
    return tasks.filter(task => 
      task.status === 'pending' || task.status === 'processing'
    );
  }, [tasks]);

  return {
    // Original hook data
    tasks,
    stats,
    retryTask,
    
    // Custom upload functions
    uploadFile,
    uploadFiles,
    cancelUpload,
    
    // Computed values
    uploadProgress,
    activeUploads,
    
    // Status helpers
    isUploading: activeUploads.length > 0,
    hasFailedUploads: stats.failed > 0
  };
}

// Usage in component
function FileUploader() {
  const {
    tasks,
    uploadFile,
    uploadFiles,
    cancelUpload,
    retryTask,
    uploadProgress,
    isUploading,
    hasFailedUploads
  } = useFileUploadQueue();

  const handleFileSelect = (files) => {
    uploadFiles(Array.from(files));
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span>Upload Progress</span>
          <span>{uploadProgress.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: \`\${uploadProgress}%\` }}
          />
        </div>
      </div>

      <input
        type="file"
        multiple
        onChange={(e) => handleFileSelect(e.target.files)}
        className="mb-4"
      />

      {isUploading && (
        <div className="mb-4 p-2 bg-blue-50 rounded">
          Uploading files...
        </div>
      )}

      {hasFailedUploads && (
        <div className="mb-4 p-2 bg-red-50 rounded">
          Some uploads failed. Click retry to try again.
        </div>
      )}

      <div className="space-y-2">
        {tasks.map(task => (
          <FileUploadItem 
            key={task.id}
            task={task}
            onCancel={cancelUpload}
            onRetry={retryTask}
          />
        ))}
      </div>
    </div>
  );
}`;

const realTimeExample = `import React, { useState, useEffect } from 'react';
import { useReliableQueue } from '@aplanka/reliable-queue';

function RealtimeTaskDashboard() {
  const [notifications, setNotifications] = useState([]);
  
  const { tasks, stats, addTask, queue } = useReliableQueue({
    queueName: 'dashboard-tasks',
    processor: async (data) => {
      await processTask(data);
    }
  });

  // Subscribe to queue events for real-time updates
  useEffect(() => {
    const unsubscribeCompleted = queue.on('taskCompleted', (task) => {
      setNotifications(prev => [...prev, {
        id: Date.now(),
        type: 'success',
        message: \`Task \${task.id} completed successfully\`,
        timestamp: new Date()
      }]);
    });

    const unsubscribeFailed = queue.on('taskFailed', (task, error) => {
      setNotifications(prev => [...prev, {
        id: Date.now(),
        type: 'error',
        message: \`Task \${task.id} failed: \${error.message}\`,
        timestamp: new Date()
      }]);
    });

    const unsubscribeStarted = queue.on('taskStarted', (task) => {
      setNotifications(prev => [...prev, {
        id: Date.now(),
        type: 'info',
        message: \`Task \${task.id} started processing\`,
        timestamp: new Date()
      }]);
    });

    return () => {
      unsubscribeCompleted();
      unsubscribeFailed();
      unsubscribeStarted();
    };
  }, [queue]);

  // Auto-clear old notifications
  useEffect(() => {
    const timer = setInterval(() => {
      setNotifications(prev => 
        prev.filter(notif => Date.now() - notif.timestamp.getTime() < 10000)
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Real-time Stats */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Queue Stats</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Total Tasks:</span>
            <span className="font-bold">{stats.total}</span>
          </div>
          <div className="flex justify-between">
            <span>Processing:</span>
            <span className="font-bold text-blue-600">{stats.processing}</span>
          </div>
          <div className="flex justify-between">
            <span>Completed:</span>
            <span className="font-bold text-green-600">{stats.completed}</span>
          </div>
          <div className="flex justify-between">
            <span>Failed:</span>
            <span className="font-bold text-red-600">{stats.failed}</span>
          </div>
        </div>
      </div>

      {/* Live Task List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Active Tasks</h3>
        <div className="max-h-64 overflow-y-auto space-y-2">
          {tasks.slice(0, 10).map(task => (
            <div key={task.id} className="p-2 bg-gray-50 rounded text-sm">
              <div className="flex justify-between items-center">
                <span className="truncate">{task.id}</span>
                <TaskStatusBadge status={task.status} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Notifications */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Live Updates</h3>
        <div className="max-h-64 overflow-y-auto space-y-2">
          {notifications.map(notification => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </div>
      </div>
    </div>
  );
}`;

const hookOptions = [
  {
    name: 'queueName',
    type: 'string',
    required: false,
    description: 'Name for the queue (enables sharing across components)',
    default: 'undefined'
  },
  {
    name: 'processor',
    type: 'TaskProcessor<T>',
    required: false,
    description: 'Function to process tasks',
    default: 'undefined'
  },
  {
    name: 'useSingleton',
    type: 'boolean',
    required: false,
    description: 'Use singleton QueueManager for named queues',
    default: 'true'
  },
  {
    name: 'maxRetries',
    type: 'number',
    required: false,
    description: 'Maximum retry attempts',
    default: '3'
  },
  {
    name: 'retryDelay',
    type: 'number',
    required: false,
    description: 'Base retry delay in milliseconds',
    default: '1000'
  },
  {
    name: 'exponentialBackoff',
    type: 'boolean',
    required: false,
    description: 'Use exponential backoff for retries',
    default: 'true'
  },
  {
    name: 'concurrency',
    type: 'number',
    required: false,
    description: 'Maximum concurrent tasks',
    default: '1'
  },
  {
    name: 'persistent',
    type: 'boolean',
    required: false,
    description: 'Persist queue to localStorage',
    default: 'false'
  }
];

const returnValues = [
  { name: 'tasks', type: 'QueuedTask<T>[]', description: 'Array of all tasks in the queue' },
  { name: 'stats', type: 'QueueStats', description: 'Current queue statistics' },
  { name: 'addTask', type: '(data: T, options?: AddTaskOptions) => string', description: 'Add a task and return its ID' },
  { name: 'removeTask', type: '(taskId: string) => boolean', description: 'Remove a task by ID' },
  { name: 'retryTask', type: '(taskId: string) => boolean', description: 'Retry a failed task' },
  { name: 'retryAllTasks', type: '() => number', description: 'Retry all failed tasks' },
  { name: 'clearCompleted', type: '() => number', description: 'Clear completed tasks' },
  { name: 'clearFailed', type: '() => number', description: 'Clear failed tasks' },
  { name: 'clearAll', type: '() => void', description: 'Clear all tasks' },
  { name: 'getTask', type: '(taskId: string) => QueuedTask<T> | undefined', description: 'Get task by ID' },
  { name: 'setProcessor', type: '(processor: TaskProcessor<T>) => void', description: 'Set task processor' },
  { name: 'queue', type: 'ReliableQueue<T>', description: 'Direct access to queue instance' }
];

export default function ReactIntegrationPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-600 via-red-700 to-orange-800 pt-20">
        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <Link
            href="/docs"
            className="inline-flex items-center text-orange-200 hover:text-white transition-colors duration-200 mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Documentation
          </Link>
          
          <div className="flex items-center mb-6">
            <div className="bg-white/10 p-3 rounded-xl mr-4 backdrop-blur-sm border border-white/20">
              <Wrench className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              React Integration
            </h1>
          </div>
          <p className="text-xl text-orange-100 max-w-3xl">
            Complete guide to using Reliable Queue with React applications, including hooks, context, and real-time updates.
          </p>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Navigation</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="#basic-usage" className="flex items-center text-sm text-gray-600 hover:text-orange-600 transition-colors duration-200">
              <Zap className="h-4 w-4 mr-2" />
              Basic Usage
            </Link>
            <Link href="#advanced-hook" className="flex items-center text-sm text-gray-600 hover:text-orange-600 transition-colors duration-200">
              <Code2 className="h-4 w-4 mr-2" />
              Advanced Hook
            </Link>
            <Link href="#context" className="flex items-center text-sm text-gray-600 hover:text-orange-600 transition-colors duration-200">
              <Layers className="h-4 w-4 mr-2" />
              Context Pattern
            </Link>
            <Link href="#realtime" className="flex items-center text-sm text-gray-600 hover:text-orange-600 transition-colors duration-200">
              <RefreshCw className="h-4 w-4 mr-2" />
              Real-time Updates
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {/* Basic Usage */}
        <section id="basic-usage" className="mb-20">
          <div className="flex items-center mb-8">
            <Zap className="h-8 w-8 text-orange-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Basic Usage</h2>
          </div>
          
          <p className="text-lg text-gray-600 mb-8">
            The <code>useReliableQueue</code> hook provides a simple way to integrate queue functionality into your React components.
          </p>

          <CodeBlock
            code={basicHookExample}
            language="tsx"
            title="Basic useReliableQueue Hook"
          />

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center mb-3">
                <Play className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Automatic Processing</h3>
              </div>
              <p className="text-gray-700 text-sm">
                Tasks are processed automatically when you provide a processor function to the hook.
              </p>
            </div>
            
            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
              <div className="flex items-center mb-3">
                <RefreshCw className="h-5 w-5 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Reactive Updates</h3>
              </div>
              <p className="text-gray-700 text-sm">
                Component re-renders automatically when queue state changes, keeping your UI in sync.
              </p>
            </div>
            
            <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
              <div className="flex items-center mb-3">
                <Settings className="h-5 w-5 text-purple-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Full Configuration</h3>
              </div>
              <p className="text-gray-700 text-sm">
                All queue configuration options are available through the hook options.
              </p>
            </div>
          </div>
        </section>

        {/* Hook API Reference */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Hook API Reference</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Hook Options */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">Hook Options</h3>
                <p className="text-sm text-gray-600 mt-1">Configuration options for useReliableQueue</p>
              </div>
              <div className="divide-y divide-gray-200">
                {hookOptions.map((option) => (
                  <div key={option.name} className="px-6 py-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-sm font-semibold font-mono text-gray-900">
                          {option.name}{option.required ? '' : '?'}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                      </div>
                      <span className="text-xs font-mono bg-blue-50 text-blue-700 px-2 py-1 rounded whitespace-nowrap ml-2">
                        {option.type}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Default: {option.default}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Return Values */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">Return Values</h3>
                <p className="text-sm text-gray-600 mt-1">Values returned by the hook</p>
              </div>
              <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {returnValues.map((value) => (
                  <div key={value.name} className="px-6 py-4">
                    <h4 className="text-sm font-semibold font-mono text-gray-900 mb-1">
                      {value.name}
                    </h4>
                    <p className="text-xs font-mono bg-purple-50 text-purple-700 px-2 py-1 rounded inline-block mb-2">
                      {value.type}
                    </p>
                    <p className="text-sm text-gray-600">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Advanced Hook Usage */}
        <section id="advanced-hook" className="mb-20">
          <div className="flex items-center mb-8">
            <Code2 className="h-8 w-8 text-blue-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Advanced Hook Usage</h2>
          </div>
          
          <p className="text-lg text-gray-600 mb-8">
            Build sophisticated queue-powered components with full type safety and advanced features.
          </p>

          <CodeBlock
            code={advancedHookExample}
            language="tsx"
            title="Advanced Email Queue Manager"
          />
        </section>

        {/* Context Pattern */}
        <section id="context" className="mb-20">
          <div className="flex items-center mb-8">
            <Layers className="h-8 w-8 text-purple-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Context Pattern</h2>
          </div>
          
          <p className="text-lg text-gray-600 mb-8">
            Share queues across multiple components using React Context for global state management.
          </p>

          <CodeBlock
            code={contextExample}
            language="tsx"
            title="Queue Context Provider"
          />

          <div className="mt-8 bg-purple-50 rounded-xl p-6 border border-purple-200">
            <div className="flex items-center mb-4">
              <Layers className="h-6 w-6 text-purple-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Benefits of Context Pattern</h3>
            </div>
            <ul className="text-gray-700 space-y-2 text-sm">
              <li>• Share queue instances across multiple components</li>
              <li>• Centralized queue management and configuration</li>
              <li>• Consistent queue naming and lifecycle management</li>
              <li>• Better performance through singleton pattern</li>
            </ul>
          </div>
        </section>

        {/* Custom Hooks */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Custom Queue Hooks</h2>
          
          <p className="text-lg text-gray-600 mb-8">
            Create domain-specific hooks that encapsulate queue logic for specific use cases.
          </p>

          <CodeBlock
            code={customHookExample}
            language="tsx"
            title="Custom File Upload Hook"
          />

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Advantages</h3>
              </div>
              <ul className="text-gray-700 text-sm space-y-2">
                <li>• Encapsulate domain-specific logic</li>
                <li>• Provide convenient helper functions</li>
                <li>• Add computed values and state</li>
                <li>• Improve reusability across components</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center mb-4">
                <Code2 className="h-6 w-6 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Use Cases</h3>
              </div>
              <ul className="text-gray-700 text-sm space-y-2">
                <li>• File upload queues with progress tracking</li>
                <li>• Email sending with delivery status</li>
                <li>• Image processing pipelines</li>
                <li>• API call batching and retries</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Real-time Updates */}
        <section id="realtime" className="mb-20">
          <div className="flex items-center mb-8">
            <RefreshCw className="h-8 w-8 text-red-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Real-time Updates</h2>
          </div>
          
          <p className="text-lg text-gray-600 mb-8">
            Build live dashboards and real-time interfaces using queue events and automatic re-renders.
          </p>

          <CodeBlock
            code={realTimeExample}
            language="tsx"
            title="Real-time Task Dashboard"
          />

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-red-50 rounded-xl p-6 border border-red-200">
              <div className="flex items-center mb-3">
                <RefreshCw className="h-5 w-5 text-red-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Live Updates</h3>
              </div>
              <p className="text-gray-700 text-sm">
                Components automatically re-render when queue state changes, keeping your UI synchronized.
              </p>
            </div>
            
            <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
              <div className="flex items-center mb-3">
                <Clock className="h-5 w-5 text-yellow-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Event Subscriptions</h3>
              </div>
              <p className="text-gray-700 text-sm">
                Subscribe to specific events for custom notifications and UI updates.
              </p>
            </div>
            
            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
              <div className="flex items-center mb-3">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Performance</h3>
              </div>
              <p className="text-gray-700 text-sm">
                Efficient updates using React&apos;s built-in optimization and selective re-rendering.
              </p>
            </div>
          </div>
        </section>

        {/* TypeScript Integration */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">TypeScript Integration</h2>
          
          <p className="text-lg text-gray-600 mb-8">
            Reliable Queue provides full TypeScript support with type-safe hooks and interfaces.
          </p>

          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Type Safety Features</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-2">Generic Hook</h4>
                <pre className="text-sm bg-white p-3 rounded border font-mono">
{`// Type-safe task data
interface MyTask {
  userId: string;
  action: string;
}

const { addTask, tasks } = useReliableQueue<MyTask>({
  processor: async (data: MyTask) => {
    // data is properly typed
  }
});`}
                </pre>
              </div>
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-2">Return Types</h4>
                <pre className="text-sm bg-white p-3 rounded border font-mono">
{`// All return values are properly typed
const {
  tasks,        // QueuedTask<MyTask>[]
  stats,        // QueueStats
  addTask,      // (data: MyTask) => string
  retryTask,    // (id: string) => boolean
} = useReliableQueue<MyTask>();`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-200">
          <div className="flex items-center mb-4">
            <Wrench className="h-6 w-6 text-orange-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">React Integration Best Practices</h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Hook Usage</h4>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>• Use meaningful queue names for shared queues</li>
                <li>• Provide processor functions for automatic processing</li>
                <li>• Enable persistence for critical user data</li>
                <li>• Use TypeScript generics for type safety</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Performance Tips</h4>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>• Use useMemo and useCallback for expensive operations</li>
                <li>• Unsubscribe from events in useEffect cleanup</li>
                <li>• Consider pagination for large task lists</li>
                <li>• Use React.memo for task item components</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/docs/api"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-orange-600 text-white hover:bg-orange-700 transition-colors duration-200"
            >
              API Reference
            </Link>
            <Link
              href="/docs/events"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors duration-200"
            >
              Events & Monitoring
            </Link>
            <Link
              href="/examples"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-600 text-white hover:bg-gray-700 transition-colors duration-200"
            >
              View Examples
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
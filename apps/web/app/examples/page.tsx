import Link from 'next/link';
import { FileUp, Mail, Database, Code2, ExternalLink, Play } from 'lucide-react';
import CodeBlock from '../../components/CodeBlock';

// File upload example code
const fileUploadCode = `import { ReliableQueue } from '@aplanka/reliable-queue';

interface FileUploadData {
  id: string;
  fileName: string;
  fileSize: number;
  uploadUrl: string;
  metadata?: {
    userId: string;
    folder: string;
    tags?: string[];
  };
}

// Create a file upload queue
const uploadQueue = new ReliableQueue<FileUploadData>({
  maxRetries: 3,
  retryDelay: 1000,
  exponentialBackoff: true,
  persistent: true,
  storageKey: 'file-upload-queue',
  concurrency: 2, // Upload 2 files concurrently
});

// Set up the processor
uploadQueue.setProcessor(async (data) => {
  console.log('Uploading file:', data.fileName);
  
  const formData = new FormData();
  formData.append('fileName', data.fileName);
  formData.append('fileSize', data.fileSize.toString());
  
  if (data.metadata) {
    formData.append('metadata', JSON.stringify(data.metadata));
  }

  const response = await fetch(data.uploadUrl, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(\`Upload failed: \${response.status}\`);
  }

  console.log('File uploaded successfully:', data.fileName);
});

// Add event handlers
uploadQueue.on('taskCompleted', (task) => {
  console.log('✅ File uploaded:', task.data.fileName);
});

uploadQueue.on('taskFailed', (task, error) => {
  console.error('❌ Upload failed:', task.data.fileName, error.message);
});

// Usage
export function addFileUpload(fileData: Omit<FileUploadData, 'id'>) {
  const id = \`upload-\${Date.now()}-\${Math.random().toString(36).substr(2, 9)}\`;
  return uploadQueue.add({ ...fileData, id });
}`;

// React data processing example
const reactProcessingCode = `import React, { useState } from 'react';
import { useReliableQueue } from '@aplanka/reliable-queue';

interface ProcessingTask {
  id: string;
  type: 'email' | 'report' | 'export' | 'analysis';
  data: string;
  priority?: number;
}

export function DataProcessingExample() {
  const [taskType, setTaskType] = useState<ProcessingTask['type']>('email');
  const [taskData, setTaskData] = useState('');

  const {
    tasks,
    stats,
    addTask,
    retryTask,
    removeTask,
    clearFailed,
    retryAllTasks,
  } = useReliableQueue<ProcessingTask>({
    queueName: 'data-processing',
    maxRetries: 3,
    retryDelay: 1000,
    exponentialBackoff: true,
    persistent: true,
    concurrency: 2, // Process 2 tasks concurrently
    processor: async (data) => {
      console.log('Processing task:', data.type, data.id);
      
      // Simulate different processing times
      const processingTime = {
        email: 500,
        report: 2000,
        export: 1500,
        analysis: 3000,
      }[data.type];

      // Simulate API call that might fail
      if (Math.random() < 0.2) {
        throw new Error(\`\${data.type} processing failed\`);
      }

      await new Promise(resolve => setTimeout(resolve, processingTime));
      console.log(\`\${data.type} task completed:\`, data.id);
    },
  });

  const handleAddTask = () => {
    if (!taskData.trim()) return;

    const taskId = \`\${taskType}-\${Date.now()}-\${Math.random().toString(36).substr(2, 9)}\`;
    
    addTask({
      id: taskId,
      type: taskType,
      data: taskData.trim(),
      priority: taskType === 'email' ? 10 : taskType === 'report' ? 5 : 1,
    });

    setTaskData('');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Data Processing Queue</h2>
      
      {/* Queue Statistics */}
      <div style={{ background: '#f5f5f5', padding: '10px', marginBottom: '20px' }}>
        <h3>Queue Statistics</h3>
        <div>
          <span>Total: {stats.total}</span>
          <span>Pending: {stats.pending}</span>
          <span>Processing: {stats.processing}</span>
          <span>Completed: {stats.completed}</span>
          <span>Failed: {stats.failed}</span>
        </div>
      </div>

      {/* Task Input */}
      <div style={{ marginBottom: '20px' }}>
        <select
          value={taskType}
          onChange={(e) => setTaskType(e.target.value as ProcessingTask['type'])}
        >
          <option value="email">Email Processing</option>
          <option value="report">Report Generation</option>
          <option value="export">Data Export</option>
          <option value="analysis">Data Analysis</option>
        </select>
        
        <input
          type="text"
          value={taskData}
          onChange={(e) => setTaskData(e.target.value)}
          placeholder="Enter task data..."
          onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
        />
        
        <button onClick={handleAddTask}>
          Add {taskType} Task
        </button>
      </div>

      {/* Task List */}
      <div>
        <h3>Processing Queue</h3>
        {tasks.length === 0 ? (
          <p>No tasks in queue</p>
        ) : (
          tasks.map((task) => (
            <div key={task.id} style={{ border: '1px solid #ddd', padding: '10px', margin: '5px' }}>
              <div>
                <strong>{task.data.data}</strong>
                <span> - {task.status}</span>
                {task.retryCount > 0 && <span> (Retries: {task.retryCount})</span>}
              </div>
              
              {task.status === 'failed' && (
                <button onClick={() => retryTask(task.id)}>Retry</button>
              )}
              
              {task.status !== 'processing' && (
                <button onClick={() => removeTask(task.id)}>Remove</button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}`;

const emailQueueCode = `import { ReliableQueue, QueueManager } from '@aplanka/reliable-queue';

interface EmailTask {
  to: string;
  subject: string;
  body: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  templateId?: string;
  attachments?: string[];
}

// Create specialized email queue
const emailQueue = new ReliableQueue<EmailTask>({
  maxRetries: 5, // Important emails should retry more
  retryDelay: 2000,
  exponentialBackoff: true,
  maxRetryDelay: 60000, // Max 1 minute delay
  concurrency: 3, // Send 3 emails concurrently
  persistent: true,
});

emailQueue.setProcessor(async (emailData) => {
  console.log(\`Sending email to \${emailData.to}\`);
  
  // Simulate email API call
  const response = await fetch('/api/send-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(emailData),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(\`Email send failed: \${error}\`);
  }
  
  return response.json();
});

// Add priority-based processing
emailQueue.on('taskCompleted', (task) => {
  console.log(\`✅ Email sent to \${task.data.to}\`);
  // Log to analytics, update user notification status, etc.
});

// Usage examples
export function sendWelcomeEmail(userEmail: string, userName: string) {
  return emailQueue.add({
    to: userEmail,
    subject: 'Welcome to our platform!',
    body: \`Hello \${userName}, welcome to our platform!\`,
    priority: 'high',
    templateId: 'welcome-email',
  }, { priority: 10 }); // High priority
}

export function sendPasswordReset(userEmail: string, resetToken: string) {
  return emailQueue.add({
    to: userEmail,
    subject: 'Password Reset Request',
    body: \`Click here to reset: /reset?token=\${resetToken}\`,
    priority: 'urgent',
    templateId: 'password-reset',
  }, { priority: 100 }); // Highest priority
}

export function sendNewsletter(subscribers: string[], content: string) {
  subscribers.forEach(email => {
    emailQueue.add({
      to: email,
      subject: 'Weekly Newsletter',
      body: content,
      priority: 'low',
      templateId: 'newsletter',
    }, { priority: 1 }); // Low priority
  });
}`;

const batchProcessingCode = `import { ReliableQueue } from '@aplanka/reliable-queue';

interface BatchJob {
  id: string;
  type: 'image-resize' | 'data-export' | 'report-generation';
  batchSize: number;
  items: any[];
  progress?: {
    processed: number;
    total: number;
    currentItem?: string;
  };
}

const batchQueue = new ReliableQueue<BatchJob>({
  maxRetries: 2,
  retryDelay: 5000,
  exponentialBackoff: true,
  concurrency: 1, // Process batches one at a time
  persistent: true,
});

batchQueue.setProcessor(async (job) => {
  console.log(\`Starting batch job: \${job.type}\`);
  
  const results = [];
  
  for (let i = 0; i < job.items.length; i++) {
    const item = job.items[i];
    
    try {
      // Update progress (this would typically be saved to database)
      const progress = {
        processed: i,
        total: job.items.length,
        currentItem: item.id || item.name || \`Item \${i + 1}\`,
      };
      
      console.log(\`Processing \${progress.currentItem} (\${progress.processed + 1}/\${progress.total})\`);
      
      // Process individual item based on job type
      let result;
      switch (job.type) {
        case 'image-resize':
          result = await resizeImage(item);
          break;
        case 'data-export':
          result = await exportData(item);
          break;
        case 'report-generation':
          result = await generateReport(item);
          break;
        default:
          throw new Error(\`Unknown job type: \${job.type}\`);
      }
      
      results.push({ item: item.id, result, status: 'success' });
      
    } catch (error) {
      console.error(\`Failed to process item \${item.id}:\`, error);
      results.push({ item: item.id, error: error.message, status: 'failed' });
    }
  }
  
  console.log(\`Batch job completed: \${job.type}\`);
  return {
    jobId: job.id,
    results,
    summary: {
      total: results.length,
      successful: results.filter(r => r.status === 'success').length,
      failed: results.filter(r => r.status === 'failed').length,
    }
  };
});

// Helper functions (implement based on your needs)
async function resizeImage(image: any) {
  // Simulate image processing
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { url: \`/resized/\${image.id}.jpg\`, width: 800, height: 600 };
}

async function exportData(data: any) {
  // Simulate data export
  await new Promise(resolve => setTimeout(resolve, 500));
  return { file: \`/exports/\${data.id}.csv\`, size: 1024 };
}

async function generateReport(reportConfig: any) {
  // Simulate report generation
  await new Promise(resolve => setTimeout(resolve, 2000));
  return { file: \`/reports/\${reportConfig.id}.pdf\`, pages: 10 };
}

// Usage
export function processBatchImages(images: any[]) {
  return batchQueue.add({
    id: \`batch-\${Date.now()}\`,
    type: 'image-resize',
    batchSize: images.length,
    items: images,
  });
}`;

const examples = [
  {
    title: 'File Upload Queue',
    description: 'Reliable file uploads with retry logic, progress tracking, and concurrent processing.',
    icon: FileUp,
    color: 'bg-blue-50 text-blue-600 border-blue-200',
    code: fileUploadCode,
    language: 'typescript',
    tags: ['File Upload', 'Concurrency', 'Error Handling'],
  },
  {
    title: 'React Data Processing',
    description: 'Interactive React component demonstrating queue integration with real-time updates.',
    icon: Code2,
    color: 'bg-purple-50 text-purple-600 border-purple-200',
    code: reactProcessingCode,
    language: 'tsx',
    tags: ['React', 'Hooks', 'Real-time Updates'],
  },
  {
    title: 'Email Queue System',
    description: 'Priority-based email processing with different retry strategies for different email types.',
    icon: Mail,
    color: 'bg-green-50 text-green-600 border-green-200',
    code: emailQueueCode,
    language: 'typescript',
    tags: ['Email', 'Priority Queue', 'Event Handling'],
  },
  {
    title: 'Batch Processing',
    description: 'Process large batches of items with progress tracking and individual error handling.',
    icon: Database,
    color: 'bg-orange-50 text-orange-600 border-orange-200',
    code: batchProcessingCode,
    language: 'typescript',
    tags: ['Batch Processing', 'Progress Tracking', 'Error Recovery'],
  },
];

export default function ExamplesPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Code2 className="mx-auto h-12 w-12 text-white mb-6" />
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Examples
            </h1>
            <p className="mt-6 text-lg leading-8 text-green-100">
              Real-world examples showing how to use Reliable Queue in different scenarios.
              Copy the code and adapt it to your needs.
            </p>
          </div>
        </div>
      </div>

      {/* Examples */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="space-y-24">
            {examples.map((example) => (
              <div key={example.title} className="relative">
                <div className="mx-auto max-w-4xl">
                  <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
                    <div className="lg:col-span-5">
                      <div className={`inline-flex rounded-lg p-3 ${example.color} border`}>
                        <example.icon className="h-6 w-6" />
                      </div>
                      <h3 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
                        {example.title}
                      </h3>
                      <p className="mt-4 text-lg text-gray-600">
                        {example.description}
                      </p>
                      <div className="mt-6 flex flex-wrap gap-2">
                        {example.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-8 lg:mt-0 lg:col-span-7">
                      <CodeBlock
                        code={example.code}
                        language={example.language}
                        title={example.title}
                        showLineNumbers={true}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Ready to try it yourself?
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Experience Reliable Queue in action with our interactive demo, or dive into the full documentation.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/demo"
                className="rounded-md bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-500 flex items-center gap-2"
              >
                <Play className="h-4 w-4" />
                Try Interactive Demo
              </Link>
              <Link
                href="/docs"
                className="text-sm font-semibold leading-6 text-gray-900 hover:text-green-600 flex items-center gap-2"
              >
                View Documentation
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
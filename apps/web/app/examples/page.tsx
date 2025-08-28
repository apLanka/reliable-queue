import Link from 'next/link';
import { FileUp, Mail, Database, Code2, ExternalLink, Play, Sparkles, ArrowRight, Copy, Check } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-mesh opacity-5"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-3/4 left-1/2 w-96 h-96 bg-green-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float" style={{animationDelay: '4s'}}></div>
      {/* Header */}
      <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-green-600 overflow-hidden">
        {/* Header Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center animate-fadeInUp">
            <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium bg-white/10 text-white border border-white/20 mb-8 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 mr-2" />
              Real-World Examples
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl lg:text-8xl text-balance">
              Code Examples
            </h1>
            <p className="mt-8 text-xl leading-8 text-white/90 max-w-2xl mx-auto text-pretty">
              Discover how to implement Reliable Queue in real-world scenarios. 
              <span className="text-yellow-300 font-medium">Copy, paste, and customize</span> these production-ready examples.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/demo"
                className="group relative flex items-center gap-3 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
              >
                <Play className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                <span>Try Live Demo</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Examples */}
      <div className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-20 animate-fadeInUp">
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl text-balance">
              Production-Ready
              <span className="gradient-text"> Examples</span>
            </h2>
            <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto text-pretty">
              Copy these battle-tested implementations and adapt them to your specific use cases
            </p>
          </div>
          
          <div className="space-y-32">
            {examples.map((example, index) => (
              <div key={example.title} className={`relative group animate-slideInUp`} style={{animationDelay: `${index * 200}ms`}}>
                {/* Decorative background */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                
                <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                  <div className="lg:grid lg:grid-cols-12 lg:gap-0 items-stretch">
                    <div className="lg:col-span-5 p-12 bg-gradient-to-br from-gray-50 to-white">
                      <div className="h-full flex flex-col justify-center">
                        <div className={`inline-flex rounded-2xl p-4 ${example.color} border-2 mb-8 group-hover:scale-110 transition-transform duration-300`}>
                          <example.icon className="h-8 w-8" />
                        </div>
                        <h3 className="text-3xl font-bold tracking-tight text-gray-900 mb-6 group-hover:text-blue-600 transition-colors duration-300">
                          {example.title}
                        </h3>
                        <p className="text-lg text-gray-600 leading-relaxed mb-8">
                          {example.description}
                        </p>
                        <div className="flex flex-wrap gap-3 mb-8">
                          {example.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200 hover:shadow-md transition-shadow duration-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center space-x-4">
                          <button className="group/btn flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                            <Copy className="h-4 w-4 group-hover/btn:scale-110 transition-transform duration-300" />
                            <span>Copy Code</span>
                          </button>
                          <Link 
                            href="/demo"
                            className="group/btn flex items-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:border-blue-300 hover:text-blue-600 transition-all duration-300"
                          >
                            <Play className="h-4 w-4 group-hover/btn:scale-110 transition-transform duration-300" />
                            <span>Try Demo</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="lg:col-span-7 relative">
                      <div className="sticky top-8">
                        <div className="relative">
                          <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 rounded-2xl blur opacity-20"></div>
                          <div className="relative">
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-24 sm:py-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-green-600"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-mesh opacity-10"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center animate-fadeInUp">
            <div className="inline-flex items-center px-6 py-3 rounded-full text-sm font-medium bg-white/10 text-white border border-white/20 mb-8 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
              Ready to Build?
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl text-balance">
              Start Building with
              <span className="bg-gradient-to-r from-yellow-400 via-pink-500 to-red-500 bg-clip-text text-transparent"> Reliable Queue</span>
            </h2>
            <p className="mt-8 text-xl leading-8 text-white/90 max-w-3xl mx-auto text-pretty">
              Experience the power of reliable task processing with our interactive demo, 
              or dive deep into the comprehensive documentation.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                href="/demo"
                className="group relative flex items-center gap-3 px-8 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl min-w-[200px] justify-center"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 to-pink-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                <div className="relative flex items-center gap-3">
                  <Play className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                  <span>Try Interactive Demo</span>
                </div>
              </Link>
              <Link
                href="/docs"
                className="group flex items-center gap-3 px-8 py-4 border-2 border-white/30 text-white rounded-xl font-semibold text-lg hover:bg-white/10 hover:border-white/50 transition-all duration-300 min-w-[200px] justify-center backdrop-blur-sm"
              >
                <span>View Documentation</span>
                <ExternalLink className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </Link>
            </div>
            
            {/* Feature highlights */}
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-xl border border-white/20 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Code2 className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">TypeScript Ready</h3>
                <p className="text-sm text-white/80">Full type safety and IntelliSense support</p>
              </div>
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-xl border border-white/20 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Database className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">Persistent Storage</h3>
                <p className="text-sm text-white/80">Built-in persistence for reliability</p>
              </div>
              <div className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-xl border border-white/20 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">Production Ready</h3>
                <p className="text-sm text-white/80">Battle-tested in real applications</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
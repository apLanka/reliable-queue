import Link from 'next/link';
import { ArrowLeft, Settings, Clock, Zap, Database, Layers, AlertTriangle, CheckCircle, Repeat } from 'lucide-react';
import CodeBlock from '../../../components/CodeBlock';

const basicConfigExample = `import { ReliableQueue } from '@aplanka/reliable-queue';

const queue = new ReliableQueue({
  maxRetries: 3,
  retryDelay: 1000,
  exponentialBackoff: true,
  concurrency: 2,
  persistent: false,
  storageKey: 'my-app-queue'
});`;

const retryConfigExample = `// Linear retry delays (1s, 1s, 1s)
const linearQueue = new ReliableQueue({
  maxRetries: 3,
  retryDelay: 1000,
  exponentialBackoff: false
});

// Exponential backoff (1s, 2s, 4s, 8s)
const exponentialQueue = new ReliableQueue({
  maxRetries: 4,
  retryDelay: 1000,
  exponentialBackoff: true,
  maxRetryDelay: 10000 // Cap at 10 seconds
});

// Custom retry logic
queue.setProcessor(async (data, task) => {
  try {
    await processTask(data);
  } catch (error) {
    // Handle specific error types differently
    if (error.code === 'RATE_LIMIT') {
      // Longer delay for rate limit errors
      task.processAt = Date.now() + 60000; // 1 minute
      throw error;
    }
    throw error;
  }
});`;

const concurrencyExample = `// Process one task at a time (default)
const serialQueue = new ReliableQueue({
  concurrency: 1
});

// Process up to 5 tasks simultaneously
const parallelQueue = new ReliableQueue({
  concurrency: 5
});

// Different concurrency for different queue types
const emailQueue = new ReliableQueue({
  concurrency: 3  // Send 3 emails at once
});

const imageQueue = new ReliableQueue({
  concurrency: 1  // Process images one at a time
});`;

const persistenceExample = `// Browser persistence with localStorage
const persistentQueue = new ReliableQueue({
  persistent: true,
  storageKey: 'user-tasks'  // Custom storage key
});

// Node.js - persistence is automatically disabled
const nodeQueue = new ReliableQueue({
  persistent: true  // Will be ignored in Node.js
});

// Check if persistence is active
if (queue.config.persistent) {
  console.log('Queue will survive page refreshes');
}`;

const advancedConfigExample = `import { ReliableQueue, QueueManager } from '@aplanka/reliable-queue';

// High-throughput email queue
const emailQueue = new ReliableQueue({
  maxRetries: 5,           // Email delivery is critical
  retryDelay: 2000,        // Start with 2 second delays
  exponentialBackoff: true,
  maxRetryDelay: 300000,   // Max 5 minutes between retries
  concurrency: 10,         // Send 10 emails simultaneously
  persistent: true,
  storageKey: 'email-queue'
});

// Image processing queue
const imageQueue = new ReliableQueue({
  maxRetries: 2,           // Images can be reprocessed easily
  retryDelay: 5000,        // Longer initial delay
  exponentialBackoff: true,
  maxRetryDelay: 60000,    // Max 1 minute between retries
  concurrency: 2,          // CPU intensive, limit concurrency
  persistent: false        // Don't persist large image data
});

// Background sync queue
const syncQueue = new ReliableQueue({
  maxRetries: 10,          // Keep trying for a long time
  retryDelay: 1000,
  exponentialBackoff: true,
  maxRetryDelay: 3600000,  // Max 1 hour between retries
  concurrency: 1,          // Ensure ordered processing
  persistent: true,
  storageKey: 'sync-queue'
});`;

const configurationOptions = [
  {
    name: 'maxRetries',
    type: 'number',
    defaultValue: '3',
    description: 'Maximum number of retry attempts before marking a task as failed.',
    icon: Repeat,
    color: 'text-blue-600',
    examples: [
      { value: '0', use: 'No retries - fail immediately' },
      { value: '3', use: 'Standard retry behavior' },
      { value: '10', use: 'Critical tasks that must succeed' }
    ]
  },
  {
    name: 'retryDelay',
    type: 'number',
    defaultValue: '1000',
    description: 'Base delay in milliseconds before retrying a failed task.',
    icon: Clock,
    color: 'text-green-600',
    examples: [
      { value: '500', use: 'Fast retries for quick operations' },
      { value: '1000', use: 'Standard 1 second delay' },
      { value: '5000', use: 'Longer delays for heavy operations' }
    ]
  },
  {
    name: 'exponentialBackoff',
    type: 'boolean',
    defaultValue: 'true',
    description: 'Whether to use exponential backoff for retry delays (doubles each retry).',
    icon: Zap,
    color: 'text-purple-600',
    examples: [
      { value: 'true', use: 'Delays: 1s, 2s, 4s, 8s...' },
      { value: 'false', use: 'Delays: 1s, 1s, 1s, 1s...' }
    ]
  },
  {
    name: 'maxRetryDelay',
    type: 'number',
    defaultValue: '30000',
    description: 'Maximum delay in milliseconds for exponential backoff (prevents extremely long delays).',
    icon: AlertTriangle,
    color: 'text-orange-600',
    examples: [
      { value: '10000', use: 'Cap at 10 seconds' },
      { value: '30000', use: 'Standard 30 second cap' },
      { value: '300000', use: 'Allow up to 5 minute delays' }
    ]
  },
  {
    name: 'concurrency',
    type: 'number',
    defaultValue: '1',
    description: 'Maximum number of tasks that can be processed simultaneously.',
    icon: Layers,
    color: 'text-indigo-600',
    examples: [
      { value: '1', use: 'Serial processing (default)' },
      { value: '5', use: 'Moderate parallelism' },
      { value: '20', use: 'High throughput processing' }
    ]
  },
  {
    name: 'persistent',
    type: 'boolean',
    defaultValue: 'false',
    description: 'Whether to persist queue state to localStorage (browser only).',
    icon: Database,
    color: 'text-red-600',
    examples: [
      { value: 'false', use: 'In-memory only (default)' },
      { value: 'true', use: 'Survive page refreshes' }
    ]
  },
  {
    name: 'storageKey',
    type: 'string',
    defaultValue: "'reliable-queue'",
    description: 'localStorage key for persistent queues (when persistent: true).',
    icon: Database,
    color: 'text-cyan-600',
    examples: [
      { value: "'app-queue'", use: 'Custom storage key' },
      { value: "'user-123-tasks'", use: 'User-specific queue' },
      { value: "'reliable-queue'", use: 'Default storage key' }
    ]
  }
];

const bestPractices = [
  {
    title: 'Email Delivery',
    icon: CheckCircle,
    color: 'text-green-600',
    config: {
      maxRetries: 5,
      retryDelay: 2000,
      exponentialBackoff: true,
      concurrency: 10,
      persistent: true
    },
    rationale: 'High retry count for delivery reliability, good concurrency for throughput, persistent to survive restarts.'
  },
  {
    title: 'Image Processing',
    icon: Zap,
    color: 'text-blue-600',
    config: {
      maxRetries: 2,
      retryDelay: 5000,
      exponentialBackoff: true,
      concurrency: 2,
      persistent: false
    },
    rationale: 'Lower retries (images can be reprocessed), limited concurrency (CPU intensive), non-persistent (large data).'
  },
  {
    title: 'API Calls',
    icon: Settings,
    color: 'text-purple-600',
    config: {
      maxRetries: 3,
      retryDelay: 1000,
      exponentialBackoff: true,
      concurrency: 5,
      persistent: true
    },
    rationale: 'Standard config with moderate concurrency for API rate limits, persistent for reliability.'
  },
  {
    title: 'File Uploads',
    icon: Database,
    color: 'text-orange-600',
    config: {
      maxRetries: 3,
      retryDelay: 3000,
      exponentialBackoff: true,
      concurrency: 3,
      persistent: true
    },
    rationale: 'Longer initial delay for network issues, limited concurrency to avoid overwhelming server.'
  }
];

export default function ConfigurationPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 via-teal-700 to-green-800 pt-20">
        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <Link
            href="/docs"
            className="inline-flex items-center text-green-200 hover:text-white transition-colors duration-200 mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Documentation
          </Link>
          
          <div className="flex items-center mb-6">
            <div className="bg-white/10 p-3 rounded-xl mr-4 backdrop-blur-sm border border-white/20">
              <Settings className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              Configuration
            </h1>
          </div>
          <p className="text-xl text-green-100 max-w-3xl">
            Learn about all configuration options and how to customize your queues for different use cases.
          </p>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Navigation</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="#basic-config" className="flex items-center text-sm text-gray-600 hover:text-green-600 transition-colors duration-200">
              <Settings className="h-4 w-4 mr-2" />
              Basic Configuration
            </Link>
            <Link href="#options" className="flex items-center text-sm text-gray-600 hover:text-green-600 transition-colors duration-200">
              <Zap className="h-4 w-4 mr-2" />
              All Options
            </Link>
            <Link href="#advanced" className="flex items-center text-sm text-gray-600 hover:text-green-600 transition-colors duration-200">
              <Layers className="h-4 w-4 mr-2" />
              Advanced Examples
            </Link>
            <Link href="#best-practices" className="flex items-center text-sm text-gray-600 hover:text-green-600 transition-colors duration-200">
              <CheckCircle className="h-4 w-4 mr-2" />
              Best Practices
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {/* Basic Configuration */}
        <section id="basic-config" className="mb-20">
          <div className="flex items-center mb-8">
            <Settings className="h-8 w-8 text-green-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Basic Configuration</h2>
          </div>
          
          <p className="text-lg text-gray-600 mb-8">
            Configure your queue with the most commonly used options. All configuration options are optional and have sensible defaults.
          </p>

          <CodeBlock
            code={basicConfigExample}
            language="typescript"
            title="Basic Queue Configuration"
          />

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center mb-3">
                <Repeat className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Retry Behavior</h3>
              </div>
              <p className="text-gray-700 text-sm">
                Control how many times failed tasks are retried and the delay between attempts.
              </p>
            </div>
            
            <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
              <div className="flex items-center mb-3">
                <Layers className="h-5 w-5 text-purple-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Concurrency</h3>
              </div>
              <p className="text-gray-700 text-sm">
                Set how many tasks can be processed simultaneously for optimal performance.
              </p>
            </div>
            
            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
              <div className="flex items-center mb-3">
                <Database className="h-5 w-5 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Persistence</h3>
              </div>
              <p className="text-gray-700 text-sm">
                Enable localStorage persistence to maintain queues across browser sessions.
              </p>
            </div>
          </div>
        </section>

        {/* Configuration Options */}
        <section id="options" className="mb-20">
          <div className="flex items-center mb-8">
            <Zap className="h-8 w-8 text-yellow-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">All Configuration Options</h2>
          </div>
          
          <p className="text-lg text-gray-600 mb-8">
            Complete reference for all available configuration options with examples and use cases.
          </p>

          <div className="space-y-8">
            {configurationOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <div key={option.name} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <IconComponent className={`h-6 w-6 ${option.color} mr-3`} />
                        <div>
                          <h3 className="text-xl font-semibold font-mono text-gray-900">{option.name}</h3>
                          <p className="text-sm text-gray-600">{option.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-mono bg-blue-50 text-blue-700 px-2 py-1 rounded">
                          {option.type}
                        </span>
                        <p className="text-sm text-gray-500 mt-1">Default: {option.defaultValue}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-6 py-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Common Use Cases</h4>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {option.examples.map((example, exampleIndex) => (
                        <div key={exampleIndex} className="bg-gray-50 rounded-lg p-4">
                          <code className="text-sm font-mono text-purple-600">{example.value}</code>
                          <p className="text-sm text-gray-600 mt-1">{example.use}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Retry Configuration */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Retry Configuration Deep Dive</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Exponential Backoff</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Recommended for most use cases. Reduces server load and improves success rates.
              </p>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm font-mono text-gray-600">
                  Delays: 1s → 2s → 4s → 8s → 16s
                </p>
              </div>
            </div>
            
            <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
              <div className="flex items-center mb-4">
                <Clock className="h-6 w-6 text-orange-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Linear Retries</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Use when you need consistent timing or for time-sensitive operations.
              </p>
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm font-mono text-gray-600">
                  Delays: 1s → 1s → 1s → 1s → 1s
                </p>
              </div>
            </div>
          </div>

          <CodeBlock
            code={retryConfigExample}
            language="typescript"
            title="Retry Configuration Examples"
          />
        </section>

        {/* Concurrency Configuration */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Concurrency Configuration</h2>
          
          <p className="text-lg text-gray-600 mb-8">
            Control how many tasks are processed simultaneously to optimize performance for your use case.
          </p>

          <CodeBlock
            code={concurrencyExample}
            language="typescript"
            title="Concurrency Examples"
          />

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Low Concurrency (1-2)</h3>
              <ul className="text-gray-700 text-sm space-y-2">
                <li>• CPU-intensive tasks</li>
                <li>• Sequential processing required</li>
                <li>• Limited system resources</li>
              </ul>
            </div>
            
            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Medium Concurrency (3-10)</h3>
              <ul className="text-gray-700 text-sm space-y-2">
                <li>• API calls with rate limits</li>
                <li>• File operations</li>
                <li>• Database operations</li>
              </ul>
            </div>
            
            <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">High Concurrency (10+)</h3>
              <ul className="text-gray-700 text-sm space-y-2">
                <li>• Simple HTTP requests</li>
                <li>• Message sending</li>
                <li>• Data validation</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Persistence Configuration */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Persistence Configuration</h2>
          
          <p className="text-lg text-gray-600 mb-8">
            Enable persistence to maintain queue state across browser sessions and page refreshes.
          </p>

          <CodeBlock
            code={persistenceExample}
            language="typescript"
            title="Persistence Examples"
          />

          <div className="mt-8 bg-amber-50 rounded-xl p-6 border border-amber-200">
            <div className="flex items-start">
              <AlertTriangle className="h-6 w-6 text-amber-600 mr-3 mt-0.5" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Important Notes</h3>
                <ul className="text-gray-700 space-y-2">
                  <li>• Persistence only works in browser environments (not Node.js)</li>
                  <li>• Large task payloads may hit localStorage size limits</li>
                  <li>• Tasks in &#34;processing&#34; state are reset to &#34;pending&#34; on reload</li>
                  <li>• Different storage keys allow multiple independent queues</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Advanced Configuration */}
        <section id="advanced" className="mb-20">
          <div className="flex items-center mb-8">
            <Layers className="h-8 w-8 text-blue-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Advanced Configuration Examples</h2>
          </div>
          
          <p className="text-lg text-gray-600 mb-8">
            Real-world configuration examples for different types of applications and use cases.
          </p>

          <CodeBlock
            code={advancedConfigExample}
            language="typescript"
            title="Production-Ready Queue Configurations"
          />
        </section>

        {/* Best Practices */}
        <section id="best-practices" className="mb-20">
          <div className="flex items-center mb-8">
            <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Best Practices by Use Case</h2>
          </div>
          
          <p className="text-lg text-gray-600 mb-8">
            Recommended configurations for common use cases based on real-world experience.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {bestPractices.map((practice) => {
              const IconComponent = practice.icon;
              return (
                <div key={practice.title} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center">
                      <IconComponent className={`h-6 w-6 ${practice.color} mr-3`} />
                      <h3 className="text-xl font-semibold text-gray-900">{practice.title}</h3>
                    </div>
                  </div>
                  
                  <div className="px-6 py-4">
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <pre className="text-sm font-mono text-gray-800">
{`{
  maxRetries: ${practice.config.maxRetries},
  retryDelay: ${practice.config.retryDelay},
  exponentialBackoff: ${practice.config.exponentialBackoff},
  concurrency: ${practice.config.concurrency},
  persistent: ${practice.config.persistent}
}`}
                      </pre>
                    </div>
                    <p className="text-gray-700 text-sm">{practice.rationale}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Configuration Tips */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border border-green-200">
          <div className="flex items-center mb-4">
            <Settings className="h-6 w-6 text-green-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">Configuration Tips</h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Performance Tips</h4>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>• Start with conservative concurrency and increase gradually</li>
                <li>• Use exponential backoff for external API calls</li>
                <li>• Monitor task completion rates to optimize retry settings</li>
                <li>• Consider separate queues for different task types</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Reliability Tips</h4>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>• Enable persistence for critical tasks</li>
                <li>• Set appropriate maxRetryDelay to avoid infinite delays</li>
                <li>• Use different storage keys for different user contexts</li>
                <li>• Test queue behavior under error conditions</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/docs/api"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors duration-200"
            >
              API Reference
            </Link>
            <Link
              href="/docs/events"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
            >
              Events & Monitoring
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
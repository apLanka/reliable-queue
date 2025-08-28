import Link from 'next/link';
import {
  ArrowLeft,
  Bell,
  Zap,
  Eye,
  BarChart3,
  Play,
  CheckCircle,
  XCircle,
  RotateCcw,
  Database,
  AlertTriangle,
  Activity,
  LineChart,
  Clock
} from 'lucide-react';
import CodeBlock from '../../../components/CodeBlock';

const basicEventsExample = `import { ReliableQueue } from '@aplanka/reliable-queue';

const queue = new ReliableQueue();

// Subscribe to events
const unsubscribeTaskCompleted = queue.on('taskCompleted', (task) => {
  console.log(\`Task \${task.id} completed successfully\`);
});

const unsubscribeTaskFailed = queue.on('taskFailed', (task, error) => {
  console.error(\`Task \${task.id} failed:, error.message\`);
});

const unsubscribeQueueUpdated = queue.on('queueUpdated', (tasks) => {
  console.log(\`Queue now has \${tasks.length} tasks\`);
});

// Unsubscribe when done
unsubscribeTaskCompleted();
unsubscribeTaskFailed();
unsubscribeQueueUpdated();`;

const monitoringExample = `import { ReliableQueue } from '@aplanka/reliable-queue';

const queue = new ReliableQueue();

// Real-time monitoring dashboard
class QueueMonitor {
  constructor(queue) {
    this.queue = queue;
    this.metrics = {
      totalProcessed: 0,
      totalFailed: 0,
      averageProcessingTime: 0,
      lastError: null,
      throughputPerMinute: 0
    };
    
    this.setupEventListeners();
    this.startMetricsCollection();
  }

  setupEventListeners() {
    // Track task lifecycle
    this.queue.on('taskStarted', (task) => {
      task.startTime = Date.now();
      this.updateDashboard();
    });

    this.queue.on('taskCompleted', (task) => {
      const processingTime = Date.now() - task.startTime;
      this.metrics.totalProcessed++;
      this.updateAverageProcessingTime(processingTime);
      this.updateDashboard();
    });

    this.queue.on('taskFailed', (task, error) => {
      this.metrics.totalFailed++;
      this.metrics.lastError = {
        taskId: task.id,
        error: error.message,
        timestamp: Date.now()
      };
      this.sendAlert('Task Failed', \`Task \${task.id} failed: \${error.message}\`);
      this.updateDashboard();
    });

    // Monitor queue state changes
    this.queue.on('queueUpdated', (tasks) => {
      this.calculateThroughput(tasks);
      this.updateDashboard();
    });
  }

  updateDashboard() {
    const stats = this.queue.getStats();
    console.log('📊 Queue Metrics:', {
      ...stats,
      ...this.metrics,
      successRate: this.calculateSuccessRate()
    });
  }

  calculateSuccessRate() {
    const total = this.metrics.totalProcessed + this.metrics.totalFailed;
    return total > 0 ? (this.metrics.totalProcessed / total * 100).toFixed(2) : 0;
  }
}

const monitor = new QueueMonitor(queue);`;

const alertingExample = `// Advanced alerting system
class QueueAlerts {
  constructor(queue, options = {}) {
    this.queue = queue;
    this.options = {
      failureThreshold: options.failureThreshold || 5,
      stuckTaskThreshold: options.stuckTaskThreshold || 300000, // 5 minutes
      errorRateThreshold: options.errorRateThreshold || 0.1, // 10%
      ...options
    };
    
    this.consecutiveFailures = 0;
    this.errorHistory = [];
    
    this.setupAlerts();
  }

  setupAlerts() {
    // Alert on consecutive failures
    this.queue.on('taskCompleted', () => {
      this.consecutiveFailures = 0;
    });

    this.queue.on('taskFailed', (task, error) => {
      this.consecutiveFailures++;
      this.recordError(task, error);
      
      if (this.consecutiveFailures >= this.options.failureThreshold) {
        this.sendCriticalAlert('High Failure Rate', 
          \`\${this.consecutiveFailures} consecutive task failures detected\`);
      }
    });

    // Check for stuck tasks
    setInterval(() => {
      this.checkForStuckTasks();
    }, 60000); // Check every minute

    // Monitor error rate
    setInterval(() => {
      this.checkErrorRate();
    }, 300000); // Check every 5 minutes
  }

  checkForStuckTasks() {
    const tasks = this.queue.getTasks();
    const stuckTasks = tasks.filter(task => 
      task.status === 'processing' && 
      Date.now() - task.updatedAt > this.options.stuckTaskThreshold
    );

    if (stuckTasks.length > 0) {
      this.sendAlert('Stuck Tasks', 
        \`\${stuckTasks.length} tasks have been processing for too long\`);
    }
  }

  sendCriticalAlert(title, message) {
    console.error(\`🚨 CRITICAL: \${title} - \${message}\`);
    // Integration with alerting services:
    // - Send to Slack, Discord, or Teams
    // - Email notifications
    // - Push notifications
    // - PagerDuty integration
  }
}`;

const metricsExample = `// Comprehensive metrics collection
class QueueMetrics {
  constructor(queue) {
    this.queue = queue;
    this.history = [];
    this.taskTimings = new Map();
    
    this.setupMetricsCollection();
  }

  setupMetricsCollection() {
    // Collect metrics every 30 seconds
    setInterval(() => {
      this.collectSnapshot();
    }, 30000);

    // Track individual task performance
    this.queue.on('taskStarted', (task) => {
      this.taskTimings.set(task.id, {
        startTime: Date.now(),
        retryCount: task.retryCount
      });
    });

    this.queue.on('taskCompleted', (task) => {
      this.recordTaskCompletion(task);
    });

    this.queue.on('taskFailed', (task) => {
      this.recordTaskFailure(task);
    });
  }

  collectSnapshot() {
    const stats = this.queue.getStats();
    const snapshot = {
      timestamp: Date.now(),
      ...stats,
      activeMemory: this.calculateMemoryUsage(),
      averageWaitTime: this.calculateAverageWaitTime(),
      throughput: this.calculateThroughput()
    };

    this.history.push(snapshot);
    
    // Keep only last 100 snapshots
    if (this.history.length > 100) {
      this.history.shift();
    }
  }

  // Export metrics for external monitoring tools
  exportMetrics() {
    return {
      current: this.queue.getStats(),
      history: this.history,
      performance: this.getPerformanceMetrics()
    };
  }

  // Integration with monitoring services
  sendToPrometheus() {
    // Send metrics to Prometheus
  }

  sendToDatadog() {
    // Send metrics to Datadog
  }
}`;

const debuggingExample = `// Queue debugging utilities
class QueueDebugger {
  constructor(queue) {
    this.queue = queue;
    this.debugMode = false;
    this.logs = [];
  }

  enableDebugMode() {
    this.debugMode = true;
    
    // Log all events with detailed information
    this.queue.on('taskAdded', (task) => {
      this.log('TASK_ADDED', \`Task \${task.id} added with priority \${task.priority}\`);
    });

    this.queue.on('taskStarted', (task) => {
      this.log('TASK_STARTED', \`Task \${task.id} started processing\`);
    });

    this.queue.on('taskCompleted', (task) => {
      const duration = Date.now() - task.startTime;
      this.log('TASK_COMPLETED', \`Task \${task.id} completed in \${duration}ms\`);
    });

    this.queue.on('taskFailed', (task, error) => {
      this.log('TASK_FAILED', \`Task \${task.id} failed: \${error.message}\`);
    });

    this.queue.on('taskRetried', (task) => {
      this.log('TASK_RETRIED', \`Task \${task.id} retry #\${task.retryCount}\`);
    });
  }

  log(event, message) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      message,
      queueState: this.queue.getStats()
    };
    
    this.logs.push(logEntry);
    
    if (this.debugMode) {
      console.log(\`[QUEUE DEBUG] \${event}: \${message}\`);
    }
    
    // Keep only last 1000 logs
    if (this.logs.length > 1000) {
      this.logs.shift();
    }
  }

  exportLogs() {
    return this.logs;
  }

  findTaskHistory(taskId) {
    return this.logs.filter(log => log.message.includes(taskId));
  }
}`;

const events = [
  {
    name: 'taskAdded',
    signature: '(task: QueuedTask<T>) => void',
    description: 'Fired when a new task is added to the queue.',
    icon: Play,
    color: 'text-blue-600',
    useCases: ['Logging new tasks', 'Updating UI counters', 'Triggering notifications'],
    example: `queue.on('taskAdded', (task) => {
  console.log(\`New task: \${task.id}\`);
  updateTaskCounter(queue.getStats().total);
});`
  },
  {
    name: 'taskStarted',
    signature: '(task: QueuedTask<T>) => void',
    description: 'Fired when a task begins processing.',
    icon: Play,
    color: 'text-green-600',
    useCases: ['Performance tracking', 'Progress indicators', 'Resource monitoring'],
    example: `queue.on('taskStarted', (task) => {
  task.startTime = Date.now();
  showProgressIndicator(task.id);
});`
  },
  {
    name: 'taskCompleted',
    signature: '(task: QueuedTask<T>) => void',
    description: 'Fired when a task completes successfully.',
    icon: CheckCircle,
    color: 'text-green-600',
    useCases: ['Success tracking', 'UI updates', 'Analytics', 'Cleanup operations'],
    example: `queue.on('taskCompleted', (task) => {
  const duration = Date.now() - task.startTime;
  analytics.track('task_completed', { duration });
  hideProgressIndicator(task.id);
});`
  },
  {
    name: 'taskFailed',
    signature: '(task: QueuedTask<T>, error: Error) => void',
    description: 'Fired when a task fails after exhausting all retries.',
    icon: XCircle,
    color: 'text-red-600',
    useCases: ['Error logging', 'User notifications', 'Alerting systems'],
    example: `queue.on('taskFailed', (task, error) => {
  errorLogger.log(error, { taskId: task.id });
  notifyUser(\`Task \${task.id} failed: \${error.message}\`);
});`
  },
  {
    name: 'taskRetried',
    signature: '(task: QueuedTask<T>) => void',
    description: 'Fired when a task is retried (manually or automatically).',
    icon: RotateCcw,
    color: 'text-orange-600',
    useCases: ['Retry tracking', 'Debugging', 'Performance monitoring'],
    example: `queue.on('taskRetried', (task) => {
  console.log(\`Retry #\${task.retryCount} for task \${task.id}\`);
  metrics.incrementRetryCount();
});`
  },
  {
    name: 'queueUpdated',
    signature: '(tasks: QueuedTask<T>[]) => void',
    description: 'Fired whenever the queue state changes.',
    icon: Database,
    color: 'text-purple-600',
    useCases: ['Real-time dashboards', 'State synchronization', 'React re-renders'],
    example: `queue.on('queueUpdated', (tasks) => {
  const stats = queue.getStats();
  updateDashboard(stats);
  syncToLocalStorage(tasks);
});`
  }
];

const monitoringTools = [
  {
    name: 'Real-time Dashboard',
    icon: BarChart3,
    color: 'text-blue-600',
    description: 'Live view of queue statistics, task status, and performance metrics.',
    features: ['Task counts by status', 'Processing rate', 'Error rate', 'Average processing time']
  },
  {
    name: 'Performance Tracking',
    icon: LineChart,
    color: 'text-green-600',
    description: 'Track task performance over time to identify bottlenecks and trends.',
    features: ['Processing time trends', 'Throughput analysis', 'Memory usage', 'Success rates']
  },
  {
    name: 'Alerting System',
    icon: AlertTriangle,
    color: 'text-red-600',
    description: 'Automated alerts for failures, performance issues, and anomalies.',
    features: ['Failure rate alerts', 'Stuck task detection', 'Custom thresholds', 'Multiple channels']
  },
  {
    name: 'Debug Logging',
    icon: Eye,
    color: 'text-purple-600',
    description: 'Detailed logging of queue operations for debugging and analysis.',
    features: ['Event timeline', 'Task history', 'Error details', 'State snapshots']
  }
];

export default function EventsPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 via-pink-700 to-purple-800 pt-20">
        <div className="relative mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <Link
            href="/docs"
            className="inline-flex items-center text-purple-200 hover:text-white transition-colors duration-200 mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Documentation
          </Link>
          
          <div className="flex items-center mb-6">
            <div className="bg-white/10 p-3 rounded-xl mr-4 backdrop-blur-sm border border-white/20">
              <Bell className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white sm:text-5xl">
              Events & Monitoring
            </h1>
          </div>
          <p className="text-xl text-purple-100 max-w-3xl">
            Monitor your queues with comprehensive event system and real-time updates. Build dashboards, alerts, and analytics.
          </p>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Navigation</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="#events" className="flex items-center text-sm text-gray-600 hover:text-purple-600 transition-colors duration-200">
              <Bell className="h-4 w-4 mr-2" />
              Event System
            </Link>
            <Link href="#monitoring" className="flex items-center text-sm text-gray-600 hover:text-purple-600 transition-colors duration-200">
              <Activity className="h-4 w-4 mr-2" />
              Real-time Monitoring
            </Link>
            <Link href="#alerting" className="flex items-center text-sm text-gray-600 hover:text-purple-600 transition-colors duration-200">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Alerting System
            </Link>
            <Link href="#debugging" className="flex items-center text-sm text-gray-600 hover:text-purple-600 transition-colors duration-200">
              <Eye className="h-4 w-4 mr-2" />
              Debugging Tools
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {/* Event System Overview */}
        <section id="events" className="mb-20">
          <div className="flex items-center mb-8">
            <Bell className="h-8 w-8 text-purple-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Event System</h2>
          </div>
          
          <p className="text-lg text-gray-600 mb-8">
            Reliable Queue provides a comprehensive event system that allows you to monitor queue operations, track task lifecycle, and respond to state changes in real-time.
          </p>

          <CodeBlock
            code={basicEventsExample}
            language="typescript"
            title="Basic Event Subscription"
          />

          <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Available Events</h3>
            <div className="space-y-8">
              {events.map((event) => {
                const IconComponent = event.icon;
                return (
                  <div key={event.name} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <IconComponent className={`h-6 w-6 ${event.color} mr-3`} />
                          <div>
                            <h4 className="text-xl font-semibold font-mono text-gray-900">{event.name}</h4>
                            <p className="text-sm text-gray-600">{event.description}</p>
                          </div>
                        </div>
                        <span className="text-sm font-mono bg-purple-50 text-purple-700 px-2 py-1 rounded">
                          Event
                        </span>
                      </div>
                    </div>
                    
                    <div className="px-6 py-4">
                      <div className="mb-4">
                        <h5 className="text-sm font-semibold text-gray-900 mb-2">Signature</h5>
                        <code className="text-sm font-mono bg-gray-100 px-3 py-2 rounded block">
                          {event.signature}
                        </code>
                      </div>
                      
                      <div className="mb-4">
                        <h5 className="text-sm font-semibold text-gray-900 mb-2">Common Use Cases</h5>
                        <div className="flex flex-wrap gap-2">
                          {event.useCases.map((useCase, idx) => (
                            <span key={idx} className="text-sm bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {useCase}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h5 className="text-sm font-semibold text-gray-900 mb-2">Example Usage</h5>
                        <CodeBlock
                          code={event.example}
                          language="typescript"
                          title={`${event.name} example`}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Monitoring Tools */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Monitoring Tools</h2>
          
          <p className="text-lg text-gray-600 mb-8">
            Build comprehensive monitoring solutions using queue events and statistics.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {monitoringTools.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <div key={tool.name} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center">
                      <IconComponent className={`h-6 w-6 ${tool.color} mr-3`} />
                      <h3 className="text-xl font-semibold text-gray-900">{tool.name}</h3>
                    </div>
                  </div>
                  
                  <div className="px-6 py-4">
                    <p className="text-gray-700 mb-4">{tool.description}</p>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Features</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {tool.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Real-time Monitoring */}
        <section id="monitoring" className="mb-20">
          <div className="flex items-center mb-8">
            <Activity className="h-8 w-8 text-green-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Real-time Monitoring</h2>
          </div>
          
          <p className="text-lg text-gray-600 mb-8">
            Build real-time dashboards and monitoring systems using queue events and statistics.
          </p>

          <CodeBlock
            code={monitoringExample}
            language="typescript"
            title="Queue Monitoring System"
          />

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
              <div className="flex items-center mb-3">
                <BarChart3 className="h-5 w-5 text-green-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Key Metrics</h3>
              </div>
              <ul className="text-gray-700 text-sm space-y-2">
                <li>• Tasks processed per minute</li>
                <li>• Average processing time</li>
                <li>• Success/failure rates</li>
                <li>• Queue size over time</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <div className="flex items-center mb-3">
                <LineChart className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Performance Tracking</h3>
              </div>
              <ul className="text-gray-700 text-sm space-y-2">
                <li>• Response time trends</li>
                <li>• Throughput analysis</li>
                <li>• Resource utilization</li>
                <li>• Error rate patterns</li>
              </ul>
            </div>
            
            <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
              <div className="flex items-center mb-3">
                <Eye className="h-5 w-5 text-purple-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Real-time Updates</h3>
              </div>
              <ul className="text-gray-700 text-sm space-y-2">
                <li>• Live task status</li>
                <li>• Queue state changes</li>
                <li>• Instant notifications</li>
                <li>• Dynamic dashboards</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Alerting System */}
        <section id="alerting" className="mb-20">
          <div className="flex items-center mb-8">
            <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Alerting System</h2>
          </div>
          
          <p className="text-lg text-gray-600 mb-8">
            Set up automated alerts to detect issues early and maintain system reliability.
          </p>

          <CodeBlock
            code={alertingExample}
            language="typescript"
            title="Advanced Alerting System"
          />

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-red-50 rounded-xl p-6 border border-red-200">
              <div className="flex items-center mb-4">
                <XCircle className="h-6 w-6 text-red-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Failure Alerts</h3>
              </div>
              <ul className="text-gray-700 text-sm space-y-2">
                <li>• Consecutive failure detection</li>
                <li>• High error rate warnings</li>
                <li>• Critical task failures</li>
                <li>• Custom failure thresholds</li>
              </ul>
            </div>
            
            <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
              <div className="flex items-center mb-4">
                <Clock className="h-6 w-6 text-orange-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Performance Alerts</h3>
              </div>
              <ul className="text-gray-700 text-sm space-y-2">
                <li>• Stuck task detection</li>
                <li>• Processing time anomalies</li>
                <li>• Queue backlog warnings</li>
                <li>• Throughput degradation</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Metrics Collection */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Metrics Collection</h2>
          
          <p className="text-lg text-gray-600 mb-8">
            Collect comprehensive metrics for analysis and integration with monitoring platforms.
          </p>

          <CodeBlock
            code={metricsExample}
            language="typescript"
            title="Comprehensive Metrics Collection"
          />

          <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center mb-4">
              <BarChart3 className="h-6 w-6 text-blue-600 mr-3" />
              <h3 className="text-xl font-semibold text-gray-900">Integration Options</h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Time Series Databases</h4>
                <p className="text-sm text-gray-600">Prometheus, InfluxDB, CloudWatch</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">APM Tools</h4>
                <p className="text-sm text-gray-600">Datadog, New Relic, AppDynamics</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Analytics Platforms</h4>
                <p className="text-sm text-gray-600">Google Analytics, Mixpanel, Amplitude</p>
              </div>
            </div>
          </div>
        </section>

        {/* Debugging Tools */}
        <section id="debugging" className="mb-20">
          <div className="flex items-center mb-8">
            <Eye className="h-8 w-8 text-purple-600 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">Debugging Tools</h2>
          </div>
          
          <p className="text-lg text-gray-600 mb-8">
            Debug queue issues with detailed logging and task history tracking.
          </p>

          <CodeBlock
            code={debuggingExample}
            language="typescript"
            title="Queue Debugging Utilities"
          />

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
              <div className="flex items-center mb-4">
                <Eye className="h-6 w-6 text-purple-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Debug Features</h3>
              </div>
              <ul className="text-gray-700 text-sm space-y-2">
                <li>• Detailed event logging</li>
                <li>• Task lifecycle tracking</li>
                <li>• State change history</li>
                <li>• Error context capture</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <div className="flex items-center mb-4">
                <Database className="h-6 w-6 text-gray-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Log Analysis</h3>
              </div>
              <ul className="text-gray-700 text-sm space-y-2">
                <li>• Task history queries</li>
                <li>• Error pattern analysis</li>
                <li>• Performance bottlenecks</li>
                <li>• State transition logs</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Best Practices */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-200">
          <div className="flex items-center mb-4">
            <Bell className="h-6 w-6 text-purple-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">Monitoring Best Practices</h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Event Handling</h4>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>• Always unsubscribe from events when components unmount</li>
                <li>• Use debouncing for high-frequency events like queueUpdated</li>
                <li>• Handle event errors gracefully to prevent queue disruption</li>
                <li>• Keep event handlers lightweight and non-blocking</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Performance Monitoring</h4>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>• Monitor key metrics: throughput, latency, error rates</li>
                <li>• Set up alerts for abnormal patterns and thresholds</li>
                <li>• Track task processing times and queue depths</li>
                <li>• Use sampling for high-volume queues to reduce overhead</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/docs/react"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-200"
            >
              <Zap className="h-4 w-4 mr-2" />
              React Integration
            </Link>
            <Link
              href="/docs/api"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-pink-600 text-white hover:bg-pink-700 transition-colors duration-200"
            >
              API Reference
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
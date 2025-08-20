import Link from 'next/link';
import { ArrowRight, BookOpen, Code2, Settings, Bell, Wrench } from 'lucide-react';
import CodeBlock from '../../components/CodeBlock';

const installationCode = `npm install @aplanka/reliable-queue`;

const basicUsageCode = `import { ReliableQueue } from '@aplanka/reliable-queue';

// Create a basic queue
const queue = new ReliableQueue({
  maxRetries: 3,
  retryDelay: 1000,
  exponentialBackoff: true,
});

// Set up task processor
queue.setProcessor(async (data) => {
  console.log('Processing:', data);
  
  // Your async task logic here
  const result = await processTask(data);
  
  return result;
});

// Add tasks
queue.add({ id: 1, action: 'process-data' });
queue.add({ id: 2, action: 'send-email' });`;

const reactUsageCode = `import React from 'react';
import { useReliableQueue } from '@aplanka/reliable-queue';

function TaskManager() {
  const { tasks, stats, addTask, retryTask } = useReliableQueue({
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
      <div>Pending: {stats.pending}, Failed: {stats.failed}</div>
      
      <button onClick={() => addTask({ data: 'test' })}>
        Add Task
      </button>
      
      {tasks.map(task => (
        <div key={task.id}>
          {task.status} - {JSON.stringify(task.data)}
          {task.status === 'failed' && (
            <button onClick={() => retryTask(task.id)}>Retry</button>
          )}
        </div>
      ))}
    </div>
  );
}`;

const quickStartSteps = [
  {
    title: 'Install the Package',
    description: 'Add Reliable Queue to your project using npm or yarn.',
    code: installationCode,
    language: 'bash',
  },
  {
    title: 'Create a Queue',
    description: 'Set up a queue with your desired configuration and task processor.',
    code: basicUsageCode,
    language: 'typescript',
  },
  {
    title: 'React Integration',
    description: 'Use the React hook for seamless integration with your React components.',
    code: reactUsageCode,
    language: 'tsx',
  },
];

const documentationSections = [
  {
    title: 'API Reference',
    description: 'Complete reference for all classes, methods, and configuration options.',
    icon: Code2,
    href: '/docs/api',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    title: 'Configuration',
    description: 'Learn about all configuration options and how to customize your queues.',
    icon: Settings,
    href: '/docs/configuration',
    color: 'bg-green-50 text-green-600',
  },
  {
    title: 'Events & Monitoring',
    description: 'Monitor your queues with comprehensive event system and real-time updates.',
    icon: Bell,
    href: '/docs/events',
    color: 'bg-purple-50 text-purple-600',
  },
  {
    title: 'React Integration',
    description: 'Complete guide to using Reliable Queue with React applications.',
    icon: Wrench,
    href: '/docs/react',
    color: 'bg-orange-50 text-orange-600',
  },
];

export default function DocsPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <BookOpen className="mx-auto h-12 w-12 text-white mb-6" />
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Documentation
            </h1>
            <p className="mt-6 text-lg leading-8 text-blue-100">
              Everything you need to know about Reliable Queue. From basic usage to advanced configurations.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Start Guide */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600">Quick Start</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Get up and running in minutes
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Follow these simple steps to integrate Reliable Queue into your application.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-4xl">
            {quickStartSteps.map((step, index) => (
              <div key={index} className="mb-12">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                    <p className="mt-1 text-gray-600">{step.description}</p>
                    <div className="mt-4">
                      <CodeBlock
                        code={step.code}
                        language={step.language}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Documentation Sections */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600">Explore</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Comprehensive Documentation
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Dive deeper into specific topics and advanced features.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-2">
              {documentationSections.map((section) => (
                <Link
                  key={section.title}
                  href={section.href}
                  className="group relative rounded-2xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className={`inline-flex rounded-lg p-3 ${section.color}`}>
                    <section.icon className="h-6 w-6" />
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                      {section.title}
                      <span className="absolute inset-0" aria-hidden="true" />
                    </h3>
                    <p className="mt-2 text-gray-600">{section.description}</p>
                  </div>
                  <div className="mt-4 flex items-center text-blue-600 group-hover:text-blue-800">
                    <span className="text-sm font-medium">Learn more</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Ready to build?
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Check out our examples and interactive demo to see Reliable Queue in action.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/examples"
                className="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
              >
                View Examples
              </Link>
              <Link
                href="/demo"
                className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600"
              >
                Try Live Demo <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
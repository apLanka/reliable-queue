import Link from 'next/link';
import { ArrowRight, BookOpen, Code2, Settings, Bell, Wrench, Sparkles, Zap, Shield } from 'lucide-react';
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
    <div className="bg-white overflow-hidden">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-blue-600 via-purple-700 to-blue-800 pt-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-mesh opacity-20"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full filter blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-3xl text-center animate-fadeInUp">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/10 text-white border border-white/20 mb-8 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 mr-2" />
              Complete Documentation
            </div>
            <div className="relative mb-8">
              <BookOpen className="mx-auto h-16 w-16 text-white mb-6 animate-float" />
              <div className="absolute inset-0 rounded-full bg-white/20 blur-md opacity-50 mx-auto w-16 h-16 mb-6"></div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl text-balance">
              <span className="block">Documentation</span>
              <span className="block bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
                & Guides
              </span>
            </h1>
            <p className="mt-8 text-xl leading-8 text-blue-100 max-w-2xl mx-auto text-pretty">
              Everything you need to know about Reliable Queue. From basic usage to advanced configurations, 
              we&apos;ve got you covered with comprehensive guides and examples.
            </p>
            
            {/* Quick Links */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-4 animate-slideInRight" style={{ animationDelay: '200ms' }}>
              <Link
                href="#quick-start"
                className="group flex items-center space-x-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 transition-all duration-300 backdrop-blur-sm"
              >
                <Zap className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                <span>Quick Start</span>
              </Link>
              <Link
                href="#documentation"
                className="group flex items-center space-x-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 transition-all duration-300 backdrop-blur-sm"
              >
                <BookOpen className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                <span>Browse Docs</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Start Guide */}
      <div id="quick-start" className="py-24 sm:py-32 bg-gradient-to-b from-white to-gray-50 relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center animate-fadeInUp">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-green-50 to-blue-50 text-green-700 border border-green-200 mb-6">
              <Zap className="h-4 w-4 mr-2" />
              Quick Start Guide
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl text-balance">
              Get up and running in
              <span className="gradient-text"> minutes</span>
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 text-pretty">
              Follow these simple steps to integrate Reliable Queue into your application and start processing tasks reliably.
            </p>
          </div>

          <div className="mx-auto mt-20 max-w-5xl">
            {quickStartSteps.map((step, index) => (
              <div 
                key={index} 
                className="group relative mb-16 animate-slideInRight"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Connector Line */}
                {index < quickStartSteps.length - 1 && (
                  <div className="absolute left-6 top-16 w-0.5 h-20 bg-gradient-to-b from-blue-200 to-transparent"></div>
                )}
                
                <div className="relative flex items-start">
                  <div className="flex-shrink-0">
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white text-lg font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {index + 1}
                      <div className="absolute inset-0 rounded-xl bg-blue-600/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                  
                  <div className="ml-8 flex-1">
                    <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 group-hover:shadow-2xl transition-all duration-300">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">{step.description}</p>
                      
                      <div className="relative group/code">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-0 group-hover/code:opacity-25 transition duration-300"></div>
                        <div className="relative">
                          <CodeBlock
                            code={step.code}
                            language={step.language}
                            title={`Step ${index + 1}`}
                          />
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

      {/* Documentation Sections */}
      <div id="documentation" className="bg-gradient-to-b from-gray-50 to-white py-24 sm:py-32 relative">
        <div className="absolute inset-0 bg-mesh opacity-5"></div>
        
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center animate-fadeInUp">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 border border-purple-200 mb-6">
              <BookOpen className="h-4 w-4 mr-2" />
              Explore Documentation
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl text-balance">
              Comprehensive
              <span className="gradient-text"> Documentation</span>
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 text-pretty">
              Dive deeper into specific topics and advanced features. Everything you need to master Reliable Queue.
            </p>
          </div>
          
          <div className="mx-auto mt-20 max-w-2xl sm:mt-24 lg:max-w-none">
            <div className="grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-2">
              {documentationSections.map((section, index) => (
                <Link
                  key={section.title}
                  href={section.href}
                  className="group relative rounded-2xl border border-gray-200 bg-white p-8 shadow-lg hover:shadow-2xl transition-all duration-500 card-hover animate-fadeInUp"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Gradient Border Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                  
                  <div className="relative">
                    <div className={`inline-flex rounded-xl p-4 ${section.color} group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                      <section.icon className="h-7 w-7" />
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300 mb-3">
                        {section.title}
                        <span className="absolute inset-0" aria-hidden="true" />
                      </h3>
                      <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300 leading-relaxed">
                        {section.description}
                      </p>
                    </div>
                    
                    <div className="mt-6 flex items-center text-blue-600 group-hover:text-blue-800 transition-colors duration-300">
                      <span className="text-sm font-semibold">Learn more</span>
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                    
                    {/* Hover Effect Indicator */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-gradient-to-br from-white via-blue-50 to-purple-50 py-24 sm:py-32 relative">
        {/* Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center animate-fadeInUp">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200 mb-8">
              <Shield className="h-4 w-4 mr-2" />
              Ready to Build
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl text-balance">
              Start building
              <span className="gradient-text"> reliable</span> applications today
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 text-pretty max-w-2xl mx-auto">
              Check out our examples and interactive demo to see Reliable Queue in action. 
              From simple use cases to complex workflows, we&apos;ve got you covered.
            </p>
            
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 animate-slideInRight" style={{ animationDelay: '200ms' }}>
              <Link
                href="/examples"
                className="group relative rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 text-sm font-semibold text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 btn-glow"
              >
                <Code2 className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                <span>View Examples</span>
              </Link>
              <Link
                href="/demo"
                className="group flex items-center gap-2 text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 px-6 py-4 rounded-xl hover:bg-white/60 transition-all duration-300"
              >
                <Zap className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                <span>Try Live Demo</span>
                <span className="group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true">→</span>
              </Link>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500 animate-fadeInUp" style={{ animationDelay: '400ms' }}>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-500" />
                <span>Production Ready</span>
              </div>
              <div className="flex items-center gap-2">
                <Code2 className="h-4 w-4 text-blue-500" />
                <span>TypeScript First</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-purple-500" />
                <span>Zero Dependencies</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
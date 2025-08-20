import Link from 'next/link';
import { 
  ArrowRight, 
  RefreshCw, 
  BarChart3, 
  Zap, 
  Shield, 
  Code2,
  CheckCircle,
  Users,
  Download
} from 'lucide-react';
import CodeBlock from '../components/CodeBlock';

const quickStartCode = `import { ReliableQueue } from '@aplanka/reliable-queue';

// Create a queue with retry logic
const queue = new ReliableQueue({
  maxRetries: 3,
  retryDelay: 1000,
  exponentialBackoff: true,
});

// Set up task processor
queue.setProcessor(async (data) => {
  const response = await fetch('/api/process', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Processing failed');
  }
  
  return response.json();
});

// Add tasks to queue
queue.add({ message: 'Process this data' });`;

const features = [
  {
    name: 'Automatic Retry Logic',
    description: 'Smart exponential backoff prevents overwhelming failing services while ensuring tasks complete.',
    icon: RefreshCw,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    name: 'Real-time Monitoring',
    description: 'Track task progress with detailed status information and event-driven updates.',
    icon: BarChart3,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    name: 'High Performance',
    description: 'Process multiple tasks concurrently with priority-based scheduling.',
    icon: Zap,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
  {
    name: 'Persistent Storage',
    description: 'Tasks survive page refreshes and browser restarts with local storage integration.',
    icon: Shield,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    name: 'React Integration',
    description: 'Seamless React hooks for building responsive queue-powered UIs.',
    icon: Code2,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
  },
  {
    name: 'TypeScript Support',
    description: 'Full type safety with generic types for your custom data structures.',
    icon: CheckCircle,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
  },
];


export default function Home() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-600 to-purple-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>
        
        <div className="mx-auto max-w-4xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Production-Ready 
              <span className="text-blue-600"> Task Queue</span> Management
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
              A comprehensive queue system for JavaScript & TypeScript. Handle asynchronous operations 
              with guaranteed execution, intelligent retry logic, and seamless React integration.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/docs"
                className="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 flex items-center gap-2"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/demo"
                className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 flex items-center gap-2"
              >
                Live Demo <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Installation */}
        <div className="mx-auto max-w-4xl pb-16">
          <div className="bg-gray-900 rounded-lg p-1">
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex items-center space-x-2">
                  <Download className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-400 text-sm">Install</span>
                </div>
              </div>
              <code className="text-green-400 font-mono text-lg">
                npm install @aplanka/reliable-queue
              </code>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-blue-600 to-purple-600 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"></div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 sm:py-32 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600">Everything you need</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Powerful Features for Production Apps
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Built from the ground up to handle real-world challenges. Never lose a task again with 
              our intelligent retry system and comprehensive monitoring.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.name} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${feature.bgColor}`}>
                      <feature.icon className={`h-6 w-6 ${feature.color}`} aria-hidden="true" />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Quick Start Section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600">Quick Start</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Up and running in minutes
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Get started with Reliable Queue in just a few lines of code. No complex configuration required.
            </p>
          </div>
          
          <div className="mt-16 max-w-4xl mx-auto">
            <CodeBlock 
              code={quickStartCode}
              language="typescript"
              title="Quick Start Example"
            />
          </div>

          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/docs"
              className="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              View Full Documentation
            </Link>
            <Link
              href="/examples"
              className="text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600"
            >
              See More Examples <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-blue-600 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-4">
            <div className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base leading-7 text-blue-200">Production Ready</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                <CheckCircle className="h-12 w-12 mx-auto mb-4" />
                Tested
              </dd>
            </div>
            <div className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base leading-7 text-blue-200">TypeScript Support</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                <Code2 className="h-12 w-12 mx-auto mb-4" />
                100%
              </dd>
            </div>
            <div className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base leading-7 text-blue-200">Zero Dependencies</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                <Zap className="h-12 w-12 mx-auto mb-4" />
                Lightweight
              </dd>
            </div>
            <div className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base leading-7 text-blue-200">Browser Compatible</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                <Users className="h-12 w-12 mx-auto mb-4" />
                Universal
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="relative isolate overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
            <svg
              viewBox="0 0 1024 1024"
              className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
              aria-hidden="true"
            >
              <circle cx={512} cy={512} r={512} fill="url(#759c1415-0410-454c-8f7c-9a820de03641)" fillOpacity="0.7" />
              <defs>
                <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                  <stop stopColor="#7775D6" />
                  <stop offset={1} stopColor="#E935C1" />
                </radialGradient>
              </defs>
            </svg>
            <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to build reliable applications?
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Start using Reliable Queue today and never worry about lost tasks or failed operations again.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
                <Link
                  href="/docs"
                  className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Get Started
                </Link>
                <Link href="/examples" className="text-sm font-semibold leading-6 text-white">
                  View Examples <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

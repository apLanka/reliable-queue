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
  Download,
  Copy,
  Github
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
    <div className="bg-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative isolate px-6 pt-20 lg:px-8 bg-mesh">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
        </div>
        
        <div className="mx-auto max-w-4xl py-32 sm:py-48 lg:py-56">
          <div className="text-center animate-fadeInUp">
            <div className="mb-8">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200 animate-bounce">
                🚀 Production Ready & Type Safe
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl text-balance">
              <span className="block">Production-Ready</span>
              <span className="block gradient-text"> Task Queue</span>
              <span className="block">Management</span>
            </h1>
            <p className="mt-8 text-lg leading-8 text-gray-600 max-w-2xl mx-auto text-pretty animate-slideInRight" style={{ animationDelay: '200ms' }}>
              A comprehensive queue system for JavaScript & TypeScript. Handle asynchronous operations 
              with guaranteed execution, intelligent retry logic, and seamless React integration.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slideInRight" style={{ animationDelay: '400ms' }}>
              <Link
                href="/docs"
                className="group relative rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 text-sm font-semibold text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2 btn-glow"
              >
                <span>Get Started</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                href="/demo"
                className="group flex items-center gap-2 text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 px-6 py-4 rounded-xl hover:bg-white/60 transition-all duration-300"
              >
                <span>Live Demo</span>
                <span className="group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true">→</span>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500 animate-fadeInUp" style={{ animationDelay: '600ms' }}>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Zero Dependencies</span>
              </div>
              <div className="flex items-center gap-2">
                <Code2 className="h-5 w-5 text-blue-500" />
                <span>TypeScript First</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-500" />
                <span>Production Tested</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Installation Terminal */}
        <div className="mx-auto max-w-4xl pb-20 animate-fadeInUp" style={{ animationDelay: '800ms' }}>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative bg-gray-900 rounded-xl overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between px-6 py-4 bg-gray-800 border-b border-gray-700">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
                </div>
                <div className="flex items-center space-x-2">
                  <Download className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-400 text-sm font-medium">Terminal</span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-gray-500 font-mono text-sm">$</span>
                  <code className="text-green-400 font-mono text-lg font-medium">
                    npm install @aplanka/reliable-queue
                  </code>
                  <div className="ml-auto">
                    <button className="text-gray-400 hover:text-white transition-colors p-2 rounded-md hover:bg-gray-700">
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="text-gray-500 font-mono text-sm">
                  <span className="text-blue-400">✓</span> Package installed successfully
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 sm:py-32 bg-gradient-to-b from-gray-50 to-white relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
          <div className="mx-auto max-w-2xl lg:text-center animate-fadeInUp">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200 mb-6">
              ⚡ Everything you need
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl text-balance">
              Powerful Features for
              <span className="gradient-text"> Production Apps</span>
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 text-pretty">
              Built from the ground up to handle real-world challenges. Never lose a task again with 
              our intelligent retry system and comprehensive monitoring.
            </p>
          </div>
          
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
              {features.map((feature, index) => (
                <div 
                  key={feature.name} 
                  className="group relative flex flex-col p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 card-hover border border-gray-100 animate-fadeInUp"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Gradient Border Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
                  
                  <dt className="flex items-center gap-x-4 text-lg font-semibold leading-7 text-gray-900">
                    <div className={`relative flex h-12 w-12 items-center justify-center rounded-xl ${feature.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className={`h-6 w-6 ${feature.color}`} aria-hidden="true" />
                      <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    <span className="group-hover:text-blue-600 transition-colors duration-300">
                      {feature.name}
                    </span>
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto group-hover:text-gray-700 transition-colors duration-300">
                      {feature.description}
                    </p>
                  </dd>
                  
                  {/* Hover Effect Indicator */}
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <ArrowRight className="h-4 w-4 text-blue-500" />
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Quick Start Section */}
      <div className="py-24 sm:py-32 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center animate-fadeInUp">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-green-50 to-blue-50 text-green-700 border border-green-200 mb-6">
              ⚡ Quick Start
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl text-balance">
              Up and running in
              <span className="gradient-text"> minutes</span>
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 text-pretty">
              Get started with Reliable Queue in just a few lines of code. No complex configuration required.
            </p>
          </div>
          
          <div className="mt-16 max-w-4xl mx-auto animate-slideInRight" style={{ animationDelay: '200ms' }}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative">
                <CodeBlock 
                  code={quickStartCode}
                  language="typescript"
                  title="Quick Start Example"
                />
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeInUp" style={{ animationDelay: '400ms' }}>
            <Link
              href="/docs"
              className="group relative rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 text-sm font-semibold text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 btn-glow"
            >
              View Full Documentation
            </Link>
            <Link
              href="/examples"
              className="group flex items-center gap-2 text-sm font-semibold leading-6 text-gray-900 hover:text-blue-600 px-6 py-4 rounded-xl hover:bg-gray-50 transition-all duration-300"
            >
              <span>See More Examples</span>
              <span className="group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 py-24 sm:py-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full filter blur-3xl"></div>
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative">
          <div className="text-center mb-16 animate-fadeInUp">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
              Trusted by Developers Worldwide
            </h2>
            <p className="text-blue-100 text-lg">
              Join thousands of developers building reliable applications
            </p>
          </div>
          
          <dl className="grid grid-cols-1 gap-8 text-center lg:grid-cols-4">
            {[
              { icon: CheckCircle, title: "Production Ready", subtitle: "Battle Tested", delay: "0ms" },
              { icon: Code2, title: "TypeScript Support", subtitle: "100% Coverage", delay: "150ms" },
              { icon: Zap, title: "Zero Dependencies", subtitle: "Lightweight", delay: "300ms" },
              { icon: Users, title: "Browser Compatible", subtitle: "Universal", delay: "450ms" }
            ].map((stat, index) => (
              <div 
                key={stat.title}
                className="group mx-auto flex max-w-xs flex-col gap-y-4 p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-500 card-hover animate-fadeInUp"
                style={{ animationDelay: stat.delay }}
              >
                <dt className="text-base leading-7 text-blue-200 group-hover:text-white transition-colors duration-300">
                  {stat.title}
                </dt>
                <dd className="order-first flex flex-col items-center">
                  <stat.icon className="h-12 w-12 mb-4 text-white group-hover:scale-110 transition-transform duration-300 animate-float" style={{ animationDelay: `${index * 0.5}s` }} />
                  <span className="text-2xl font-semibold tracking-tight text-white sm:text-3xl group-hover:text-blue-100 transition-colors duration-300">
                    {stat.subtitle}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-b from-white to-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative isolate overflow-hidden rounded-3xl shadow-2xl">
            {/* Enhanced Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"></div>
            <div className="absolute inset-0 bg-mesh opacity-20"></div>
            
            {/* Floating Elements */}
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
            <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
            <div className="absolute bottom-1/4 left-1/2 w-32 h-32 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '4s' }}></div>
            
            <svg
              viewBox="0 0 1024 1024"
              className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
              aria-hidden="true"
            >
              <circle cx={512} cy={512} r={512} fill="url(#759c1415-0410-454c-8f7c-9a820de03641)" fillOpacity="0.3" />
              <defs>
                <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                  <stop stopColor="#7775D6" />
                  <stop offset={1} stopColor="#E935C1" />
                </radialGradient>
              </defs>
            </svg>
            
            <div className="relative px-6 py-24 sm:px-16 md:py-32 lg:flex lg:gap-x-20 lg:px-24">
              <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:text-left animate-fadeInUp">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl text-balance">
                  Ready to build
                  <span className="gradient-text-secondary"> reliable</span> applications?
                </h2>
                <p className="mt-6 text-lg leading-8 text-gray-300 text-pretty">
                  Start using Reliable Queue today and never worry about lost tasks or failed operations again. 
                  Join thousands of developers who trust our battle-tested solution.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 animate-slideInRight" style={{ animationDelay: '200ms' }}>
                  <Link
                    href="/docs"
                    className="group relative rounded-xl bg-white px-8 py-4 text-sm font-semibold text-gray-900 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                  <Link 
                    href="/examples" 
                    className="group flex items-center gap-2 text-sm font-semibold leading-6 text-white hover:text-blue-200 px-6 py-4 rounded-xl hover:bg-white/10 transition-all duration-300"
                  >
                    <span>View Examples</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true">→</span>
                  </Link>
                </div>
                
                {/* Additional Trust Elements */}
                <div className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-gray-400 animate-fadeInUp" style={{ animationDelay: '400ms' }}>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span>MIT Licensed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Github className="h-4 w-4" />
                    <span>Open Source</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Active Community</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

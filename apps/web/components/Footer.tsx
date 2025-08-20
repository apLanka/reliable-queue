import Link from 'next/link';
import { Github, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Reliable Queue
            </h3>
            <p className="mt-4 text-base text-gray-500">
              A production-ready task queue management library for JavaScript & TypeScript applications.
              Handle asynchronous operations with guaranteed execution and intelligent failure recovery.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Documentation
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link href="/docs" className="text-base text-gray-500 hover:text-gray-900">
                  Getting Started
                </Link>
              </li>
              <li>
                <Link href="/docs/api" className="text-base text-gray-500 hover:text-gray-900">
                  API Reference
                </Link>
              </li>
              <li>
                <Link href="/docs/react" className="text-base text-gray-500 hover:text-gray-900">
                  React Integration
                </Link>
              </li>
              <li>
                <Link href="/examples" className="text-base text-gray-500 hover:text-gray-900">
                  Examples
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Community
            </h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a
                  href="https://github.com/apLanka/reliable-queue"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://www.npmjs.com/package/@aplanka/reliable-queue"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base text-gray-500 hover:text-gray-900"
                >
                  NPM Package
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t border-gray-200 pt-8 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-gray-500">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500" />
            <span>by</span>
            <a
              href="https://github.com/apLanka"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
            >
              Pasindu Lanka
            </a>
          </div>
          <div className="flex items-center space-x-6">
            <a
              href="https://github.com/apLanka/reliable-queue"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">GitHub</span>
              <Github className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
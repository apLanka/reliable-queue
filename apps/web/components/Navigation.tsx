'use client';

import Link from 'next/link';
import { Github, Layers3, BookOpen, Code2, FileText } from 'lucide-react';
import { usePathname } from 'next/navigation';

const navigation = [
  { name: 'Home', href: '/', icon: Layers3 },
  { name: 'Docs', href: '/docs', icon: BookOpen },
  { name: 'Examples', href: '/examples', icon: Code2 },
  { name: 'Demo', href: '/demo', icon: FileText },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Layers3 className="h-8 w-8 text-blue-600" />
              <span className="font-bold text-xl text-gray-900">Reliable Queue</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="https://www.npmjs.com/package/@aplanka/reliable-queue"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              <span className="sr-only">NPM Package</span>
              <div className="flex items-center space-x-1 text-sm">
                <span>npm</span>
              </div>
            </a>
            <a
              href="https://github.com/apLanka/reliable-queue"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              <span className="sr-only">GitHub</span>
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
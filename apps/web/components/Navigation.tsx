'use client';

import Link from 'next/link';
import { Github, Layers3, BookOpen, Code2, FileText, Menu, X, Package } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const navigation = [
  { name: 'Home', href: '/', icon: Layers3 },
  { name: 'Docs', href: '/docs', icon: BookOpen },
  { name: 'Examples', href: '/examples', icon: Code2 },
  { name: 'Demo', href: '/demo', icon: FileText },
];

export default function Navigation() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'glass backdrop-blur-xl bg-white/70 border-b border-white/20 shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <Layers3 className="h-8 w-8 text-blue-600 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 animate-float" />
                <div className="absolute inset-0 rounded-full bg-blue-600/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <span className="font-bold text-xl text-gray-900 hover:text-blue-600 transition-all duration-300">
                Reliable Queue
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group relative flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-blue-600 bg-blue-50/80 shadow-md'
                      : 'text-gray-800 hover:text-blue-600 hover:bg-white/60'
                  }`}
                >
                  <item.icon className={`h-4 w-4 transition-all duration-300 ${
                    isActive ? 'text-blue-600' : 'group-hover:scale-110'
                  }`} />
                  <span>{item.name}</span>
                  {isActive && (
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 -z-10 animate-pulse"></div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop External Links */}
          <div className="hidden md:flex items-center space-x-3">
            <a
              href="https://www.npmjs.com/package/@aplanka/reliable-queue"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-800 hover:text-blue-600 hover:bg-white/60 transition-all duration-300"
            >
              <Package className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
              <span>npm</span>
            </a>
            <a
              href="https://github.com/apLanka/reliable-queue"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center w-10 h-10 rounded-lg text-gray-800 hover:text-blue-600 hover:bg-white/60 transition-all duration-300"
            >
              <Github className="h-5 w-5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
              <span className="sr-only">GitHub</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="group flex items-center justify-center w-10 h-10 rounded-lg text-gray-800 hover:text-blue-600 hover:bg-white/60 transition-all duration-300"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
              ) : (
                <Menu className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out ${
        isMobileMenuOpen 
          ? 'max-h-96 opacity-100' 
          : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <div className="glass-dark backdrop-blur-xl bg-white/90 border-t border-white/20 shadow-xl">
          <div className="px-4 py-6 space-y-3">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`group flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 animate-slideInRight ${
                    isActive
                      ? 'text-blue-600 bg-blue-50/80 shadow-md'
                      : 'text-gray-800 hover:text-blue-600 hover:bg-white/60'
                  }`}
                  style={{ animationDelay: `${navigation.indexOf(item) * 100}ms` }}
                >
                  <item.icon className={`h-5 w-5 transition-all duration-300 ${
                    isActive ? 'text-blue-600' : 'group-hover:scale-110'
                  }`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            
            {/* Mobile External Links */}
            <div className="pt-4 border-t border-gray-200/50 space-y-3">
              <a
                href="https://www.npmjs.com/package/@aplanka/reliable-queue"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium text-gray-800 hover:text-blue-600 hover:bg-white/60 transition-all duration-300 animate-slideInRight"
                style={{ animationDelay: '400ms' }}
              >
                <Package className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                <span>NPM Package</span>
              </a>
              <a
                href="https://github.com/apLanka/reliable-queue"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium text-gray-800 hover:text-blue-600 hover:bg-white/60 transition-all duration-300 animate-slideInRight"
                style={{ animationDelay: '500ms' }}
              >
                <Github className="h-5 w-5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                <span>GitHub Repository</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
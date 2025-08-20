import Link from 'next/link';
import { Github, Heart, Layers3, BookOpen, FileText, Package, Star, ExternalLink } from 'lucide-react';

const footerLinks = {
  documentation: [
    { name: 'Getting Started', href: '/docs' },
    { name: 'API Reference', href: '/docs/api' },
    { name: 'React Integration', href: '/docs/react' },
    { name: 'Examples', href: '/examples' },
  ],
  community: [
    { name: 'GitHub', href: 'https://github.com/apLanka/reliable-queue', external: true },
    { name: 'NPM Package', href: 'https://www.npmjs.com/package/@aplanka/reliable-queue', external: true },
    { name: 'Issues', href: 'https://github.com/apLanka/reliable-queue/issues', external: true },
    { name: 'Discussions', href: 'https://github.com/apLanka/reliable-queue/discussions', external: true },
  ],
  resources: [
    { name: 'Demo', href: '/demo' },
    { name: 'Changelog', href: 'https://github.com/apLanka/reliable-queue/releases', external: true },
    { name: 'License', href: 'https://github.com/apLanka/reliable-queue/blob/main/LICENSE', external: true },
  ],
};

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-mesh opacity-5"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full filter blur-xl animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-purple-500/10 rounded-full filter blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div className="relative max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2 animate-fadeInUp">
            <Link href="/" className="flex items-center space-x-3 group mb-6">
              <div className="relative">
                <Layers3 className="h-8 w-8 text-blue-400 group-hover:text-blue-300 transition-colors duration-300 animate-float" />
                <div className="absolute inset-0 rounded-full bg-blue-400/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <span className="font-bold text-xl gradient-text">Reliable Queue</span>
            </Link>
            
            <p className="text-gray-300 text-base leading-relaxed mb-6 text-pretty">
              A production-ready task queue management library for JavaScript & TypeScript applications.
              Handle asynchronous operations with guaranteed execution and intelligent failure recovery.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com/apLanka/reliable-queue"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 transition-all duration-300"
              >
                <Github className="h-5 w-5 text-gray-300 group-hover:text-white transition-colors duration-300" />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="https://www.npmjs.com/package/@aplanka/reliable-queue"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center w-10 h-10 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 transition-all duration-300"
              >
                <Package className="h-5 w-5 text-gray-300 group-hover:text-white transition-colors duration-300" />
                <span className="sr-only">NPM</span>
              </a>
              <a
                href="https://github.com/apLanka/reliable-queue"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-gray-600 transition-all duration-300 text-sm"
              >
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-gray-300 group-hover:text-white">Star</span>
              </a>
            </div>
          </div>
          
          {/* Documentation Links */}
          <div className="animate-fadeInUp" style={{ animationDelay: '150ms' }}>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-6 flex items-center">
              <BookOpen className="h-4 w-4 mr-2 text-blue-400" />
              Documentation
            </h3>
            <ul className="space-y-4">
              {footerLinks.documentation.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="group flex items-center text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {link.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Community Links */}
          <div className="animate-fadeInUp" style={{ animationDelay: '300ms' }}>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-6 flex items-center">
              <Github className="h-4 w-4 mr-2 text-blue-400" />
              Community
            </h3>
            <ul className="space-y-4">
              {footerLinks.community.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="group flex items-center text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    <span className="group-hover:translate-x-1 transition-transform duration-300">
                      {link.name}
                    </span>
                    {link.external && (
                      <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Resources Links */}
          <div className="animate-fadeInUp" style={{ animationDelay: '450ms' }}>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-6 flex items-center">
              <FileText className="h-4 w-4 mr-2 text-blue-400" />
              Resources
            </h3>
            <ul className="space-y-4">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center text-gray-300 hover:text-white transition-colors duration-300"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {link.name}
                      </span>
                      <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </a>
                  ) : (
                    <Link 
                      href={link.href} 
                      className="group flex items-center text-gray-300 hover:text-white transition-colors duration-300"
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-300">
                        {link.name}
                      </span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-700 animate-fadeInUp" style={{ animationDelay: '600ms' }}>
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-gray-400">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 animate-pulse" />
              <span>by</span>
              <a
                href="https://github.com/apLanka"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors duration-300 font-medium"
              >
                Pasindu Lanka
              </a>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <span>© 2024 Reliable Queue</span>
              <span className="hidden md:inline">•</span>
              <span>MIT License</span>
              <span className="hidden md:inline">•</span>
              <span>Open Source</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
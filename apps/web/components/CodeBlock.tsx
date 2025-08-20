'use client';

import { Highlight, themes } from 'prism-react-renderer';
import { Copy, Check, Code2, Terminal } from 'lucide-react';
import { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language: string;
  title?: string;
  showLineNumbers?: boolean;
}

export default function CodeBlock({ 
  code, 
  language, 
  title, 
  showLineNumbers = false 
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLanguageIcon = () => {
    switch (language.toLowerCase()) {
      case 'typescript':
      case 'tsx':
        return <Code2 className="h-4 w-4 text-blue-400" />;
      case 'bash':
      case 'shell':
        return <Terminal className="h-4 w-4 text-green-400" />;
      default:
        return <Code2 className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="relative group">
      {/* Glow Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-25 transition duration-500"></div>
      
      <div className="relative bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-gray-800">
        {title && (
          <div className="flex items-center justify-between px-6 py-4 bg-gray-800 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '200ms' }}></div>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '400ms' }}></div>
              </div>
              <div className="flex items-center space-x-2">
                {getLanguageIcon()}
                <span className="text-gray-200 text-sm font-medium">{title}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400 uppercase tracking-wider">{language}</span>
            </div>
          </div>
        )}
        
        <div className="relative">
          <button
            onClick={handleCopy}
            className="absolute right-4 top-4 p-2 rounded-lg bg-gray-800/80 hover:bg-gray-700 transition-all duration-200 z-10 group/btn backdrop-blur-sm border border-gray-700 hover:border-gray-600"
            title={copied ? "Copied!" : "Copy code"}
          >
            <div className="relative">
              {copied ? (
                <Check className="h-4 w-4 text-green-400 animate-fadeInUp" />
              ) : (
                <Copy className="h-4 w-4 text-gray-300 group-hover/btn:text-white transition-colors duration-200" />
              )}
              {copied && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-green-400 text-xs rounded shadow-lg animate-fadeInUp">
                  Copied!
                </div>
              )}
            </div>
          </button>
          
          <Highlight
            theme={themes.oneDark}
            code={code.trim()}
            language={language}
          >
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre
                className={`${className} p-6 overflow-x-auto text-sm leading-relaxed ${
                  title ? '' : 'rounded-xl'
                } hover:bg-gray-800/50 transition-colors duration-300`}
                style={style}
              >
                {tokens.map((line, i) => (
                  <div 
                    key={i} 
                    {...getLineProps({ line })}
                    className="hover:bg-gray-700/30 px-2 -mx-2 rounded transition-colors duration-150"
                  >
                    {showLineNumbers && (
                      <span className="text-gray-500 mr-6 select-none w-8 inline-block text-right text-xs">
                        {i + 1}
                      </span>
                    )}
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </div>
                ))}
              </pre>
            )}
          </Highlight>
        </div>
        
        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none"></div>
      </div>
    </div>
  );
}
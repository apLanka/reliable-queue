'use client';

import { Highlight, themes } from 'prism-react-renderer';
import { Copy, Check } from 'lucide-react';
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

  return (
    <div className="relative">
      {title && (
        <div className="bg-gray-800 text-gray-200 px-4 py-2 text-sm font-medium rounded-t-lg border-b border-gray-700">
          {title}
        </div>
      )}
      
      <div className="relative">
        <button
          onClick={handleCopy}
          className="absolute right-2 top-2 p-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors z-10"
          title="Copy code"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-400" />
          ) : (
            <Copy className="h-4 w-4 text-gray-300" />
          )}
        </button>
        
        <Highlight
          theme={themes.oneDark}
          code={code.trim()}
          language={language}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre
              className={`${className} p-4 overflow-x-auto text-sm ${
                title ? 'rounded-b-lg' : 'rounded-lg'
              }`}
              style={style}
            >
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line })}>
                  {showLineNumbers && (
                    <span className="text-gray-500 mr-4 select-none w-8 inline-block text-right">
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
    </div>
  );
}
import ReactMarkdown from 'react-markdown';

export function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div className={`markdown-content ${className || ''}`}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-4xl font-bold text-gray-900 mb-6 mt-8">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-3xl font-bold text-gray-800 mb-4 mt-6">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-2xl font-semibold text-gray-800 mb-3 mt-5">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="text-base text-gray-700 mb-4 leading-relaxed">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-4 space-y-2 ml-4">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-4 space-y-2 ml-4">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-base text-gray-700">{children}</li>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-gray-900">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-gray-800">{children}</em>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-emerald-500 pl-4 italic text-gray-600 my-4">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="my-8 border-gray-300" />,
          a: ({ href, children }) => (
            <a 
              href={href} 
              className="text-emerald-600 hover:text-emerald-800 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
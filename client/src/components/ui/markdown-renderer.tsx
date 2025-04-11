import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeSlug from 'rehype-slug';
import { Card } from './card';
import { cn } from '@/lib/utils';

// Define types of Markdown display modes
type MarkdownDisplayMode = 'default' | 'compact' | 'enhanced';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  mode?: MarkdownDisplayMode;
}

export function MarkdownRenderer({ 
  content, 
  className,
  mode = 'default' 
}: MarkdownRendererProps) {
  // Define custom renderers based on mode
  const getComponents = () => {
    const baseComponents = {
      h1: ({ node, className, children, ...props }: any) => (
        <h1 className={cn("text-2xl font-bold mt-6 mb-4 text-primary", className)} {...props}>
          {children}
        </h1>
      ),
      h2: ({ node, className, children, ...props }: any) => (
        <h2 className={cn("text-xl font-bold mt-5 mb-3 text-primary", className)} {...props}>
          {children}
        </h2>
      ),
      h3: ({ node, className, children, ...props }: any) => (
        <h3 className={cn("text-lg font-bold mt-4 mb-2", className)} {...props}>
          {children}
        </h3>
      ),
      h4: ({ node, className, children, ...props }: any) => (
        <h4 className={cn("text-base font-bold mt-3 mb-2", className)} {...props}>
          {children}
        </h4>
      ),
      h5: ({ node, className, children, ...props }: any) => (
        <h5 className={cn("text-sm font-bold mt-2 mb-1", className)} {...props}>
          {children}
        </h5>
      ),
      h6: ({ node, className, children, ...props }: any) => (
        <h6 className={cn("text-xs font-bold mt-2 mb-1", className)} {...props}>
          {children}
        </h6>
      ),
      p: ({ node, className, children, ...props }: any) => (
        <p className={cn("my-2 text-foreground", className)} {...props}>
          {children}
        </p>
      ),
      a: ({ node, className, children, ...props }: any) => (
        <a 
          className={cn("text-blue-600 hover:underline", className)} 
          target="_blank"
          rel="noopener noreferrer"
          {...props}
        >
          {children}
        </a>
      ),
      blockquote: ({ node, className, children, ...props }: any) => (
        <blockquote 
          className={cn("pl-4 italic border-l-4 border-muted-foreground/40 my-3 text-muted-foreground", className)} 
          {...props}
        >
          {children}
        </blockquote>
      ),
      ul: ({ node, className, children, ...props }: any) => (
        <ul className={cn("list-disc pl-5 space-y-1 my-2", className)} {...props}>
          {children}
        </ul>
      ),
      ol: ({ node, className, children, ...props }: any) => (
        <ol className={cn("list-decimal pl-5 space-y-1 my-2", className)} {...props}>
          {children}
        </ol>
      ),
      li: ({ node, className, children, ...props }: any) => (
        <li className={cn("my-1", className)} {...props}>
          {children}
        </li>
      ),
      table: ({ node, className, children, ...props }: any) => (
        <div className="overflow-x-auto my-4">
          <table 
            className={cn("min-w-full divide-y divide-border border rounded-lg", className)} 
            {...props}
          >
            {children}
          </table>
        </div>
      ),
      thead: ({ node, className, children, ...props }: any) => (
        <thead className={cn("bg-muted", className)} {...props}>
          {children}
        </thead>
      ),
      tbody: ({ node, className, children, ...props }: any) => (
        <tbody 
          className={cn("divide-y divide-border bg-background", className)} 
          {...props}
        >
          {children}
        </tbody>
      ),
      tr: ({ node, className, children, ...props }: any) => (
        <tr className={cn("", className)} {...props}>
          {children}
        </tr>
      ),
      th: ({ node, className, children, ...props }: any) => (
        <th 
          className={cn("px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider", className)} 
          {...props}
        >
          {children}
        </th>
      ),
      td: ({ node, className, children, ...props }: any) => (
        <td 
          className={cn("px-4 py-2 text-sm", className)} 
          {...props}
        >
          {children}
        </td>
      ),
      hr: ({ node, className, ...props }: any) => (
        <hr 
          className={cn("my-6 border-t border-border", className)} 
          {...props}
        />
      ),
      code: ({ inline, className, children, ...props }: any) => {
        return inline ? (
          <code className={cn("bg-muted px-1 py-0.5 rounded text-sm font-mono", className)} {...props}>
            {children}
          </code>
        ) : (
          <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-sm">
            <code className="font-mono whitespace-pre-wrap" {...props}>
              {children}
            </code>
          </pre>
        );
      },
      pre: ({ node, className, children, ...props }: any) => (
        <pre className={cn("overflow-auto p-4 bg-muted rounded-lg my-4", className)} {...props}>
          {children}
        </pre>
      ),
      strong: ({ node, className, children, ...props }: any) => (
        <strong className={cn("font-bold", className)} {...props}>
          {children}
        </strong>
      ),
      em: ({ node, className, children, ...props }: any) => (
        <em className={cn("italic", className)} {...props}>
          {children}
        </em>
      )
    };
    
    // Enhanced mode adds more styling
    if (mode === 'enhanced') {
      return {
        ...baseComponents,
        h1: ({ node, className, children, ...props }: any) => (
          <h1 
            className={cn(
              "text-2xl font-bold mt-6 mb-4 pb-2 border-b border-border text-primary/90 font-heading", 
              className
            )} 
            {...props}
          >
            {children}
          </h1>
        ),
        h2: ({ node, className, children, ...props }: any) => (
          <h2 
            className={cn(
              "text-xl font-bold mt-5 mb-3 text-primary/90 font-heading", 
              className
            )} 
            {...props}
          >
            {children}
          </h2>
        ),
        blockquote: ({ node, className, children, ...props }: any) => (
          <blockquote 
            className={cn(
              "pl-4 italic border-l-4 border-primary/30 my-4 text-muted-foreground bg-muted/50 p-2 rounded-r-md",
              className
            )} 
            {...props}
          >
            {children}
          </blockquote>
        ),
        table: ({ node, className, children, ...props }: any) => (
          <Card className="my-6 overflow-hidden border shadow-sm">
            <div className="overflow-x-auto">
              <table 
                className={cn("min-w-full divide-y divide-border", className)} 
                {...props}
              >
                {children}
              </table>
            </div>
          </Card>
        ),
      };
    }
    
    // Compact mode reduces spacing
    if (mode === 'compact') {
      return {
        ...baseComponents,
        h1: ({ node, className, children, ...props }: any) => (
          <h1 className={cn("text-xl font-bold mt-3 mb-2 text-primary", className)} {...props}>
            {children}
          </h1>
        ),
        h2: ({ node, className, children, ...props }: any) => (
          <h2 className={cn("text-lg font-bold mt-3 mb-2 text-primary", className)} {...props}>
            {children}
          </h2>
        ),
        h3: ({ node, className, children, ...props }: any) => (
          <h3 className={cn("text-base font-bold mt-2 mb-1", className)} {...props}>
            {children}
          </h3>
        ),
        p: ({ node, className, children, ...props }: any) => (
          <p className={cn("my-1 text-sm text-foreground", className)} {...props}>
            {children}
          </p>
        ),
        ul: ({ node, className, children, ...props }: any) => (
          <ul className={cn("list-disc pl-4 space-y-0.5 my-1 text-sm", className)} {...props}>
            {children}
          </ul>
        ),
        ol: ({ node, className, children, ...props }: any) => (
          <ol className={cn("list-decimal pl-4 space-y-0.5 my-1 text-sm", className)} {...props}>
            {children}
          </ol>
        ),
      };
    }
    
    return baseComponents;
  };

  return (
    <div className={cn("markdown-renderer text-foreground", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeSlug]}
        components={getComponents()}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
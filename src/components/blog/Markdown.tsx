import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {CodeHighlight} from './CodeHighlight';
import {FadeImage} from '@/components/FadeImage';

/**
 * Renders a markdown string with GitHub-flavored markdown and lazily-loaded,
 * per-language syntax highlighting for fenced code blocks.
 */
export function Markdown({children}: {children: string}) {
  return (
    <div className="blog-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre: ({children}) => <>{children}</>,
          img: ({node: _node, ...props}) => <FadeImage {...props} />,
          code: ({className, children}) => {
            const match = /language-(\w+)/.exec(className || '');
            const text = String(children).replace(/\n$/, '');
            if (match) {
              return <CodeHighlight code={text} language={match[1]} />;
            }
            return <code className={className}>{children}</code>;
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

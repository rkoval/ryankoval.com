import {useEffect, useState} from 'react';
import 'highlight.js/styles/github-dark.css';

/** Lazy per-language loaders so highlight.js grammars are only fetched when used. */
const loaders: Record<string, () => Promise<{default: unknown}>> = {
  javascript: () => import('highlight.js/lib/languages/javascript'),
  js: () => import('highlight.js/lib/languages/javascript'),
  scala: () => import('highlight.js/lib/languages/scala'),
  bash: () => import('highlight.js/lib/languages/bash'),
  shell: () => import('highlight.js/lib/languages/bash'),
  sh: () => import('highlight.js/lib/languages/bash'),
};

const aliases: Record<string, string> = {
  js: 'javascript',
  shell: 'bash',
  sh: 'bash',
};

export function CodeHighlight({code, language}: {code: string; language?: string}) {
  const [html, setHtml] = useState<string | null>(null);
  const lang = language?.toLowerCase();

  useEffect(() => {
    let active = true;
    const loader = lang ? loaders[lang] : undefined;
    if (!lang || !loader) {
      setHtml(null);
      return;
    }
    (async () => {
      const [core, langMod] = await Promise.all([import('highlight.js/lib/core'), loader()]);
      if (!active) return;
      const hljs = core.default;
      const name = aliases[lang] ?? lang;
      if (!hljs.getLanguage(name)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        hljs.registerLanguage(name, langMod.default as any);
      }
      const result = hljs.highlight(code, {language: name});
      if (active) setHtml(result.value);
    })();
    return () => {
      active = false;
    };
  }, [code, lang]);

  return (
    <pre>
      {html ? (
        <code
          className={`hljs language-${aliases[lang ?? ''] ?? lang ?? ''}`}
          dangerouslySetInnerHTML={{__html: html}}
        />
      ) : (
        <code className="hljs">{code}</code>
      )}
    </pre>
  );
}

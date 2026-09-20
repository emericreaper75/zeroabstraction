import React from 'react';
import {
  RichText,
  defaultJSXConverters,
  type JSXConverters,
} from '@payloadcms/richtext-lexical/react';
import katex from 'katex';
import { codeToHtml } from 'shiki';

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

/** Slugify a string for use as a heading ID. */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

/** Recursively extract plain text from Lexical child nodes. */
function extractText(children: any[]): string {
  if (!children) return '';
  return children
    .map((child: any) => {
      if (child.text != null) return child.text;
      if (child.children) return extractText(child.children);
      return '';
    })
    .join('');
}

// ---------------------------------------------------------------------------
// Math rendering (KaTeX)
// ---------------------------------------------------------------------------

/** Process a text string, rendering $...$ and $$...$$ LaTeX delimiters. */
function renderMathInText(text: string): React.ReactNode[] {
  // Pattern: $$...$$ (display) or $...$ (inline), non-greedy
  const parts: React.ReactNode[] = [];
  const regex = /\$\$([\s\S]+?)\$\$|\$([^\$\n]+?)\$/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    // Text before the match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const isDisplay = match[1] !== undefined;
    const latex = isDisplay ? match[1] : match[2];

    try {
      const html = katex.renderToString(latex.trim(), {
        displayMode: isDisplay,
        throwOnError: false,
        output: 'html',
      });

      if (isDisplay) {
        parts.push(
          <div
            key={`math-${match.index}`}
            className="math-display"
            dangerouslySetInnerHTML={{ __html: html }}
          />,
        );
      } else {
        parts.push(
          <span
            key={`math-${match.index}`}
            className="math-inline"
            dangerouslySetInnerHTML={{ __html: html }}
          />,
        );
      }
    } catch {
      // If KaTeX fails, output the raw text
      parts.push(isDisplay ? `$$${latex}$$` : `$${latex}$`);
    }

    lastIndex = match.index + match[0].length;
  }

  // Remaining text after last match
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}

// ---------------------------------------------------------------------------
// Syntax highlighting (Shiki) — async server component helper
// ---------------------------------------------------------------------------

async function highlightCode(
  code: string,
  language: string,
): Promise<string> {
  try {
    return await codeToHtml(code, {
      lang: language || 'text',
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultColor: false,
    });
  } catch {
    // Fallback: plain code block if Shiki can't handle the language
    const escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return `<pre><code>${escaped}</code></pre>`;
  }
}

/** Server-side code block component (async RSC). */
async function CodeBlockComponent({
  code,
  language,
}: {
  code: string;
  language: string;
}) {
  const highlighted = await highlightCode(code, language);

  return (
    <div className="code-block">
      {language && (
        <div className="code-block-header">
          <span className="code-block-lang">{language}</span>
        </div>
      )}
      <div dangerouslySetInnerHTML={{ __html: highlighted }} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Custom JSX Converters
// ---------------------------------------------------------------------------

const customConverters: JSXConverters = {
  ...defaultJSXConverters,

  // ---- Anchored Headings ----
  heading: ({ node, nodesToJSX }) => {
    const children = nodesToJSX({ nodes: node.children });
    const text = extractText(node.children);
    const id = slugify(text);
    const Tag = node.tag as keyof React.JSX.IntrinsicElements;

    return (
      <Tag id={id}>
        {children}
        <a href={`#${id}`} className="heading-anchor" aria-label={`Link to ${text}`}>
          #
        </a>
      </Tag>
    );
  },

  // ---- Code Block (Payload Block type: "Code") ----
  blocks: {
    Code: ({ node }: { node: any }) => {
      const fields = node.fields || {};
      const code = fields.code || '';
      const language = fields.language || '';

      return <CodeBlockComponent code={code} language={language} />;
    },
  },

  // ---- Text with LaTeX Math ----
  text: ({ node }) => {
    const text = node.text || '';
    const format = node.format || 0;

    // If marked as inline code, render as <code> without math processing
    if (format & 16) {
      return <code>{text}</code>;
    }

    // Check if text contains math delimiters
    const hasMath = /\$\$[\s\S]+?\$\$|\$[^\$\n]+?\$/.test(text);

    // Build the base text/math content
    let content: React.ReactNode;
    if (hasMath) {
      const mathParts = renderMathInText(text);
      content = <>{mathParts}</>;
    } else {
      content = text;
    }

    // No formatting and no math — return plain text
    if (format === 0 && !hasMath) {
      return <>{text}</>;
    }

    // Apply Lexical text formatting flags:
    // 1=bold, 2=italic, 4=strikethrough, 8=underline, 32=subscript, 64=superscript
    let element = content;

    if (format & 1) {
      element = <strong>{element}</strong>;
    }
    if (format & 2) {
      element = <em>{element}</em>;
    }
    if (format & 4) {
      element = <s>{element}</s>;
    }
    if (format & 8) {
      element = <u>{element}</u>;
    }
    if (format & 32) {
      element = <sub>{element}</sub>;
    }
    if (format & 64) {
      element = <sup>{element}</sup>;
    }

    return <>{element}</>;
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const RichTextRenderer = ({ data }: { data: any }) => {
  if (!data) return null;
  return (
    <div className="rich-text">
      <RichText data={data} converters={customConverters} />
    </div>
  );
};

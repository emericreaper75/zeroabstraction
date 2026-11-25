'use client'

import React, { useState, useRef, useMemo } from 'react'
import katex from 'katex'

interface RichContentEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
  label?: string
}

type EditorMode = 'write' | 'preview' | 'split'

export function RichContentEditor({
  value,
  onChange,
  placeholder = 'Write your manuscript content here in Markdown format (supports LaTeX $...$ and $$...$$)...',
  minHeight = '360px',
  label = 'Body Content',
}: RichContentEditorProps) {
  const [mode, setMode] = useState<EditorMode>('write')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Live writing telemetry
  const telemetry = useMemo(() => {
    const text = value || ''
    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    const chars = text.length
    const readingTime = Math.max(1, Math.ceil(words / 200))
    return { words, chars, readingTime }
  }, [value])

  // Helper to insert or wrap markdown syntax
  const insertSyntax = (prefix: string, suffix = '', defaultText = '') => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = value.slice(start, end)
    const contentToWrap = selected || defaultText

    const before = value.slice(0, start)
    const after = value.slice(end)

    const replacement = `${prefix}${contentToWrap}${suffix}`
    const newValue = `${before}${replacement}${after}`

    onChange(newValue)

    // Restore cursor position / selection
    setTimeout(() => {
      textarea.focus()
      const newCursorStart = start + prefix.length
      const newCursorEnd = newCursorStart + contentToWrap.length
      textarea.setSelectionRange(newCursorStart, newCursorEnd)
    }, 0)
  }

  // Prepend prefix to current line (for headings, quotes, lists)
  const prefixLine = (prefix: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const before = value.slice(0, start)
    const lastNewline = before.lastIndexOf('\n')
    const lineStart = lastNewline === -1 ? 0 : lastNewline + 1

    const textBeforeLine = value.slice(0, lineStart)
    const lineContent = value.slice(lineStart)

    const newValue = `${textBeforeLine}${prefix} ${lineContent}`
    onChange(newValue)

    setTimeout(() => {
      textarea.focus()
      const newPos = start + prefix.length + 1
      textarea.setSelectionRange(newPos, newPos)
    }, 0)
  }

  // Keyboard shortcut handlers (Ctrl+B, Ctrl+I, etc.)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault()
      insertSyntax('**', '**', 'bold text')
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
      e.preventDefault()
      insertSyntax('*', '*', 'italic text')
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
      e.preventDefault()
      insertSyntax('`', '`', 'code')
    } else if (e.key === 'Tab') {
      e.preventDefault()
      insertSyntax('  ', '', '')
    }
  }

  return (
    <div className="space-y-2.5 w-full">
      {/* Header bar: Label & Compact Pill View Mode Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="block text-[13px] font-medium text-ink-secondary">
          {label}
        </label>
        <div className="inline-flex items-center gap-1 bg-[#F1F5F9] dark:bg-zinc-900 p-1 rounded-full text-[12px]">
          <button
            type="button"
            onClick={() => setMode('write')}
            className={`px-3 py-1 rounded-full transition-colors flex items-center gap-1 font-medium ${
              mode === 'write'
                ? 'bg-[#0F172A] text-white dark:bg-slate-100 dark:text-slate-900'
                : 'text-ink-muted hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">edit</span>
            <span>Write</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('preview')}
            className={`px-3 py-1 rounded-full transition-colors flex items-center gap-1 font-medium ${
              mode === 'preview'
                ? 'bg-[#0F172A] text-white dark:bg-slate-100 dark:text-slate-900'
                : 'text-ink-muted hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">visibility</span>
            <span>Preview</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('split')}
            className={`px-3 py-1 rounded-full transition-colors hidden sm:flex items-center gap-1 font-medium ${
              mode === 'split'
                ? 'bg-[#0F172A] text-white dark:bg-slate-100 dark:text-slate-900'
                : 'text-ink-muted hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">vertical_split</span>
            <span>Split</span>
          </button>
        </div>
      </div>

      {/* Editor Frame (borderless soft surface) */}
      <div className="rounded-[14px] bg-[#F8FAFC] dark:bg-zinc-900 overflow-hidden flex flex-col">
        {/* Streamlined Formatting Toolbar */}
        {mode !== 'preview' && (
          <div className="border-b border-[#E2E8F0]/70 dark:border-zinc-800 px-3 py-2 flex flex-wrap items-center gap-1 text-ink-secondary">
            {/* Collapsed Heading Dropdown */}
            <select
              aria-label="Insert heading level"
              value=""
              onChange={(e) => {
                if (e.target.value) {
                  prefixLine(e.target.value)
                }
              }}
              className="bg-paper-surface text-on-surface text-[12px] font-medium px-2.5 py-1 rounded-lg cursor-pointer focus:outline-none mr-1"
            >
              <option value="" disabled>
                Heading ▾
              </option>
              <option value="#">H1 — Title</option>
              <option value="##">H2 — Section</option>
              <option value="###">H3 — Subsection</option>
              <option value="####">H4 — Minor</option>
              <option value="#####">H5 — Note</option>
              <option value="######">H6 — Micro</option>
            </select>

            <span className="h-4 w-px bg-[#E2E8F0] dark:bg-zinc-800 mx-1" />

            {/* Inline Formatting */}
            <button
              type="button"
              onClick={() => insertSyntax('**', '**', 'bold text')}
              title="Bold (Ctrl+B)"
              className="p-1.5 hover:bg-surface-container hover:text-on-surface rounded font-bold"
            >
              <span className="material-symbols-outlined text-[17px]">format_bold</span>
            </button>
            <button
              type="button"
              onClick={() => insertSyntax('*', '*', 'italic text')}
              title="Italic (Ctrl+I)"
              className="p-1.5 hover:bg-surface-container hover:text-on-surface rounded italic"
            >
              <span className="material-symbols-outlined text-[17px]">format_italic</span>
            </button>
            <button
              type="button"
              onClick={() => insertSyntax('~~', '~~', 'strikethrough')}
              title="Strikethrough"
              className="p-1.5 hover:bg-surface-container hover:text-on-surface rounded"
            >
              <span className="material-symbols-outlined text-[17px]">format_strikethrough</span>
            </button>
            <button
              type="button"
              onClick={() => insertSyntax('`', '`', 'code')}
              title="Inline Code (Ctrl+E)"
              className="p-1.5 hover:bg-surface-container hover:text-on-surface rounded font-mono text-[13px]"
            >
              <span className="material-symbols-outlined text-[17px]">code</span>
            </button>

            <span className="h-4 w-px bg-hairline-rule mx-1" />

            {/* Math Support */}
            <button
              type="button"
              onClick={() => insertSyntax('$', '$', 'E=mc^2')}
              title="Inline LaTeX Math ($...$)"
              className="px-2 py-1 hover:bg-surface-container hover:text-primary font-mono text-label-sm text-accent-ochre font-semibold rounded"
            >
              $x$
            </button>
            <button
              type="button"
              onClick={() => insertSyntax('$$\n', '\n$$', '\\int_0^\\infty e^{-x^2} dx')}
              title="Display LaTeX Math ($$...$$)"
              className="px-2 py-1 hover:bg-surface-container hover:text-primary font-mono text-label-sm text-accent-ochre font-semibold rounded"
            >
              $$
            </button>

            <span className="h-4 w-px bg-hairline-rule mx-1" />

            {/* Blocks & Lists */}
            <button
              type="button"
              onClick={() => prefixLine('>')}
              title="Quote"
              className="p-1.5 hover:bg-surface-container hover:text-on-surface rounded"
            >
              <span className="material-symbols-outlined text-[17px]">format_quote</span>
            </button>
            <button
              type="button"
              onClick={() => prefixLine('-')}
              title="Bullet List"
              className="p-1.5 hover:bg-surface-container hover:text-on-surface rounded"
            >
              <span className="material-symbols-outlined text-[17px]">format_list_bulleted</span>
            </button>
            <button
              type="button"
              onClick={() => prefixLine('1.')}
              title="Numbered List"
              className="p-1.5 hover:bg-surface-container hover:text-on-surface rounded"
            >
              <span className="material-symbols-outlined text-[17px]">format_list_numbered</span>
            </button>
            <button
              type="button"
              onClick={() => insertSyntax('[', '](https://)', 'Link text')}
              title="Link"
              className="p-1.5 hover:bg-surface-container hover:text-on-surface rounded"
            >
              <span className="material-symbols-outlined text-[17px]">link</span>
            </button>
            <button
              type="button"
              onClick={() => insertSyntax('```python\n', '\n```', '# code here')}
              title="Code Block"
              className="p-1.5 hover:bg-surface-container hover:text-on-surface rounded"
            >
              <span className="material-symbols-outlined text-[17px]">data_object</span>
            </button>
            <button
              type="button"
              onClick={() =>
                insertSyntax(
                  '\n| Metric | Baseline | Target |\n| :--- | :---: | ---: |\n| Flux | 1.42 Jy | 1.85 Jy |\n| SNR | 12.4 | 18.0 |\n| Efficiency | 84% | 96% |\n\n'
                )
              }
              title="Table (GFM)"
              className="p-1.5 hover:bg-surface-container hover:text-on-surface rounded"
            >
              <span className="material-symbols-outlined text-[17px]">table_chart</span>
            </button>
            <button
              type="button"
              onClick={() => insertSyntax('\n---\n')}
              title="Horizontal Rule"
              className="p-1.5 hover:bg-surface-container hover:text-on-surface rounded"
            >
              <span className="material-symbols-outlined text-[17px]">horizontal_rule</span>
            </button>
          </div>
        )}

        {/* Editor Body */}
        <div className={`grid ${mode === 'split' ? 'grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-hairline-rule' : 'grid-cols-1'}`}>
          {/* Write Mode Textarea */}
          {mode !== 'preview' && (
            <div className="relative flex flex-col">
              <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                style={{ minHeight }}
                className="w-full flex-1 p-4 bg-transparent text-on-surface font-body-md text-body-md leading-relaxed focus:outline-none resize-y border-none"
              />
            </div>
          )}

          {/* Preview Mode Rendered Output */}
          {mode !== 'write' && (
            <div
              style={{ minHeight }}
              className="p-5 bg-paper-base/30 overflow-y-auto max-h-[600px] text-on-surface font-body-md leading-relaxed"
            >
              <MarkdownPreview content={value} />
            </div>
          )}
        </div>

        {/* Telemetry Footer */}
        <div className="border-t border-[#E2E8F0]/70 dark:border-zinc-800 px-4 py-2 flex flex-wrap items-center justify-between gap-3 font-mono-telemetry text-[11px] text-ink-muted">
          <div className="flex items-center space-x-4">
            <span>
              <strong className="text-on-surface font-medium font-mono">{telemetry.words}</strong> words
            </span>
            <span>
              <strong className="text-on-surface font-medium font-mono">{telemetry.chars}</strong> chars
            </span>
            <span>
              ~<strong className="text-on-surface font-medium font-mono">{telemetry.readingTime}</strong> min read
            </span>
          </div>
          <div className="flex items-center space-x-2 text-ink-secondary">
            <span className="font-mono text-[11px] text-accent-ochre bg-amber-wash px-2 py-0.5 rounded">
              MARKDOWN + KATEX
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Lightweight client preview component supporting Markdown & KaTeX rendering.
 */
function MarkdownPreview({ content }: { content: string }) {
  if (!content || !content.trim()) {
    return (
      <div className="text-ink-muted italic font-body-sm py-8 text-center">
        Preview will appear here once you write content.
      </div>
    )
  }

  // Parses inline Markdown (bold, italic, bold+italic, code, strikethrough, links) and LaTeX math ($...$, $$...$$)
  const renderInlineContent = (rawText: string): React.ReactNode => {
    if (!rawText) return null

    // 1. Tokenize LaTeX math expressions first ($$...$$ or $...$)
    const segments: { type: 'text' | 'math'; isDisplay?: boolean; latex?: string; text?: string }[] = []
    const mathRegex = /\$\$([\s\S]+?)\$\$|\$([^\$\n]+?)\$/g
    let lastIdx = 0
    let match: RegExpExecArray | null

    while ((match = mathRegex.exec(rawText)) !== null) {
      if (match.index > lastIdx) {
        segments.push({ type: 'text', text: rawText.slice(lastIdx, match.index) })
      }
      segments.push({
        type: 'math',
        isDisplay: match[1] !== undefined,
        latex: (match[1] || match[2] || '').trim(),
      })
      lastIdx = match.index + match[0].length
    }
    if (lastIdx < rawText.length) {
      segments.push({ type: 'text', text: rawText.slice(lastIdx) })
    }

    // 2. Tokenize markdown inline elements within 'text' segments
    // Matches:
    // 1-3: ***bold italic*** or ___bold italic___
    // 4-6: **bold** or __bold__
    // 7-9: *italic* or _italic_
    // 10-11: `inline code`
    // 12-13: ~~strikethrough~~
    // 14-16: [link text](url)
    const mdRegex =
      /(\*\*\*(.+?)\*\*\*|___(.+?)___)|(\*\*(.+?)\*\*|__(.+?)__)|((?<!\*)\*(?!\*)([^\*]+?)(?<!\*)\*(?!\*)|(?<!_)(?<![a-zA-Z0-9])_([^_]+?)_(?![a-zA-Z0-9]))|(`(.+?)`)|(~~(.+?)~~)|(\[(.+?)\]\((.+?)\))/g

    const nodes: React.ReactNode[] = []

    segments.forEach((seg, segIdx) => {
      if (seg.type === 'math') {
        const isDisplay = seg.isDisplay
        const latex = seg.latex || ''
        try {
          const html = katex.renderToString(latex, {
            displayMode: isDisplay,
            throwOnError: false,
          })
          nodes.push(
            <span
              key={`math-${segIdx}`}
              dangerouslySetInnerHTML={{ __html: html }}
              className={isDisplay ? 'block my-3 text-center overflow-x-auto' : 'inline-block px-1'}
            />
          )
        } catch {
          nodes.push(
            <span key={`math-fallback-${segIdx}`}>
              {isDisplay ? `$$${latex}$$` : `$${latex}$`}
            </span>
          )
        }
        return
      }

      const str = seg.text || ''
      let sIdx = 0
      let m: RegExpExecArray | null

      while ((m = mdRegex.exec(str)) !== null) {
        if (m.index > sIdx) {
          nodes.push(
            <React.Fragment key={`text-${segIdx}-${sIdx}`}>
              {str.slice(sIdx, m.index)}
            </React.Fragment>
          )
        }

        const matchKey = `md-${segIdx}-${m.index}`
        if (m[1]) {
          // Bold + Italic
          nodes.push(
            <strong key={matchKey} className="font-bold text-on-surface">
              <em className="italic">{m[2] || m[3]}</em>
            </strong>
          )
        } else if (m[4]) {
          // Bold
          nodes.push(
            <strong key={matchKey} className="font-bold text-on-surface">
              {m[5] || m[6]}
            </strong>
          )
        } else if (m[7]) {
          // Italic
          nodes.push(
            <em key={matchKey} className="italic text-on-surface">
              {m[8] || m[9]}
            </em>
          )
        } else if (m[10]) {
          // Inline Code
          nodes.push(
            <code
              key={matchKey}
              className="px-1.5 py-0.5 bg-surface-container-high text-accent-ochre font-mono text-[13px] rounded"
            >
              {m[11]}
            </code>
          )
        } else if (m[12]) {
          // Strikethrough
          nodes.push(
            <s key={matchKey} className="line-through text-ink-muted">
              {m[13]}
            </s>
          )
        } else if (m[14]) {
          // Link
          nodes.push(
            <a
              key={matchKey}
              href={m[16]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline hover:text-accent-ochre"
            >
              {m[15]}
            </a>
          )
        }

        sIdx = m.index + m[0].length
      }

      if (sIdx < str.length) {
        nodes.push(
          <React.Fragment key={`text-${segIdx}-${sIdx}`}>
            {str.slice(sIdx)}
          </React.Fragment>
        )
      }
    })

    return nodes.length > 0 ? nodes : rawText
  }

  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (!line.trim()) {
      i++
      continue
    }

    // Fenced Code Block
    if (line.trim().startsWith('```')) {
      const lang = line.trim().slice(3)
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      if (i < lines.length) i++ // skip closing fence

      elements.push(
        <div key={`code-${i}`} className="my-4 bg-surface-container-lowest border border-hairline-rule rounded overflow-hidden">
          {lang && (
            <div className="bg-surface-container-high px-3 py-1 text-label-sm font-mono text-ink-muted border-b border-hairline-rule">
              {lang}
            </div>
          )}
          <pre className="p-3 font-mono text-body-sm text-on-surface overflow-x-auto bg-paper-surface">
            <code>{codeLines.join('\n')}</code>
          </pre>
        </div>
      )
      continue
    }

    // GFM Table
    if (
      line.trim().startsWith('|') &&
      i + 1 < lines.length &&
      lines[i + 1].trim().startsWith('|') &&
      /^\|?(\s*:?-+:?\s*\|)+(\s*:?-+:?\s*\|?)?$/.test(lines[i + 1].trim())
    ) {
      const headerLine = line
      const delimiterLine = lines[i + 1]
      i += 2

      const parseCells = (str: string) => {
        let s = str.trim()
        if (s.startsWith('|')) s = s.slice(1)
        if (s.endsWith('|')) s = s.slice(0, -1)
        return s.split('|').map((c) => c.trim())
      }

      const headers = parseCells(headerLine)
      const aligns = parseCells(delimiterLine).map((c) => {
        const left = c.startsWith(':')
        const right = c.endsWith(':')
        if (left && right) return 'center' as const
        if (right) return 'right' as const
        return 'left' as const
      })

      const rows: string[][] = []
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        rows.push(parseCells(lines[i]))
        i++
      }

      elements.push(
        <div key={`table-${i}`} className="my-4 overflow-x-auto border border-hairline-rule rounded">
          <table className="w-full border-collapse font-body-sm text-on-surface text-left">
            <thead className="bg-surface-container-high/60 border-b border-hairline-rule">
              <tr>
                {headers.map((h, hIdx) => (
                  <th
                    key={hIdx}
                    style={{ textAlign: aligns[hIdx] || 'left' }}
                    className="p-2.5 font-mono text-label-sm font-semibold uppercase tracking-wider text-ink-muted"
                  >
                    {renderInlineContent(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline-rule bg-white">
              {rows.map((r, rIdx) => (
                <tr key={rIdx} className={rIdx % 2 === 1 ? 'bg-surface-container-lowest/40' : ''}>
                  {r.map((c, cIdx) => (
                    <td
                      key={cIdx}
                      style={{ textAlign: aligns[cIdx] || 'left' }}
                      className="p-2.5 font-body-sm text-on-surface"
                    >
                      {renderInlineContent(c)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
      continue
    }

    // Headings (H1 to H6)
    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/)
    if (headingMatch) {
      const level = headingMatch[1].length
      const headingText = headingMatch[2]
      if (level === 1) {
        elements.push(
          <h1 key={`h1-${i}`} className="font-headline-xl text-headline-xl text-on-surface mt-6 mb-3 tracking-tight font-medium">
            {renderInlineContent(headingText)}
          </h1>
        )
      } else if (level === 2) {
        elements.push(
          <h2 key={`h2-${i}`} className="font-headline-lg text-headline-lg text-on-surface mt-5 mb-2.5 tracking-tight font-medium">
            {renderInlineContent(headingText)}
          </h2>
        )
      } else if (level === 3) {
        elements.push(
          <h3 key={`h3-${i}`} className="font-headline-md text-headline-md text-on-surface mt-4 mb-2 font-medium">
            {renderInlineContent(headingText)}
          </h3>
        )
      } else if (level === 4) {
        elements.push(
          <h4 key={`h4-${i}`} className="font-headline-sm text-headline-sm text-on-surface mt-3.5 mb-1.5 font-semibold">
            {renderInlineContent(headingText)}
          </h4>
        )
      } else if (level === 5) {
        elements.push(
          <h5 key={`h5-${i}`} className="font-body-md text-body-md text-on-surface mt-3 mb-1 font-semibold uppercase tracking-wide">
            {renderInlineContent(headingText)}
          </h5>
        )
      } else if (level === 6) {
        elements.push(
          <h6 key={`h6-${i}`} className="font-label-sm text-label-sm text-ink-secondary mt-2.5 mb-1 font-semibold uppercase tracking-widest">
            {renderInlineContent(headingText)}
          </h6>
        )
      }
      i++
      continue
    }

    // Blockquote
    if (line.startsWith('>')) {
      const quoteLines: string[] = []
      while (i < lines.length && lines[i].startsWith('>')) {
        quoteLines.push(lines[i].replace(/^>\s?/, ''))
        i++
      }
      elements.push(
        <blockquote key={`quote-${i}`} className="my-3 pl-4 border-l-2 border-accent-amber italic text-ink-secondary bg-surface-container-low/40 py-1.5 pr-3">
          {renderInlineContent(quoteLines.join(' '))}
        </blockquote>
      )
      continue
    }

    // Unordered List
    if (line.match(/^[\*\-]\s+/)) {
      const items: string[] = []
      while (i < lines.length && lines[i].match(/^[\*\-]\s+/)) {
        items.push(lines[i].replace(/^[\*\-]\s+/, ''))
        i++
      }
      elements.push(
        <ul key={`ul-${i}`} className="list-disc list-inside space-y-1 my-2.5 pl-2 text-on-surface">
          {items.map((it, idx) => (
            <li key={idx}>{renderInlineContent(it)}</li>
          ))}
        </ul>
      )
      continue
    }

    // Ordered List
    if (line.match(/^\d+\.\s+/)) {
      const items: string[] = []
      while (i < lines.length && lines[i].match(/^\d+\.\s+/)) {
        items.push(lines[i].replace(/^\d+\.\s+/, ''))
        i++
      }
      elements.push(
        <ol key={`ol-${i}`} className="list-decimal list-inside space-y-1 my-2.5 pl-2 text-on-surface">
          {items.map((it, idx) => (
            <li key={idx}>{renderInlineContent(it)}</li>
          ))}
        </ol>
      )
      continue
    }

    // Horizontal Rule
    if (line.trim() === '---' || line.trim() === '***') {
      elements.push(<hr key={`hr-${i}`} className="border-hairline-rule my-4" />)
      i++
      continue
    }

    // Paragraph
    const pLines: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith('```') &&
      !lines[i].match(/^#{1,6}\s+/) &&
      !lines[i].startsWith('>') &&
      !lines[i].match(/^[\*\-]\s+/) &&
      !lines[i].match(/^\d+\.\s+/) &&
      lines[i].trim() !== '---' &&
      !(
        lines[i].trim().startsWith('|') &&
        i + 1 < lines.length &&
        lines[i + 1].trim().startsWith('|') &&
        /^\|?(\s*:?-+:?\s*\|)+(\s*:?-+:?\s*\|?)?$/.test(lines[i + 1].trim())
      )
    ) {
      pLines.push(lines[i])
      i++
    }

    elements.push(
      <p key={`p-${i}`} className="my-2 text-on-surface leading-relaxed">
        {renderInlineContent(pLines.join(' '))}
      </p>
    )
  }

  return <div className="space-y-1">{elements}</div>
}

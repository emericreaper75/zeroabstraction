/**
 * Lexical <-> Markdown bidirectional converter.
 * Converts markdown text to/from Payload CMS Lexical richText AST.
 */

export interface LexicalNode {
  type: string
  tag?: string
  format?: number | string
  indent?: number
  version: number
  direction?: 'ltr' | 'rtl' | null
  text?: string
  mode?: string
  listType?: 'bullet' | 'number'
  value?: number
  fields?: Record<string, any>
  children?: LexicalNode[]
}

export interface LexicalState {
  root: {
    type: 'root'
    format: string
    indent: number
    version: number
    children: LexicalNode[]
    direction?: 'ltr' | 'rtl' | null
  }
}

/**
 * Parses inline markdown formatted text (bold, italic, code, links, math) into Lexical text/link nodes.
 */
function parseInlineMarkdown(text: string): LexicalNode[] {
  if (!text) {
    return [{ type: 'text', text: '', version: 1, format: 0, mode: 'normal' }]
  }

  // Tokenize math first to protect expressions like $D_{ds}$ or $x * y$ from markdown splitting
  const rawSegments: { type: 'text' | 'math'; content: string }[] = []
  const mathRegex = /\$\$([\s\S]+?)\$\$|\$([^\$\n]+?)\$/g
  let lastIdx = 0
  let match: RegExpExecArray | null

  while ((match = mathRegex.exec(text)) !== null) {
    if (match.index > lastIdx) {
      rawSegments.push({ type: 'text', content: text.slice(lastIdx, match.index) })
    }
    rawSegments.push({
      type: 'math',
      content: match[0],
    })
    lastIdx = match.index + match[0].length
  }
  if (lastIdx < text.length) {
    rawSegments.push({ type: 'text', content: text.slice(lastIdx) })
  }

  const nodes: LexicalNode[] = []
  // Matches:
  // 1-3: ***bold italic*** or ___bold italic___
  // 4-6: **bold** or __bold__
  // 7-9: *italic* or _italic_
  // 10-11: `code`
  // 12-13: ~~strikethrough~~
  // 14-16: [link text](url)
  const mdRegex =
    /(\*\*\*(.+?)\*\*\*|___(.+?)___)|(\*\*(.+?)\*\*|__(.+?)__)|((?<!\*)\*(?!\*)([^\*]+?)(?<!\*)\*(?!\*)|(?<!_)(?<![a-zA-Z0-9])_([^_]+?)_(?![a-zA-Z0-9]))|(`(.+?)`)|(~~(.+?)~~)|(\[(.+?)\]\((.+?)\))/g

  for (const seg of rawSegments) {
    if (seg.type === 'math') {
      nodes.push({
        type: 'text',
        text: seg.content,
        version: 1,
        format: 0,
        mode: 'normal',
      })
      continue
    }

    const str = seg.content
    let sIdx = 0
    let m: RegExpExecArray | null

    while ((m = mdRegex.exec(str)) !== null) {
      if (m.index > sIdx) {
        nodes.push({
          type: 'text',
          text: str.slice(sIdx, m.index),
          version: 1,
          format: 0,
          mode: 'normal',
        })
      }

      if (m[1]) {
        // Bold + Italic (format = 1 | 2 = 3)
        nodes.push({
          type: 'text',
          text: m[2] || m[3],
          version: 1,
          format: 3,
          mode: 'normal',
        })
      } else if (m[4]) {
        // Bold (format = 1)
        nodes.push({
          type: 'text',
          text: m[5] || m[6],
          version: 1,
          format: 1,
          mode: 'normal',
        })
      } else if (m[7]) {
        // Italic (format = 2)
        nodes.push({
          type: 'text',
          text: m[8] || m[9],
          version: 1,
          format: 2,
          mode: 'normal',
        })
      } else if (m[10]) {
        // Code (format = 16)
        nodes.push({
          type: 'text',
          text: m[11],
          version: 1,
          format: 16,
          mode: 'normal',
        })
      } else if (m[12]) {
        // Strikethrough (format = 4)
        nodes.push({
          type: 'text',
          text: m[13],
          version: 1,
          format: 4,
          mode: 'normal',
        })
      } else if (m[14]) {
        // Link [text](url)
        nodes.push({
          type: 'link',
          version: 1,
          fields: {
            url: m[16],
            newTab: false,
          },
          children: [
            {
              type: 'text',
              text: m[15],
              version: 1,
              format: 0,
              mode: 'normal',
            },
          ],
        })
      }

      sIdx = m.index + m[0].length
    }

    if (sIdx < str.length) {
      nodes.push({
        type: 'text',
        text: str.slice(sIdx),
        version: 1,
        format: 0,
        mode: 'normal',
      })
    }
  }

  return nodes.length > 0 ? nodes : [{ type: 'text', text, version: 1, format: 0, mode: 'normal' }]
}

function splitTableRow(rowStr: string): string[] {
  let s = rowStr.trim()
  if (s.startsWith('|')) s = s.slice(1)
  if (s.endsWith('|')) s = s.slice(0, -1)
  return s.split('|').map((c) => c.trim())
}

function getTableAlignment(cell: string): 'left' | 'center' | 'right' {
  const c = cell.trim()
  const left = c.startsWith(':')
  const right = c.endsWith(':')
  if (left && right) return 'center'
  if (right) return 'right'
  return 'left'
}

function isTableDelimiterRow(line: string): boolean {
  const trimmed = line.trim()
  return (
    trimmed.startsWith('|') &&
    /^\|?(\s*:?-+:?\s*\|)+(\s*:?-+:?\s*\|?)?$/.test(trimmed)
  )
}

function extractNodeText(node: LexicalNode): string {
  if (node.text != null) return node.text
  if (node.children) return node.children.map(extractNodeText).join('')
  return ''
}

/**
 * Converts markdown string into Payload CMS Lexical JSON AST.
 */
export function markdownToLexical(markdown: string): LexicalState {
  if (!markdown || !markdown.trim()) {
    return {
      root: {
        type: 'root',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        children: [
          {
            type: 'paragraph',
            format: '',
            indent: 0,
            version: 1,
            direction: 'ltr',
            children: [{ type: 'text', text: '', version: 1, format: 0, mode: 'normal' }],
          },
        ],
      },
    }
  }

  const lines = markdown.split(/\r?\n/)
  const children: LexicalNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Code Fence (```lang)
    if (line.trim().startsWith('```')) {
      const lang = line.trim().slice(3).trim()
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      if (i < lines.length && lines[i].trim().startsWith('```')) {
        i++ // Skip closing fence
      }
      children.push({
        type: 'block',
        version: 1,
        fields: {
          blockType: 'Code',
          language: lang || 'text',
          code: codeLines.join('\n'),
        },
      })
      continue
    }

    // Table block (header line starting with '|' followed by delimiter line)
    if (
      line.trim().startsWith('|') &&
      i + 1 < lines.length &&
      isTableDelimiterRow(lines[i + 1])
    ) {
      const headerRowStr = line
      const delimiterRowStr = lines[i + 1]
      i += 2 // Skip header & delimiter lines

      const headers = splitTableRow(headerRowStr)
      const aligns = splitTableRow(delimiterRowStr).map(getTableAlignment)

      const dataRows: string[][] = []
      while (i < lines.length && lines[i].trim().startsWith('|')) {
        dataRows.push(splitTableRow(lines[i]))
        i++
      }

      const tableRows: LexicalNode[] = []

      // 1. Header row
      tableRows.push({
        type: 'tablerow',
        version: 1,
        children: headers.map((h, colIdx) => ({
          type: 'tablecell',
          version: 1,
          headerState: 1,
          header: true,
          align: aligns[colIdx] || 'left',
          format: aligns[colIdx] || 'left',
          children: [
            {
              type: 'paragraph',
              format: '',
              indent: 0,
              version: 1,
              direction: 'ltr',
              children: parseInlineMarkdown(h),
            },
          ],
        })),
      })

      // 2. Data rows
      for (const row of dataRows) {
        tableRows.push({
          type: 'tablerow',
          version: 1,
          children: row.map((cell, colIdx) => ({
            type: 'tablecell',
            version: 1,
            headerState: 0,
            header: false,
            align: aligns[colIdx] || 'left',
            format: aligns[colIdx] || 'left',
            children: [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1,
                direction: 'ltr',
                children: parseInlineMarkdown(cell),
              },
            ],
          })),
        })
      }

      children.push({
        type: 'table',
        version: 1,
        children: tableRows,
      })
      continue
    }

    // Skip empty lines between blocks
    if (!line.trim()) {
      i++
      continue
    }

    // Headings (#, ##, ###, ####, #####, ######)
    const headingMatch = line.match(/^(#{1,6})\s+(.*)$/)
    if (headingMatch) {
      const level = headingMatch[1].length
      children.push({
        type: 'heading',
        tag: `h${level}`,
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        children: parseInlineMarkdown(headingMatch[2]),
      })
      i++
      continue
    }

    // Blockquote (> ...)
    if (line.startsWith('>')) {
      const quoteLines: string[] = []
      while (i < lines.length && lines[i].startsWith('>')) {
        quoteLines.push(lines[i].replace(/^>\s?/, ''))
        i++
      }
      children.push({
        type: 'quote',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        children: parseInlineMarkdown(quoteLines.join('\n')),
      })
      continue
    }

    // Unordered List (- or *)
    if (line.match(/^[\*\-]\s+/)) {
      const listItems: LexicalNode[] = []
      while (i < lines.length && lines[i].match(/^[\*\-]\s+/)) {
        const itemText = lines[i].replace(/^[\*\-]\s+/, '')
        listItems.push({
          type: 'listitem',
          version: 1,
          value: listItems.length + 1,
          children: parseInlineMarkdown(itemText),
        })
        i++
      }
      children.push({
        type: 'list',
        listType: 'bullet',
        tag: 'ul',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        children: listItems,
      })
      continue
    }

    // Ordered List (1. ...)
    if (line.match(/^\d+\.\s+/)) {
      const listItems: LexicalNode[] = []
      while (i < lines.length && lines[i].match(/^\d+\.\s+/)) {
        const itemText = lines[i].replace(/^\d+\.\s+/, '')
        listItems.push({
          type: 'listitem',
          version: 1,
          value: listItems.length + 1,
          children: parseInlineMarkdown(itemText),
        })
        i++
      }
      children.push({
        type: 'list',
        listType: 'number',
        tag: 'ol',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        children: listItems,
      })
      continue
    }

    // Math block ($$...$$ on own line)
    if (line.trim().startsWith('$$')) {
      const mathLines: string[] = [line]
      if (!line.trim().endsWith('$$') || line.trim() === '$$') {
        i++
        while (i < lines.length && !lines[i].trim().endsWith('$$')) {
          mathLines.push(lines[i])
          i++
        }
        if (i < lines.length) {
          mathLines.push(lines[i])
          i++
        }
      } else {
        i++
      }
      children.push({
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        children: [
          {
            type: 'text',
            text: mathLines.join('\n'),
            version: 1,
            format: 0,
            mode: 'normal',
          },
        ],
      })
      continue
    }

    // Standard Paragraph: collect contiguous non-blank lines
    const pLines: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith('```') &&
      !lines[i].match(/^#{1,6}\s+/) &&
      !lines[i].startsWith('>') &&
      !lines[i].match(/^[\*\-]\s+/) &&
      !lines[i].match(/^\d+\.\s+/) &&
      !lines[i].trim().startsWith('$$') &&
      !(lines[i].trim().startsWith('|') && i + 1 < lines.length && isTableDelimiterRow(lines[i + 1]))
    ) {
      pLines.push(lines[i])
      i++
    }

    children.push({
      type: 'paragraph',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: parseInlineMarkdown(pLines.join(' ')),
    })
  }

  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children:
        children.length > 0
          ? children
          : [
              {
                type: 'paragraph',
                format: '',
                indent: 0,
                version: 1,
                direction: 'ltr',
                children: [{ type: 'text', text: '', version: 1, format: 0, mode: 'normal' }],
              },
            ],
    },
  }
}

/**
 * Serializes inline Lexical children into markdown text.
 */
function serializeInlineNodes(nodes?: LexicalNode[]): string {
  if (!nodes || nodes.length === 0) return ''

  return nodes
    .map((node) => {
      if (node.type === 'link') {
        const url = node.fields?.url || ''
        const linkText = serializeInlineNodes(node.children)
        return `[${linkText}](${url})`
      }

      if (node.type === 'text') {
        let text = node.text || ''
        const format = typeof node.format === 'number' ? node.format : 0

        // If it's already a math token ($...$), preserve it
        if (text.startsWith('$') && text.endsWith('$')) {
          return text
        }

        // 16 = inline code
        if (format & 16) {
          text = `\`${text}\``
        }
        // 1 = bold, 2 = italic, 3 = bold+italic
        if ((format & 3) === 3) {
          text = `***${text}***`
        } else if (format & 1) {
          text = `**${text}**`
        } else if (format & 2) {
          text = `*${text}*`
        }
        // 4 = strikethrough
        if (format & 4) {
          text = `~~${text}~~`
        }
        return text
      }

      if (node.children) {
        return serializeInlineNodes(node.children)
      }

      return ''
    })
    .join('')
}

/**
 * Converts a Payload CMS Lexical AST object back to clean Markdown string.
 */
export function lexicalToMarkdown(lexical: any): string {
  if (!lexical) return ''
  if (typeof lexical === 'string') return lexical

  const root = lexical.root || lexical
  if (!root || !Array.isArray(root.children)) {
    return ''
  }

  const chunks: string[] = []

  for (const node of root.children as LexicalNode[]) {
    switch (node.type) {
      case 'heading': {
        const levelStr = node.tag?.replace('h', '') || '1'
        const level = Math.min(6, Math.max(1, parseInt(levelStr, 10) || 1))
        const prefix = '#'.repeat(level)
        chunks.push(`${prefix} ${serializeInlineNodes(node.children)}`)
        break
      }
      case 'paragraph': {
        const text = serializeInlineNodes(node.children)
        chunks.push(text)
        break
      }
      case 'quote': {
        const text = serializeInlineNodes(node.children)
        chunks.push(`> ${text}`)
        break
      }
      case 'list': {
        const isOrdered = node.listType === 'number'
        const listItems = (node.children || [])
          .map((item, idx) => {
            const itemText = serializeInlineNodes(item.children)
            return isOrdered ? `${idx + 1}. ${itemText}` : `- ${itemText}`
          })
          .join('\n')
        chunks.push(listItems)
        break
      }
      case 'block': {
        if (node.fields?.blockType === 'Code' || node.fields?.code != null) {
          const lang = node.fields?.language || ''
          const code = node.fields?.code || ''
          chunks.push(`\`\`\`${lang}\n${code}\n\`\`\``)
        }
        break
      }
      case 'code': {
        const lang = (node as any).language || ''
        const code = extractNodeText(node)
        chunks.push(`\`\`\`${lang}\n${code}\n\`\`\``)
        break
      }
      case 'table': {
        const rows = (node.children || []).filter((r: any) => r.type === 'tablerow')
        if (rows.length === 0) break

        const tableLines: string[] = []
        const aligns: ('left' | 'center' | 'right')[] = []

        const parsedRows: string[][] = rows.map((row: any, rowIdx: number) => {
          const cells = (row.children || []).filter((c: any) => c.type === 'tablecell')
          return cells.map((cell: any, colIdx: number) => {
            if (rowIdx === 0) {
              const align = cell.align || cell.format || 'left'
              aligns[colIdx] = align === 'center' ? 'center' : align === 'right' ? 'right' : 'left'
            }
            const cellChildren = cell.children?.flatMap((ch: any) => ch.children || ch) || []
            return serializeInlineNodes(cellChildren).replace(/\|/g, '\\|').trim()
          })
        })

        if (parsedRows.length > 0) {
          const headerRow = parsedRows[0]
          tableLines.push(`| ${headerRow.join(' | ')} |`)

          const delimiterRow = headerRow.map((_, colIdx) => {
            const align = aligns[colIdx] || 'left'
            if (align === 'center') return ':---:'
            if (align === 'right') return '---:'
            return ':---'
          })
          tableLines.push(`| ${delimiterRow.join(' | ')} |`)

          for (let r = 1; r < parsedRows.length; r++) {
            tableLines.push(`| ${parsedRows[r].join(' | ')} |`)
          }

          chunks.push(tableLines.join('\n'))
        }
        break
      }
      default: {
        if (node.children) {
          chunks.push(serializeInlineNodes(node.children))
        } else if (node.text) {
          chunks.push(node.text)
        }
      }
    }
  }

  return chunks.join('\n\n')
}

import { useEditor, EditorContent, useEditorState } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { TextAlign } from '@tiptap/extension-text-align'
import { Highlight } from '@tiptap/extension-highlight'
import { TextStyle, FontFamily, FontSize } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import { CharacterCount } from '@tiptap/extension-character-count'
import { Placeholder } from '@tiptap/extension-placeholder'
import { Image } from '@tiptap/extension-image'
import { Link } from '@tiptap/extension-link'
import { useEffect, useRef, useState, useCallback } from 'react'
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  Code, Code2, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, AlignLeft, AlignCenter,
  AlignRight, AlignJustify, Undo, Redo, Minus,
  Palette, Highlighter, ChevronDown, Eye, PenLine,
  Type, FileText, ImagePlus, Link2, Link2Off, Unlink,
  Upload, X, Check,
} from 'lucide-react'

/* ── Constants ────────────────────────────────────────────── */
const FONTS = [
  { label: 'Mặc định', value: '' },
  { label: 'Times New Roman', value: 'Times New Roman, serif' },
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Calibri', value: 'Calibri, sans-serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Verdana', value: 'Verdana, sans-serif' },
  { label: 'Courier New', value: 'Courier New, monospace' },
  { label: 'Tahoma', value: 'Tahoma, sans-serif' },
  { label: 'Trebuchet MS', value: 'Trebuchet MS, sans-serif' },
]

const SIZES = [8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 28, 32, 36, 48, 72]

const TEXT_COLORS = [
  '#000000','#1e293b','#dc2626','#ea580c','#ca8a04',
  '#16a34a','#0891b2','#1d4ed8','#7c3aed','#be185d',
  '#ffffff','#94a3b8','#fca5a5','#fdba74','#fde047',
  '#86efac','#67e8f9','#93c5fd','#c4b5fd','#f9a8d4',
]
const HIGHLIGHT_COLORS = [
  '#fef08a','#bbf7d0','#bfdbfe','#e9d5ff','#fecaca',
  '#fed7aa','#fce7f3','#cffafe','#d1fae5','#f3f4f6',
]

/* ── Image Insert Modal ───────────────────────────────────── */
function ImageModal({ editor, onClose }) {
  const [tab, setTab] = useState('url') // 'url' | 'upload'
  const [url, setUrl] = useState('')
  const [alt, setAlt] = useState('')
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef(null)

  const insertFromUrl = () => {
    if (!url.trim()) return
    editor.chain().focus().setImage({ src: url.trim(), alt }).run()
    onClose()
  }

  const insertFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      editor.chain().focus().setImage({ src: e.target.result, alt: file.name }).run()
      onClose()
    }
    reader.readAsDataURL(file)
  }

  const onDrop = (e) => {
    e.preventDefault(); setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) insertFile(file)
  }

  return (
    <div className="rte-modal-overlay" onClick={onClose}>
      <div className="rte-modal" onClick={e => e.stopPropagation()}>
        <div className="rte-modal-header">
          <ImagePlus size={16} />
          <span>Chèn hình ảnh</span>
          <button type="button" className="rte-modal-close" onClick={onClose}><X size={14} /></button>
        </div>
        <div className="rte-modal-tabs">
          <button type="button" className={`rte-mtab${tab === 'url' ? ' rte-mtab--on' : ''}`} onClick={() => setTab('url')}>🔗 Từ URL</button>
          <button type="button" className={`rte-mtab${tab === 'upload' ? ' rte-mtab--on' : ''}`} onClick={() => setTab('upload')}>⬆️ Tải lên</button>
        </div>
        {tab === 'url' ? (
          <div className="rte-modal-body">
            <label className="rte-mlabel">Đường dẫn ảnh (URL)</label>
            <input autoFocus className="rte-minput" placeholder="https://example.com/image.jpg"
              value={url} onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && insertFromUrl()} />
            <label className="rte-mlabel" style={{ marginTop: 10 }}>Mô tả ảnh (Alt text)</label>
            <input className="rte-minput" placeholder="Mô tả ảnh..."
              value={alt} onChange={e => setAlt(e.target.value)} />
            {url && (
              <div className="rte-mpreview">
                <img src={url} alt={alt} onError={e => e.target.style.display = 'none'} />
              </div>
            )}
          </div>
        ) : (
          <div className="rte-modal-body">
            <div className={`rte-dropzone${dragging ? ' rte-dropzone--drag' : ''}`}
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              onClick={() => fileRef.current?.click()}>
              <Upload size={28} />
              <p>Kéo thả hoặc <strong>click</strong> để chọn ảnh</p>
              <p className="rte-dropzone-hint">PNG, JPG, GIF, WebP</p>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
                onChange={e => insertFile(e.target.files[0])} />
            </div>
          </div>
        )}
        <div className="rte-modal-footer">
          <button type="button" className="rte-mbtn rte-mbtn--cancel" onClick={onClose}>Hủy</button>
          {tab === 'url' && (
            <button type="button" className="rte-mbtn rte-mbtn--ok" onClick={insertFromUrl}>
              <Check size={13} /> Chèn ảnh
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── Link Modal ───────────────────────────────────────────── */
function LinkModal({ editor, onClose }) {
  const [href, setHref] = useState(editor.getAttributes('link').href || '')
  const [newTab, setNewTab] = useState(true)

  const apply = () => {
    if (!href.trim()) {
      editor.chain().focus().unsetLink().run()
    } else {
      editor.chain().focus().setLink({ href: href.trim(), target: newTab ? '_blank' : '_self' }).run()
    }
    onClose()
  }

  return (
    <div className="rte-modal-overlay" onClick={onClose}>
      <div className="rte-modal" onClick={e => e.stopPropagation()}>
        <div className="rte-modal-header">
          <Link2 size={16} />
          <span>Chèn liên kết</span>
          <button type="button" className="rte-modal-close" onClick={onClose}><X size={14} /></button>
        </div>
        <div className="rte-modal-body">
          <label className="rte-mlabel">Địa chỉ URL</label>
          <input autoFocus className="rte-minput" placeholder="https://example.com"
            value={href} onChange={e => setHref(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && apply()} />
          <label className="rte-mcheck">
            <input type="checkbox" checked={newTab} onChange={e => setNewTab(e.target.checked)} />
            <span>Mở trong tab mới</span>
          </label>
        </div>
        <div className="rte-modal-footer">
          <button type="button" className="rte-mbtn rte-mbtn--cancel" onClick={onClose}>Hủy</button>
          <button type="button" className="rte-mbtn rte-mbtn--ok" onClick={apply}>
            <Check size={13} /> Áp dụng
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Color picker dropdown ────────────────────────────────── */
function ColorPicker({ editor, mode }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const colors = mode === 'text' ? TEXT_COLORS : HIGHLIGHT_COLORS

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const apply = c => {
    if (mode === 'text') editor.chain().focus().setColor(c).run()
    else editor.chain().focus().setHighlight({ color: c }).run()
    setOpen(false)
  }

  return (
    <div style={{ position: 'relative' }} ref={ref}>
      <button type="button" className="rte-btn" title={mode === 'text' ? 'Màu chữ' : 'Tô màu'}
        onClick={() => setOpen(!open)}>
        {mode === 'text' ? <Palette size={14} /> : <Highlighter size={14} />}
        <ChevronDown size={8} style={{ opacity: .5 }} />
      </button>
      {open && (
        <div className="rte-color-panel">
          <div className="rte-color-title">{mode === 'text' ? 'Màu chữ' : 'Tô nền'}</div>
          <div className="rte-color-grid">
            {colors.map(c => (
              <button key={c} type="button" className="rte-color-swatch"
                style={{ background: c, border: c === '#ffffff' ? '1px solid #e2e8f0' : 'none' }}
                onClick={() => apply(c)} />
            ))}
          </div>
          <button type="button" className="rte-color-clear"
            onClick={() => {
              if (mode === 'text') editor.chain().focus().unsetColor().run()
              else editor.chain().focus().unsetHighlight().run()
              setOpen(false)
            }}>✕ Xoá màu</button>
        </div>
      )}
    </div>
  )
}

/* ── Toolbar Button ───────────────────────────────────────── */
function Btn({ onClick, active, disabled, title, children }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} title={title}
      className={`rte-btn${active ? ' rte-btn--on' : ''}`}>
      {children}
    </button>
  )
}

/* ── Toolbar Group ────────────────────────────────────────── */
function Group({ label, children }) {
  return (
    <div className="rte-group">
      <div className="rte-group-body">{children}</div>
      <div className="rte-group-label">{label}</div>
    </div>
  )
}

/* ── Floating Bubble on text select ──────────────────────── */
function FloatingBubble({ editor }) {
  const [state, setState] = useState({ visible: false, top: 0, left: 0 })
  const menuRef = useRef(null)

  const update = useCallback(() => {
    if (!editor || editor.state.selection.empty) {
      setState(s => ({ ...s, visible: false })); return
    }
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) { setState(s => ({ ...s, visible: false })); return }
    const rect = sel.getRangeAt(0).getBoundingClientRect()
    const wrap = document.querySelector('.rte-wrap')
    if (!wrap || rect.width === 0) { setState(s => ({ ...s, visible: false })); return }
    const wRect = wrap.getBoundingClientRect()
    const menuW = menuRef.current?.offsetWidth || 280
    let left = rect.left - wRect.left + rect.width / 2 - menuW / 2
    left = Math.max(4, Math.min(left, wRect.width - menuW - 4))
    setState({ visible: true, top: rect.top - wRect.top - 46, left })
  }, [editor])

  useEffect(() => {
    if (!editor) return
    editor.on('selectionUpdate', update)
    editor.on('blur', () => setState(s => ({ ...s, visible: false })))
    return () => { editor.off('selectionUpdate', update) }
  }, [editor, update])

  useEffect(() => {
    const h = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setState(s => ({ ...s, visible: false }))
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  if (!state.visible || !editor) return null

  const Fb = ({ onClick, active, title, children }) => (
    <button type="button" title={title}
      className={`rte-fb${active ? ' rte-fb--on' : ''}`}
      onMouseDown={e => { e.preventDefault(); onClick() }}>
      {children}
    </button>
  )

  return (
    <div ref={menuRef} className="rte-bubble" style={{ top: state.top, left: state.left }}>
      <Fb onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Đậm"><Bold size={12}/></Fb>
      <Fb onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Nghiêng"><Italic size={12}/></Fb>
      <Fb onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Gạch chân"><UnderlineIcon size={12}/></Fb>
      <Fb onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Gạch ngang"><Strikethrough size={12}/></Fb>
      <div className="rte-fb-sep"/>
      <Fb onClick={() => editor.chain().focus().toggleHeading({level:1}).run()} active={editor.isActive('heading',{level:1})} title="H1"><Heading1 size={12}/></Fb>
      <Fb onClick={() => editor.chain().focus().toggleHeading({level:2}).run()} active={editor.isActive('heading',{level:2})} title="H2"><Heading2 size={12}/></Fb>
      <div className="rte-fb-sep"/>
      <Fb onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Trích dẫn"><Quote size={12}/></Fb>
      <Fb onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive('highlight')} title="Tô sáng"><Highlighter size={12}/></Fb>
    </div>
  )
}

/* ── Main RichTextEditor ──────────────────────────────────── */
export default function RichTextEditor({
  value = '',
  onChange,
  placeholder = 'Bắt đầu nhập nội dung...',
  minHeight = 380,
}) {
  const [preview, setPreview] = useState(false)
  const [fontFamily, setFontFamily] = useState('')
  const [fontSize, setFontSize] = useState('14')
  const [showImageModal, setShowImageModal] = useState(false)
  const [showLinkModal, setShowLinkModal] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight.configure({ multicolor: true }),
      TextStyle,
      FontFamily,
      FontSize,
      Color,
      CharacterCount,
      Placeholder.configure({ placeholder }),
      Image.configure({ inline: false, allowBase64: true }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer' } }),
    ],
    content: value,
    editorProps: {
      attributes: { class: 'rte-body', style: `min-height:${minHeight}px` },
      handlePaste(view, event) {
        const items = event.clipboardData?.items
        if (!items) return false
        for (const item of items) {
          if (item.type.startsWith('image/')) {
            event.preventDefault()
            const file = item.getAsFile()
            const reader = new FileReader()
            reader.onload = e => {
              view.dispatch(view.state.tr.replaceSelectionWith(
                view.state.schema.nodes.image.create({ src: e.target.result })
              ))
            }
            reader.readAsDataURL(file)
            return true
          }
        }
        return false
      },
      handleDrop(view, event) {
        const file = event.dataTransfer?.files[0]
        if (file && file.type.startsWith('image/')) {
          event.preventDefault()
          const reader = new FileReader()
          reader.onload = e => {
            const { schema } = view.state
            const coords = view.posAtCoords({ left: event.clientX, top: event.clientY })
            const node = schema.nodes.image.create({ src: e.target.result })
            const transaction = view.state.tr.insert(coords?.pos ?? 0, node)
            view.dispatch(transaction)
          }
          reader.readAsDataURL(file)
          return true
        }
        return false
      },
    },
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', false)
    }
  }, [value, editor])

  const edState = useEditorState({
    editor,
    selector: ctx => ({
      words: ctx.editor?.storage?.characterCount?.words?.() ?? 0,
      chars: ctx.editor?.storage?.characterCount?.characters?.() ?? 0,
      canUndo: ctx.editor?.can().undo() ?? false,
      canRedo: ctx.editor?.can().redo() ?? false,
    }),
  })

  const applyFont = (f) => {
    setFontFamily(f)
    if (f) editor.chain().focus().setFontFamily(f).run()
    else editor.chain().focus().unsetFontFamily().run()
  }

  const applySize = (s) => {
    setFontSize(s)
    editor.chain().focus().setFontSize(s + 'px').run()
  }

  if (!editor) return null

  const words = edState?.words ?? 0
  const chars = edState?.chars ?? 0
  const pages = Math.max(1, Math.ceil(words / 250))
  const readTime = Math.max(1, Math.ceil(words / 200))

  return (
    <>
      <style>{CSS}</style>
      <div className="rte-wrap">

        {/* Modals */}
        {showImageModal && <ImageModal editor={editor} onClose={() => setShowImageModal(false)} />}
        {showLinkModal && <LinkModal editor={editor} onClose={() => setShowLinkModal(false)} />}

        {/* Floating bubble */}
        {!preview && <FloatingBubble editor={editor} />}

        {/* ══ RIBBON ══ */}
        {!preview && (
          <div className="rte-ribbon">

            {/* Undo / Redo */}
            <Group label="Lịch sử">
              <Btn onClick={() => editor.chain().focus().undo().run()} disabled={!edState?.canUndo} title="Hoàn tác (Ctrl+Z)">
                <Undo size={15}/><span>Hoàn tác</span>
              </Btn>
              <Btn onClick={() => editor.chain().focus().redo().run()} disabled={!edState?.canRedo} title="Làm lại (Ctrl+Y)">
                <Redo size={15}/><span>Làm lại</span>
              </Btn>
            </Group>

            <div className="rte-sep"/>

            {/* Font */}
            <Group label="Phông chữ">
              <select className="rte-select rte-select--font" value={fontFamily} onChange={e => applyFont(e.target.value)}>
                {FONTS.map(f => <option key={f.label} value={f.value} style={{ fontFamily: f.value || 'inherit' }}>{f.label}</option>)}
              </select>
              <select className="rte-select rte-select--size" value={fontSize} onChange={e => applySize(e.target.value)}>
                {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <div className="rte-vline"/>
              <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Đậm (Ctrl+B)">
                <Bold size={14} style={{ strokeWidth: 2.8 }}/>
              </Btn>
              <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Nghiêng (Ctrl+I)">
                <Italic size={14}/>
              </Btn>
              <Btn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Gạch chân (Ctrl+U)">
                <UnderlineIcon size={14}/>
              </Btn>
              <Btn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Gạch ngang">
                <Strikethrough size={14}/>
              </Btn>
              <div className="rte-vline"/>
              <ColorPicker editor={editor} mode="text"/>
              <ColorPicker editor={editor} mode="highlight"/>
            </Group>

            <div className="rte-sep"/>

            {/* Paragraph */}
            <Group label="Đoạn văn">
              <div className="rte-row">
                <Btn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({textAlign:'left'})} title="Trái"><AlignLeft size={14}/></Btn>
                <Btn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({textAlign:'center'})} title="Giữa"><AlignCenter size={14}/></Btn>
                <Btn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({textAlign:'right'})} title="Phải"><AlignRight size={14}/></Btn>
                <Btn onClick={() => editor.chain().focus().setTextAlign('justify').run()} active={editor.isActive({textAlign:'justify'})} title="Đều"><AlignJustify size={14}/></Btn>
              </div>
              <div className="rte-row">
                <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Dấu chấm">
                  <List size={14}/><span>Chấm</span>
                </Btn>
                <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Đánh số">
                  <ListOrdered size={14}/><span>Số</span>
                </Btn>
              </div>
            </Group>

            <div className="rte-sep"/>

            {/* Styles */}
            <Group label="Kiểu">
              <div className="rte-style-grid">
                <button type="button" className={`rte-style${editor.isActive('paragraph') ? ' rte-style--on' : ''}`} onClick={() => editor.chain().focus().setParagraph().run()}>¶ Đoạn</button>
                <button type="button" className={`rte-style rte-style--h1${editor.isActive('heading',{level:1}) ? ' rte-style--on' : ''}`} onClick={() => editor.chain().focus().toggleHeading({level:1}).run()}>H1</button>
                <button type="button" className={`rte-style rte-style--h2${editor.isActive('heading',{level:2}) ? ' rte-style--on' : ''}`} onClick={() => editor.chain().focus().toggleHeading({level:2}).run()}>H2</button>
                <button type="button" className={`rte-style rte-style--h3${editor.isActive('heading',{level:3}) ? ' rte-style--on' : ''}`} onClick={() => editor.chain().focus().toggleHeading({level:3}).run()}>H3</button>
                <button type="button" className={`rte-style rte-style--quote${editor.isActive('blockquote') ? ' rte-style--on' : ''}`} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote size={10}/> Trích dẫn</button>
                <button type="button" className={`rte-style rte-style--code${editor.isActive('codeBlock') ? ' rte-style--on' : ''}`} onClick={() => editor.chain().focus().toggleCodeBlock().run()}><Code2 size={10}/> Code</button>
              </div>
            </Group>

            <div className="rte-sep"/>

            {/* Insert */}
            <Group label="Chèn vào">
              <Btn onClick={() => setShowImageModal(true)} title="Chèn ảnh">
                <ImagePlus size={15}/><span>Ảnh</span>
              </Btn>
              <Btn onClick={() => setShowLinkModal(true)} active={editor.isActive('link')} title="Chèn liên kết">
                <Link2 size={15}/><span>Link</span>
              </Btn>
              {editor.isActive('link') && (
                <Btn onClick={() => editor.chain().focus().unsetLink().run()} title="Xóa liên kết">
                  <Unlink size={15}/>
                </Btn>
              )}
              <Btn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline code">
                <Code size={15}/><span>Code</span>
              </Btn>
              <Btn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Kẻ ngang">
                <Minus size={15}/><span>Kẻ ngang</span>
              </Btn>
            </Group>

            {/* Spacer + Preview */}
            <div style={{ flex: 1 }}/>
            <div style={{ display:'flex', alignItems:'center', padding:'0 8px' }}>
              <button type="button" className={`rte-preview-btn${preview ? ' rte-preview-btn--on' : ''}`}
                onClick={() => setPreview(v => !v)}>
                {preview ? <><PenLine size={13}/> Chỉnh sửa</> : <><Eye size={13}/> Xem trước</>}
              </button>
            </div>
          </div>
        )}

        {/* ══ CANVAS ══ */}
        <div className="rte-canvas">
          {preview ? (
            <div className="rte-page">
              <div className="rte-preview-bar">
                <Eye size={12}/> Chế độ xem trước
                <button type="button" className="rte-preview-back" onClick={() => setPreview(false)}>
                  <PenLine size={11}/> Chỉnh sửa
                </button>
              </div>
              <div className="rte-body" style={{ minHeight: minHeight }}
                dangerouslySetInnerHTML={{ __html: editor.getHTML() || '<p style="color:#999;font-style:italic">Chưa có nội dung...</p>' }} />
            </div>
          ) : (
            <div className="rte-page">
              <EditorContent editor={editor} />
            </div>
          )}
        </div>

        {/* ══ STATUS BAR ══ */}
        <div className="rte-statusbar">
          <div className="rte-status-left">
            <span className="rte-status-item"><FileText size={10}/> Trang {pages}</span>
            <span className="rte-status-sep">|</span>
            <span className="rte-status-item"><Type size={10}/> {words} từ</span>
            <span className="rte-status-sep">|</span>
            <span className="rte-status-item">{chars} ký tự</span>
            <span className="rte-status-sep">|</span>
            <span className="rte-status-item">~{readTime} phút đọc</span>
          </div>
          <div className="rte-status-right">
            <span className="rte-status-brand">✦ Nam Việt Editor</span>
          </div>
        </div>
      </div>
    </>
  )
}

/* ═══════════════════════════════════════════════════════════
   CSS
   ═══════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

/* ── Wrapper ─────────────────────────────────────────────── */
.rte-wrap {
  border: 1.5px solid #d1d5db;
  border-radius: 10px;
  background: #f1f3f4;
  position: relative;
  box-shadow: 0 4px 24px rgba(0,0,0,.08), 0 1px 4px rgba(0,0,0,.06);
  font-family: 'Inter', sans-serif;
  overflow: visible;
}
.dark .rte-wrap { background: #1e1e2e; border-color: #333; box-shadow: 0 4px 24px rgba(0,0,0,.4); }

/* ── Ribbon ──────────────────────────────────────────────── */
.rte-ribbon {
  display: flex;
  align-items: stretch;
  flex-wrap: nowrap;
  overflow-x: auto;
  background: linear-gradient(180deg, #ffffff 0%, #f3f4f6 100%);
  border-bottom: 1.5px solid #e5e7eb;
  padding: 4px 6px 0;
  min-height: 76px;
  gap: 2px;
  border-radius: 10px 10px 0 0;
  scrollbar-width: thin;
  scrollbar-color: #d1d5db transparent;
}
.dark .rte-ribbon { background: linear-gradient(180deg, #2a2a3e 0%, #22223a 100%); border-bottom-color: #3a3a50; }
.rte-ribbon::-webkit-scrollbar { height: 3px; }
.rte-ribbon::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 2px; }

/* ── Group ───────────────────────────────────────────────── */
.rte-group { display:flex; flex-direction:column; align-items:center; padding: 2px 6px; min-width:fit-content; }
.rte-group-body { display:flex; align-items:center; gap:2px; flex:1; flex-wrap:wrap; justify-content:center; padding-bottom:4px; }
.rte-group-label { font-size:9px; color:#6b7280; text-align:center; padding: 2px 4px; border-top: 1px solid #e5e7eb; width:100%; margin-top:auto; white-space:nowrap; font-weight:500; letter-spacing:.04em; text-transform:uppercase; }
.dark .rte-group-label { color:#6b7280; border-top-color:#3a3a50; }

.rte-sep { width:1px; background:linear-gradient(180deg,transparent,#d1d5db,transparent); margin:6px 3px; flex-shrink:0; }
.dark .rte-sep { background:linear-gradient(180deg,transparent,#3a3a50,transparent); }
.rte-vline { width:1px; height:22px; background:#e5e7eb; margin:0 3px; flex-shrink:0; }
.dark .rte-vline { background:#3a3a50; }
.rte-row { display:flex; gap:1px; }

/* ── Toolbar buttons ─────────────────────────────────────── */
.rte-btn {
  display:inline-flex; align-items:center; justify-content:center; gap:3px;
  min-width:28px; height:28px; padding:0 6px;
  border: 1px solid transparent; border-radius:5px;
  background:transparent; color:#374151; font-size:11px;
  cursor:pointer; transition:all .12s ease;
  white-space:nowrap; flex-shrink:0; font-family:inherit;
}
.rte-btn:hover { background:#dbeafe; border-color:#93c5fd; color:#1d4ed8; transform:translateY(-1px); box-shadow:0 2px 8px rgba(59,130,246,.15); }
.dark .rte-btn { color:#9ca3af; }
.dark .rte-btn:hover { background:#1e3a5f; border-color:#3b82f6; color:#93c5fd; }
.rte-btn--on { background:#bfdbfe !important; border-color:#3b82f6 !important; color:#1d4ed8 !important; box-shadow:0 1px 4px rgba(59,130,246,.25) !important; }
.dark .rte-btn--on { background:#1e3a5f !important; border-color:#3b82f6 !important; color:#93c5fd !important; }
.rte-btn:disabled { opacity:.3; cursor:not-allowed; transform:none; box-shadow:none; }
.rte-btn span { font-size:10.5px; }

/* ── Selects ─────────────────────────────────────────────── */
.rte-select {
  height:26px; border:1.5px solid #e5e7eb; border-radius:5px;
  background:#fff; font-size:11.5px; color:#374151;
  padding:0 6px; cursor:pointer; outline:none;
  transition:border-color .12s, box-shadow .12s; font-family:inherit;
}
.rte-select:hover, .rte-select:focus { border-color:#3b82f6; box-shadow:0 0 0 2px rgba(59,130,246,.12); }
.dark .rte-select { background:#2a2a3e; border-color:#3a3a50; color:#ccc; }
.rte-select--font { width:118px; }
.rte-select--size { width:50px; }

/* ── Style presets ───────────────────────────────────────── */
.rte-style-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:2px; }
.rte-style {
  display:flex; align-items:center; gap:3px;
  padding:3px 6px; border:1px solid #e5e7eb; border-radius:4px;
  background:#fff; cursor:pointer; font-size:10.5px; color:#374151;
  transition:all .12s; white-space:nowrap; font-family:inherit;
}
.rte-style:hover { background:#eff6ff; border-color:#3b82f6; color:#1d4ed8; }
.rte-style--on { background:#dbeafe !important; border-color:#3b82f6 !important; color:#1d4ed8 !important; }
.dark .rte-style { background:#2a2a3e; border-color:#3a3a50; color:#9ca3af; }
.dark .rte-style:hover { background:#1e3a5f; border-color:#3b82f6; }
.rte-style--h1 { font-weight:800; color:#1e3a8a; font-size:12px; }
.rte-style--h2 { font-weight:700; color:#1e40af; font-size:11px; }
.rte-style--h3 { font-weight:600; color:#4f46e5; }
.rte-style--quote { font-style:italic; color:#6b7280; }
.rte-style--code { font-family:monospace; color:#7c3aed; }

/* ── Color picker ────────────────────────────────────────── */
.rte-color-panel {
  position:absolute; top:calc(100% + 6px); left:0; z-index:9999;
  background:#fff; border:1.5px solid #e5e7eb; border-radius:10px;
  padding:12px; box-shadow:0 8px 32px rgba(0,0,0,.16), 0 2px 8px rgba(0,0,0,.08);
  min-width:160px; animation:rteDropIn .14s ease;
}
.dark .rte-color-panel { background:#2a2a3e; border-color:#3a3a50; }
.rte-color-title { font-size:10px; font-weight:600; color:#6b7280; margin-bottom:8px; text-transform:uppercase; letter-spacing:.05em; }
.rte-color-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:5px; }
.rte-color-swatch { width:22px; height:22px; border-radius:4px; cursor:pointer; transition:transform .1s,box-shadow .1s; }
.rte-color-swatch:hover { transform:scale(1.3); box-shadow:0 3px 10px rgba(0,0,0,.3); }
.rte-color-clear { margin-top:10px; width:100%; padding:5px; border:1.5px dashed #e5e7eb; border-radius:5px; background:transparent; cursor:pointer; font-size:11px; color:#6b7280; font-family:inherit; transition:all .12s; }
.rte-color-clear:hover { background:#fee2e2; border-color:#f87171; color:#dc2626; }

/* ── Preview button ──────────────────────────────────────── */
.rte-preview-btn {
  display:inline-flex; align-items:center; gap:5px; padding:5px 14px;
  border-radius:6px; border:1.5px solid #3b82f6; background:#fff; color:#3b82f6;
  font-size:11.5px; font-weight:600; cursor:pointer; transition:all .14s; font-family:inherit;
}
.rte-preview-btn:hover, .rte-preview-btn--on {
  background:linear-gradient(135deg,#3b82f6,#6366f1); color:#fff; border-color:transparent;
  box-shadow:0 4px 12px rgba(99,102,241,.4); transform:translateY(-1px);
}

/* ── Canvas ──────────────────────────────────────────────── */
.rte-canvas {
  background:linear-gradient(180deg,#e5e7eb 0%,#d1d5db 100%);
  padding:20px 14px;
  display:flex; justify-content:center;
}
.dark .rte-canvas { background:linear-gradient(180deg,#111118 0%,#0d0d14 100%); }

/* ── Page ────────────────────────────────────────────────── */
.rte-page {
  background:#fff; width:100%; max-width:100%;
  border-radius:4px; overflow:hidden;
  box-shadow:0 2px 8px rgba(0,0,0,.15), 0 8px 32px rgba(0,0,0,.1);
}
.dark .rte-page { background:#1e1e2e; box-shadow:0 2px 20px rgba(0,0,0,.6); }

/* ── Preview bar ─────────────────────────────────────────── */
.rte-preview-bar {
  display:flex; align-items:center; gap:6px; padding:7px 16px;
  font-size:11.5px; font-weight:500; color:#3b82f6;
  background:linear-gradient(90deg,#eff6ff,#f5f3ff);
  border-bottom:1px solid #dbeafe;
}
.rte-preview-back {
  margin-left:auto; display:inline-flex; align-items:center; gap:4px;
  padding:3px 10px; border-radius:4px; border:1.5px solid #3b82f6;
  background:#fff; color:#3b82f6; font-size:11px; cursor:pointer; transition:all .12s; font-family:inherit;
}
.rte-preview-back:hover { background:#3b82f6; color:#fff; }

/* ── Editor body ─────────────────────────────────────────── */
.rte-body {
  padding:30px 40px; outline:none;
  font-size:14px; line-height:1.9; color:#1a1a1a;
  font-family:'Times New Roman', serif; caret-color:#3b82f6;
}
.dark .rte-body { color:#e0e0e0; }

.rte-body p.is-editor-empty:first-child::before {
  content:attr(data-placeholder); float:left; color:#9ca3af;
  pointer-events:none; height:0; font-style:italic;
}

.rte-body h1 { font-size:2em; font-weight:800; margin:.7em 0 .3em; color:#1e3a8a; font-family:'Calibri','Georgia',serif; border-bottom:2.5px solid #3b82f6; padding-bottom:5px; letter-spacing:-.01em; }
.dark .rte-body h1 { color:#93c5fd; border-bottom-color:#3b82f6; }
.rte-body h2 { font-size:1.5em; font-weight:700; margin:.6em 0 .25em; color:#1e40af; font-family:'Calibri','Georgia',serif; }
.dark .rte-body h2 { color:#60a5fa; }
.rte-body h3 { font-size:1.2em; font-weight:600; margin:.5em 0 .2em; color:#4f46e5; }
.dark .rte-body h3 { color:#a5b4fc; }
.rte-body p { margin:.4em 0; }
.rte-body strong { font-weight:750; }
.rte-body em { font-style:italic; }
.rte-body u { text-decoration:underline; }
.rte-body s { text-decoration:line-through; }

/* Images */
.rte-body img {
  max-width:100%; height:auto; border-radius:6px;
  box-shadow:0 4px 16px rgba(0,0,0,.12); margin:8px 0;
  cursor:pointer; transition:box-shadow .2s, transform .2s;
  display:block;
}
.rte-body img:hover { box-shadow:0 8px 28px rgba(0,0,0,.2); transform:translateY(-2px); }
.rte-body img.ProseMirror-selectednode { outline:3px solid #3b82f6; outline-offset:2px; border-radius:6px; }

/* Links */
.rte-body a { color:#3b82f6; text-decoration:underline; text-underline-offset:2px; transition:color .12s; }
.rte-body a:hover { color:#1d4ed8; }

/* Code */
.rte-body code:not(pre code) { font-family:'Courier New',monospace; font-size:.88em; background:#f1f5f9; border:1px solid #e2e8f0; padding:.1em .4em; border-radius:4px; color:#be123c; }
.dark .rte-body code:not(pre code) { background:#1e293b; border-color:#334155; color:#fb7185; }
.rte-body pre { background:#1e293b; border-radius:8px; padding:16px 20px; margin:12px 0; overflow-x:auto; font-family:'Courier New',monospace; font-size:.88em; color:#e2e8f0; border-left:4px solid #3b82f6; }
.rte-body pre code { background:none; border:none; padding:0; color:inherit; }

/* Blockquote */
.rte-body blockquote { margin:12px 0; padding:12px 18px; border-left:4px solid #6366f1; background:linear-gradient(90deg,#f5f3ff,#eff6ff); color:#4b5563; font-style:italic; border-radius:0 8px 8px 0; }
.dark .rte-body blockquote { background:linear-gradient(90deg,#1e1b4b,#1e1e2e); color:#a5b4fc; border-left-color:#6366f1; }

/* Lists */
.rte-body ul { list-style:disc; padding-left:2em; margin:6px 0; }
.rte-body ul li { margin:3px 0; }
.rte-body ol { list-style:decimal; padding-left:2em; margin:6px 0; }
.rte-body ol li { margin:3px 0; }

/* Mark + HR */
.rte-body mark { border-radius:3px; padding:.05em .25em; }
.rte-body hr { border:none; border-top:2px solid #e5e7eb; margin:20px 0; }
.rte-body ::selection { background:rgba(99,102,241,.2); }

/* ── Status bar ──────────────────────────────────────────── */
.rte-statusbar {
  display:flex; align-items:center; justify-content:space-between;
  padding:5px 14px;
  background:linear-gradient(90deg,#3b82f6,#6366f1);
  color:rgba(255,255,255,.95); border-radius:0 0 9px 9px;
  font-size:10.5px; letter-spacing:.01em;
}
.dark .rte-statusbar { background:linear-gradient(90deg,#1e3a5f,#312e81); }
.rte-status-left { display:flex; align-items:center; gap:8px; }
.rte-status-item { display:inline-flex; align-items:center; gap:4px; opacity:.9; }
.rte-status-sep { opacity:.4; }
.rte-status-brand { font-size:10px; font-weight:700; opacity:.8; letter-spacing:.08em; }

/* ── Floating Bubble ──────────────────────────────────────── */
.rte-bubble {
  position:absolute; z-index:9999;
  display:flex; align-items:center; gap:2px;
  background:#1e293b; border:1px solid #334155;
  border-radius:8px; padding:4px 6px;
  box-shadow:0 8px 32px rgba(0,0,0,.35);
  animation:rteBubble .15s ease;
  white-space:nowrap;
}
@keyframes rteBubble { from{opacity:0;transform:translateY(6px) scale(.94)} to{opacity:1;transform:translateY(0) scale(1)} }
.rte-fb {
  display:inline-flex; align-items:center; justify-content:center;
  width:26px; height:26px; border:none; background:transparent;
  cursor:pointer; border-radius:5px; color:#cbd5e1; transition:all .1s;
}
.rte-fb:hover { background:#334155; color:#fff; }
.rte-fb--on { background:#3b82f6 !important; color:#fff !important; }
.rte-fb-sep { width:1px; height:16px; background:#334155; margin:0 2px; }

/* ── Modal ───────────────────────────────────────────────── */
.rte-modal-overlay {
  position:fixed; inset:0; z-index:99999;
  background:rgba(0,0,0,.45); backdrop-filter:blur(4px);
  display:flex; align-items:center; justify-content:center;
  animation:rteOverlay .2s ease;
}
@keyframes rteOverlay { from{opacity:0} to{opacity:1} }
.rte-modal {
  background:#fff; border-radius:14px; width:440px; max-width:90vw;
  box-shadow:0 24px 80px rgba(0,0,0,.25), 0 4px 16px rgba(0,0,0,.12);
  animation:rteModalIn .22s cubic-bezier(.34,1.56,.64,1);
  overflow:hidden; font-family:'Inter',sans-serif;
}
.dark .rte-modal { background:#1e1e2e; border:1px solid #3a3a50; }
@keyframes rteModalIn { from{opacity:0;transform:scale(.88) translateY(16px)} to{opacity:1;transform:scale(1) translateY(0)} }
.rte-modal-header {
  display:flex; align-items:center; gap:8px; padding:16px 18px 14px;
  font-size:14px; font-weight:700; color:#1e293b;
  border-bottom:1.5px solid #f1f5f9;
  background:linear-gradient(180deg,#f8fafc,#f1f5f9);
}
.dark .rte-modal-header { color:#e2e8f0; background:linear-gradient(180deg,#2a2a3e,#22223a); border-bottom-color:#3a3a50; }
.rte-modal-close { margin-left:auto; display:inline-flex; align-items:center; justify-content:center; width:26px; height:26px; border:none; background:transparent; cursor:pointer; color:#6b7280; border-radius:6px; transition:all .12s; }
.rte-modal-close:hover { background:#fee2e2; color:#dc2626; }
.rte-modal-tabs { display:flex; border-bottom:1.5px solid #f1f5f9; }
.dark .rte-modal-tabs { border-bottom-color:#3a3a50; }
.rte-mtab { flex:1; padding:10px; background:transparent; border:none; font-size:12.5px; font-weight:600; color:#6b7280; cursor:pointer; transition:all .12s; font-family:inherit; }
.rte-mtab:hover { background:#f8fafc; color:#374151; }
.rte-mtab--on { color:#3b82f6; border-bottom:2.5px solid #3b82f6; background:#eff6ff; }
.rte-modal-body { padding:16px 18px; }
.rte-mlabel { display:block; font-size:11.5px; font-weight:600; color:#374151; margin-bottom:6px; font-family:inherit; }
.dark .rte-mlabel { color:#9ca3af; }
.rte-minput {
  width:100%; padding:8px 12px; border:1.5px solid #e5e7eb; border-radius:8px;
  font-size:13px; color:#1e293b; background:#fff; font-family:inherit;
  transition:border-color .12s, box-shadow .12s; outline:none; box-sizing:border-box;
}
.rte-minput:focus { border-color:#3b82f6; box-shadow:0 0 0 3px rgba(59,130,246,.12); }
.dark .rte-minput { background:#2a2a3e; border-color:#3a3a50; color:#e2e8f0; }
.rte-mcheck { display:flex; align-items:center; gap:8px; margin-top:12px; font-size:12.5px; color:#374151; cursor:pointer; font-family:inherit; }
.dark .rte-mcheck { color:#9ca3af; }
.rte-mpreview { margin-top:12px; border:1.5px solid #e5e7eb; border-radius:8px; overflow:hidden; max-height:140px; display:flex; align-items:center; justify-content:center; background:#f8fafc; }
.rte-mpreview img { max-width:100%; max-height:140px; object-fit:contain; }

/* Dropzone */
.rte-dropzone {
  border:2.5px dashed #d1d5db; border-radius:12px; padding:32px 20px;
  text-align:center; cursor:pointer; color:#6b7280;
  transition:all .2s; background:#f9fafb;
}
.rte-dropzone:hover, .rte-dropzone--drag { border-color:#3b82f6; background:#eff6ff; color:#3b82f6; transform:scale(1.01); }
.rte-dropzone p { margin:8px 0 4px; font-size:13px; font-family:inherit; }
.rte-dropzone strong { color:#1e293b; }
.rte-dropzone--drag .rte-dropzone strong { color:#3b82f6; }
.rte-dropzone-hint { font-size:11px; color:#9ca3af; }

.rte-modal-footer { display:flex; justify-content:flex-end; gap:8px; padding:14px 18px; border-top:1.5px solid #f1f5f9; background:#f8fafc; }
.dark .rte-modal-footer { background:#22223a; border-top-color:#3a3a50; }
.rte-mbtn { display:inline-flex; align-items:center; gap:6px; padding:8px 18px; border-radius:8px; font-size:12.5px; font-weight:600; cursor:pointer; font-family:inherit; transition:all .14s; }
.rte-mbtn--cancel { background:transparent; border:1.5px solid #e5e7eb; color:#6b7280; }
.rte-mbtn--cancel:hover { border-color:#9ca3af; color:#374151; }
.rte-mbtn--ok { background:linear-gradient(135deg,#3b82f6,#6366f1); border:none; color:#fff; box-shadow:0 4px 14px rgba(99,102,241,.35); }
.rte-mbtn--ok:hover { transform:translateY(-1px); box-shadow:0 6px 20px rgba(99,102,241,.45); }

/* ── Animations ──────────────────────────────────────────── */
@keyframes rteDropIn { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
`

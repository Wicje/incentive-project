"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { uploadToCloudinary } from '@/lib/api';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Bold, Italic, List, ListOrdered, Link2, Image as ImageIcon, 
  Heading1, Heading2, Heading3, Quote, Code, Minus, Video, FileAudio, CheckSquare, Table as TableIcon
} from 'lucide-react';
import { Iframe } from './extensions/iframe';
import { Audio } from './extensions/audio';

export default function Editor({ 
  initialContent, 
  onChange,
  readOnly = false
}: { 
  initialContent: string; 
  onChange?: (html: string) => void;
  readOnly?: boolean;
}) {
  const [linkInputOpen, setLinkInputOpen] = useState(false);
  const [imageInputOpen, setImageInputOpen] = useState(false);
  const [iframeInputOpen, setIframeInputOpen] = useState(false);
  const [audioInputOpen, setAudioInputOpen] = useState(false);
  
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [iframeUrl, setIframeUrl] = useState('');
  const [audioUrl, setAudioUrl] = useState('');

  const handleImageUpload = async (file: File) => {
    try {
      const url = await uploadToCloudinary(file);
      return url;
    } catch (e) {
      console.error(e);
      alert('Failed to upload image');
      return null;
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Iframe,
      Audio,
    ],
    content: initialContent || '<p>Start building your moodboard & notes here...</p>',
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-stone prose-sm sm:prose-base font-sans focus:outline-none max-w-none min-h-[65vh] prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-blue-600',
      },
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith('image/')) {
            handleImageUpload(file).then(url => {
              if (url) {
                const { schema } = view.state;
                const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });
                const node = schema.nodes.image.create({ src: url });
                if (coordinates) {
                  const transaction = view.state.tr.insert(coordinates.pos, node);
                  view.dispatch(transaction);
                }
              }
            });
            return true;
          }
        }
        return false;
      }
    }
  });

  // Keep editor content in sync if readOnly updates (important for client view mode)
  useEffect(() => {
    if (readOnly && editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent);
    }
  }, [initialContent, readOnly, editor]);

  const toggleLinkInput = () => {
    if (!editor) return;
    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run();
    } else {
      setLinkUrl(editor.getAttributes('link').href || '');
      setLinkInputOpen(true);
      setImageInputOpen(false);
      setIframeInputOpen(false);
      setAudioInputOpen(false);
    }
  };

  const applyLink = () => {
    if (!editor) return;
    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
    }
    setLinkInputOpen(false);
    setLinkUrl('');
  };

  const applyImage = () => {
    if (!editor || !imageUrl) return;
    editor.chain().focus().setImage({ src: imageUrl }).run();
    setImageInputOpen(false);
    setImageUrl('');
  };

  const applyIframe = () => {
    if (!editor || !iframeUrl) return;
    editor.chain().focus().setIframe({ src: iframeUrl }).run();
    setIframeInputOpen(false);
    setIframeUrl('');
  };

  const applyAudio = () => {
    if (!editor || !audioUrl) return;
    editor.chain().focus().setAudio({ src: audioUrl }).run();
    setAudioInputOpen(false);
    setAudioUrl('');
  };

  if (!editor) {
    return null;
  }

  return (
    <div className={`border rounded-lg overflow-visible bg-white ${readOnly ? 'border-transparent' : 'border-zinc-200 shadow-sm'} relative`}>
      {!readOnly && (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-zinc-100 bg-zinc-50/50">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'bg-zinc-200' : ''}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'bg-zinc-200' : ''}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </Button>
          
          <div className="w-px h-4 bg-zinc-300 mx-1" />
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={editor.isActive('heading', { level: 1 }) ? 'bg-zinc-200' : ''}
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={editor.isActive('heading', { level: 2 }) ? 'bg-zinc-200' : ''}
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={editor.isActive('heading', { level: 3 }) ? 'bg-zinc-200' : ''}
            title="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </Button>

          <div className="w-px h-4 bg-zinc-300 mx-1" />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'bg-zinc-200' : ''}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'bg-zinc-200' : ''}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            className={editor.isActive('taskList') ? 'bg-zinc-200' : ''}
            title="Todo List"
          >
            <CheckSquare className="w-4 h-4" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
            title="Insert Table"
          >
            <TableIcon className="w-4 h-4" />
          </Button>

          <div className="w-px h-4 bg-zinc-300 mx-1" />

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive('blockquote') ? 'bg-zinc-200' : ''}
            title="Quote"
          >
            <Quote className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={editor.isActive('codeBlock') ? 'bg-zinc-200' : ''}
            title="Code Block"
          >
            <Code className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Divider"
          >
            <Minus className="w-4 h-4" />
          </Button>

          <div className="w-px h-4 bg-zinc-300 mx-1" />
          
          <div className="relative">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={toggleLinkInput}
              className={editor.isActive('link') ? 'bg-zinc-200' : ''}
              title="Link"
            >
              <Link2 className="w-4 h-4" />
            </Button>
            {linkInputOpen && (
              <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-stone-200 rounded shadow-lg z-50 flex gap-2">
                <input 
                  type="url" 
                  autoFocus
                  placeholder="https://..." 
                  value={linkUrl} 
                  onChange={(e) => setLinkUrl(e.target.value)} 
                  className="text-sm border border-stone-200 rounded px-2 py-1 w-48"
                  onKeyDown={(e) => e.key === 'Enter' && applyLink()}
                />
                <Button size="sm" onClick={applyLink}>Add</Button>
              </div>
            )}
          </div>
          <div className="relative">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => { 
                setImageInputOpen(!imageInputOpen); 
                setLinkInputOpen(false); 
                setIframeInputOpen(false); 
                setAudioInputOpen(false); 
              }}
              title="Image"
            >
              <ImageIcon className="w-4 h-4" />
            </Button>
            {imageInputOpen && (
              <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-stone-200 rounded shadow-lg z-50 flex flex-col gap-2 w-64">
                <span className="text-xs text-stone-500 font-medium">Add Image via URL (or drop file below):</span>
                <div className="flex gap-2">
                  <input 
                    type="url" 
                    autoFocus
                    placeholder="https://picsum..." 
                    value={imageUrl} 
                    onChange={(e) => setImageUrl(e.target.value)} 
                    className="text-sm border border-stone-200 rounded px-2 py-1 flex-1"
                    onKeyDown={(e) => e.key === 'Enter' && applyImage()}
                  />
                  <Button size="sm" onClick={applyImage}>Add</Button>
                </div>
              </div>
            )}
          </div>
          <div className="relative">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => { 
                setIframeInputOpen(!iframeInputOpen); 
                setLinkInputOpen(false); 
                setImageInputOpen(false); 
                setAudioInputOpen(false); 
              }}
              title="Embed Video/Figma/Map"
            >
              <Video className="w-4 h-4" />
            </Button>
            {iframeInputOpen && (
              <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-stone-200 rounded shadow-lg z-50 flex flex-col gap-2 w-64">
                <span className="text-xs text-stone-500 font-medium">Add Embed/Iframe Link (Youtube, Figma, etc):</span>
                <div className="flex gap-2">
                  <input 
                    type="url" 
                    autoFocus
                    placeholder="https://..." 
                    value={iframeUrl} 
                    onChange={(e) => setIframeUrl(e.target.value)} 
                    className="text-sm border border-stone-200 rounded px-2 py-1 flex-1"
                    onKeyDown={(e) => e.key === 'Enter' && applyIframe()}
                  />
                  <Button size="sm" onClick={applyIframe}>Add</Button>
                </div>
              </div>
            )}
          </div>
          <div className="relative">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => { 
                setAudioInputOpen(!audioInputOpen); 
                setLinkInputOpen(false); 
                setImageInputOpen(false); 
                setIframeInputOpen(false); 
              }}
              title="Audio"
            >
              <FileAudio className="w-4 h-4" />
            </Button>
            {audioInputOpen && (
              <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-stone-200 rounded shadow-lg z-50 flex flex-col gap-2 w-64">
                <span className="text-xs text-stone-500 font-medium">Add Audio File Link:</span>
                <div className="flex gap-2">
                  <input 
                    type="url" 
                    autoFocus
                    placeholder="https://..." 
                    value={audioUrl} 
                    onChange={(e) => setAudioUrl(e.target.value)} 
                    className="text-sm border border-stone-200 rounded px-2 py-1 flex-1"
                    onKeyDown={(e) => e.key === 'Enter' && applyAudio()}
                  />
                  <Button size="sm" onClick={applyAudio}>Add</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <div className={`p-4 ${readOnly ? 'p-0 pb-10' : ''}`}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

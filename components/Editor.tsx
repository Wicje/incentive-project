"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { uploadToCloudinary } from '@/lib/api';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bold, Italic, List, ListOrdered, Link2, Image as ImageIcon } from 'lucide-react';

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
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');

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
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: initialContent || '<p>Start building your moodboard & notes here...</p>',
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm prose-zinc sm:prose-base focus:outline-none max-w-none min-h-[300px]',
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
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'bg-zinc-200' : ''}
          >
            <Italic className="w-4 h-4" />
          </Button>
          <div className="w-px h-4 bg-zinc-300 mx-1" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'bg-zinc-200' : ''}
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'bg-zinc-200' : ''}
          >
            <ListOrdered className="w-4 h-4" />
          </Button>
          <div className="w-px h-4 bg-zinc-300 mx-1" />
          <div className="relative">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={toggleLinkInput}
              className={editor.isActive('link') ? 'bg-zinc-200' : ''}
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
              onClick={() => { setImageInputOpen(!imageInputOpen); setLinkInputOpen(false); }}
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
        </div>
      )}
      <div className={`p-4 ${readOnly ? 'p-0 pb-10' : ''}`}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

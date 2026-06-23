"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
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
  onChange?: (content: string) => void;
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
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
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
                if (coordinates) {
                  const node = schema.nodes.image.create({ src: url });
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
    if (editor && initialContent !== editor.getHTML()) {
      // Don't update if it's JSON from blocknote, just try to render as text
      if (initialContent.startsWith('[')) {
          // It's blocknote JSON. Tiptap will crash if we try setContent with it.
          // In real migration we'd parse this, but for now we fallback.
      } else {
          editor.commands.setContent(initialContent);
      }
    }
  }, [initialContent, editor]);

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
    <div className={`border rounded-lg overflow-visible bg-white dark:bg-stone-950 ${readOnly ? 'border-transparent' : 'border-zinc-200 dark:border-stone-800 shadow-sm'} relative`}>
      {!readOnly && (
        <div className="flex flex-wrap items-center gap-1 p-2 border-b border-zinc-100 dark:border-stone-800 bg-zinc-50/50 dark:bg-stone-900/50">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'bg-zinc-200 dark:bg-stone-800' : ''}
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'bg-zinc-200 dark:bg-stone-800' : ''}
          >
            <Italic className="w-4 h-4" />
          </Button>
          <div className="w-px h-4 bg-zinc-300 dark:bg-stone-700 mx-1" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'bg-zinc-200 dark:bg-stone-800' : ''}
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'bg-zinc-200 dark:bg-stone-800' : ''}
          >
            <ListOrdered className="w-4 h-4" />
          </Button>
        </div>
      )}
      <div className={`p-4 ${readOnly ? 'p-0 pb-10' : ''}`}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

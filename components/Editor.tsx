"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { uploadToCloudinary } from '@/lib/api';
import { useCallback, useEffect } from 'react';
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

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const defaultUrl = 'https://picsum.photos/800/600';
    const url = window.prompt('URL (or let Cloudinary handle drop)', defaultUrl);
    
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className={`border rounded-lg overflow-hidden bg-white ${readOnly ? 'border-transparent' : 'border-zinc-200 shadow-sm'}`}>
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
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={setLink}
            className={editor.isActive('link') ? 'bg-zinc-200' : ''}
          >
            <Link2 className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={addImage}
          >
            <ImageIcon className="w-4 h-4" />
          </Button>
        </div>
      )}
      <div className={`p-4 ${readOnly ? 'p-0 pb-10' : ''}`}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

"use client";

import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";
import { uploadToCloudinary } from "@/lib/api";
import { useEffect, useState } from "react";

export default function Editor({ 
  initialContent, 
  onChange,
  readOnly = false
}: { 
  initialContent: string; 
  onChange?: (content: string) => void;
  readOnly?: boolean;
}) {
  const [ready, setReady] = useState(false);

  const editor = useCreateBlockNote({
    uploadFile: async (file) => {
      try {
        const url = await uploadToCloudinary(file);
        return url;
      } catch (e) {
        alert("Failed to upload file");
        return "";
      }
    }
  });

  useEffect(() => {
    async function load() {
      if (initialContent) {
        try {
          // Attempt to parse JSON block structure
          const blocks = JSON.parse(initialContent);
          editor.replaceBlocks(editor.document, blocks);
        } catch {
          // Fallback parsing for legacy HTML content
          try {
            const blocks = await editor.tryParseHTMLToBlocks(initialContent);
            editor.replaceBlocks(editor.document, blocks);
          } catch (e) {
            console.error("Failed to parse initial content", e);
          }
        }
      } else {
        // Provide some default content to start with
        const blocks = await editor.tryParseHTMLToBlocks('<p>Start building your moodboard & notes here...</p>');
        editor.replaceBlocks(editor.document, blocks);
      }
      setReady(true);
    }
    load();
  }, [editor, initialContent]);

  if (!ready) {
    return <div className="p-8 text-center text-sm text-stone-500 animate-pulse">Loading editor...</div>;
  }

  return (
    <div className={`overflow-visible rounded-lg bg-white dark:bg-stone-950 ${readOnly ? '' : 'border border-stone-200 dark:border-stone-800 shadow-sm'}`}>
      <div className={`p-4 ${readOnly ? 'p-0 pb-10' : ''}`}>
        <BlockNoteView 
          theme="light" // Ideally inherit theme from next-themes, but setting to light for now
          editor={editor} 
          editable={!readOnly}
          onChange={() => {
            if (onChange) {
               // We store as JSON to retain blocknote structures including embeds and custom blocks
               onChange(JSON.stringify(editor.document));
            }
          }} 
        />
      </div>
    </div>
  );
}

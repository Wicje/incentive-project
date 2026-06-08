"use client";

import { useStore } from '@/lib/store';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Plus, Trash2, Command } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Editor from '@/components/Editor';

export default function InboxPage() {
  const { notes, addNote, updateNote, deleteNote } = useStore();
  const [activeNoteId, setActiveNoteId] = useState<string | null>(notes[0]?.id || null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const activeNote = notes.find(n => n.id === activeNoteId);

  const handleCreateNote = () => {
    addNote({ title: 'Untitled Note', content: '' });
  };

  if (!mounted) return null;

  return (
    <div className="flex h-full bg-[#FAF9F6] border-t border-stone-200/50">
      {/* Sidebar List */}
      <div className="w-80 border-r border-stone-200 bg-stone-50/50 flex flex-col hidden md:flex">
        <div className="p-4 border-b border-stone-200 flex items-center justify-between">
          <h2 className="font-semibold text-stone-800 text-sm tracking-wide">Inbox & Ideas</h2>
          <Button variant="ghost" size="icon" onClick={handleCreateNote}>
            <Plus className="w-4 h-4 text-stone-500" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {notes.length === 0 ? (
            <div className="p-4 text-sm text-stone-500 text-center mt-10">No notes yet. Capture an idea.</div>
          ) : (
            notes.map(note => (
              <div 
                key={note.id}
                onClick={() => setActiveNoteId(note.id)}
                className={`p-4 border-b border-stone-100 cursor-pointer transition-colors ${activeNoteId === note.id ? 'bg-white shadow-[inset_2px_0_0_0_#1c1917]' : 'hover:bg-white'}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium text-stone-800 text-sm truncate">{note.title || 'Untitled Note'}</h3>
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteNote(note.id); if (activeNoteId === note.id) setActiveNoteId(null); }}
                    className="p-1 text-stone-400 hover:text-red-500 transition-colors rounded hidden group-hover:block"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-xs text-stone-500 mt-1 font-mono tracking-wide">{format(new Date(note.createdAt), 'MMM d, yyyy')}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Editor Main */}
      <div className="flex-1 flex flex-col bg-white overflow-y-auto">
        {activeNote ? (
          <div className="max-w-4xl w-full mx-auto p-8 md:p-12 space-y-6">
            <input 
              type="text" 
              value={activeNote.title}
              onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
              className="text-4xl font-serif font-bold text-stone-900 w-full outline-none placeholder:text-stone-300 bg-transparent"
              placeholder="Note title..."
            />
            <div className="text-xs font-mono text-stone-400 tracking-widest uppercase mb-8">
              Last updated {format(new Date(activeNote.updatedAt), 'PPp')}
            </div>
            
            <Editor 
              initialContent={activeNote.content} 
              onChange={(content) => updateNote(activeNote.id, { content })} 
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-stone-400 flex-col gap-4">
            <Command className="w-12 h-12 text-stone-200" />
            <p className="text-sm font-medium">Select a note or create a new one.</p>
            <Button variant="outline" onClick={handleCreateNote}>Create Note</Button>
          </div>
        )}
      </div>
    </div>
  );
}

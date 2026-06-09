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

  const handleCreateNote = async () => {
    const newId = await addNote({ title: 'Untitled Note', content: '' });
    setActiveNoteId(newId);
  };

  if (!mounted) return null;

  return (
    <div className="flex h-full bg-white border-t-0 md:border-t-0">
      {/* Sidebar List */}
      <div className={`w-full md:w-80 border-r border-[#EFEFEF] bg-[#F9F9F8] flex flex-col ${activeNoteId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-[#EFEFEF] flex items-center justify-between">
          <h2 className="font-sans font-semibold text-stone-800 text-sm tracking-tight">Inbox & Ideas</h2>
          <Button variant="ghost" size="icon" onClick={handleCreateNote}>
            <Plus className="w-4 h-4 text-stone-500" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {notes.length === 0 ? (
            <div className="p-4 text-sm text-stone-500 text-center mt-10 font-sans">No notes yet. Capture an idea.</div>
          ) : (
            notes.map(note => (
              <div 
                key={note.id}
                onClick={() => setActiveNoteId(note.id)}
                className={`p-3 mx-2 mt-2 rounded-md cursor-pointer transition-colors group ${activeNoteId === note.id ? 'bg-black/5' : 'hover:bg-black/5'}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium text-stone-800 text-[14px] truncate leading-tight">{note.title || 'Untitled Note'}</h3>
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteNote(note.id); if (activeNoteId === note.id) setActiveNoteId(null); }}
                    className="p-1 text-stone-400 hover:text-red-500 transition-colors rounded hidden group-hover:block -mt-1 -mr-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-[12px] text-stone-500 mt-1 font-sans">{format(new Date(note.createdAt), 'MMM d, yyyy')}</p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Editor Main */}
      <div className={`flex-1 flex flex-col bg-white overflow-y-auto ${activeNote ? 'block' : 'hidden md:flex'}`}>
        {activeNote ? (
          <div className="max-w-3xl w-full mx-auto p-4 md:p-12 space-y-4">
            <div className="flex md:hidden items-center justify-between mb-4 pb-4 border-b border-[#EFEFEF]">
               <Button variant="ghost" size="sm" onClick={() => setActiveNoteId(null)} className="text-stone-500">
                 ← Back to Inbox
               </Button>
               <Button variant="ghost" size="icon" onClick={handleCreateNote}>
                 <Plus className="w-4 h-4 text-stone-500" />
               </Button>
            </div>
            <input 
              type="text" 
              value={activeNote.title}
              onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
              className="text-4xl font-sans font-bold text-stone-900 w-full outline-none placeholder:text-stone-300 bg-transparent tracking-tight"
              placeholder="Start typing..."
            />
            
            <Editor 
              initialContent={activeNote.content} 
              onChange={(content) => updateNote(activeNote.id, { content })} 
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-stone-400 flex-col gap-4">
            <Command className="w-12 h-12 text-stone-200" />
            <p className="text-[14px] font-medium font-sans">Select a note or create a new one.</p>
            <Button variant="outline" onClick={handleCreateNote} className="font-sans font-medium text-[14px] shadow-sm">Create Note</Button>
          </div>
        )}
      </div>
    </div>
  );
}

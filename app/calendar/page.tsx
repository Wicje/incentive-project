"use client";

import { useStore } from '@/lib/store';
import { useState, useEffect } from 'react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  eachDayOfInterval,
  parseISO
} from 'date-fns';
import { ChevronLeft, ChevronRight, Folder, CheckCircle2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CalendarPage() {
  const { projects, tasks, addTask } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Interactive State
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskProjectId, setNewTaskProjectId] = useState('');

  if (!mounted) return null;

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const today = () => setCurrentDate(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate
  });

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle || !newTaskProjectId || !selectedDay) return;
    
    await addTask({
      projectId: newTaskProjectId,
      title: newTaskTitle,
      stage: 'research',
      status: 'todo',
      dueDate: selectedDay.toISOString()
    });
    
    setNewTaskTitle('');
    setSelectedDay(null);
  };

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto space-y-8 flex flex-col h-full bg-[#FAF9F6]">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-stone-200/50">
        <div>
          <h1 className="text-4xl font-serif font-semibold tracking-tight text-stone-900 mb-2">Calendar</h1>
          <p className="text-stone-500 font-medium tracking-wide text-sm">Manage project deadlines and tasks.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={today} className="hidden md:flex border-stone-200 text-stone-600 bg-white">
            Today
          </Button>
          <div className="flex items-center gap-2 bg-white rounded-lg border border-stone-200 p-1 shadow-sm">
            <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8 text-stone-500 hover:text-stone-900">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="w-32 text-center font-semibold text-stone-800 text-sm">
              {format(currentDate, "MMMM yyyy")}
            </div>
            <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8 text-stone-500 hover:text-stone-900">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 bg-white border border-stone-200 rounded-2xl shadow-sm flex flex-col">
        {/* Days Header */}
        <div className="grid grid-cols-7 border-b border-stone-200 bg-stone-50/80 rounded-t-2xl">
          {weekDays.map((day) => (
            <div key={day} className="py-3 text-center text-[10px] font-bold uppercase tracking-widest text-stone-500">
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="flex-1 grid grid-cols-7 auto-rows-fr relative bg-stone-100 gap-px rounded-b-2xl overflow-hidden">
          {days.map((day, i) => {
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isToday = isSameDay(day, new Date());
            const isSelected = selectedDay && isSameDay(day, selectedDay);
            
            // Find items for this day
            const dayProjects = projects.filter(p => isSameDay(parseISO(p.deadline), day));
            const dayTasks = tasks.filter(t => t.dueDate && isSameDay(parseISO(t.dueDate), day));

            return (
              <div 
                key={day.toISOString()} 
                className={`min-h-[120px] p-2 transition-colors relative group ${
                  !isCurrentMonth ? 'bg-[#FAFAFA] text-stone-400' : 'bg-white'
                } ${isSelected ? 'ring-2 ring-inset ring-stone-400 bg-stone-50 z-10' : 'hover:bg-stone-50/80 cursor-pointer'} flex flex-col gap-1`}
                onClick={() => setSelectedDay(day)}
              >
                <div className="flex justify-between items-center px-1 mb-1">
                  <span className={`text-sm font-semibold font-mono ${isToday ? 'bg-stone-900 text-white w-6 h-6 flex items-center justify-center rounded-full shadow-sm' : 'text-stone-600'}`}>
                    {format(day, "d")}
                  </span>
                  {!isSelected && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus className="w-4 h-4 text-stone-300 hover:text-stone-600" />
                    </div>
                  )}
                </div>

                <div className="space-y-1 flex-1 overflow-y-auto hide-scrollbar">
                  {dayProjects.map(p => (
                    <div key={p.id} className="text-[10px] bg-[#EAE8E3] text-stone-700 font-semibold px-2 py-1 rounded border border-stone-200/50 truncate flex items-center gap-1.5 w-full">
                      <Folder className="w-3 h-3 text-stone-500 shrink-0" />
                      <span className="truncate">{p.name}</span>
                    </div>
                  ))}
                  
                  {dayTasks.map(t => (
                    <div key={t.id} className={`text-[10px] px-2 py-1 rounded border truncate flex items-center gap-1.5 font-medium transition-colors ${
                      t.status === 'done' 
                        ? 'bg-stone-50 text-stone-400 border-stone-100 line-through' 
                        : 'bg-white text-stone-600 border-stone-200 shadow-sm hover:border-stone-300'
                    }`}>
                      <CheckCircle2 className={`w-3 h-3 shrink-0 ${t.status === 'done' ? 'text-stone-300' : 'text-stone-700'}`} />
                      <span className="truncate">{t.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Add Modal */}
      {selectedDay && (
        <>
          <div className="fixed inset-0 z-40 bg-stone-900/10 backdrop-blur-sm" onClick={() => setSelectedDay(null)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl shadow-xl border border-stone-200 p-6 w-[400px]">
            <h3 className="font-serif text-2xl font-bold text-stone-800 mb-1">New Task</h3>
            <p className="text-sm text-stone-500 mb-6 font-medium">Scheduled for {format(selectedDay, "EEEE, MMMM d")}</p>
            
            <form onSubmit={handleQuickAdd} className="flex flex-col gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest uppercase text-stone-400">Task Title</label>
                <input 
                  autoFocus
                  type="text" 
                  placeholder="What needs to be done?" 
                  className="w-full text-sm border-0 border-b-2 border-stone-100 px-0 py-2 focus:ring-0 focus:outline-none focus:border-stone-400 transition-colors bg-transparent font-medium placeholder:text-stone-300 text-stone-900"
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold tracking-widest uppercase text-stone-400">Project</label>
                <select 
                  className="w-full text-sm border border-stone-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-stone-400 bg-stone-50 font-medium text-stone-700"
                  value={newTaskProjectId}
                  onChange={e => setNewTaskProjectId(e.target.value)}
                >
                  <option value="" disabled>Select Project</option>
                  {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              
              <div className="flex gap-3 mt-4">
                <Button type="submit" className="flex-1 bg-stone-900 text-white hover:bg-stone-800">Add to Calendar</Button>
                <Button type="button" variant="outline" className="flex-1" onClick={() => setSelectedDay(null)}>Cancel</Button>
              </div>
            </form>
          </div>
        </>
      )}
    </div>
  );
}

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
import { ChevronLeft, ChevronRight, Folder, CheckCircle2, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { initAuth, googleSignIn, getAccessToken } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function CalendarPage() {
  const router = useRouter();
  const { projects, tasks, addTask } = useStore();
  const [mounted, setMounted] = useState(false);

  // Calendar Auth & Fetch State
  const [needsAuth, setNeedsAuth] = useState(false);
  const [googleEvents, setGoogleEvents] = useState<any[]>([]);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Interactive State
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskProjectId, setNewTaskProjectId] = useState('');

  useEffect(() => {
    if (!mounted) return;
    const fetchEvents = async (token: string) => {
      try {
        const timeMin = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1).toISOString();
        const timeMax = new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0).toISOString();
        const res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setGoogleEvents(data.items || []);
        } else if (res.status === 401 || res.status === 403) {
          setNeedsAuth(true);
        }
      } catch (err) {
        console.error("Failed to fetch Google Calendar events", err);
      }
    };

    const unsubscribe = initAuth(
      (user, token) => {
        setNeedsAuth(false);
        fetchEvents(token);
      },
      () => setNeedsAuth(true)
    );

    getAccessToken().then(token => {
       if (token) fetchEvents(token);
    });

    return () => unsubscribe();
  }, [currentDate, mounted]);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      // Auth success handled in initAuth
    } catch (err) {
      console.error('Login failed:', err);
    } finally {
      setIsLoggingIn(false);
    }
  };

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
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 pb-6 border-b border-stone-200/50">
        <div>
          <h1 className="text-4xl font-serif font-semibold tracking-tight text-stone-900 mb-2">Calendar</h1>
          <p className="text-stone-500 font-medium tracking-wide text-sm">Manage project deadlines, tasks, and appointments.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {needsAuth ? (
            <button onClick={handleLogin} disabled={isLoggingIn} className="w-full sm:w-auto hover:opacity-90 transition-opacity">
              <div className="bg-white border border-[#dadce0] rounded text-[#3c4043] px-3 py-1.5 flex flex-row items-center cursor-pointer shadow-sm">
                <div className="h-4 w-4 mr-2">
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style={{display: 'block'}}>
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    <path fill="none" d="M0 0h48v48H0z"></path>
                  </svg>
                </div>
                <span className="font-medium text-sm">Sync Google Calendar</span>
              </div>
            </button>
          ) : (
            <div className="bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6] px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5">
               <CheckCircle2 className="w-3.5 h-3.5" /> Calendar Synced
            </div>
          )}
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
            const dayProjects = projects.filter(p => p.deadline && isSameDay(parseISO(p.deadline), day));
            const dayTasks = tasks.filter(t => t.dueDate && isSameDay(parseISO(t.dueDate), day));
            const dayGoogleEvents = googleEvents.filter(ev => {
              const evDate = ev.start?.dateTime || ev.start?.date;
              return evDate && isSameDay(parseISO(evDate), day);
            });

            return (
              <div 
                key={day.toISOString()} 
                className={`min-h-[120px] p-2 transition-colors relative group ${
                  !isCurrentMonth ? 'bg-[#FAFAFA] text-stone-400' : 'bg-white'
                } ${isSelected ? 'ring-2 ring-inset ring-stone-400 bg-stone-50 z-10' : 'hover:bg-stone-50/80 cursor-pointer'} flex flex-col gap-1`}
                onClick={() => setSelectedDay(day)}
              >
                <div className="flex justify-between items-center px-1 mb-1">
                  <span className={`text-sm md:text-base font-semibold font-mono ${isToday ? 'bg-stone-900 text-white w-6 h-6 flex items-center justify-center rounded-full shadow-sm' : 'text-stone-600'}`}>
                    {format(day, "d")}
                  </span>
                  {!isSelected && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus className="w-4 h-4 text-stone-300 hover:text-stone-600" />
                    </div>
                  )}
                </div>

                <div className="space-y-1 flex-1 overflow-y-auto hide-scrollbar">
                  {dayGoogleEvents.map(ev => (
                    <div 
                      key={ev.id} 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (ev.htmlLink) window.open(ev.htmlLink, '_blank');
                      }}
                      className="text-[10px] bg-[#E8F0FE] text-[#1967D2] hover:bg-[#D2E3FC] cursor-pointer font-semibold px-2 py-1 rounded border border-[#D2E3FC] truncate flex items-center gap-1.5 w-full shadow-sm" title={ev.summary}>
                      <CalendarIcon className="w-3 h-3 shrink-0" />
                      <span className="truncate">{ev.summary || 'Event'}</span>
                    </div>
                  ))}

                  {dayProjects.map(p => (
                    <div 
                      key={p.id} 
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/projects/${p.id}`);
                      }}
                      className="text-[10px] bg-[#FFF8E6] text-[#B37800] hover:bg-[#FFEAC2] cursor-pointer font-semibold px-2 py-1 rounded border border-[#FFEAC2] truncate flex items-center gap-1.5 w-full shadow-sm">
                      <Folder className="w-3 h-3 text-[#B37800] shrink-0" />
                      <span className="truncate">{p.name} - Deadline</span>
                    </div>
                  ))}
                  
                  {dayTasks.map(t => (
                    <div 
                      key={t.id} 
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/projects/${t.projectId}`);
                      }}
                      className={`text-[10px] px-2 py-1 rounded border truncate flex items-center gap-1.5 font-medium cursor-pointer transition-colors ${
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

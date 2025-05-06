'use client';
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { format, parseISO, isToday } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

function getTodayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function JournalPage() {
  const [selectedDate, setSelectedDate] = useState(getTodayISO());
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [notes, setNotes] = useState("");

  // Load notes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`journal-${selectedDate}`);
    setNotes(saved || "");
  }, [selectedDate]);

  // Save notes to localStorage
  useEffect(() => {
    localStorage.setItem(`journal-${selectedDate}`, notes);
  }, [notes, selectedDate]);

  const friendlyDate = isToday(parseISO(selectedDate))
    ? "Today"
    : format(parseISO(selectedDate), "EEEE, MMMM d, yyyy");

  function handleDateChange(date: Date | undefined) {
    if (!date) return;
    const iso = date.toISOString().slice(0, 10);
    setSelectedDate(iso);
    setCalendarDate(date);
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-0 px-2 sm:px-0">
      <header className="sticky top-0 z-10 bg-background/90 backdrop-blur flex flex-col items-center w-full max-w-2xl mx-auto px-4 pt-4 pb-2 gap-2 shadow-sm">
        <h1 className="text-2xl font-bold mb-2">Journal</h1>
        <div className="flex gap-2 items-center">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex gap-2 items-center">
                <CalendarIcon className="w-4 h-4" />
                <span>{friendlyDate}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="p-0">
              <Calendar mode="single" selected={calendarDate} onSelect={handleDateChange} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
      </header>
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-6 flex flex-col gap-6 mt-4">
        <textarea
          className="w-full min-h-[300px] rounded-lg border p-4 text-base bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-vertical"
          placeholder="Write your notes for the day..."
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />
      </div>
    </div>
  );
} 
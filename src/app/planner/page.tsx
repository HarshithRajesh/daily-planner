'use client';
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Sun, Moon, Laptop } from "lucide-react";
import { format, addDays, parseISO, isToday } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

function getTodayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function PlannerPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialDate = searchParams.get("date") || getTodayISO();
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [calendarDate, setCalendarDate] = useState(new Date(initialDate));

  // State for planner sections (to be expanded)
  const [top3, setTop3] = useState(["", "", ""]);
  const [top3Checked, setTop3Checked] = useState([false, false, false]);
  const [rating, setRating] = useState(0);
  const [timeTracker, setTimeTracker] = useState(Array(14).fill(""));
  const [todos, setTodos] = useState([{ text: "", done: false }]);
  const [calls, setCalls] = useState([{ text: "", done: false }]);
  const [menu, setMenu] = useState({ Breakfast: "", Lunch: "", Snacks: "", Dinner: "" });
  const [water, setWater] = useState(Array(8).fill(false));
  const [exercise, setExercise] = useState(0);
  const [money, setMoney] = useState([{ sign: "", amount: "", type: "" }]);
  const [highlight, setHighlight] = useState("");
  const [journal, setJournal] = useState("");
  const [celebrated, setCelebrated] = useState({ top3: false, water: false });

  // Streak logic
  const [streak, setStreak] = useState(0);

  // Theme switching logic
  const [theme, setTheme] = useState('system');
  useEffect(() => {
    const saved = localStorage.getItem('planner-theme');
    if (saved) setTheme(saved);
  }, []);
  useEffect(() => {
    localStorage.setItem('planner-theme', theme);
    if (theme === 'system') {
      document.documentElement.classList.remove('dark');
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      }
    } else if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Load/save planner data per date
  useEffect(() => {
    const saved = localStorage.getItem(`planner-${selectedDate}`);
    if (saved) {
      const data = JSON.parse(saved);
      setTop3(data.top3 || ["", "", ""]);
      setTop3Checked(data.top3Checked || [false, false, false]);
      setRating(data.rating || 0);
      setTimeTracker(data.timeTracker || Array(14).fill(""));
      setTodos(data.todos || [{ text: "", done: false }]);
      setCalls(data.calls || [{ text: "", done: false }]);
      setMenu(data.menu || { Breakfast: "", Lunch: "", Snacks: "", Dinner: "" });
      setWater(data.water || Array(8).fill(false));
      setExercise(data.exercise || 0);
      setMoney(data.money || [{ sign: "", amount: "", type: "" }]);
      setHighlight(data.highlight || "");
    } else {
      setTop3(["", "", ""]);
      setTop3Checked([false, false, false]);
      setRating(0);
      setTimeTracker(Array(14).fill(""));
      setTodos([{ text: "", done: false }]);
      setCalls([{ text: "", done: false }]);
      setMenu({ Breakfast: "", Lunch: "", Snacks: "", Dinner: "" });
      setWater(Array(8).fill(false));
      setExercise(0);
      setMoney([{ sign: "", amount: "", type: "" }]);
      setHighlight("");
    }
  }, [selectedDate]);

  useEffect(() => {
    const data = { top3, top3Checked, rating, timeTracker, todos, calls, menu, water, exercise, money, highlight /* ...other sections... */ };
    localStorage.setItem(`planner-${selectedDate}`, JSON.stringify(data));
  }, [top3, top3Checked, rating, timeTracker, todos, calls, menu, water, exercise, money, highlight, selectedDate /*, ...other sections */]);

  // Load/save journal notes per date
  useEffect(() => {
    const saved = localStorage.getItem(`journal-${selectedDate}`);
    setJournal(saved || "");
  }, [selectedDate]);
  useEffect(() => {
    localStorage.setItem(`journal-${selectedDate}`, journal);
  }, [journal, selectedDate]);

  // Handle calendar date change
  function handleDateChange(date: Date | undefined) {
    if (!date) return;
    const iso = date.toISOString().slice(0, 10);
    setSelectedDate(iso);
    setCalendarDate(date);
    router.replace(`?date=${iso}`);
  }

  // Helper for friendly date display
  const friendlyDate = isToday(parseISO(selectedDate))
    ? "Today"
    : format(parseISO(selectedDate), "EEEE, MMMM d, yyyy");

  // Quick navigation handlers
  function goToToday() {
    const today = getTodayISO();
    setSelectedDate(today);
    setCalendarDate(new Date(today));
    router.replace(`?date=${today}`);
  }
  function goToPrev() {
    const prev = format(addDays(parseISO(selectedDate), -1), "yyyy-MM-dd");
    setSelectedDate(prev);
    setCalendarDate(new Date(prev));
    router.replace(`?date=${prev}`);
  }
  function goToNext() {
    const next = format(addDays(parseISO(selectedDate), 1), "yyyy-MM-dd");
    setSelectedDate(next);
    setCalendarDate(new Date(next));
    router.replace(`?date=${next}`);
  }

  // Handler for top 3 task text
  function handleTop3TextChange(idx: number, value: string) {
    const updated = [...top3];
    updated[idx] = value;
    setTop3(updated);
  }
  // Handler for top 3 checkbox
  function handleTop3Check(idx: number, checked: boolean) {
    const updated = [...top3Checked];
    updated[idx] = checked;
    setTop3Checked(updated);
  }

  function handleTimeTrackerChange(idx: number, value: string) {
    const updated = [...timeTracker];
    updated[idx] = value;
    setTimeTracker(updated);
  }

  // Handlers for todos
  function handleTodoText(idx: number, value: string) {
    const updated = [...todos];
    updated[idx].text = value;
    setTodos(updated);
  }
  function handleTodoCheck(idx: number, checked: boolean) {
    const updated = [...todos];
    updated[idx].done = checked;
    setTodos(updated);
  }
  function addTodo() {
    setTodos([...todos, { text: "", done: false }]);
  }
  function removeTodo(idx: number) {
    setTodos(todos.length === 1 ? [{ text: "", done: false }] : todos.filter((_, i) => i !== idx));
  }

  // Handlers for calls
  function handleCallText(idx: number, value: string) {
    const updated = [...calls];
    updated[idx].text = value;
    setCalls(updated);
  }
  function handleCallCheck(idx: number, checked: boolean) {
    const updated = [...calls];
    updated[idx].done = checked;
    setCalls(updated);
  }
  function addCall() {
    setCalls([...calls, { text: "", done: false }]);
  }
  function removeCall(idx: number) {
    setCalls(calls.length === 1 ? [{ text: "", done: false }] : calls.filter((_, i) => i !== idx));
  }

  function handleMenuChange(meal: keyof typeof menu, value: string) {
    setMenu(prev => ({ ...prev, [meal]: value }));
  }
  function handleWaterClick(idx: number) {
    setWater(prev => prev.map((v, i) => (i === idx ? !v : v)));
  }
  function handleExerciseChange(val: number[]) {
    setExercise(val[0]);
  }

  // Handlers for money tracker
  function handleMoneyChange(idx: number, field: "sign" | "amount" | "type", value: string) {
    const updated = [...money];
    updated[idx][field] = value;
    setMoney(updated);
  }
  function addMoneyRow() {
    setMoney([...money, { sign: "", amount: "", type: "" }]);
  }
  function removeMoneyRow(idx: number) {
    setMoney(money.length === 1 ? [{ sign: "", amount: "", type: "" }] : money.filter((_, i) => i !== idx));
  }

  // Calculate progress
  const top3Complete = top3Checked.every(Boolean);
  const waterComplete = water.every(Boolean);
  const exerciseComplete = exercise > 0;
  const todosComplete = todos.some(t => t.done);
  const callsComplete = calls.some(c => c.done);
  const sections = [top3Complete, waterComplete, exerciseComplete, todosComplete, callsComplete];
  const progress = (sections.filter(Boolean).length / sections.length) * 100;

  // Streak logic
  useEffect(() => {
    // On mount, check streak from localStorage
    const streakData = localStorage.getItem('planner-streak');
    let streakObj = streakData ? JSON.parse(streakData) : { count: 0, lastDate: null };
    const yesterday = new Date(Date.now() - 86400000);
    const yesterdayISO = yesterday.toISOString().slice(0, 10);
    if (top3Complete) {
      if (streakObj.lastDate === yesterdayISO) {
        // Continue streak
        streakObj = { count: streakObj.count + 1, lastDate: selectedDate };
      } else if (streakObj.lastDate !== selectedDate) {
        // New streak or first completion today
        streakObj = { count: 1, lastDate: selectedDate };
      }
      localStorage.setItem('planner-streak', JSON.stringify(streakObj));
    } else if (streakObj.lastDate !== selectedDate) {
      // If not completed today, don't update streak
    }
    setStreak(streakObj.count);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [top3Complete, selectedDate]);

  // Motivational quotes
  const quotes = [
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain", emoji: "🚀" },
    { text: "Small steps every day.", author: "Unknown", emoji: "👣" },
    { text: "You are capable of amazing things.", author: "Unknown", emoji: "💡" },
    { text: "Progress, not perfection.", author: "Unknown", emoji: "🌱" },
    { text: "Stay positive, work hard, make it happen.", author: "Unknown", emoji: "💪" },
    { text: "Dream big. Start small. Act now.", author: "Robin Sharma", emoji: "✨" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt", emoji: "🏆" },
    { text: "Every day is a fresh start.", author: "Unknown", emoji: "🌅" },
  ];
  const [quote, setQuote] = useState(quotes[0]);
  useEffect(() => {
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 1. Add section complete booleans
  const todosSectionComplete = todos.some(t => t.done);
  const callsSectionComplete = calls.some(c => c.done);
  const menuSectionComplete = Object.values(menu).some(Boolean);
  const moneySectionComplete = money.some(row => row.amount && row.type);
  const highlightSectionComplete = !!highlight;
  const journalSectionComplete = !!journal;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center py-0 px-2 sm:px-0">
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 bg-background/90 backdrop-blur flex flex-col items-center w-full max-w-2xl mx-auto px-4 pt-4 pb-2 gap-2 shadow-sm">
        <div className="flex items-center justify-between w-full">
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={goToPrev}><ChevronLeft /></Button>
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
            <Button variant="outline" size="icon" onClick={goToNext}><ChevronRight /></Button>
          </div>
          <Button variant="secondary" onClick={goToToday}>Today</Button>
          <div className="flex items-center gap-2 ml-auto">
            <div className="flex items-center gap-2 text-orange-500 font-bold text-lg">
              <span role="img" aria-label="Fire">🔥</span>
              {streak} day{streak === 1 ? '' : 's'} streak
            </div>
            <button
              type="button"
              onClick={() => setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light')}
              aria-label="Toggle theme"
              className="ml-2 p-1 rounded-full bg-muted hover:bg-muted/70 transition-colors"
            >
              {theme === 'light' && <Sun className="w-5 h-5 text-yellow-500" />}
              {theme === 'dark' && <Moon className="w-5 h-5 text-blue-700" />}
              {theme === 'system' && <Laptop className="w-5 h-5 text-gray-700 dark:text-gray-200" />}
            </button>
          </div>
        </div>
      </header>
      {/* Progress Bar */}
      <div className="w-full max-w-2xl mx-auto px-4 mt-2">
        <div className="h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-200 to-cyan-200 transition-all duration-500"
            style={{ width: `${progress}%` }}
            aria-label="Progress bar"
          />
        </div>
        <div className="text-xs text-muted-foreground text-right mt-1">{Math.round(progress)}% Complete</div>
      </div>
      <div className="w-full max-w-2xl mx-auto px-4 mt-4 mb-2 flex items-center gap-3 bg-accent/40 rounded-lg p-3 shadow-sm">
        <span className="text-2xl sm:text-3xl">{quote.emoji}</span>
        <div className="flex-1">
          <div className="text-base sm:text-lg font-semibold">{quote.text}</div>
          <div className="text-xs text-muted-foreground mt-1">{quote.author}</div>
        </div>
      </div>
      <div className="w-full max-w-2xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md border border-blue-200/40 shadow-2xl rounded-2xl p-6 flex flex-col gap-8 mt-4 animate-fade-in">
        {/* Date Selector & Day of Week */}
        <section className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex gap-2 items-center">
            {/* Date Picker Placeholder */}
            <input type="date" className="border rounded px-2 py-1" />
            <div className="flex gap-1 text-xs font-medium">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>
          {/* Rate Your Day */}
          <section className="flex items-center gap-2 mb-4">
            <span className="text-sm font-semibold">Rate your day:</span>
            {[1,2,3,4,5].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  rating === n ? 'bg-primary text-primary-foreground scale-110 shadow' : 'bg-muted text-muted-foreground hover:bg-primary/10'
                }`}
                aria-label={`Rate ${n}`}
              >
                {n}
              </button>
            ))}
          </section>
        </section>
        {/* Today's Top 3 */}
        <section className="animate-section-fade">
          <div className="font-semibold mb-2 flex items-center gap-2 text-lg">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-200 bg-opacity-40">🏆</span>
            Today's Top 3 {top3Complete && <span className="ml-1 text-green-400 text-lg">✔️</span>}
          </div>
          <div className="flex flex-col gap-2">
            {top3.map((task, i) => (
              <div key={i} className="flex items-center gap-2 transition-all duration-200">
                <Checkbox checked={top3Checked[i]} onCheckedChange={checked => handleTop3Check(i, !!checked)} className={`transition-all duration-200 ${top3Checked[i] ? 'scale-125' : ''}`} />
                <Input
                  type="text"
                  value={task}
                  onChange={e => handleTop3TextChange(i, e.target.value)}
                  placeholder={`Top ${i + 1} task`}
                  className={
                    "flex-1 border-b bg-transparent outline-none px-1 py-0.5 transition-all duration-200 " +
                    (top3Checked[i] ? "line-through text-muted-foreground opacity-60" : "")
                  }
                  disabled={top3Checked[i]}
                />
              </div>
            ))}
          </div>
        </section>
        {/* Main Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Time Tracker */}
          <div className="overflow-x-auto">
            <div>
              <div className="font-semibold mb-2 flex items-center gap-2 text-lg">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-200 bg-opacity-40">⏰</span>
                Time Tracker
              </div>
              <div className="flex flex-col gap-1">
                {Array.from({length: 14}, (_,i) => 8+i).map((hour, idx) => (
                  <div key={hour} className="flex items-center gap-2 text-xs">
                    <span className="w-12 text-right pr-2">{hour <= 12 ? hour : hour-12}:00 {hour < 12 ? 'AM' : 'PM'}</span>
                    <Input
                      type="text"
                      value={timeTracker[idx]}
                      onChange={e => handleTimeTrackerChange(idx, e.target.value)}
                      className={
                        "flex-1 border-b bg-transparent outline-none px-1 py-0.5 transition-all duration-200 " +
                        (timeTracker[idx] ? "bg-primary/10" : "")
                      }
                      placeholder="What are you doing?"
                      aria-label={`Time slot ${hour}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* To-Do's, Calls/Emails */}
          <div className="flex flex-col gap-4">
            <div>
              <div className="font-semibold mb-2 flex items-center gap-2 text-lg">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-mint-200 bg-opacity-40">📝</span>
                To Do's
              </div>
              <div className="flex flex-col gap-1">
                {todos.map((todo, i) => (
                  <div key={i} className="flex items-center gap-2 group transition-all duration-200">
                    <Checkbox checked={todo.done} onCheckedChange={checked => handleTodoCheck(i, !!checked)} className={`transition-all duration-200 ${todo.done ? 'scale-125' : ''}`} />
                    <Input
                      type="text"
                      value={todo.text}
                      onChange={e => handleTodoText(i, e.target.value)}
                      placeholder="Task..."
                      className={
                        "flex-1 border-b bg-transparent outline-none px-1 py-0.5 transition-all duration-200 " +
                        (todo.done ? "line-through text-muted-foreground opacity-60" : "")
                      }
                      disabled={todo.done}
                    />
                    <button
                      type="button"
                      onClick={() => removeTodo(i)}
                      className="opacity-0 group-hover:opacity-100 text-xs text-destructive px-2 transition-opacity"
                      aria-label="Remove task"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button type="button" onClick={addTodo} className="text-primary text-xs mt-1 hover:underline">+ Add To-Do</button>
              </div>
            </div>
            <div>
              <div className="font-semibold mb-2 flex items-center gap-2 text-lg">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-peach-200 bg-opacity-40">📞</span>
                Calls / Emails
              </div>
              <div className="flex flex-col gap-1">
                {calls.map((call, i) => (
                  <div key={i} className="flex items-center gap-2 group transition-all duration-200">
                    <Checkbox checked={call.done} onCheckedChange={checked => handleCallCheck(i, !!checked)} className={`transition-all duration-200 ${call.done ? 'scale-125' : ''}`} />
                    <Input
                      type="text"
                      value={call.text}
                      onChange={e => handleCallText(i, e.target.value)}
                      placeholder="Contact..."
                      className={
                        "flex-1 border-b bg-transparent outline-none px-1 py-0.5 transition-all duration-200 " +
                        (call.done ? "line-through text-muted-foreground opacity-60" : "")
                      }
                      disabled={call.done}
                    />
                    <button
                      type="button"
                      onClick={() => removeCall(i)}
                      className="opacity-0 group-hover:opacity-100 text-xs text-destructive px-2 transition-opacity"
                      aria-label="Remove call"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button type="button" onClick={addCall} className="text-primary text-xs mt-1 hover:underline">+ Add Call/Email</button>
              </div>
            </div>
          </div>
        </section>
        {/* Menu, Water, Exercise, Money, Highlight */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Menu of the Day */}
          <div>
            <div className="font-semibold mb-2 flex items-center gap-2 text-lg">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-200 bg-opacity-40">🍽️</span>
              Menu of the Day
            </div>
            <div className="flex flex-col gap-1">
              {(['Breakfast','Lunch','Snacks','Dinner'] as (keyof typeof menu)[]).map(meal => (
                <div key={meal} className="flex items-center gap-2 text-xs">
                  <span className="w-16">{meal}</span>
                  <Input
                    type="text"
                    value={menu[meal]}
                    onChange={e => handleMenuChange(meal, e.target.value)}
                    className="flex-1 border-b bg-transparent outline-none px-1 py-0.5"
                    placeholder={meal}
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs">Water</span>
              {water.map((filled, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleWaterClick(i)}
                  className={`inline-block w-8 h-8 rounded-full mx-1 border-2 border-blue-300 shadow-md flex items-center justify-center text-xl transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary/50 ${filled ? 'bg-gradient-to-t from-blue-400 to-cyan-300 shadow-blue-400/60 scale-125' : 'bg-blue-100 hover:bg-blue-200 hover:scale-105'}`}
                  aria-label={`Water glass ${i+1}`}
                >💧</button>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs">Exercise</span>
              <Slider
                min={0}
                max={24}
                step={1}
                value={[exercise]}
                onValueChange={handleExerciseChange}
                className="w-32"
              />
              <span className="text-xs ml-2">{exercise} hrs</span>
            </div>
          </div>
          {/* Money Tracker & Highlight */}
          <div className="flex flex-col gap-4">
            <div>
              <div className="font-semibold mb-2 flex items-center gap-2 text-lg">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-200 bg-opacity-40">💰</span>
                Money Tracker
              </div>
              <div className="border rounded-lg overflow-x-auto">
                <div className="grid grid-cols-3 bg-muted text-xs font-semibold">
                  <div className="p-1">+/-</div>
                  <div className="p-1">Amount</div>
                  <div className="p-1">Expense / Saved</div>
                </div>
                {money.map((row, i) => (
                  <div key={i} className="grid grid-cols-3 border-t text-xs items-center group transition-all duration-200">
                    <Input
                      className="p-1 border-none outline-none bg-transparent"
                      value={row.sign}
                      onChange={e => handleMoneyChange(i, "sign", e.target.value)}
                      placeholder="+/-"
                    />
                    <Input
                      className="p-1 border-none outline-none bg-transparent"
                      value={row.amount}
                      onChange={e => handleMoneyChange(i, "amount", e.target.value)}
                      placeholder="Amount"
                    />
                    <Input
                      className="p-1 border-none outline-none bg-transparent"
                      value={row.type}
                      onChange={e => handleMoneyChange(i, "type", e.target.value)}
                      placeholder="Expense/Saved"
                    />
                    <button
                      type="button"
                      onClick={() => removeMoneyRow(i)}
                      className="opacity-0 group-hover:opacity-100 text-xs text-destructive px-2 transition-opacity col-span-3 text-right"
                      aria-label="Remove row"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button type="button" onClick={addMoneyRow} className="text-primary text-xs mt-1 hover:underline w-full text-left px-2 py-1">+ Add Row</button>
              </div>
            </div>
            <div>
              <div className="font-semibold mb-2 flex items-center gap-2 text-lg">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-pink-200 bg-opacity-40">🌟</span>
                Highlight of the Day
              </div>
              <Input
                type="text"
                className="w-full border-b bg-transparent outline-none px-1 py-0.5"
                placeholder="Highlight..."
                value={highlight}
                onChange={e => setHighlight(e.target.value)}
              />
            </div>
          </div>
        </section>
        {/* Journal Section */}
        <section className="animate-section-fade">
          <h2 className="text-xl font-bold mb-2 flex items-center gap-2 text-lg">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">📓</span>
            Journal
          </h2>
          <textarea
            className="w-full min-h-[200px] rounded-lg border p-4 text-base bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-vertical"
            placeholder="Write your notes for the day..."
            value={journal}
            onChange={e => setJournal(e.target.value)}
          />
        </section>
      </div>
    </div>
  );
} 
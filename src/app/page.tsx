'use client';
import Link from "next/link";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [selected, setSelected] = useState<Date | undefined>(undefined);
  const selectedDate = selected ? selected.toISOString().slice(0, 10) : "";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-8 flex flex-col gap-6 items-center">
        <h1 className="text-3xl font-bold text-center">Welcome to Your Daily Planner!</h1>
        <p className="italic text-center text-muted-foreground">“The secret of getting ahead is getting started.” – Mark Twain</p>
        {/* Calendar Overview */}
        <div className="w-full flex flex-col items-center gap-2">
          <div className="font-semibold mb-1">Calendar Overview</div>
          <Calendar mode="single" selected={selected} onSelect={setSelected} className="rounded-lg border" />
        </div>
        <Link href={selected ? `/planner?date=${selectedDate}` : "/planner"} className="w-full">
          <Button className="w-full py-3 text-lg" disabled={!selected}>Open My Planner</Button>
        </Link>
      </div>
    </div>
  );
}

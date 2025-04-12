"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Calendar } from "@/components/ui/calendar";

interface Task {
  id: number;
  title: string;
  completed: boolean;
  dueDate?: Date;
  priority?: "low" | "medium" | "high" |undefined;
  time?: string;
}

export default function Home() {
  // this state is used to store the tasks
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [dueDate, setDueDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("low");

  const addTask = () => {
    if (newTask.trim() === "") return;
    const newItem: Task = {
      id: Date.now(),
      title: newTask,
      completed: false,
      dueDate: dueDate,
      priority: priority,
      time: selectedTime,
    };
    setTasks([...tasks, newItem]);
    setNewTask("");
    setDueDate(undefined);
    setSelectedTime("");
    setPriority("low");
  };

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const priorityOptions = [
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" },
  ];

  return (
    <main className="max-w-md mx-auto mt-10 space-y-4">
      <h1 className="text-2xl font-bold text-center">📝 My Tasks</h1>
      <div className="grid gap-2">
        <Input
          placeholder="Add a new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        {/* Date Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              {dueDate ? dueDate.toDateString() : "Date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dueDate}
              onSelect={setDueDate}
              initialFocus
            ></Calendar>
          </PopoverContent>
        </Popover>
        {/* Time Picker */}
        <select
          className="border rounded p-2 text-sm"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
        >
          <option value="">Pick time</option>
          <option value="09:00 AM">09:00 AM</option>
          <option value="12:00 PM">12:00 PM</option>
          <option value="03:00 PM">03:00 PM</option>
          <option value="06:00 PM">06:00 PM</option>
        </select>
        {/* Priority Selector */}
        <div className="flex gap-2">
          {priorityOptions.map((level) => (
            <Button
              key={level.value}
              variant={priority === level.label ? "default" : "outline"}
              onClick={() =>
                setPriority(level.label as "low" | "medium" | "high")
              }
            >
              {level.label}
            </Button>
          ))}
          <Button onClick={addTask}>Add</Button>
        </div>
      </div>
      {tasks.map((task) => (
        <Card key={task.id}>
          <CardContent className="flex flex-col gap-1 py-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task.id)}
                />
                <span
                  className={task.completed ? "line-through text-gray-500" : ""}
                >
                  {task.title}
                </span>
              </div>
              <Button variant="ghost" onClick={() => deleteTask(task.id)}>
                ❌
              </Button>
            </div>
            <div>
              {task.dueDate && task.dueDate.toDateString()}
              {task.time && task.time}
              <span
              className={
               `${task.priority} === "low"
                  ? "text-green-600"
                  : ${task.priority}=== "medium"
                  ? "text-yellow-600"
                  : "text-red-600"`
              }
              >
                 🔥 {task.priority}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
      {/* <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        Go to nextjs.org →
      </footer> */}
    </main>
  );
}

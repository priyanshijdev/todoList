
import { useState, useEffect } from "react"
import { Plus, Search, X, Check, Trash2, Edit, Save } from "lucide-react"
import { Input } from "./components/ui/input"
import { Card } from "./components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select"
import { Button } from "./components/ui/button"
import { Badge } from "./components/ui/badge"

// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Todo type definition
type Priority = "low" | "medium" | "high"
type TodoStatus = "active" | "completed"

interface Todo {
  id: string
  text: string
  completed: boolean
  priority: Priority
  createdAt: Date
}

export default function TodoApp() {
  // State for todos and form inputs
  const [todos, setTodos] = useState<Todo[]>(() => {
    // Load from localStorage if available
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("todos")
      if (saved) {
        return JSON.parse(saved, (key, value) => {
          if (key === "createdAt") return new Date(value)
          return value
        })
      }
    }
    return []
  })

  const [inputText, setInputText] = useState("")
  const [priority, setPriority] = useState<Priority>("medium")
  const [filter, setFilter] = useState<"all" | TodoStatus>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState("")

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  // Add a new todo
  const addTodo = () => {
    if (inputText.trim() === "") return

    const newTodo: Todo = {
      id: Date.now().toString(),
      text: inputText,
      completed: false,
      priority,
      createdAt: new Date(),
    }

    setTodos([...todos, newTodo])
    setInputText("")
  }

  // Toggle todo completion status
  const toggleTodo = (id: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  // Delete a todo
  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  // Start editing a todo
  const startEditing = (todo: Todo) => {
    setEditingId(todo.id)
    setEditText(todo.text)
  }

  // Save edited todo
  const saveEdit = () => {
    if (editingId && editText.trim() !== "") {
      setTodos(todos.map((todo) => (todo.id === editingId ? { ...todo, text: editText } : todo)))
      setEditingId(null)
    }
  }

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null)
  }

  // Filter todos based on current filter and search query
  const filteredTodos = todos
    .filter((todo) => {
      if (filter === "all") return true
      if (filter === "active") return !todo.completed
      if (filter === "completed") return todo.completed
      return true
    })
    .filter((todo) => todo.text.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

  // Get counts for the filter badges
  const activeTodosCount = todos.filter((todo) => !todo.completed).length
  const completedTodosCount = todos.filter((todo) => todo.completed).length

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6">
      <div className="flex flex-col space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Todo App</h1>
          <p className="text-muted-foreground">Manage your tasks efficiently</p>
        </div>

        {/* Add Todo Form */}
        <Card className="p-4">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row gap-2">
              <Input
                placeholder="Add a new task..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addTodo()
                }}
                className="flex-1"
              />
              <div className="flex gap-2">
                <Select value={priority} onValueChange={(value) => setPriority(value as Priority)}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={addTodo}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex items-center space-x-2 flex-wrap">
            <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
              All ({todos.length})
            </Button>
            <Button variant={filter === "active" ? "default" : "outline"} size="sm" onClick={() => setFilter("active")}>
              Active ({activeTodosCount})
            </Button>
            <Button
              variant={filter === "completed" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("completed")}
            >
              Completed ({completedTodosCount})
            </Button>
          </div>
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search todos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Todo List */}
        <div className="space-y-2">
          {filteredTodos.length === 0 ? (
            <div className="text-center p-8 border border-dashed rounded-lg">
              <p className="text-muted-foreground">No todos found</p>
            </div>
          ) : (
            filteredTodos.map((todo) => (
              <Card key={todo.id} className="p-4">
                <div className="flex items-start gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className={`rounded-full mt-0.5 ${todo.completed ? "bg-primary text-primary-foreground" : ""}`}
                    onClick={() => toggleTodo(todo.id)}
                  >
                    {todo.completed && <Check className="h-4 w-4" />}
                  </Button>
                  <div className="flex-1 min-w-0">
                    {editingId === todo.id ? (
                      <div className="flex gap-2">
                        <Input
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveEdit()
                            if (e.key === "Escape") cancelEdit()
                          }}
                        />
                        <Button size="icon" onClick={saveEdit}>
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="outline" onClick={cancelEdit}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <p className={`${todo.completed ? "line-through text-muted-foreground" : ""}`}>{todo.text}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant={
                              todo.priority === "high"
                                ? "destructive"
                                : todo.priority === "medium"
                                  ? "default"
                                  : "secondary"
                            }
                            className="text-xs"
                          >
                            {todo.priority}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(todo.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  {editingId !== todo.id && (
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => startEditing(todo)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteTodo(todo.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}


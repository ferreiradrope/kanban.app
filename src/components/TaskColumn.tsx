
import { Column, Task, TaskStatus } from "@/types";
import { useRef } from "react";
import TaskCard from "./TaskCard";
import { cn } from "@/lib/utils";

interface TaskColumnProps {
  column: Column;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onDragStart: (taskId: string, status: TaskStatus, index: number) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (status: TaskStatus) => void;
  isDraggingOver: boolean;
}

const TaskColumn = ({
  column,
  tasks,
  onEditTask,
  onDeleteTask,
  onDragStart,
  onDragOver,
  onDrop,
  isDraggingOver,
}: TaskColumnProps) => {
  const columnRef = useRef<HTMLDivElement>(null);

  const getColumnColor = (id: TaskStatus) => {
    switch (id) {
      case "todo":
        return "bg-kanban-todo";
      case "inProgress":
        return "bg-kanban-progress";
      case "done":
        return "bg-kanban-done";
      default:
        return "bg-kanban-todo";
    }
  };

  return (
    <div
      ref={columnRef}
      className={cn(
        "kanban-column rounded-lg shadow-sm",
        getColumnColor(column.id),
        isDraggingOver && "column-drop-active"
      )}
      onDragOver={onDragOver}
      onDrop={() => onDrop(column.id)}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-primary">
          {column.title}
        </h2>
        <span className="bg-background/25 text-foreground/80 text-xs px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>

      <div className="custom-scrollbar overflow-y-auto flex-grow">
        {tasks.map((task, index) => (
          <div
            key={task.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.effectAllowed = 'move';
              onDragStart(task.id, column.id, index);
            }}
          >
            <TaskCard
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          </div>
        ))}
        
        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-20 border border-dashed border-border rounded-lg mt-2 text-muted-foreground">
            <p className="text-xs">Nenhuma tarefa</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskColumn;

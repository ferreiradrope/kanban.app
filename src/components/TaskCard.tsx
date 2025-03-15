
import { Task } from "@/types";
import { useState, useRef } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  isDragging?: boolean;
  forwardedRef?: React.RefObject<HTMLDivElement>;
  dragHandleProps?: any;
}

const TaskCard = ({ 
  task, 
  onEdit, 
  onDelete, 
  isDragging = false,
  forwardedRef,
  dragHandleProps,
}: TaskCardProps) => {
  const [showOptions, setShowOptions] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={forwardedRef || cardRef}
      className={cn(
        "task-card focus-ring cursor-grab",
        isDragging && "dragging",
        task.status === 'done' && "opacity-80"
      )}
      onMouseEnter={() => setShowOptions(true)}
      onMouseLeave={() => setShowOptions(false)}
      {...dragHandleProps}
    >
      <div className="flex justify-between items-start">
        <h3 className={cn(
          "font-medium text-sm text-primary",
          task.status === "done" && "line-through text-muted-foreground"
        )}>
          {task.title}
        </h3>
        
        {showOptions && (
          <div className="flex space-x-1">
            <button
              className="p-1 text-muted-foreground hover:text-blue-500 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              aria-label="Editar tarefa"
            >
              <Pencil size={16} />
            </button>
            <button
              className="p-1 text-muted-foreground hover:text-red-500 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
              aria-label="Excluir tarefa"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
      
      {task.description && (
        <p className="text-xs text-muted-foreground mt-2">{task.description}</p>
      )}
    </div>
  );
};

export default TaskCard;

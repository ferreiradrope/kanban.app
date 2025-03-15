
import { Task } from "@/types";
import { useState, useRef } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
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
  const optionsRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (optionsRef.current && !optionsRef.current.contains(e.target as Node)) {
      setShowOptions(false);
    }
  };

  const toggleOptions = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowOptions(!showOptions);
    
    if (!showOptions) {
      // Add event listener when opening
      document.addEventListener('click', handleClickOutside);
    } else {
      // Remove event listener when closing
      document.removeEventListener('click', handleClickOutside);
    }
  };

  return (
    <div 
      ref={forwardedRef}
      className={cn(
        "task-card focus-ring",
        isDragging && "dragging",
        task.status === 'done' && "opacity-80"
      )}
      {...dragHandleProps}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className={cn(
          "font-medium text-sm text-primary",
          task.status === "done" && "line-through text-muted-foreground"
        )}>
          {task.title}
        </h3>
        <div className="relative" ref={optionsRef}>
          <button
            className="p-1 rounded-full text-muted-foreground hover:text-primary transition-colors focus-ring"
            onClick={toggleOptions}
            aria-label="Task options"
          >
            <MoreHorizontal size={16} />
          </button>
          
          {showOptions && (
            <div className="absolute right-0 mt-1 py-1 bg-popover border border-border rounded-md shadow-md animate-scale-in z-10 w-32">
              <button
                className="w-full text-left px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-muted transition-colors"
                onClick={() => {
                  setShowOptions(false);
                  onEdit(task);
                  document.removeEventListener('click', handleClickOutside);
                }}
              >
                <Pencil size={14} />
                <span>Edit</span>
              </button>
              <button
                className="w-full text-left px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-muted text-destructive transition-colors"
                onClick={() => {
                  setShowOptions(false);
                  onDelete(task.id);
                  document.removeEventListener('click', handleClickOutside);
                }}
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>
      
      {task.description && (
        <p className="text-xs text-muted-foreground">{task.description}</p>
      )}
    </div>
  );
};

export default TaskCard;

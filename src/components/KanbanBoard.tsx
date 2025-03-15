
import { useState, useEffect, useRef } from "react";
import { KanbanData, Task, TaskStatus } from "@/types";
import TaskColumn from "./TaskColumn";
import TaskForm from "./TaskForm";
import ConfirmDialog from "./ConfirmDialog";
import NewTaskButton from "./NewTaskButton";
import { addTask, deleteTask, getInitialData, moveTask, updateTask } from "@/utils/localStorage";
import { useToast } from "@/hooks/use-toast";

interface DragState {
  taskId: string;
  sourceStatus: TaskStatus;
  sourceIndex: number;
}

const KanbanBoard = () => {
  const [data, setData] = useState<KanbanData>(getInitialData());
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [draggingOverColumn, setDraggingOverColumn] = useState<TaskStatus | null>(null);
  const { toast } = useToast();

  // Load data from localStorage on initial render
  useEffect(() => {
    setData(getInitialData());
  }, []);

  // Handle task creation
  const handleCreateTask = (task: { title: string; description: string; status: TaskStatus }) => {
    const updatedData = addTask(data, task);
    setData(updatedData);
    toast({
      title: "Task created",
      description: "Your task has been created successfully.",
    });
  };

  // Handle task update
  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    const updatedData = updateTask(data, taskId, updates);
    setData(updatedData);
    toast({
      title: "Task updated",
      description: "Your task has been updated successfully.",
    });
  };

  // Handle task deletion
  const handleDeleteTask = (taskId: string) => {
    const updatedData = deleteTask(data, taskId);
    setData(updatedData);
    toast({
      title: "Task deleted",
      description: "Your task has been deleted.",
    });
  };

  // Open task form for editing
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  // Handle form submission (create or update)
  const handleTaskFormSubmit = (task: { title: string; description: string; status: TaskStatus }) => {
    if (editingTask) {
      handleUpdateTask(editingTask.id, task);
      setEditingTask(null);
    } else {
      handleCreateTask(task);
    }
  };

  // Close the task form
  const handleCloseTaskForm = () => {
    setIsTaskFormOpen(false);
    setEditingTask(null);
  };

  // Open delete confirmation
  const handleDeletePrompt = (taskId: string) => {
    setTaskToDelete(taskId);
  };

  // Confirm task deletion
  const handleConfirmDelete = () => {
    if (taskToDelete) {
      handleDeleteTask(taskToDelete);
      setTaskToDelete(null);
    }
  };

  // Cancel task deletion
  const handleCancelDelete = () => {
    setTaskToDelete(null);
  };

  // Handle drag start
  const handleDragStart = (taskId: string, status: TaskStatus, index: number) => {
    setDragState({
      taskId,
      sourceStatus: status,
      sourceIndex: index
    });
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, status: TaskStatus) => {
    e.preventDefault();
    setDraggingOverColumn(status);
  };

  // Handle drop
  const handleDrop = (destinationStatus: TaskStatus) => {
    if (!dragState) return;
    
    const { taskId, sourceStatus, sourceIndex } = dragState;
    
    // Get the tasks in the destination column
    const destinationTasks = data.columns[destinationStatus].taskIds.map(id => data.tasks[id]);
    const destinationIndex = destinationTasks.length; // By default, drop at the end
    
    // Update the data
    const updatedData = moveTask(
      data,
      taskId,
      { status: sourceStatus, index: sourceIndex },
      { status: destinationStatus, index: destinationIndex }
    );
    
    setData(updatedData);
    setDragState(null);
    setDraggingOverColumn(null);
    
    // Show a toast notification only if the status changed
    if (sourceStatus !== destinationStatus) {
      const statusNames = {
        todo: "To Do",
        inProgress: "In Progress",
        done: "Done"
      };
      
      toast({
        title: "Task moved",
        description: `Task moved to ${statusNames[destinationStatus]}.`,
      });
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="py-6 px-4 md:px-6 flex justify-between items-center border-b">
        <h1 className="text-xl md:text-2xl font-semibold">Kanban Board</h1>
      </div>
      
      <div className="flex-grow p-4 md:p-6 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 h-full">
          {data.columnOrder.map(columnId => {
            const column = data.columns[columnId];
            const tasks = column.taskIds.map(taskId => data.tasks[taskId]);
            
            return (
              <TaskColumn
                key={column.id}
                column={column}
                tasks={tasks}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeletePrompt}
                onDragStart={handleDragStart}
                onDragOver={(e) => handleDragOver(e, column.id)}
                onDrop={handleDrop}
                isDraggingOver={draggingOverColumn === column.id}
              />
            );
          })}
        </div>
      </div>
      
      <NewTaskButton 
        onClick={() => setIsTaskFormOpen(true)} 
      />
      
      {isTaskFormOpen && (
        <TaskForm
          onClose={handleCloseTaskForm}
          onSubmit={handleTaskFormSubmit}
          initialTask={editingTask || undefined}
        />
      )}
      
      {taskToDelete && (
        <ConfirmDialog
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default KanbanBoard;

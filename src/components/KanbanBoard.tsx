import { useState, useEffect } from "react";
import { KanbanData, Task, TaskStatus, columnTitles } from "@/types";
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

  useEffect(() => {
    setData(getInitialData());
  }, []);

  const handleCreateTask = (task: { title: string; description: string; status: TaskStatus }) => {
    const updatedData = addTask(data, task);
    setData(updatedData);
    toast({
      title: "Tarefa criada",
      description: "Sua tarefa foi criada com sucesso.",
    });
  };

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    const updatedData = updateTask(data, taskId, updates);
    setData(updatedData);
    toast({
      title: "Tarefa atualizada",
      description: "Sua tarefa foi atualizada com sucesso.",
    });
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedData = deleteTask(data, taskId);
    setData(updatedData);
    toast({
      title: "Tarefa excluída",
      description: "Sua tarefa foi excluída.",
    });
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleTaskFormSubmit = (task: { title: string; description: string; status: TaskStatus }) => {
    if (editingTask) {
      handleUpdateTask(editingTask.id, task);
      setEditingTask(null);
    } else {
      handleCreateTask(task);
    }
  };

  const handleCloseTaskForm = () => {
    setIsTaskFormOpen(false);
    setEditingTask(null);
  };

  const handleDeletePrompt = (taskId: string) => {
    setTaskToDelete(taskId);
  };

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      handleDeleteTask(taskToDelete);
      setTaskToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setTaskToDelete(null);
  };

  const handleDragStart = (taskId: string, status: TaskStatus, index: number) => {
    setDragState({
      taskId,
      sourceStatus: status,
      sourceIndex: index
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, status: TaskStatus) => {
    e.preventDefault();
    setDraggingOverColumn(status);
  };

  const handleDrop = (destinationStatus: TaskStatus) => {
    if (!dragState) return;
    
    const { taskId, sourceStatus, sourceIndex } = dragState;
    
    const destinationTasks = data.columns[destinationStatus].taskIds.map(id => data.tasks[id]);
    const destinationIndex = destinationTasks.length; // By default, drop at the end
    
    const updatedData = moveTask(
      data,
      taskId,
      { status: sourceStatus, index: sourceIndex },
      { status: destinationStatus, index: destinationIndex }
    );
    
    setData(updatedData);
    setDragState(null);
    setDraggingOverColumn(null);
    
    if (sourceStatus !== destinationStatus) {
      toast({
        title: "Tarefa movida",
        description: `Tarefa movida para ${columnTitles[destinationStatus]}.`,
      });
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-grow p-4 md:p-6 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 h-full">
          {data.columnOrder.map(columnId => {
            const column = data.columns[columnId];
            const tasks = column.taskIds.map(taskId => data.tasks[taskId]);
            
            return (
              <TaskColumn
                key={column.id}
                column={{
                  ...column,
                  title: columnTitles[column.id]
                }}
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
